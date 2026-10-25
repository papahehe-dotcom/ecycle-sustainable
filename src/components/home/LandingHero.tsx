/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Cpu,
  HeartHandshake,
  DollarSign,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ApplianceCategory, WorkingCondition } from '../../types';
import { calculateEstimatedValuation, formatINR } from '../../utils/valuation';
import { useApp } from '../../context/AppContext';

interface LandingHeroProps {
  onOpenSubmit: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenSubmit,
  onOpenAuth,
  onNavigateTab,
}) => {
  const { switchUser } = useApp();

  // Quick valuation teaser state
  const [quickCat, setQuickCat] = useState<ApplianceCategory>('phones_pcs_tvs');
  const [quickBrand, setQuickBrand] = useState('Apple');
  const [quickAge, setQuickAge] = useState(3);
  const [quickCondition, setQuickCondition] = useState<WorkingCondition>('fully_working');

  const { estimatedPrice, breakdown } = calculateEstimatedValuation(
    quickCat,
    quickBrand,
    quickAge,
    quickCondition
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:py-20 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>India's Solar-Powered E-Waste Circular Hub</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Give Your Electronic Appliances a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700">
                  Second Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                E-Cycle makes responsible e-waste disposal rewarding and completely transparent.
                Book doorstep electric van pickup, receive on-spot verified engineer valuation, ensure
                military-grade data erasure, and support affordable refurbished tech for students.
              </p>

              {/* Core 3 USPs matching reference image 2 */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Genuine Valuation</p>
                  <p className="text-[11px] text-slate-500">Zero hidden cuts</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-teal-100 shadow-xs text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">1–2 Yrs Warranty</p>
                  <p className="text-[11px] text-slate-500">Refurbished resale</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Buyback Promise</p>
                  <p className="text-[11px] text-slate-500">Instant payout</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onOpenSubmit}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-700/25 flex items-center gap-2 group transition text-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition" />
                  <span>Submit Appliance for Pickup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => onNavigateTab('how-it-works')}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm transition flex items-center gap-1.5"
                >
                  <span>How It Works</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    switchUser('engineer_rajesh');
                    onNavigateTab('engineer');
                  }}
                  className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-emerald-100/60 text-slate-700 hover:text-emerald-800 font-medium text-xs transition flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test Field Engineer View</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Quick Valuation Calculator Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-slate-200/50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">
                      Instant Estimator
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      Check Appliance Valuation
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Rule-Based MVP
                  </span>
                </div>

                <div className="space-y-4 py-4 text-sm">
                  {/* Category select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Appliance Group
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuickCat('phones_pcs_tvs');
                          setQuickBrand('Apple');
                        }}
                        className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center gap-2 transition ${
                          quickCat === 'phones_pcs_tvs'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Tv className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Phones, PCs & TVs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuickCat('home_appliances');
                          setQuickBrand('Samsung');
                        }}
                        className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center gap-2 transition ${
                          quickCat === 'home_appliances'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Refrigerator className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Home Appliances</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuickCat('lights_tools_medical');
                          setQuickBrand('Bosch');
                        }}
                        className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center gap-2 transition ${
                          quickCat === 'lights_tools_medical'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Drill className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Tools & Medical</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuickCat('batteries_special');
                          setQuickBrand('Exide');
                        }}
                        className={`p-2 rounded-lg text-xs font-medium text-left border flex items-center gap-2 transition ${
                          quickCat === 'batteries_special'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Batteries & UPS</span>
                      </button>
                    </div>
                  </div>

                  {/* Brand and Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Brand / Make
                      </label>
                      <select
                        value={quickBrand}
                        onChange={(e) => setQuickBrand(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {quickCat === 'phones_pcs_tvs' ? (
                          <>
                            <option value="Apple">Apple</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Dell">Dell</option>
                            <option value="HP">HP</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="OnePlus">OnePlus</option>
                            <option value="Sony">Sony</option>
                          </>
                        ) : quickCat === 'home_appliances' ? (
                          <>
                            <option value="LG">LG</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Whirlpool">Whirlpool</option>
                            <option value="Bosch">Bosch</option>
                            <option value="Daikin">Daikin</option>
                            <option value="Voltas">Voltas</option>
                          </>
                        ) : (
                          <>
                            <option value="Bosch">Bosch</option>
                            <option value="Havells">Havells</option>
                            <option value="Exide">Exide</option>
                            <option value="Other">Other Make</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age: {quickAge} {quickAge === 1 ? 'Year' : 'Years'}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={quickAge}
                        onChange={(e) => setQuickAge(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer mt-1"
                      />
                    </div>
                  </div>

                  {/* Working condition */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Condition
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickCondition('fully_working')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition ${
                          quickCondition === 'fully_working'
                            ? 'bg-emerald-500 text-white border-emerald-600 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Fully Working
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickCondition('partially_working')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition ${
                          quickCondition === 'partially_working'
                            ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Minor Faults
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickCondition('non_working')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition ${
                          quickCondition === 'non_working'
                            ? 'bg-slate-800 text-white border-slate-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Non-Working
                      </button>
                    </div>
                  </div>
                </div>

                {/* Valuation Result display */}
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-xl p-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-emerald-300 font-medium">Estimated Doorstep Value</p>
                      <h4 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                        {formatINR(estimatedPrice)}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30">
                        {quickCondition === 'fully_working'
                          ? 'Refurbish Ready'
                          : quickCondition === 'partially_working'
                          ? 'Repair & Resell'
                          : 'Material Scrap Value'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Verified on inspection</p>
                    </div>
                  </div>

                  <div className="border-t border-emerald-800/60 mt-3 pt-2 text-[11px] text-slate-300 flex justify-between">
                    <span>Includes free EV collection & data wipe</span>
                    <span className="text-emerald-400 font-semibold">+ Buyback Promise</span>
                  </div>
                </div>

                <button
                  onClick={onOpenSubmit}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Lock Estimate & Book Free Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Pillar E-Cycle Operating Model (Faithfully adapted from image 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            E-CYCLE OPERATING MODEL
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            A Sustainable E-Waste Management Solution
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Collect → Repair → Reuse → Recycle
            <br />
            <span className="text-emerald-700 font-medium">
              Cleaner Environment. Stronger Communities. A Circular Future.
            </span>
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Card 1: Collection */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 font-heading font-bold text-base">
              1
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base">Collection</h4>
            <p className="text-xs text-emerald-700 font-semibold mb-3">Convenient & Accessible</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Household pickups (scheduled / on-demand)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Offices, schools, hospitals</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Community urban & village drop-off points</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solar & EV collection fleet</span>
            </div>
          </div>

          {/* Card 2: Transport */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 font-heading font-bold text-base">
              2
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base">Transport</h4>
            <p className="text-xs text-teal-700 font-semibold mb-3">Low Emissions</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <span>Electric trucks & vans</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <span>Charged via solar rooftop arrays</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <span>Real-time GPS routing & load tracking</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-teal-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Zero tailpipe emissions</span>
            </div>
          </div>

          {/* Card 3: Processing Hub */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-300 shadow-sm ring-1 ring-emerald-200/50 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 font-heading font-bold text-base shadow-xs">
              3
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base">Processing Hub</h4>
            <p className="text-xs text-emerald-700 font-semibold mb-3">Sort • Repair • Recycle</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Initial assessment: scan QR ID & record</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Repair & refurbish to extend lifespan</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Full traceability system across lifecycle</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Solar-powered hub</span>
            </div>
          </div>

          {/* Card 4: Output & Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 font-heading font-bold text-base">
              4
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base">Output & Value</h4>
            <p className="text-xs text-indigo-700 font-semibold mb-3">Create Social Value</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>Affordable refurbished devices for students</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>Recovered raw metals & pure plastics</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>Certified partner recycling for unfixable parts</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-indigo-800 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Donations & school bundles</span>
            </div>
          </div>

          {/* Card 5: Impact */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 font-heading font-bold text-base">
              5
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base">Impact</h4>
            <p className="text-xs text-emerald-700 font-semibold mb-3">For People & Planet</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Zero e-waste diverted into landfills</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Measurable CO2 emission avoidance</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Digital inclusion & circular economy</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5 text-emerald-600" />
              <span>True circular economy</span>
            </div>
          </div>
        </div>

        {/* Green Infrastructure Layer Banner from reference diagram 1 */}
        <div className="mt-6 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 border border-emerald-800/40 shadow-lg">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
              Green Infrastructure & Tech Layer
            </span>
            <p className="text-xs text-slate-300">
              Renewable Energy + Smart Logistics + Circular Economy = A Greener Tomorrow
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <Sun className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white">Solar Energy</p>
              <p className="text-[11px] text-slate-400">Panels on warehouse & hubs</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <BatteryCharging className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white">Battery Storage</p>
              <p className="text-[11px] text-slate-400">Power during low/no sunlight</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <Zap className="w-6 h-6 text-teal-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white">Smart Energy Mgmt</p>
              <p className="text-[11px] text-slate-400">Priority loads & islanding</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <Truck className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white">Solar EV Charging</p>
              <p className="text-[11px] text-slate-400">Fleet & equipment chargers</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Stage Workflow (Faithfully adapted from image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              E-CYCLE SOLUTION AND VALUE PROPOSITION
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Your E-Waste Solution and How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From doorstep collection to certified data wiping and student reselling.
            </p>
          </div>

          {/* 4 Large Stage Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stage 1 */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-800 tracking-wider uppercase mb-1">
                  1. COLLECT & SEGREGATE
                </div>
                <h4 className="font-heading font-bold text-slate-900 text-lg mb-3">
                  Slots Booking Through Website
                </h4>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    <span>Village drop-offs & doorstep pickups</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    <span>Electric collection vans</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    <span>On-spot verified valuations</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-amber-200/60 text-[11px] text-amber-900 font-medium">
                Convenient scheduling in 60 seconds
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1">
                  2. REPAIR & TEST
                </div>
                <h4 className="font-heading font-bold text-slate-900 text-lg mb-3">
                  Solar-Powered Main Hub
                </h4>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Weigh & tag with permanent QR ID</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Wipe personal data safely (NIST 800-88)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Check for errors, repair & test improved unit</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-900 font-medium">
                ISO & CPCB compliant procedures
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-emerald-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="text-xs font-bold text-emerald-300 tracking-wider uppercase mb-1">
                  3. RESELL
                </div>
                <h4 className="font-heading font-bold text-white text-lg mb-1">
                  First Choice: Reuse Before Recycling
                </h4>
                <p className="text-[11px] text-emerald-200 mb-3">Maximize product lifetime</p>
                <ul className="text-xs text-slate-200 space-y-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Fix working gadgets & components</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Sell cheaply to students & schools</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>1–2 Years warranty certification</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-emerald-800 text-[11px] text-emerald-300 font-medium">
                Bridge the digital divide
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-100 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">
                  4. RECYCLING
                </div>
                <h4 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  Last Resort: Authorized Recyclers
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">Safe material recovery</p>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>Send unfixable parts to R2 recyclers</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>Safe battery isolation & metal recovery</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>Safely extract refrigerant cooling gases</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Zero landfill dumping guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-Waste Category Table (Directly from reference image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-emerald-950 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              E-Waste Category Lifecycles
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-1">
              What Happens to Your Collected Electronics?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
              We handle every category through tailored protocols to recover maximum utility and
              prevent hazardous environmental leakage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-900 text-emerald-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">E-Waste Group</th>
                  <th className="py-3.5 px-6 font-semibold">Everyday Examples</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Avg. Life</th>
                  <th className="py-3.5 px-6 font-semibold">What E-Cycle Does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Phones, PCs & TVs</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Smartphones, laptops, routers, monitors, TVs
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-amber-700 bg-amber-50/50">
                    3–10 yrs
                  </td>
                  <td className="py-4 px-6 text-xs leading-relaxed">
                    Erase all personal data safely, repair working units for resale to students with warranty,
                    recycle broken screens with certified partners.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    <Refrigerator className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Home Appliances</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Fridges, washing machines, mixers, irons, ACs
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-amber-700 bg-amber-50/50">
                    3–15 yrs
                  </td>
                  <td className="py-4 px-6 text-xs leading-relaxed">
                    Fix and reuse working appliances, save useful spare parts, safely remove cooling gases
                    (CFC/HCFC/HFC) to protect the ozone layer.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    <Drill className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Lights, Tools & Medical</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    LED bulbs, tube lights, drills, chargers, clinic monitors
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-amber-700 bg-amber-50/50">
                    2–10 yrs
                  </td>
                  <td className="py-4 px-6 text-xs leading-relaxed">
                    Clean medical gear first with biohazard protocols, keep fragile bulbs separate to avoid
                    mercury vapor release, recover copper and industrial metals.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Batteries (Special Care)</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Phone, laptop, inverter, and portable lithium batteries
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-amber-700 bg-amber-50/50">
                    2–8 yrs
                  </td>
                  <td className="py-4 px-6 text-xs leading-relaxed">
                    Store in fire-safe bins away from other waste and send to registered battery recyclers for
                    lithium, cobalt, and nickel recovery.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
              Join the Circular Movement
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Ready to declutter your space and protect our planet?
            </h3>
            <p className="text-emerald-100 text-sm">
              Schedule your electric doorstep pickup now. Instant valuation, safe data erase, and instant
              digital payout upon collection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenSubmit}
              className="bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 font-bold px-6 py-3.5 rounded-xl shadow-md text-sm transition text-center"
            >
              Submit an Appliance Now
            </button>
            <button
              onClick={() => {
                switchUser('customer_priya');
                onNavigateTab('customer');
              }}
              className="bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-400/40 text-white font-medium px-5 py-3.5 rounded-xl text-sm transition text-center"
            >
              Open Customer Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
