/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Leaf,
  Recycle,
  Sun,
  ShieldCheck,
  Zap,
  Award,
  BarChart3,
  Scale,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SustainabilityImpactView: React.FC = () => {
  const { requests } = useApp();

  // Aggregate live metrics across current requests
  const totalCollectedCount = requests.filter((r) => r.status === 'collected' || r.status === 'payment_completed').length;
  const refurbishedOrReusedCount = requests.filter(
    (r) =>
      r.inspection?.recommendedDisposition === 'resell_students' ||
      r.inspection?.recommendedDisposition === 'repair_refurbish'
  ).length;
  const certifiedRecycledCount = requests.filter(
    (r) => r.inspection?.recommendedDisposition === 'certified_recycling' || r.customerCondition === 'non_working'
  ).length;
  const completedTransactionsCount = requests.filter((r) => r.status === 'payment_completed').length;

  const totalDivertedKg = requests
    .filter((r) => r.status === 'collected' || r.status === 'payment_completed')
    .reduce((sum, r) => sum + r.environmentalImpact.wasteDivertedKg, 0);

  const totalCo2AvoidedKg = requests
    .filter((r) => r.status === 'collected' || r.status === 'payment_completed')
    .reduce((sum, r) => sum + r.environmentalImpact.co2AvoidedKg, 0);

  const totalPreciousMetalsG = requests
    .filter((r) => r.status === 'collected' || r.status === 'payment_completed')
    .reduce((sum, r) => sum + r.environmentalImpact.preciousMetalsGrams, 0);

  const totalWaterSavedL = requests
    .filter((r) => r.status === 'collected' || r.status === 'payment_completed')
    .reduce((sum, r) => sum + r.environmentalImpact.waterSavedLiters, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <Leaf className="w-3.5 h-3.5" />
            <span>Circular Economy Impact Registry</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Measuring Real Ecological Value
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every electronic device collected by E-Cycle is weighed, tagged with a unique QR ID, and
            evaluated according to the Waste Electrical and Electronic Equipment (WEEE) circular hierarchy:
            <strong> Reuse First, Recycle Responsibly.</strong>
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-medium">
            * All figures aggregated live from currently processed appliances (Demonstration Data).
          </div>
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Landfill Waste Diverted</span>
            <Recycle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-emerald-800">
            {totalDivertedKg.toFixed(1)} <span className="text-base font-normal text-slate-500">kg</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">100% zero-landfill disposal standard</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>CO2e Emissions Avoided</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-teal-800">
            {totalCo2AvoidedKg.toFixed(1)} <span className="text-base font-normal text-slate-500">kg</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Equivalent to ~160 tree-months carbon capture</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Precious Metals Recovered</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-amber-700">
            {totalPreciousMetalsG.toFixed(1)} <span className="text-base font-normal text-slate-500">g</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Gold, silver, copper & rare earths</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Water Conserved</span>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-blue-800">
            {totalWaterSavedL.toLocaleString()} <span className="text-base font-normal text-slate-500">L</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Prevented virgin semiconductor manufacturing</p>
        </div>
      </div>

      {/* Breakdown: Reuse vs Recycling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reuse & Student Resale Pillar */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-emerald-950">
            First Choice: Refurbish & Student Access
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Collected working devices undergo component-level servicing, thermal repasting, and
            clean OS installation. Rather than prematurely shredding functional electronics, E-Cycle
            offers certified refurbished laptops and smartphones to college students and rural schools
            with a 1–2 year warranty.
          </p>
          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900">Refurbished Units in Demo:</span>
            <span className="font-heading font-extrabold text-emerald-700 text-lg">
              {refurbishedOrReusedCount} devices
            </span>
          </div>
        </div>

        {/* Responsible Recycling Pillar */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Recycle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Last Resort: Certified R2 Recycling
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Non-working and beyond-economic-repair devices are dismantled at our Solar Processing Bay.
            Refrigerants (CFC/HFC) are vacuum-extracted in accordance with Montreal Protocol safety standards.
            Hazardous lithium batteries are isolated in fire-safe bins, while stripped PCBs are sent to
            authorized e-waste smelters for high-yield metal reclamation.
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Recycled / Salvage Units:</span>
            <span className="font-heading font-extrabold text-slate-800 text-lg">
              {certifiedRecycledCount} units
            </span>
          </div>
        </div>
      </div>

      {/* Authorized Partners & Statutory Compliance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <div>
            <h4 className="font-heading font-bold text-lg text-slate-900">
              Regulatory Compliance & Authorized Partners Network
            </h4>
            <p className="text-xs text-slate-500">
              Operating in compliance with the Central Pollution Control Board (CPCB) E-Waste (Management) Rules, 2022
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800">State PCB Authorizations</p>
            <p className="text-slate-500">
              Formal consent to operate for collection, aggregation, and physical segregation of electronic appliances.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800">NIST 800-88 Data Eradication</p>
            <p className="text-slate-500">
              Certified three-pass cryptographic wipe for HDDs, SSDs, and flash media, with verifiable audit trails.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800">Smelting & Battery Recyclers</p>
            <p className="text-slate-500">
              Audited downstream recycling partners for pyrometallurgical copper/gold extraction and hydrometallurgical lithium recycling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
