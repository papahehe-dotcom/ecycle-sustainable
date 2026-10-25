/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'visitor' | 'customer' | 'engineer' | 'admin';

export type ApplianceCategory =
  | 'phones_pcs_tvs'
  | 'home_appliances'
  | 'lights_tools_medical'
  | 'batteries_special';

export type WorkingCondition = 'fully_working' | 'partially_working' | 'non_working';

export type RequestStatus =
  | 'submitted'
  | 'engineer_assigned'
  | 'inspection_completed'
  | 'offer_ready'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'pickup_scheduled'
  | 'collected'
  | 'payment_completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  city: string;
  pincode: string;
  avatar?: string;
  employeeId?: string; // For engineer
  assignedVehicle?: string; // e.g. "EV Van #04 (Solar Charged)"
}

export interface PriceBreakdown {
  baseModelValue: number;
  conditionMultiplier: number;
  ageDepreciationFactor: number;
  recoverablePartsBonus: number;
  finalEstimatedTotal: number;
}

export interface InspectionRecord {
  inspectedAt: string;
  engineerId: string;
  engineerName: string;
  verifiedCondition: WorkingCondition;
  functionalScorePercent: number; // 0 - 100%
  screenDisplayOk: boolean;
  batteryHealthPercent?: number;
  casingCondition: 'pristine' | 'minor_scratches' | 'dented_cracked';
  motherboardOperational: boolean;
  coolingGasStatus?: 'intact' | 'recovered_safely' | 'not_applicable';
  physicalInspectionNotes: string;
  damageItems: string[];
  dataWipeCertified: boolean;
  recommendedDisposition: 'resell_students' | 'repair_refurbish' | 'spare_parts_harvest' | 'certified_recycling';
  originalEstimatedPrice: number;
  revisedPrice: number;
  priceRevisionReason: string;
}

export interface OfferDecision {
  decidedAt: string;
  accepted: boolean;
  customerRemarks?: string;
}

export interface CollectionSchedule {
  scheduledDate: string;
  timeWindow: string; // e.g., "10:00 AM - 12:00 PM"
  assignedVehicle: string;
  engineerName: string;
  pickupOtp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pickupAddress: string;
  city: string;
  collectedAt?: string;
  collectionNotes?: string;
}

export interface PaymentRecord {
  transactionId: string;
  receiptNumber: string;
  paidAt: string;
  amount: number;
  paymentMethod: 'UPI Instant Demo' | 'Direct Green NEFT' | 'E-Cycle EcoCredit';
  status: 'awaiting_collection' | 'awaiting_payment' | 'completed';
  accountMasked: string;
}

export interface EnvironmentalImpact {
  wasteDivertedKg: number;
  co2AvoidedKg: number;
  preciousMetalsGrams: number;
  waterSavedLiters: number;
  toxicMaterialsSafeguardedGrams: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  details?: string;
}

export interface ApplianceRequest {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  city: string;
  pincode: string;
  category: ApplianceCategory;
  brand: string;
  model: string;
  approxAgeYears: number;
  customerCondition: WorkingCondition;
  customerFaultsDescription: string;
  photos: string[];
  preferredSlot: string;
  createdAt: string;
  status: RequestStatus;
  estimatedPrice: number;
  estimatedPriceBreakdown: PriceBreakdown;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  inspection?: InspectionRecord;
  offerDecision?: OfferDecision;
  collectionSchedule?: CollectionSchedule;
  payment?: PaymentRecord;
  auditTrail: AuditLogItem[];
  environmentalImpact: EnvironmentalImpact;
}

export interface LogisticsStop {
  stopId: string;
  requestId: string;
  customerName: string;
  address: string;
  area: string;
  city: string;
  timeWindow: string;
  applianceSummary: string;
  category: ApplianceCategory;
  status: RequestStatus;
  priority: 'High' | 'Normal' | 'Urgent';
  coordinates: {
    lat: number;
    lng: number;
  };
  originalSequence: number;
  optimizedSequence: number;
  collected: boolean;
  distanceFromPrevKm: number;
  estimatedMinutes: number;
}
