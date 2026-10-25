/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sun,
  Wrench,
  Recycle,
  Zap,
  CheckCircle2,
  Tv,
  Refrigerator,
  Drill,
  BatteryCharging,
  QrCode,
  Lock,
} from 'lucide-react';

export const HowItWorksDetailedView: React.FC<{
  onOpenSubmit: () => void;
  onNavigateTab: (tab: string) => void;
}> = ({ onOpenSubmit, onNavigateTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          E-CYCLE SOLUTION ARCHITECTURE
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
          How E-Cycle Operates: From Doorstep to Circular Life
        </h2>
        <p className="text-sm text-slate-600">
          Our verified 4-stage operational model guarantees transparent valuations, zero data leaks,
          and a strict "Reuse Before Recycling" policy.
        </p>
      </div>

      {/* 4 Deep-dive Stages */}
      <div className="space-y-8">
        {/* Stage 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 bg-amber-50 rounded-2xl p-6 border border-amber-200/70 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Stage 1
            </span>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mt-1 mb-2">
              Collect & Segregate
            </h3>
            <p className="text-xs text-slate-600">Doorstep EV pickups & village aggregation hubs</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-amber-200 text-amber-900 text-xs font-bold">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>100% Electric Fleets</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-heading font-bold text-lg text-slate-900">
              Convenient Doorstep Booking with On-Spot Valuation
            </h4>
            <p>
              Users schedule a pickup via our web application by providing appliance details, photos, and
              condition. Our nearest Tata Ace EV van is routed using an energy-saving algorithm.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>Verified engineer conducts on-site diagnosis or preliminary verification.</li>
              <li>Handover verified using secure 4-digit customer OTP.</li>
              <li>Stowed into electrostatic-safe transit bays to avoid physical transit shock.</li>
            </ul>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 bg-emerald-50 rounded-2xl p-6 border border-emerald-200/70 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Stage 2
            </span>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mt-1 mb-2">
              Repair & Test
            </h3>
            <p className="text-xs text-slate-600">Solar-powered processing hub in Electronic City</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-emerald-200 text-emerald-900 text-xs font-bold">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Solar Clean Energy</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-heading font-bold text-lg text-slate-900">
              QR Tagging, Diagnostic Benchmarks & Military Data Eradication
            </h4>
            <p>
              Appliances arrive at our solar-powered hub where every device receives a laser-etched or
              scannable QR ID for complete lifecycle traceability.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>
                <strong>NIST 800-88 Compliant Sanitization:</strong> All storage drives undergo certified 3-pass erasure, rendering personal data irretrievable.
              </li>
              <li>
                <strong>Component Testing:</strong> Display panel, motherboard, capacitors, and cooling circuits tested with oscilloscopes and diagnostic suites.
              </li>
              <li>Refrigerant gases (R134a, R32, R410A) recovered via closed-circuit recovery pumps.</li>
            </ul>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 bg-emerald-900 text-white rounded-2xl p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Stage 3
            </span>
            <h3 className="font-heading font-bold text-2xl mt-1 mb-2">
              Resell: First Choice
            </h3>
            <p className="text-xs text-emerald-100">Reuse Before Recycling</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800 rounded-full text-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>1–2 Yrs Warranty</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-heading font-bold text-lg text-slate-900">
              Affordable, High-Performance Tech for Students & Schools
            </h4>
            <p>
              Working gadgets and refurbished appliances are certified with our seal and offered to
              students, non-profits, and educational institutions at steep subsidies.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>Includes 1 to 2 years replacement warranty.</li>
              <li>Guaranteed buyback promise when upgrading later.</li>
              <li>Extends product operational lifetime by 3 to 7 years, cutting electronic carbon footprints in half.</li>
            </ul>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 bg-slate-100 rounded-2xl p-6 border border-slate-300 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Stage 4
            </span>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mt-1 mb-2">
              Responsible Recycling
            </h3>
            <p className="text-xs text-slate-500">Last Resort for Unfixable Units</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-300 text-slate-700 text-xs font-bold">
              <Recycle className="w-3.5 h-3.5 text-slate-600" />
              <span>Authorized R2 Recyclers</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-heading font-bold text-lg text-slate-900">
              Zero-Landfill Material Extraction
            </h4>
            <p>
              Devices with catastrophic motherboard or screen damage are dismantled by authorized
              recycling partners for pure material separation:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>PCBs processed for high-purity gold, silver, copper, and palladium recovery.</li>
              <li>Lithium-ion cells quarantined in fire-safe bins and sent to authorized hydrometallurgical refiners.</li>
              <li>Structural plastics granulate into pellets for industrial re-extrusion.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-4">
        <h3 className="font-heading font-bold text-2xl text-slate-900">
          Experience the Seamless Workflow in Action
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Submit an appliance from the customer perspective or switch to the field engineer view to
          inspect hardware and revise offers in real-time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition"
          >
            Submit an Appliance
          </button>
          <button
            onClick={() => onNavigateTab('customer')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
          >
            View Customer Portal
          </button>
        </div>
      </div>
    </div>
  );
};
