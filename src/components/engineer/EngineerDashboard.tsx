/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  Filter,
  Search,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  X,
} from 'lucide-react';
import { ApplianceRequest, RequestStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/valuation';
import { InspectionModal } from './InspectionModal';

interface EngineerDashboardProps {
  onOpenReceipt: (request: ApplianceRequest) => void;
  onNavigateToRouting: () => void;
}

export const EngineerDashboard: React.FC<EngineerDashboardProps> = ({
  onOpenReceipt,
  onNavigateToRouting,
}) => {
  const {
    currentUser,
    requests,
    confirmApplianceCollection,
    schedulePickupSlot,
    processDemoPayment,
  } = useApp();

  const [selectedReqForInspection, setSelectedReqForInspection] = useState<ApplianceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'need_inspection' | 'pending_customer' | 'ready_collection' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collection modal state
  const [collectionModalReq, setCollectionModalReq] = useState<ApplianceRequest | null>(null);
  const [collectionNotes, setCollectionNotes] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // KPIs
  const totalAssigned = requests.length;
  const needInspection = requests.filter((r) => r.status === 'submitted' || r.status === 'engineer_assigned').length;
  const pendingCustomerDecision = requests.filter((r) => r.status === 'offer_ready').length;
  const readyForCollection = requests.filter((r) => r.status === 'offer_accepted' || r.status === 'pickup_scheduled').length;
  const inTransitOrPaid = requests.filter((r) => r.status === 'collected' || r.status === 'payment_completed').length;

  // Filtered requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'need_inspection') {
      return req.status === 'submitted' || req.status === 'engineer_assigned';
    }
    if (statusFilter === 'pending_customer') {
      return req.status === 'offer_ready';
    }
    if (statusFilter === 'ready_collection') {
      return req.status === 'offer_accepted' || req.status === 'pickup_scheduled' || req.status === 'collected';
    }
    if (statusFilter === 'completed') {
      return req.status === 'payment_completed' || req.status === 'offer_rejected';
    }
    return true;
  });

  const handleOpenCollectionConfirm = (req: ApplianceRequest) => {
    setCollectionModalReq(req);
    setCollectionNotes('Appliance inspected and safely stowed in EV van anti-static compartment.');
    setEnteredOtp(req.collectionSchedule?.pickupOtp || '');
    setOtpError('');
  };

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionModalReq) return;

    if (collectionModalReq.collectionSchedule?.pickupOtp && enteredOtp.trim() !== collectionModalReq.collectionSchedule.pickupOtp) {
      setOtpError('Invalid OTP! Please ask the customer for their 4-digit handover OTP.');
      return;
    }

    confirmApplianceCollection(collectionModalReq.id, collectionNotes);
    setCollectionModalReq(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cockpit Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-900/50">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
            alt="Engineer profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-2xl text-white">
                {currentUser?.name || 'Rajesh Kumar'}
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/30 text-emerald-300 rounded border border-emerald-400/40 uppercase">
                Field Engineer • EV #04
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Bengaluru South & East Zone • Vehicle: Tata Ace EV Van #04 (Solar Rooftop Charged)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToRouting}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-xs"
          >
            <Compass className="w-4 h-4 text-emerald-200" />
            <span>Open EV Route Logistics Map</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Requests</p>
          <p className="font-heading text-2xl font-bold text-slate-900 mt-1">{totalAssigned}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">In operational queue</p>
        </div>

        <div className={`rounded-2xl p-4 border shadow-xs transition ${
          needInspection > 0 ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' : 'bg-white border-slate-200'
        }`}>
          <p className="text-xs text-amber-800 font-bold">Needs Inspection</p>
          <p className="font-heading text-2xl font-extrabold text-amber-900 mt-1">{needInspection}</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Awaiting physical review</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-600 font-medium">Offers Pending Approval</p>
          <p className="font-heading text-2xl font-bold text-slate-800 mt-1">{pendingCustomerDecision}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Customer reviewing offer</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <p className="text-xs text-teal-700 font-medium">Collection / Scheduled</p>
          <p className="font-heading text-2xl font-bold text-teal-700 mt-1">{readyForCollection}</p>
          <p className="text-[10px] text-teal-600 mt-0.5">EV Doorstep service</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs text-emerald-700 font-medium">Collected & Paid</p>
          <p className="font-heading text-2xl font-bold text-emerald-700 mt-1">{inTransitOrPaid}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Circular lifecycle closed</p>
        </div>
      </div>

      {/* Main Operations Workbench List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Queue ({requests.length})
            </button>
            <button
              onClick={() => setStatusFilter('need_inspection')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                statusFilter === 'need_inspection'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Needs Inspection ({needInspection})
            </button>
            <button
              onClick={() => setStatusFilter('pending_customer')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'pending_customer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Awaiting Customer ({pendingCustomerDecision})
            </button>
            <button
              onClick={() => setStatusFilter('ready_collection')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'ready_collection'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pickups & Payouts ({readyForCollection})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Completed ({inTransitOrPaid})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, customer, appliance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Requests Queue */}
        <div className="divide-y divide-slate-100">
          {filteredRequests.map((req) => {
            const isOfferReady = req.status === 'offer_ready';
            const isAccepted = req.status === 'offer_accepted';
            const isScheduled = req.status === 'pickup_scheduled';
            const isCollected = req.status === 'collected';
            const isPaid = req.status === 'payment_completed';
            const isNeedsInspection = req.status === 'submitted' || req.status === 'engineer_assigned';

            return (
              <div key={req.id} className="p-6 hover:bg-slate-50/70 transition space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Device & Customer snapshot */}
                  <div className="flex items-start gap-4">
                    <img
                      src={req.photos[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'}
                      alt={req.model}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-[11px] uppercase font-bold text-slate-500">
                          {req.category.replace(/_/g, ' ')}
                        </span>
                        {/* Status label */}
                        {isNeedsInspection && (
                          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                            Awaiting Inspection
                          </span>
                        )}
                        {isOfferReady && (
                          <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                            Offer Sent — Pending Customer Decision
                          </span>
                        )}
                        {isAccepted && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Offer Accepted — Ready to Schedule
                          </span>
                        )}
                        {isScheduled && (
                          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-300">
                            EV Pickup Scheduled
                          </span>
                        )}
                        {isCollected && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-300">
                            Collected — In Transit (Payout Pending)
                          </span>
                        )}
                        {isPaid && (
                          <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                            Payment Settled
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-bold text-slate-900 text-lg">
                        {req.brand} {req.model}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          {req.customerName}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {req.customerPhone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {req.pickupAddress}, {req.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Valuation numbers & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">
                        {req.inspection ? 'Engineer Offer' : 'Initial Estimate'}
                      </p>
                      <p className="font-heading font-extrabold text-2xl text-emerald-800">
                        {formatINR(req.inspection?.revisedPrice || req.estimatedPrice)}
                      </p>
                      {req.inspection && req.inspection.revisedPrice !== req.estimatedPrice && (
                        <p className="text-[10px] text-slate-400">
                          Rev from {formatINR(req.estimatedPrice)}
                        </p>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isNeedsInspection && (
                        <button
                          onClick={() => setSelectedReqForInspection(req)}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Conduct Physical Inspection</span>
                        </button>
                      )}

                      {isOfferReady && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReqForInspection(req)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                          >
                            Update Inspection
                          </button>
                          <span className="text-xs text-amber-800 font-medium italic">
                            Waiting for customer approval...
                          </span>
                        </div>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() =>
                            schedulePickupSlot(
                              req.id,
                              'Tomorrow',
                              '10:00 AM - 1:00 PM',
                              'Tata Ace EV Van #04 (Solar Charged)'
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Confirm Pickup Schedule</span>
                        </button>
                      )}

                      {isScheduled && (
                        <button
                          onClick={() => handleOpenCollectionConfirm(req)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Physical Collection</span>
                        </button>
                      )}

                      {isCollected && (
                        <button
                          onClick={() => processDemoPayment(req.id, 'UPI Instant Demo')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Disburse Demo Payment (₹{(req.inspection?.revisedPrice || req.estimatedPrice).toLocaleString()})</span>
                        </button>
                      )}

                      {isPaid && (
                        <button
                          onClick={() => onOpenReceipt(req)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-details: Inspection notes or scheduled details */}
                {req.inspection && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-900">Technical Assessment: </span>
                      <span>{req.inspection.physicalInspectionNotes}</span>
                      {req.inspection.priceRevisionReason && (
                        <span className="text-amber-800 font-medium ml-1">
                          (Reason: {req.inspection.priceRevisionReason})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Score: {req.inspection.functionalScorePercent}% • NIST 800-88 Certified
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineer Inspection Modal */}
      {selectedReqForInspection && (
        <InspectionModal
          request={selectedReqForInspection}
          isOpen={Boolean(selectedReqForInspection)}
          onClose={() => setSelectedReqForInspection(null)}
        />
      )}

      {/* Physical Collection Confirmation Sub-Dialog */}
      {collectionModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white p-6 relative">
              <button
                onClick={() => setCollectionModalReq(null)}
                className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Doorstep Handover Verification
              </span>
              <h4 className="font-heading font-bold text-xl mt-1">
                Confirm Physical Collection
              </h4>
              <p className="text-xs text-emerald-100/80 mt-1">
                {collectionModalReq.brand} {collectionModalReq.model} • Customer: {collectionModalReq.customerName}
              </p>
            </div>

            <form onSubmit={handleConfirmCollection} className="p-6 space-y-4 text-xs">
              {otpError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {otpError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Pickup OTP *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. 5829"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full font-mono text-center text-lg font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-xl py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Demo hint: customer OTP is{' '}
                  <span className="font-bold text-slate-600">
                    {collectionModalReq.collectionSchedule?.pickupOtp || '5829'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Collection Handover Notes
                </label>
                <textarea
                  rows={2}
                  value={collectionNotes}
                  onChange={(e) => setCollectionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Stowed into Tata Ace EV Van #04
                </p>
                <p className="text-slate-600">
                  Secured against physical and electrostatic damage for transit to Electronic City Solar Hub.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollectionModalReq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Confirm & Mark In-Transit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
