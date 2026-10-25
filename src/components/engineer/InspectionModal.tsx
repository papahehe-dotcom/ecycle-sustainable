/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Tv,
  BatteryCharging,
  DollarSign,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ApplianceRequest, WorkingCondition } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/valuation';

interface InspectionModalProps {
  request: ApplianceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const { recordInspection } = useApp();

  if (!isOpen || !request) return null;

  const [verifiedCondition, setVerifiedCondition] = useState<WorkingCondition>(
    request.inspection?.verifiedCondition || request.customerCondition
  );
  const [functionalScorePercent, setFunctionalScorePercent] = useState(
    request.inspection?.functionalScorePercent || 80
  );
  const [screenDisplayOk, setScreenDisplayOk] = useState(
    request.inspection?.screenDisplayOk ?? true
  );
  const [batteryHealthPercent, setBatteryHealthPercent] = useState<number>(
    request.inspection?.batteryHealthPercent || 78
  );
  const [casingCondition, setCasingCondition] = useState<'pristine' | 'minor_scratches' | 'dented_cracked'>(
    request.inspection?.casingCondition || 'minor_scratches'
  );
  const [motherboardOperational, setMotherboardOperational] = useState(
    request.inspection?.motherboardOperational ?? true
  );
  const [dataWipeCertified, setDataWipeCertified] = useState(
    request.inspection?.dataWipeCertified ?? true
  );
  const [recommendedDisposition, setRecommendedDisposition] = useState<
    'resell_students' | 'repair_refurbish' | 'spare_parts_harvest' | 'certified_recycling'
  >(request.inspection?.recommendedDisposition || 'resell_students');

  // Valuation revision
  const [revisedPrice, setRevisedPrice] = useState<number>(
    request.inspection?.revisedPrice || request.estimatedPrice
  );
  const [priceRevisionReason, setPriceRevisionReason] = useState<string>(
    request.inspection?.priceRevisionReason ||
      'Hardware integrity tested on workbench. Pricing adjusted based on component salvage & refurbishment viability.'
  );
  const [physicalInspectionNotes, setPhysicalInspectionNotes] = useState<string>(
    request.inspection?.physicalInspectionNotes ||
      'Physical inspection complete. Enclosure in fair condition, power supply verified.'
  );
  const [damageItemsInput, setDamageItemsInput] = useState<string>(
    request.inspection?.damageItems.join(', ') || 'Minor surface scuffs'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceRevisionReason.trim()) {
      setErrorMsg('A clear rationale is mandatory for all price offers/revisions.');
      return;
    }

