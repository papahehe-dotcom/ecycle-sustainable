/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ShieldCheck,
  FileText,
  DollarSign,
  ArrowRight,
  Leaf,
  Calendar,
  MapPin,
  Camera,
  Layers,
  Wrench,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { ApplianceRequest, RequestStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/valuation';

interface ApplianceTrackerModalProps {
  request: ApplianceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: (request: ApplianceRequest) => void;
}

const TIMELINE_STEPS: Array<{ key: RequestStatus; label: string; desc: string }> = [
  { key: 'submitted', label: 'Request Submitted', desc: 'Appliance registered with preliminary valuation' },
  { key: 'engineer_assigned', label: 'Engineer Assigned', desc: 'Solar EV fleet engineer dispatched' },
  { key: 'inspection_completed', label: 'Inspection Completed', desc: 'Hardware & condition verified on-site/hub' },
  { key: 'offer_ready', label: 'Offer Ready for Approval', desc: 'Final valuation issued by engineer' },
  { key: 'offer_accepted', label: 'Offer Accepted / Confirmed', desc: 'Deal accepted by appliance owner' },
  { key: 'pickup_scheduled', label: 'EV Pickup Scheduled', desc: 'Doorstep pickup time slot confirmed' },
  { key: 'collected', label: 'Appliance Collected', desc: 'Picked up in EV fleet and transported to solar hub' },
  { key: 'payment_completed', label: 'Payment Completed', desc: 'Payout transferred and receipt generated' },
];

export const ApplianceTrackerModal: React.FC<ApplianceTrackerModalProps> = ({
  request,
  isOpen,
  onClose,
  onOpenReceipt,
}) => {
  const { respondToOffer, schedulePickupSlot } = useApp();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState('');

  if (!isOpen || !request) return null;

  // Determine stage progression index
  const getStageIndex = (status: RequestStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'engineer_assigned':
        return 1;
      case 'inspection_completed':
        return 2;
      case 'offer_ready':
        return 3;
      case 'offer_accepted':
      case 'offer_rejected':
        return 4;
      case 'pickup_scheduled':
        return 5;
      case 'collected':
        return 6;
      case 'payment_completed':
        return 7;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(request.status);
  const activeOffer = request.inspection?.revisedPrice || request.estimatedPrice;

  const handleAccept = () => {
    respondToOffer(request.id, true);
  };

  const handleReject = () => {
    respondToOffer(request.id, false, rejectionRemark);
    setRejectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-300">
            <span>{request.id}</span>
            <span>•</span>
            <span className="uppercase">{request.category.replace(/_/g, ' ')}</span>
          </div>
          <h3 className="font-heading text-2xl font-bold mt-1">
            {request.brand} {request.model}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Submitted on {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {request.assignedEngineerName && ` • Verified by ${request.assignedEngineerName}`}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* URGENT: Offer Approval Box when offer is ready */}
          {request.status === 'offer_ready' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-lg mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
                <span>Engineer Final Valuation Ready for Your Decision</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Field engineer <strong>{request.inspection?.engineerName}</strong> has completed physical
                testing. Please review the findings and confirm whether to proceed.
              </p>

              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-3 bg-white rounded-xl p-4 border border-amber-200 mb-4">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Initial Online Estimate</p>
                  <p className="font-heading font-semibold text-base text-slate-700">
                    {formatINR(request.estimatedPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
                    Engineer Final Offer
                  </p>
                  <p className="font-heading font-extrabold text-2xl text-emerald-800">
                    {formatINR(request.inspection?.revisedPrice || request.estimatedPrice)}
                  </p>
                </div>
              </div>

              {/* Inspection notes & findings */}
              {request.inspection && (
                <div className="bg-amber-100/60 rounded-xl p-3.5 border border-amber-200 text-xs space-y-1.5 mb-4">
                  <p className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-700" />
                    Engineer Inspection Assessment:
                  </p>
                  <p className="text-slate-800">
                    <span className="font-semibold">Reason for valuation: </span>
                    {request.inspection.priceRevisionReason}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold">Technical condition: </span>
                    Functional Score: {request.inspection.functionalScorePercent}% • Verified: {request.inspection.verifiedCondition.replace('_', ' ')}
                  </p>
                  {request.inspection.damageItems.length > 0 && (
                    <p className="text-slate-700">
                      <span className="font-semibold">Noted items: </span>
                      {request.inspection.damageItems.join(', ')}
                    </p>
                  )}
                  <p className="text-emerald-800 font-medium text-[11px] pt-1">
                    ✓ Military-grade data sanitization (NIST 800-88) certified upon acceptance.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Accept Offer of {formatINR(activeOffer)} & Schedule Pickup</span>
                </button>

                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <ThumbsDown className="w-4 h-4 text-slate-400" />
                  <span>Decline Offer</span>
                </button>
              </div>
            </div>
          )}

          {/* Decline Confirmation Sub-dialog */}
          {rejectModalOpen && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-rose-900">Are you sure you wish to decline?</h5>
              <p className="text-xs text-rose-700">
                You can decline the price offer. If you choose not to sell, your appliance request will be
                safely closed or returned without fee.
              </p>
              <input
                type="text"
                placeholder="Optional feedback (e.g. expected higher price)"
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status Tracker: 8-Step Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              End-to-End Tracking Lifecycle
            </h4>

            <div className="space-y-4">
              {TIMELINE_STEPS.map((stepItem, idx) => {
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isRejected = request.status === 'offer_rejected' && idx === 4;

                let iconColor = 'bg-slate-200 text-slate-400';
                if (isRejected) {
                  iconColor = 'bg-rose-500 text-white';
                } else if (isPassed) {
                  iconColor = 'bg-emerald-600 text-white';
                } else if (isCurrent) {
                  iconColor = 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-200';
                }

                return (
                  <div key={stepItem.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${iconColor} shrink-0`}>
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isRejected ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-6 mt-1 ${
                            idx < currentStageIdx ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-heading font-semibold ${
                            isCurrent
                              ? 'text-amber-900 font-bold'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {isRejected ? 'Offer Rejected by Customer' : stepItem.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{stepItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pickup & Vehicle Information (if scheduled) */}
          {request.collectionSchedule && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-teal-700" />
                  Scheduled Doorstep Collection
                </span>
                <span className="bg-teal-200 text-teal-900 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                  Secret OTP: {request.collectionSchedule.pickupOtp}
                </span>
              </div>
              <p className="text-slate-700">
                <strong>Window: </strong>
                {request.collectionSchedule.scheduledDate} ({request.collectionSchedule.timeWindow})
              </p>
              <p className="text-slate-700">
                <strong>Assigned EV: </strong>
                {request.collectionSchedule.assignedVehicle}
              </p>
              <p className="text-slate-700">
                <strong>Address: </strong>
                {request.collectionSchedule.pickupAddress}
              </p>
              <p className="text-[11px] text-teal-800">
                Provide the 4-digit secret OTP to the engineer only when physical handover takes place.
              </p>
            </div>
          )}

          {/* Payment & Receipt Trigger */}
          {request.status === 'payment_completed' && request.payment && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Transaction Closed & Disbursed
                </span>
                <h5 className="font-heading font-bold text-base text-slate-900 mt-0.5">
                  {formatINR(request.payment.amount)} transferred successfully
                </h5>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ref: {request.payment.transactionId} • {request.payment.paymentMethod}
                </p>
              </div>

              <button
                onClick={() => onOpenReceipt(request)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>View & Print Official Receipt</span>
              </button>
            </div>
          )}

          {/* Environmental Impact contribution */}
          <div className="bg-slate-900 text-white rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <Leaf className="w-4 h-4" />
              <span>Environmental & Circular Contribution</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-800 rounded-lg">
                <p className="font-heading font-bold text-emerald-300 text-base">
                  {request.environmentalImpact.wasteDivertedKg} kg
                </p>
                <p className="text-[10px] text-slate-400">E-Waste Diverted</p>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg">
                <p className="font-heading font-bold text-teal-300 text-base">
                  {request.environmentalImpact.co2AvoidedKg} kg
                </p>
                <p className="text-[10px] text-slate-400">CO2e Avoided</p>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg">
                <p className="font-heading font-bold text-amber-300 text-base">
                  {request.environmentalImpact.preciousMetalsGrams} g
                </p>
                <p className="text-[10px] text-slate-400">Precious Metals</p>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg">
                <p className="font-heading font-bold text-emerald-300 text-base">
                  {request.environmentalImpact.waterSavedLiters} L
                </p>
                <p className="text-[10px] text-slate-400">Water Conserved</p>
              </div>
            </div>
          </div>

          {/* Audit trail */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Audit Trail & Verification Log
            </h5>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-200/60 text-xs">
              {request.auditTrail.map((log) => (
                <div key={log.id} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">by {log.actor} ({log.role})</span>
                    {log.details && <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
