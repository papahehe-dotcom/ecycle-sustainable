/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Leaf,
  Truck,
  Wrench,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  RotateCcw,
  Menu,
  X,
  Compass,
  BarChart3,
  ShoppingBag,
  Layers,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenSubmit: () => void;
  onOpenSupabase: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenSubmit,
  onOpenSupabase,
  activeTab,
  setActiveTab,
}) => {
  const {
    currentUser,
    currentRole,
    switchUser,
    setCurrentRole,
    logout,
    resetDemoData,
    requests,
    isSupabaseActive,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Offers awaiting approval count for active customer
  const pendingOffersCount = requests.filter(
    (r) =>
      r.status === 'offer_ready' &&
      (currentRole === 'customer' ? r.userId === currentUser?.id : true)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Demo Bar for Judges & Evaluators */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-300">DEMO MODE:</span>
            <span className="text-slate-300 hidden sm:inline">
              Instant test switching between roles & shared workflow state:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setCurrentRole('visitor');
                setActiveTab('home');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                currentRole === 'visitor'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-950/60 text-slate-300 hover:bg-emerald-800'
              }`}
            >
              Public
            </button>

            <button
              onClick={() => {
                switchUser('customer_priya');
                setActiveTab('customer');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                currentRole === 'customer' && currentUser?.id === 'usr_priya_01'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-950/60 text-slate-300 hover:bg-emerald-800'
              }`}
            >
              <User className="w-3 h-3" />
              Priya (Customer)
              {pendingOffersCount > 0 && (
                <span className="bg-amber-400 text-slate-900 font-bold px-1 rounded-full text-[10px]">
                  {pendingOffersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                switchUser('engineer_rajesh');
                setActiveTab('engineer');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                currentRole === 'engineer'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-950/60 text-slate-300 hover:bg-emerald-800'
              }`}
            >
              <Wrench className="w-3 h-3" />
              Rajesh (Engineer #04)
            </button>

            <button
              onClick={() => {
                switchUser('admin_ananya');
                setActiveTab('logistics');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-950/60 text-slate-300 hover:bg-emerald-800'
              }`}
            >
              <Truck className="w-3 h-3" />
              Fleet & Route
            </button>

            <button
              onClick={onOpenSupabase}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ml-1 ${
                isSupabaseActive
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border border-emerald-600/40'
              }`}
              title="Connect Supabase PostgreSQL or view deployment instructions"
            >
              <Database className="w-3 h-3 text-emerald-300" />
              <span>{isSupabaseActive ? 'Supabase: Active' : 'Supabase & Deploy'}</span>
            </button>

            <button
              onClick={resetDemoData}
              title="Reset sample appliances to default state"
              className="px-2 py-1 rounded text-xs bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white flex items-center gap-1 transition ml-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo with GreenLoop reference motif */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
              <Leaf className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">
                  E-Cycle
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  GreenLoop
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block tracking-wide">
                Collect • Repair • Reuse • Recycle
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Home & Model
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'how-it-works'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>

            {/* Role-specific dashboard links */}
            <button
              onClick={() => {
                if (currentRole !== 'customer') {
                  switchUser('customer_priya');
                }
                setActiveTab('customer');
              }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition relative ${
                activeTab === 'customer'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Customer Portal
              {pendingOffersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  !
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (currentRole !== 'engineer') {
                  switchUser('engineer_rajesh');
                }
                setActiveTab('engineer');
              }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'engineer'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              Engineer Operations
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'logistics'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              EV Routing
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'impact'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Impact
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'store'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              Refurbished Store
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmit}
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-600/30 hover:shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              Submit Appliance
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-2.5 rounded-xl transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          setActiveTab('customer');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Customer Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          switchUser('engineer_rajesh');
                          setActiveTab('engineer');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Wrench className="w-3.5 h-3.5 text-slate-500" />
                        Engineer Dashboard
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 border border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 text-sm font-medium px-3.5 py-2 rounded-xl transition"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home & Operating Model
          </button>
          <button
            onClick={() => {
              setActiveTab('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            How It Works (4 Stages)
          </button>
          <button
            onClick={() => {
              switchUser('customer_priya');
              setActiveTab('customer');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
          >
            <span>Customer Portal</span>
            {pendingOffersCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingOffersCount} new
              </span>
            )}
          </button>
          <button
            onClick={() => {
              switchUser('engineer_rajesh');
              setActiveTab('engineer');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Engineer Operations
          </button>
          <button
            onClick={() => {
              setActiveTab('logistics');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            EV Fleet Routing & Map
          </button>
          <button
            onClick={() => {
              setActiveTab('impact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Sustainability Metrics
          </button>
          <button
            onClick={() => {
              setActiveTab('store');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Refurbished Student Devices
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSubmit();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-center shadow-xs"
            >
              Submit Appliance for Pickup
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setMobileMenuOpen(false);
              }}
              className="w-full text-xs text-slate-500 py-1.5 text-center flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Data to Initial State
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
