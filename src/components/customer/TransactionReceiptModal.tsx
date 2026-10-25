/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  QrCode,
  Download,
  Award,
} from 'lucide-react';
import { ApplianceRequest } from '../../types';
import { formatINR } from '../../utils/valuation';

interface TransactionReceiptModalProps {
  request: ApplianceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request || !request.payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar (hidden on print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs font-semibold text-slate-700">Official Green Settlement Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Area */}
        <div id="printable-receipt" className="p-8 sm:p-10 space-y-8 bg-white text-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5 fill-white/20" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
                  E-Cycle
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                E-Cycle Technologies India Pvt. Ltd. • Circular E-Waste Registry
              </p>
              <p className="text-[11px] text-slate-400">
                Solar Hub 1, Electronic City Phase 1, Bengaluru, KA 560100
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider">
                Settled & Certified
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 mt-2">
                Receipt #{request.payment.receiptNumber}
              </p>
              <p className="text-[11px] text-slate-400">
                Date: {new Date(request.payment.paidAt || request.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Appliance Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                Issued To (Seller)
              </p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{request.customerName}</p>
              <p className="text-slate-600">{request.pickupAddress}</p>
              <p className="text-slate-600">{request.city} - {request.pincode}</p>
              <p className="text-slate-500 mt-1">{request.customerPhone}</p>
            </div>

            <div>
              <p className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                Handling Engineer & Fleet
              </p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {request.assignedEngineerName || 'Rajesh Kumar'}
              </p>
              <p className="text-slate-600">
                Vehicle: {request.collectionSchedule?.assignedVehicle || 'Tata Ace EV #04 (Solar Charged)'}
              </p>
              <p className="text-slate-500 mt-1">
                Collection Point: {request.collectionSchedule?.city || 'Bengaluru Central'}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Appliance Description</th>
                  <th className="py-2.5 px-4 font-bold">Inspection Disposition</th>
                  <th className="py-2.5 px-4 font-bold text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">
                      {request.brand} {request.model}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Req ID: {request.id} • Category: {request.category.replace(/_/g, ' ')}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-emerald-800">
                      {request.inspection?.recommendedDisposition === 'resell_students'
                        ? 'Refurbished for Student Resale'
                        : request.inspection?.recommendedDisposition === 'repair_refurbish'
                        ? '1-Year Warranty Refurbishment'
                        : 'Certified Responsible Material Recycling'}
                    </span>
                    <p className="text-[10px] text-slate-400">Data Sanitization: NIST 800-88</p>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono text-sm">
                    {formatINR(request.payment.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Breakdown & Settlement Summary */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                Payout Disbursement Status
              </p>
              <p className="font-heading font-extrabold text-2xl text-emerald-900 mt-0.5">
                {formatINR(request.payment.amount)}
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                Transferred via <strong>{request.payment.paymentMethod}</strong> to {request.payment.accountMasked}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Transaction ID: {request.payment.transactionId}
              </p>
            </div>

            {/* Simulated QR Code for Green Verification */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
              <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
              <div className="text-[10px] text-slate-500">
                <p className="font-bold text-slate-800">Green Chain QR</p>
                <p>Scan to verify certified circular disposal & data erase audit.</p>
              </div>
            </div>
          </div>

          {/* Environmental Savings Certificate Badge */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
                Certified Environmental Impact Certificate
              </h5>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-emerald-700">{request.environmentalImpact.wasteDivertedKg} kg</p>
                <p className="text-[10px] text-slate-500">E-Waste Diverted</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-teal-700">{request.environmentalImpact.co2AvoidedKg} kg</p>
                <p className="text-[10px] text-slate-500">CO2 Emissions Avoided</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-amber-700">{request.environmentalImpact.preciousMetalsGrams} g</p>
                <p className="text-[10px] text-slate-500">Metals Recovered</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-emerald-700">{request.environmentalImpact.waterSavedLiters} L</p>
                <p className="text-[10px] text-slate-500">Water Conserved</p>
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
            <p>
              E-Cycle certified in accordance with E-Waste (Management) Rules, 2022. All personal storage
              media sanitised in accordance with NIST Special Publication 800-88 Revision 1.
            </p>
            <p className="mt-1 font-semibold text-slate-500">
              Demo Electronic Receipt • Valid without physical signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
