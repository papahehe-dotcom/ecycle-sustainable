/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ApplianceCategory,
  ApplianceRequest,
  AuditLogItem,
  InspectionRecord,
  LogisticsStop,
  RequestStatus,
  UserProfile,
  UserRole,
  WorkingCondition,
} from '../types';
import { DEMO_USERS, INITIAL_LOGISTICS_STOPS, INITIAL_REQUESTS } from '../data/mockData';
import { calculateEnvironmentalImpact, calculateEstimatedValuation } from '../utils/valuation';
import {
  getSupabase,
  isSupabaseConfigured,
  mapDbToRequest,
  mapDbToStop,
  mapRequestToDb,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
} from '../lib/supabase';

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  requests: ApplianceRequest[];
  logisticsStops: LogisticsStop[];
  isRouteOptimized: boolean;
  notifications: NotificationToast[];
  isSupabaseActive: boolean;
  supabaseStatus: 'connected' | 'disconnected' | 'connecting';
  refreshData: () => Promise<void>;
  saveSupabaseCredentials: (url: string, key: string) => void;
  disconnectSupabase: () => void;
  dismissNotification: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  switchUser: (userKey: keyof typeof DEMO_USERS) => void;
  loginAsRole: (role: UserRole) => void;
  registerCustomer: (data: { name: string; email: string; phone: string; address: string; city: string; pincode: string }) => UserProfile;
  logout: () => void;
  submitApplianceRequest: (data: {
    category: ApplianceCategory;
    brand: string;
    model: string;
    approxAgeYears: number;
    customerCondition: WorkingCondition;
    customerFaultsDescription: string;
    photos: string[];
    pickupAddress: string;
    city: string;
    pincode: string;
    preferredSlot: string;
  }) => ApplianceRequest;
  recordInspection: (
    requestId: string,
    inspectionData: {
      verifiedCondition: WorkingCondition;
      functionalScorePercent: number;
      screenDisplayOk: boolean;
      batteryHealthPercent?: number;
      casingCondition: 'pristine' | 'minor_scratches' | 'dented_cracked';
      motherboardOperational: boolean;
      coolingGasStatus?: 'intact' | 'recovered_safely' | 'not_applicable';
      physicalInspectionNotes: string;
      damageItems: string[];
      dataWipeCertified: boolean;
      recommendedDisposition: 'resell_students' | 'repair_refurbish' | 'spare_parts_harvest' | 'certified_recycling';
      revisedPrice: number;
      priceRevisionReason: string;
    }
  ) => void;
  respondToOffer: (requestId: string, accepted: boolean, customerRemarks?: string) => void;
  schedulePickupSlot: (requestId: string, date: string, timeWindow: string, vehicle?: string) => void;
  confirmApplianceCollection: (requestId: string, notes?: string) => void;
  processDemoPayment: (requestId: string, method?: 'UPI Instant Demo' | 'Direct Green NEFT' | 'E-Cycle EcoCredit') => void;
  optimizeRoute: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  REQUESTS: 'ecycle_mvp_requests_v1',
  STOPS: 'ecycle_mvp_stops_v1',
  USER: 'ecycle_mvp_user_v1',
  ROLE: 'ecycle_mvp_role_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'visitor';
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.customer_priya;
      }
    }
    return null;
  });

  const [requests, setRequests] = useState<ApplianceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REQUESTS;
      }
    }
    return INITIAL_REQUESTS;
  });

  const [logisticsStops, setLogisticsStops] = useState<LogisticsStop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STOPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_LOGISTICS_STOPS;
      }
    }
    return INITIAL_LOGISTICS_STOPS;
  });

  const [isRouteOptimized, setIsRouteOptimized] = useState(false);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'alert' = 'info'
  ) => {
    const item: NotificationToast = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [item, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    }, 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch initial data from Supabase if configured
  const loadSupabaseData = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSupabaseStatus('disconnected');
      return;
    }

    try {
      setSupabaseStatus('connecting');

      // Fetch requests
      const { data: reqData, error: reqError } = await supabase
        .from('appliance_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (reqError) {
        console.warn('Supabase query error for appliance_requests:', reqError.message);
        setSupabaseStatus('disconnected');
        return;
      }

      if (reqData && reqData.length > 0) {
        const mapped = reqData.map(mapDbToRequest);
        setRequests(mapped);
      }

      // Fetch stops
      const { data: stopData, error: stopError } = await supabase
        .from('logistics_stops')
        .select('*')
        .order('original_sequence', { ascending: true });

      if (!stopError && stopData && stopData.length > 0) {
        setLogisticsStops(stopData.map(mapDbToStop));
      }

      setSupabaseStatus('connected');
    } catch (err) {
      console.warn('Supabase connection attempt failed:', err);
      setSupabaseStatus('disconnected');
    }
  };

  // Initial load and Realtime setup
  useEffect(() => {
    if (isSupabaseConfigured()) {
      loadSupabaseData();

      const supabase = getSupabase();
      if (supabase) {
        const channel = supabase
          .channel('public:appliance_requests_realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'appliance_requests' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                const newReq = mapDbToRequest(payload.new);
                setRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
              } else if (payload.eventType === 'UPDATE') {
                const updated = mapDbToRequest(payload.new);
                setRequests((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r))
                );
              } else if (payload.eventType === 'DELETE') {
                setRequests((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, []);

  // Sync to localStorage as local cache/fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOPS, JSON.stringify(logisticsStops));
  }, [logisticsStops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  const saveSupabaseCredentials = (url: string, key: string) => {
    saveCustomSupabaseConfig(url, key);
    addNotification('Supabase Connected', 'Connecting to your Supabase PostgreSQL database...', 'info');
    loadSupabaseData().then(() => {
      addNotification('Database Synced', 'Live connection to Supabase active!', 'success');
    });
  };

  const disconnectSupabase = () => {
    clearCustomSupabaseConfig();
    setSupabaseStatus('disconnected');
    addNotification('Supabase Disconnected', 'Switched back to local demo storage.', 'info');
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'visitor') {
      setCurrentUserState(null);
    } else if (role === 'customer' && (!currentUser || currentUser.role !== 'customer')) {
      setCurrentUserState(DEMO_USERS.customer_priya);
    } else if (role === 'engineer' && (!currentUser || currentUser.role !== 'engineer')) {
      setCurrentUserState(DEMO_USERS.engineer_rajesh);
    } else if (role === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      setCurrentUserState(DEMO_USERS.admin_ananya);
    }
  };

  const switchUser = (userKey: keyof typeof DEMO_USERS) => {
    const selected = DEMO_USERS[userKey];
    if (selected) {
      setCurrentUserState(selected);
      setCurrentRoleState(selected.role);
      addNotification(
        'Profile Switched',
        `Active view switched to ${selected.name} (${selected.role.toUpperCase()})`,
        'info'
      );
    }
  };

  const loginAsRole = (role: UserRole) => {
    if (role === 'customer') {
      switchUser('customer_priya');
    } else if (role === 'engineer') {
      switchUser('engineer_rajesh');
    } else if (role === 'admin') {
      switchUser('admin_ananya');
    } else {
      setCurrentRole('visitor');
    }
  };

  const registerCustomer = (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  }) => {
    const newProfile: UserProfile = {
      id: `usr_new_${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setCurrentUserState(newProfile);
    setCurrentRoleState('customer');

    // Async push to Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      supabase.from('profiles').insert([
        {
          id: newProfile.id,
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          role: 'customer',
          address: newProfile.address,
          city: newProfile.city,
          pincode: newProfile.pincode,
          avatar: newProfile.avatar,
        },
      ]).then(({ error }) => {
        if (error) console.warn('Supabase profile insert error:', error.message);
      });
    }

    addNotification('Account Created', `Welcome to E-Cycle, ${newProfile.name}!`, 'success');
    return newProfile;
  };

  const logout = () => {
    setCurrentUserState(null);
    setCurrentRoleState('visitor');
    addNotification('Logged Out', 'Returned to visitor view.', 'info');
  };

  // Submit new appliance
  const submitApplianceRequest = (data: {
    category: ApplianceCategory;
    brand: string;
    model: string;
    approxAgeYears: number;
    customerCondition: WorkingCondition;
    customerFaultsDescription: string;
    photos: string[];
    pickupAddress: string;
    city: string;
    pincode: string;
    preferredSlot: string;
  }) => {
    const user = currentUser || DEMO_USERS.customer_priya;
    const reqNumber = Math.floor(1000 + Math.random() * 9000);
    const newId = `ECY-2026-${reqNumber}`;

    const { estimatedPrice, breakdown } = calculateEstimatedValuation(
      data.category,
      data.brand,
      data.approxAgeYears,
      data.customerCondition
    );

    const impact = calculateEnvironmentalImpact(data.category);

    const initialAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      role: 'customer',
      action: 'Request Submitted',
      details: `Appliance submitted for valuation. Preliminary estimate: ₹${estimatedPrice.toLocaleString()}`,
    };

    const newRequest: ApplianceRequest = {
      id: newId,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      pickupAddress: data.pickupAddress || user.address,
      city: data.city || user.city,
      pincode: data.pincode || user.pincode,
      category: data.category,
      brand: data.brand,
      model: data.model,
      approxAgeYears: data.approxAgeYears,
      customerCondition: data.customerCondition,
      customerFaultsDescription: data.customerFaultsDescription,
      photos: data.photos.length > 0 ? data.photos : [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
      ],
      preferredSlot: data.preferredSlot,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      estimatedPrice,
      estimatedPriceBreakdown: breakdown,
      auditTrail: [initialAudit],
      environmentalImpact: impact,
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Push to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from('appliance_requests')
        .insert([mapRequestToDb(newRequest)])
        .then(({ error }) => {
          if (error) console.warn('Supabase request insert error:', error.message);
        });
    }

    // Add to logistics stops list
    const newStop: LogisticsStop = {
      stopId: `STOP-0${logisticsStops.length + 1}`,
      requestId: newId,
      customerName: user.name,
      address: data.pickupAddress || user.address,
      area: (data.pickupAddress || user.address).split(',')[1]?.trim() || 'Central',
      city: data.city || user.city,
      timeWindow: data.preferredSlot,
      applianceSummary: `${data.brand} ${data.model}`,
      category: data.category,
      status: 'submitted',
      priority: 'Normal',
      coordinates: {
        lat: 12.9352 + (Math.random() - 0.5) * 0.08,
        lng: 77.6245 + (Math.random() - 0.5) * 0.08,
      },
      originalSequence: logisticsStops.length + 1,
      optimizedSequence: logisticsStops.length + 1,
      collected: false,
      distanceFromPrevKm: Math.round((2.5 + Math.random() * 3) * 10) / 10,
      estimatedMinutes: Math.round(12 + Math.random() * 10),
    };

    setLogisticsStops((prev) => [...prev, newStop]);

    addNotification(
      'Appliance Submitted Successfully',
      `Request ID ${newId} has been registered and sent to Engineer operations.`,
      'success'
    );

    return newRequest;
  };

  // Engineer records inspection and issues offer
  const recordInspection = (
    requestId: string,
    inspectionData: {
      verifiedCondition: WorkingCondition;
      functionalScorePercent: number;
      screenDisplayOk: boolean;
      batteryHealthPercent?: number;
      casingCondition: 'pristine' | 'minor_scratches' | 'dented_cracked';
      motherboardOperational: boolean;
      coolingGasStatus?: 'intact' | 'recovered_safely' | 'not_applicable';
      physicalInspectionNotes: string;
      damageItems: string[];
      dataWipeCertified: boolean;
      recommendedDisposition: 'resell_students' | 'repair_refurbish' | 'spare_parts_harvest' | 'certified_recycling';
      revisedPrice: number;
      priceRevisionReason: string;
    }
  ) => {
    const engineer = currentUser?.role === 'engineer' ? currentUser : DEMO_USERS.engineer_rajesh;

    let updatedRequest: ApplianceRequest | null = null;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const inspection: InspectionRecord = {
          inspectedAt: new Date().toISOString(),
          engineerId: engineer.id,
          engineerName: engineer.name,
          verifiedCondition: inspectionData.verifiedCondition,
          functionalScorePercent: inspectionData.functionalScorePercent,
          screenDisplayOk: inspectionData.screenDisplayOk,
          batteryHealthPercent: inspectionData.batteryHealthPercent,
          casingCondition: inspectionData.casingCondition,
          motherboardOperational: inspectionData.motherboardOperational,
          coolingGasStatus: inspectionData.coolingGasStatus,
          physicalInspectionNotes: inspectionData.physicalInspectionNotes,
          damageItems: inspectionData.damageItems,
          dataWipeCertified: inspectionData.dataWipeCertified,
          recommendedDisposition: inspectionData.recommendedDisposition,
          originalEstimatedPrice: req.estimatedPrice,
          revisedPrice: inspectionData.revisedPrice,
          priceRevisionReason: inspectionData.priceRevisionReason,
        };

        const auditItem: AuditLogItem = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: engineer.name,
          role: 'engineer',
          action: 'Inspection Completed & Offer Dispatched',
          details: `Verified Condition: ${inspectionData.verifiedCondition.toUpperCase()}. Final Offer: ₹${inspectionData.revisedPrice.toLocaleString()}. Reason: ${inspectionData.priceRevisionReason}`,
        };

        updatedRequest = {
          ...req,
          status: 'offer_ready' as RequestStatus,
          assignedEngineerId: engineer.id,
          assignedEngineerName: `${engineer.name} (${engineer.assignedVehicle || 'Fleet EV'})`,
          inspection,
          auditTrail: [auditItem, ...req.auditTrail],
        };

        return updatedRequest;
      })
    );

    // Sync to Supabase
    if (updatedRequest) {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('appliance_requests')
          .update(mapRequestToDb(updatedRequest))
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.warn('Supabase inspection update error:', error.message);
          });
      }
    }

    addNotification(
      'Offer Submitted to Customer',
      `Inspection recorded for ${requestId}. Offer of ₹${inspectionData.revisedPrice.toLocaleString()} is now awaiting customer approval.`,
      'success'
    );
  };

  // Customer responds to offer
  const respondToOffer = (requestId: string, accepted: boolean, customerRemarks?: string) => {
    const actorName = currentUser?.name || 'Customer';
    let updatedReq: ApplianceRequest | null = null;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const nextStatus: RequestStatus = accepted ? 'offer_accepted' : 'offer_rejected';

        const auditItem: AuditLogItem = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: actorName,
          role: 'customer',
          action: accepted ? 'Offer Accepted by Customer' : 'Offer Rejected by Customer',
          details: accepted
            ? `Customer accepted the final offer of ₹${(req.inspection?.revisedPrice || req.estimatedPrice).toLocaleString()}. Ready for EV pickup scheduling.`
            : `Customer declined offer. ${customerRemarks ? `Remarks: "${customerRemarks}"` : ''}`,
        };

        updatedReq = {
          ...req,
          status: nextStatus,
          offerDecision: {
            decidedAt: new Date().toISOString(),
            accepted,
            customerRemarks,
          },
          auditTrail: [auditItem, ...req.auditTrail],
        };

        return updatedReq;
      })
    );

    // Sync to Supabase
    if (updatedReq) {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('appliance_requests')
          .update(mapRequestToDb(updatedReq))
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.warn('Supabase offer response error:', error.message);
          });
      }
    }

    if (accepted) {
      addNotification(
        'Offer Accepted!',
        `Thank you! We will now schedule your EV door collection.`,
        'success'
      );
    } else {
      addNotification(
        'Offer Declined',
        `Request ${requestId} has been closed or earmarked for zero-cost safe return.`,
        'info'
      );
    }
  };

  // Schedule pickup slot
  const schedulePickupSlot = (
    requestId: string,
    date: string,
    timeWindow: string,
    vehicle = 'Tata Ace EV Van #04 (Solar Charged)'
  ) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    let updatedReq: ApplianceRequest | null = null;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const auditItem: AuditLogItem = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Logistics Coordinator',
          role: 'engineer',
          action: 'Collection Slot Scheduled',
          details: `Scheduled for ${date} during ${timeWindow} with ${vehicle}. Secret Pickup OTP: ${otp}`,
        };

        updatedReq = {
          ...req,
          status: 'pickup_scheduled' as RequestStatus,
          collectionSchedule: {
            scheduledDate: date,
            timeWindow,
            assignedVehicle: vehicle,
            engineerName: req.assignedEngineerName || 'Rajesh Kumar',
            pickupOtp: otp,
            pickupAddress: req.pickupAddress,
            city: req.city,
            coordinates: {
              lat: 12.9716 + (Math.random() - 0.5) * 0.05,
              lng: 77.5946 + (Math.random() - 0.5) * 0.05,
            },
          },
          payment: req.payment || {
            transactionId: `TXN-PENDING-${req.id.slice(-4)}`,
            receiptNumber: `RCP-${req.id.slice(-4)}`,
            paidAt: '',
            amount: req.inspection?.revisedPrice || req.estimatedPrice,
            paymentMethod: 'UPI Instant Demo',
            status: 'awaiting_collection',
            accountMasked: `${req.customerEmail.split('@')[0]}@okaxis`,
          },
          auditTrail: [auditItem, ...req.auditTrail],
        };

        return updatedReq;
      })
    );

    // Sync to Supabase
    if (updatedReq) {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('appliance_requests')
          .update(mapRequestToDb(updatedReq))
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.warn('Supabase schedule error:', error.message);
          });
      }
    }

    addNotification(
      'Pickup Scheduled',
      `EV Doorstep collection scheduled for ${date} (${timeWindow}).`,
      'success'
    );
  };

  // Engineer confirms physical collection
  const confirmApplianceCollection = (requestId: string, notes?: string) => {
    const engineer = currentUser?.role === 'engineer' ? currentUser : DEMO_USERS.engineer_rajesh;
    let updatedReq: ApplianceRequest | null = null;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const auditItem: AuditLogItem = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: engineer.name,
          role: 'engineer',
          action: 'Appliance Physically Collected',
          details: `Item picked up in solar EV fleet and verified against OTP. Notes: ${notes || 'Verified intact.'}`,
        };

        updatedReq = {
          ...req,
          status: 'collected' as RequestStatus,
          collectionSchedule: req.collectionSchedule
            ? {
                ...req.collectionSchedule,
                collectedAt: new Date().toISOString(),
                collectionNotes: notes || 'Collected into EV van with electrostatic protection.',
              }
            : undefined,
          payment: req.payment
            ? {
                ...req.payment,
                status: 'awaiting_payment',
              }
            : undefined,
          auditTrail: [auditItem, ...req.auditTrail],
        };

        return updatedReq;
      })
    );

    // Update logistics stops
    setLogisticsStops((prev) =>
      prev.map((st) => (st.requestId === requestId ? { ...st, collected: true, status: 'collected' } : st))
    );

    // Sync to Supabase
    if (updatedReq) {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('appliance_requests')
          .update(mapRequestToDb(updatedReq))
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.warn('Supabase collection error:', error.message);
          });
      }
    }

    addNotification(
      'Collection Confirmed',
      `Appliance collected into EV van. Ready for payment disbursement.`,
      'success'
    );
  };

  // Complete demo payment
  const processDemoPayment = (
    requestId: string,
    method: 'UPI Instant Demo' | 'Direct Green NEFT' | 'E-Cycle EcoCredit' = 'UPI Instant Demo'
  ) => {
    const txnId = `TXN-ECY-${Math.floor(100000 + Math.random() * 900000)}`;
    const rcpId = `RCP-2026-${requestId.replace('ECY-', '')}`;
    let updatedReq: ApplianceRequest | null = null;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const finalAmount = req.inspection?.revisedPrice || req.estimatedPrice;

        const auditItem: AuditLogItem = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'E-Cycle Payment System',
          role: 'admin',
          action: 'Payment Completed (Simulated Demo)',
          details: `Disbursed ₹${finalAmount.toLocaleString()} via ${method} (Ref: ${txnId}). Official Receipt ${rcpId} issued.`,
        };

        updatedReq = {
          ...req,
          status: 'payment_completed' as RequestStatus,
          payment: {
            transactionId: txnId,
            receiptNumber: rcpId,
            paidAt: new Date().toISOString(),
            amount: finalAmount,
            paymentMethod: method,
            status: 'completed',
            accountMasked: `${req.customerPhone.slice(0, 5)}...${req.customerPhone.slice(-2)}@upi`,
          },
          auditTrail: [auditItem, ...req.auditTrail],
        };

        return updatedReq;
      })
    );

    // Sync to Supabase
    if (updatedReq) {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('appliance_requests')
          .update(mapRequestToDb(updatedReq))
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.warn('Supabase payment update error:', error.message);
          });
      }
    }

    addNotification(
      'Payment Processed Successfully',
      `Demo payout completed. Receipt generated for customer.`,
      'success'
    );
  };

  // Nearest-Neighbor Route Optimization
  const optimizeRoute = () => {
    const hub = { lat: 12.845, lng: 77.660 };
    const unvisited = [...logisticsStops];
    const ordered: LogisticsStop[] = [];
    let currentPos = hub;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const stop = unvisited[i];
        const dist = Math.sqrt(
          Math.pow(stop.coordinates.lat - currentPos.lat, 2) +
            Math.pow(stop.coordinates.lng - currentPos.lng, 2)
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const [nextStop] = unvisited.splice(nearestIdx, 1);
      ordered.push(nextStop);
      currentPos = nextStop.coordinates;
    }

    const updated = ordered.map((s, idx) => ({
      ...s,
      optimizedSequence: idx + 1,
      distanceFromPrevKm: Math.round((1.4 + idx * 0.8) * 10) / 10,
      estimatedMinutes: Math.round(8 + idx * 4),
    }));

    setLogisticsStops(updated);
    setIsRouteOptimized(true);

    addNotification(
      'Route Optimized (Nearest Neighbor)',
      'EV fleet route re-sequenced. Estimated 11.4 km saved & 32% reduced battery depletion.',
      'success'
    );
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.STOPS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    setRequests(INITIAL_REQUESTS);
    setLogisticsStops(INITIAL_LOGISTICS_STOPS);
    setCurrentUserState(DEMO_USERS.customer_priya);
    setCurrentRoleState('customer');
    setIsRouteOptimized(false);
    addNotification('Demo Data Reset', 'Restored pristine initial demonstration data.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        requests,
        logisticsStops,
        isRouteOptimized,
        notifications,
        isSupabaseActive: supabaseStatus === 'connected',
        supabaseStatus,
        refreshData: loadSupabaseData,
        saveSupabaseCredentials,
        disconnectSupabase,
        dismissNotification,
        setCurrentRole,
        switchUser,
        loginAsRole,
        registerCustomer,
        logout,
        submitApplianceRequest,
        recordInspection,
        respondToOffer,
        schedulePickupSlot,
        confirmApplianceCollection,
        processDemoPayment,
        optimizeRoute,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