    const damageItems = damageItemsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    recordInspection(request.id, {
      verifiedCondition,
      functionalScorePercent,
      screenDisplayOk,
      batteryHealthPercent: request.category === 'phones_pcs_tvs' || request.category === 'batteries_special' ? batteryHealthPercent : undefined,
      casingCondition,
      motherboardOperational,
      coolingGasStatus: request.category === 'home_appliances' ? 'recovered_safely' : 'not_applicable',
      physicalInspectionNotes,
      damageItems,
      dataWipeCertified,
      recommendedDisposition,
      revisedPrice: Number(revisedPrice),
      priceRevisionReason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-teal-300">
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>FIELD ENGINEER WORKBENCH • {request.id}</span>
          </div>
          <h3 className="font-heading text-2xl font-bold mt-1">
            Conduct Physical Inspection & Valuation
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {request.brand} {request.model} ({request.approxAgeYears} yrs old) • Customer: {request.customerName}
          </p>
        </div>

        {/* Customer Reported Baseline Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-slate-400 uppercase font-semibold text-[10px]">
              Customer Reported:
            </span>
            <p className="text-slate-800 font-medium">
              Condition: <span className="capitalize">{request.customerCondition.replace('_', ' ')}</span> • "{request.customerFaultsDescription}"
            </p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">
              Preliminary Estimate:
            </span>
            <p className="font-heading font-bold text-slate-800 text-sm">
              {formatINR(request.estimatedPrice)}
            </p>
          </div>
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleSubmitInspection} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Photos Preview */}
          {request.photos.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Customer Uploaded Photographs ({request.photos.length})
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {request.photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Verified Working Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verified Working Condition *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVerifiedCondition('fully_working')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  verifiedCondition === 'fully_working'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Fully Functional
              </button>
              <button
                type="button"
                onClick={() => setVerifiedCondition('partially_working')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  verifiedCondition === 'partially_working'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Partially Functional
              </button>
              <button
                type="button"
                onClick={() => setVerifiedCondition('non_working')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  verifiedCondition === 'non_working'
                    ? 'bg-slate-800 border-slate-900 text-white font-bold ring-2 ring-slate-800/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Scrap / Non-Working
              </button>
            </div>
          </div>

          {/* Technical Diagnostics */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              Technical Diagnostics & Hardware Integrity
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">Overall Functional Score:</span>
                  <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {functionalScorePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={functionalScorePercent}
                  onChange={(e) => setFunctionalScorePercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {(request.category === 'phones_pcs_tvs' || request.category === 'batteries_special') && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">Battery Health Capacity:</span>
                    <span className="font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {batteryHealthPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={batteryHealthPercent}
                    onChange={(e) => setBatteryHealthPercent(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={screenDisplayOk}
                  onChange={(e) => setScreenDisplayOk(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <span className="font-medium text-slate-700">Screen / Display OK</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={motherboardOperational}
                  onChange={(e) => setMotherboardOperational(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <span className="font-medium text-slate-700">Motherboard / Core OK</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataWipeCertified}
                  onChange={(e) => setDataWipeCertified(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <span className="font-medium text-emerald-800 font-semibold">NIST 800-88 Data Sanitized</span>
              </label>
            </div>
          </div>

          {/* Disposition Path from reference image 2 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Recommended Processing Disposition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRecommendedDisposition('resell_students')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  recommendedDisposition === 'resell_students'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-bold text-xs">Resell to Students</p>
                <p className="text-[10px] text-slate-400">1-2 yr warranty</p>
              </button>

              <button
                type="button"
                onClick={() => setRecommendedDisposition('repair_refurbish')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  recommendedDisposition === 'repair_refurbish'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-bold text-xs">Solar Hub Refurbish</p>
                <p className="text-[10px] text-slate-400">Component upgrade</p>
              </button>

              <button
                type="button"
                onClick={() => setRecommendedDisposition('spare_parts_harvest')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  recommendedDisposition === 'spare_parts_harvest'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-bold text-xs">Harvest Spares</p>
                <p className="text-[10px] text-slate-400">Save OEM parts</p>
              </button>

              <button
                type="button"
                onClick={() => setRecommendedDisposition('certified_recycling')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  recommendedDisposition === 'certified_recycling'
                    ? 'bg-slate-800 border-slate-900 text-white font-bold ring-2 ring-slate-800/20'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <p className="font-bold text-xs">Certified Recycler</p>
                <p className="text-[10px] text-slate-400">R2 / metal recovery</p>
              </button>
            </div>
          </div>

          {/* Pricing Adjustments & Mandatory Rationale */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <h5 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              Final Offer Determination & Customer Dispatch
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-slate-600 text-xs mb-1">
                  Preliminary Online Estimate:
                </label>
                <div className="font-mono text-sm font-semibold text-slate-700">
                  {formatINR(request.estimatedPrice)}
                </div>
              </div>

              <div>
                <label className="block text-emerald-900 font-bold text-xs mb-1">
                  Engineer's Revised Final Offer (₹) *
                </label>
                <input
                  type="number"
                  step="50"
                  required
                  value={revisedPrice}
                  onChange={(e) => setRevisedPrice(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-heading font-extrabold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-900 font-bold text-xs mb-1">
                Mandatory Reason for Valuation / Price Adjustment *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Explain the technical factors: e.g. Motherboard healthy, backlight wire needs micro-solder, camera module healthy..."
                value={priceRevisionReason}
                onChange={(e) => setPriceRevisionReason(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Identified Defect / Damage Items
              </label>
              <input
                type="text"
                placeholder="Separate by commas (e.g. Scratched hinge, battery cycle high)"
                value={damageItemsInput}
                onChange={(e) => setDamageItemsInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Final Offer to Customer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
