/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Trash2,
  Tv,
  Refrigerator,
  Drill,
  BatteryCharging,
  Info,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { ApplianceCategory, WorkingCondition } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateEstimatedValuation, formatINR } from '../../utils/valuation';

interface SubmitApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (requestId: string) => void;
}

const SAMPLE_PRESETS: Record<string, { brand: string; model: string; category: ApplianceCategory; age: number; condition: WorkingCondition; photo: string; faults: string }> = {
  macbook: {
    brand: 'Apple',
    model: 'MacBook Pro 14" M2 (512GB)',
    category: 'phones_pcs_tvs',
    age: 2,
    condition: 'fully_working',
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    faults: 'Upgraded to desktop. Clean screen and keyboard, charger included.',
  },
  samsung_fridge: {
    brand: 'Samsung',
    model: 'Double Door Digital Inverter 253L Refrigerator',
    category: 'home_appliances',
    age: 6,
    condition: 'partially_working',
    photo: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    faults: 'Lower cooling compartment is slow, freezer works fine. Minor handle scratch.',
  },
  drill_tool: {
    brand: 'Bosch',
    model: 'GSB 500W Professional Impact Drill Kit',
    category: 'lights_tools_medical',
    age: 4,
    condition: 'fully_working',
    photo: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    faults: 'Working cord and chuck. Includes drill bits box.',
  },
};

