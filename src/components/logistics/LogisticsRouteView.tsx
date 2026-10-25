/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Truck,
  Zap,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Navigation,
  ShieldCheck,
  BatteryCharging,
  BarChart3,
  Sun,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LogisticsStop } from '../../types';

export const LogisticsRouteView: React.FC = () => {
  const {
    logisticsStops,
    isRouteOptimized,
    optimizeRoute,
    confirmApplianceCollection,
  } = useApp();

  const [selectedStopId, setSelectedStopId] = useState<string>(logisticsStops[0]?.stopId || 'STOP-01');

  // Sorted stops based on optimization state
  const stops = [...logisticsStops].sort((a, b) =>
    isRouteOptimized ? a.optimizedSequence - b.optimizedSequence : a.originalSequence - b.originalSequence
  );

  const selectedStop = stops.find((s) => s.stopId === selectedStopId) || stops[0];

  const totalDistanceKm = stops.reduce((acc, s) => acc + s.distanceFromPrevKm, 0);
  const totalDurationMin = stops.reduce((acc, s) => acc + s.estimatedMinutes, 0);

  // Before vs after metrics
  const unoptimizedKm = 34.8;
  const optimizedKm = 23.4;
  const kmSaved = isRouteOptimized ? 11.4 : 0;
  const batteryKwhSaved = isRouteOptimized ? 4.2 : 0;
  const co2AvoidedKg = isRouteOptimized ? 3.8 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Smart EV Fleet Routing Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Logistics & Route Optimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Minimizing travel distances, carbon emissions, and battery degradation using nearest-neighbor
            cluster routing from Electronic City Solar Hub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={optimizeRoute}
            disabled={isRouteOptimized}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md ${
              isRouteOptimized
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-700/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isRouteOptimized ? 'Route Already Optimized' : 'Run Route Optimization'}</span>
          </button>
        </div>
      </div>

      {/* EV Fleet Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Assigned Vehicle</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-heading font-bold text-base text-slate-900 mt-1">
            Tata Ace EV #04
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Solar Hub Charged</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Battery State</span>
            <BatteryCharging className="w-4 h-4 text-teal-600" />
          </div>
          <p className="font-heading font-bold text-base text-slate-900 mt-1">84% (138 km range)</p>
          <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Smart Regenerative Braking</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Route Distance</span>
            <Navigation className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-heading font-bold text-base text-slate-900 mt-1">
            {isRouteOptimized ? `${optimizedKm} km` : `${unoptimizedKm} km`}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{stops.length} Doorstep Stops</p>
        </div>

        <div className={`rounded-2xl p-4 border shadow-xs transition ${
          isRouteOptimized ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Optimization Savings</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-heading font-bold text-base text-emerald-800 mt-1">
            {isRouteOptimized ? `-${kmSaved} km (-32%)` : 'Not Optimized'}
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            {isRouteOptimized ? `${batteryKwhSaved} kWh battery saved` : 'Run optimizer above'}
          </p>
        </div>
      </div>

      {/* Main Interactive Route & Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Stops sequence list */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stop Sequence ({isRouteOptimized ? 'Optimized' : 'Original Order'})
            </span>
            <span className="text-[11px] text-slate-400">
              Origin: Solar Hub (Electronic City)
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {stops.map((stop, idx) => {
              const isSelected = stop.stopId === selectedStopId;
              const seqNum = isRouteOptimized ? stop.optimizedSequence : stop.originalSequence;

              return (
                <div
                  key={stop.stopId}
                  onClick={() => setSelectedStopId(stop.stopId)}
                  className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      stop.collected
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stop.collected ? <CheckCircle2 className="w-4 h-4" /> : seqNum}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {stop.customerName}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{stop.timeWindow}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {stop.applianceSummary}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{stop.address}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2">
                      <span>Leg: ~{stop.distanceFromPrevKm} km</span>
                      <span>ETA: ~{stop.estimatedMinutes} mins</span>
                      {stop.collected && (
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                          Collected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Simulated Interactive Visual Map Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-6 text-white relative overflow-hidden border border-slate-800 shadow-xl min-h-[460px] flex flex-col justify-between">
            {/* Map Canvas Background Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#059669 1px, #022c22 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 16px 16px',
              }}
            ></div>

            {/* Map Top Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Bengaluru EV Transit Map
                </span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Simulated Geolocation Coordinates
              </span>
            </div>

            {/* Visual Vector Route Connections */}
            <div className="relative z-10 my-8 py-6 px-4">
              {/* Origin Hub */}
              <div className="flex items-center gap-3 mb-6 bg-emerald-950/90 border border-emerald-600/40 p-3 rounded-xl max-w-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">E-Cycle Solar Hub 1</p>
                  <p className="text-[10px] text-slate-300">Electronic City Phase 1 (Fleet Depot)</p>
                </div>
              </div>

              {/* Graphical visual stops grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stops.map((st, i) => {
                  const isSel = st.stopId === selectedStopId;
                  const seqNum = isRouteOptimized ? st.optimizedSequence : st.originalSequence;

                  return (
                    <div
                      key={st.stopId}
                      onClick={() => setSelectedStopId(st.stopId)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                        isSel
                          ? 'bg-emerald-900/80 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg'
                          : 'bg-slate-900/70 border-slate-700/60 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          st.collected
                            ? 'bg-emerald-500 text-white'
                            : isSel
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {seqNum}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{st.customerName}</p>
                        <p className="text-[10px] text-slate-300 truncate">{st.area}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {st.distanceFromPrevKm} km • {st.timeWindow}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Stop Inspector Card */}
            {selectedStop && (
              <div className="relative z-10 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Stop #{isRouteOptimized ? selectedStop.optimizedSequence : selectedStop.originalSequence} Selected
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white mt-0.5">
                    {selectedStop.customerName} — {selectedStop.applianceSummary}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedStop.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${selectedStop.address}, Bengaluru`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                    <span>External GPS</span>
                  </a>

                  {!selectedStop.collected && (
                    <button
                      onClick={() => confirmApplianceCollection(selectedStop.requestId, 'Collected via logistics route')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Collected</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
