/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Wrench, ShieldCheck, ArrowRight, Lock, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'customer' | 'engineer' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { switchUser, registerCustomer } = useApp();

  const [authMode, setAuthMode] = useState<'existing_customer' | 'new_customer' | 'engineer'>('existing_customer');

  // New Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560034');
  const [errorMsg, setErrorMsg] = useState('');

  // Existing Customer / Engineer form state
  const [loginEmail, setLoginEmail] = useState('priya.sharma@example.com');
  const [loginPass, setLoginPass] = useState('••••••••');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    setErrorMsg('');
    registerCustomer({
      name,
      email,
      phone,
      address,
      city,
      pincode,
    });
    onSuccess('customer');
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'engineer') {
      switchUser('engineer_rajesh');
      onSuccess('engineer');
    } else {
      switchUser('customer_priya');
      onSuccess('customer');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            E-Cycle Access Portal
          </span>
          <h3 className="font-heading text-xl font-bold mt-1">Sign In or Register</h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Access your appliances, offers, and collection schedules.
          </p>
        </div>

        {/* Account Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('existing_customer');
              setLoginEmail('priya.sharma@example.com');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authMode === 'existing_customer'
                ? 'border-emerald-600 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Existing Customer
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('new_customer');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authMode === 'new_customer'
                ? 'border-emerald-600 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            New Customer
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('engineer');
              setLoginEmail('rajesh.kumar@e-cycle.in');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              authMode === 'engineer'
                ? 'border-emerald-600 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Engineer Login
          </button>
        </div>

        {/* Fast Demo One-Click Access Box */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100">
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Instant Evaluator 1-Click Login:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                switchUser('customer_priya');
                onSuccess('customer');
                onClose();
              }}
              className="p-2 bg-white rounded-lg border border-emerald-200 text-slate-800 hover:bg-emerald-100/50 text-left transition flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-xs leading-none">Priya Sharma</p>
                <p className="text-[10px] text-slate-500">Customer (Active offer)</p>
              </div>
            </button>

            <button
              onClick={() => {
                switchUser('engineer_rajesh');
                onSuccess('engineer');
                onClose();
              }}
              className="p-2 bg-white rounded-lg border border-emerald-200 text-slate-800 hover:bg-emerald-100/50 text-left transition flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="font-semibold text-xs leading-none">Rajesh Kumar</p>
                <p className="text-[10px] text-slate-500">Field Engineer #04</p>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Body Forms */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {authMode === 'new_customer' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divya Nair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="divya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Door No, Building, Street, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition text-xs shadow-xs"
              >
                Register & Submit First Appliance
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {authMode === 'engineer' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Engineer Portal restricted to authorized field engineers for on-site inspection,
                    valuation adjustments, and collection verification.
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {authMode === 'engineer' ? 'Engineer Official ID / Email' : 'Email or Phone'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{authMode === 'engineer' ? 'Access Engineer Cockpit' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Authentication Environment • No real passwords stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