export const SubmitApplianceModal: React.FC<SubmitApplianceModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const { currentUser, submitApplianceRequest } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [category, setCategory] = useState<ApplianceCategory>('phones_pcs_tvs');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [approxAgeYears, setApproxAgeYears] = useState(3);
  const [customerCondition, setCustomerCondition] = useState<WorkingCondition>('fully_working');
  const [customerFaultsDescription, setCustomerFaultsDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [pickupAddress, setPickupAddress] = useState(currentUser?.address || 'Flat 402, Green Glen Layout, Bellandur');
  const [city, setCity] = useState(currentUser?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(currentUser?.pincode || '560103');
  const [preferredSlot, setPreferredSlot] = useState('Tomorrow, 10:00 AM - 1:00 PM');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const { estimatedPrice, breakdown } = calculateEstimatedValuation(
    category,
    brand || 'Generic',
    approxAgeYears,
    customerCondition
  );

  const handleApplyPreset = (key: keyof typeof SAMPLE_PRESETS) => {
    const item = SAMPLE_PRESETS[key];
    setBrand(item.brand);
    setModel(item.model);
    setCategory(item.category);
    setApproxAgeYears(item.age);
    setCustomerCondition(item.condition);
    setCustomerFaultsDescription(item.faults);
    if (!photos.includes(item.photo)) {
      setPhotos([item.photo, ...photos]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!brand.trim()) {
        setErrorMsg('Please specify the appliance brand.');
        return;
      }
      if (!model.trim()) {
        setErrorMsg('Please enter the model name or number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim()) {
      setErrorMsg('Please enter a valid pickup address.');
      return;
    }

    const newReq = submitApplianceRequest({
      category,
      brand,
      model,
      approxAgeYears,
      customerCondition,
      customerFaultsDescription: customerFaultsDescription.trim() || 'No specific faults noted by owner.',
      photos,
      pickupAddress,
      city,
      pincode,
      preferredSlot,
    });

    onSubmitted(newReq.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="w-4 h-4" />
            <span>Appliance Submission Portal</span>
          </div>
          <h3 className="font-heading text-2xl font-bold mt-1">Book Pickup & Get Valuation</h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Fill in your device details for doorstep electric collection and genuine valuation.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-emerald-700/60 text-xs">
            <div
              className={`flex items-center gap-1.5 font-semibold ${
                step >= 1 ? 'text-white' : 'text-emerald-400/60'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Details</span>
            </div>
            <div className="w-8 h-0.5 bg-emerald-700"></div>
            <div
              className={`flex items-center gap-1.5 font-semibold ${
                step >= 2 ? 'text-white' : 'text-emerald-400/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-emerald-400'}`}>
                2
              </span>
              <span>Condition & Photos</span>
            </div>
            <div className="w-8 h-0.5 bg-emerald-700"></div>
            <div
              className={`flex items-center gap-1.5 font-semibold ${
                step >= 3 ? 'text-white' : 'text-emerald-400/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-emerald-400'}`}>
                3
              </span>
              <span>Pickup & Schedule</span>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets Bar */}
        <div className="px-6 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-emerald-900 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Demo Autofill:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('macbook')}
              className="px-2 py-1 rounded bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200 text-[11px] font-medium transition"
            >
              MacBook Pro
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('samsung_fridge')}
              className="px-2 py-1 rounded bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200 text-[11px] font-medium transition"
            >
              Samsung Fridge
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('drill_tool')}
              className="px-2 py-1 rounded bg-white hover:bg-emerald-100 text-slate-700 border border-emerald-200 text-[11px] font-medium transition"
            >
              Bosch Drill
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Appliance Identification */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Appliance Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('phones_pcs_tvs')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      category === 'phones_pcs_tvs'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Tv className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <p className="text-xs font-bold">Phones, PCs & TVs</p>
                      <p className="text-[10px] text-slate-400">Laptops, monitors, smartphones</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('home_appliances')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      category === 'home_appliances'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Refrigerator className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <p className="text-xs font-bold">Home Appliances</p>
                      <p className="text-[10px] text-slate-400">Fridges, washing machines, ACs</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('lights_tools_medical')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      category === 'lights_tools_medical'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Drill className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <p className="text-xs font-bold">Tools & Medical</p>
                      <p className="text-[10px] text-slate-400">LEDs, power tools, chargers</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('batteries_special')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      category === 'batteries_special'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <BatteryCharging className="w-5 h-5 text-emerald-600 mb-2" />
                    <div>
                      <p className="text-xs font-bold">Batteries (Special)</p>
                      <p className="text-[10px] text-slate-400">Inverter, UPS, Li-ion packs</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple, Samsung, LG, Dell"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model Name / Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MacBook Air M1 / 43-inch UHD"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Approximate Age of Appliance
                  </label>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {approxAgeYears} {approxAgeYears === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={approxAgeYears}
                  onChange={(e) => setApproxAgeYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1 Year (Like New)</span>
                  <span>7 Years</span>
                  <span>15+ Years (Vintage/Scrap)</span>
                </div>
              </div>

              {/* Preliminary valuation teaser */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-emerald-900">
                    Preliminary Rule-Based Estimate
                  </p>
                  <p className="text-[10px] text-emerald-700">Subject to field verification</p>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-xl text-emerald-800">
                    {formatINR(estimatedPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Working Condition & Photos */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Working Condition *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerCondition('fully_working')}
                    className={`p-3 rounded-xl border text-center transition ${
                      customerCondition === 'fully_working'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs font-bold">Fully Working</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Powers on & normal usage</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerCondition('partially_working')}
                    className={`p-3 rounded-xl border text-center transition ${
                      customerCondition === 'partially_working'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Info className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-xs font-bold">Partially Working</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Minor defects / slow / ports</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerCondition('non_working')}
                    className={`p-3 rounded-xl border text-center transition ${
                      customerCondition === 'non_working'
                        ? 'bg-slate-800 border-slate-900 text-white font-bold ring-2 ring-slate-800/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <X className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold">Non-Working</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Dead / burnt / scrap parts</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Known Faults, Visible Damage, or Inclusions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scratched bottom, screen intact, power adapter included, battery drains quickly..."
                  value={customerFaultsDescription}
                  onChange={(e) => setCustomerFaultsDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Photos Upload & Previews */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upload Photographs ({photos.length})
                  </label>
                  <span className="text-[11px] text-slate-400">Multiple angles recommended</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                  {photos.map((src, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                      <img src={src} alt={`Appliance preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition shadow-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer p-2 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition">
                    <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="text-[10px] font-semibold text-slate-600">Add Photo</span>
                    <span className="text-[9px] text-slate-400">JPG, PNG</span>
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Address, Slot & Final Estimate */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doorstep Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Flat/House No, Building, Street, Area"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Bengaluru">Bengaluru (Electronic Fleet active)</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Pickup Window
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Today, 3:00 PM - 6:00 PM (Express)">Today, 3:00 PM - 6:00 PM (Express EV)</option>
                  <option value="Tomorrow, 10:00 AM - 1:00 PM">Tomorrow, 10:00 AM - 1:00 PM</option>
                  <option value="Tomorrow, 2:00 PM - 5:00 PM">Tomorrow, 2:00 PM - 5:00 PM</option>
                  <option value="Saturday Morning, 10:00 AM - 1:00 PM">Saturday Morning, 10:00 AM - 1:00 PM</option>
                </select>
              </div>

              {/* Complete Valuation Breakdown card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Base Appliance Valuation:</span>
                  <span className="text-xs font-mono font-medium">₹{breakdown.baseModelValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Condition Adjustment ({customerCondition.replace('_', ' ')}):</span>
                  <span className="font-mono">{(breakdown.conditionMultiplier * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Age Depreciation ({approxAgeYears} yrs):</span>
                  <span className="font-mono">{(breakdown.ageDepreciationFactor * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>Guaranteed Scrap / Recovery Bonus:</span>
                  <span className="font-mono">+₹{breakdown.recoverablePartsBonus}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                  <span className="text-emerald-300">Preliminary Doorstep Offer:</span>
                  <span className="font-heading text-xl text-emerald-400">{formatINR(estimatedPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-md shadow-emerald-700/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Request & Dispatch to Engineer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
