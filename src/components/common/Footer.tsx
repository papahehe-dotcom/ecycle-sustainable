/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, ShieldCheck, Award, Recycle, Sun, Zap, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top USP Banner matching reference image 2 seals */}
        <div className="bg-slate-800/80 rounded-2xl p-6 mb-12 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-dashed flex items-center justify-center bg-emerald-950/80 text-emerald-400 font-bold text-xs uppercase tracking-tighter shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                E-Cycle Core Promise
              </p>
              <h4 className="text-white font-heading font-semibold text-lg">
                Certified Ethical E-Waste Management
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-emerald-300">Genuine Valuation</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span className="font-semibold text-teal-300">1–2 Yrs Warranty Refurbished</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-emerald-300">Buyback Guarantee</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 fill-white/20" />
              </div>
              <span className="font-heading font-bold text-xl text-white">E-Cycle</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A sustainable e-waste management company operating in India. Making responsible e-waste
              disposal convenient, transparent, and circular.
            </p>
            <div className="text-xs text-emerald-400 flex items-center gap-2 font-medium">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Solar-Powered Hub & 100% Electric Fleet</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h5 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition"
                >
                  Doorstep EV Pickups
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition"
                >
                  On-Spot Engineer Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-emerald-400 transition"
                >
                  Refurbished Tech for Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('impact')}
                  className="hover:text-emerald-400 transition"
                >
                  Certified Material Recovery
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Model & Pillars */}
          <div>
            <h5 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Green Infrastructure
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Rooftop Solar Warehousing</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Battery Storage & Smart Grids</span>
              </li>
              <li className="flex items-center gap-2">
                <Recycle className="w-3.5 h-3.5 text-teal-400" />
                <span>NIST 800-88 Data Sanitization</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>E-Waste Rules (2022) Compliant</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Demo notice */}
          <div>
            <h5 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Demonstration MVP
            </h5>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              This application is an interactive MVP prototype showcasing the end-to-end appliance collection,
              valuation, logistics, and payout workflow.
            </p>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">Simulated Elements:</span> Auth sessions,
              payout transactions, and Bangalore EV routes are demo-mode for review.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 E-Cycle Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Bengaluru • Delhi NCR • Mumbai • Pune</span>
            <span className="text-slate-600">|</span>
            <span>Renewable Energy + Smart Logistics = Greener Tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
