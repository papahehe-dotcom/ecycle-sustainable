/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  DollarSign,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Calendar,
  ShieldCheck,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import { ApplianceRequest, RequestStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/valuation';

interface CustomerDashboardProps {
  onOpenSubmit: () => void;
  onSelectRequest: (request: ApplianceRequest) => void;
  onOpenReceipt: (request: ApplianceRequest) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenSubmit,
  onSelectRequest,
  onOpenReceipt,
}) => {
  const { currentUser, requests } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'action_needed' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests belonging to this customer (or show all in demo if customer profile matches)
  const myRequests = requests.filter(
    (r) => !currentUser || r.userId === currentUser.id || currentUser.id === 'usr_priya_01'
  );

  // Counters
  const totalSubmitted = myRequests.length;
  const pendingInspections = myRequests.filter((r) => r.status === 'submitted' || r.status === 'engineer_assigned').length;
  const offersAwaitingApproval = myRequests.filter((r) => r.status === 'offer_ready').length;
  const scheduledPickups = myRequests.filter((r) => r.status === 'pickup_scheduled' || r.status === 'collected').length;
  const completedTransactions = myRequests.filter((r) => r.status === 'payment_completed').length;

  // Filtered requests list
  const filteredList = myRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'action_needed') {
      return r.status === 'offer_ready';
    }
    if (statusFilter === 'in_progress') {
      return (
        r.status === 'submitted' ||
        r.status === 'engineer_assigned' ||
        r.status === 'inspection_completed' ||
        r.status === 'pickup_scheduled' ||
        r.status === 'collected'
      );
    }
    if (statusFilter === 'completed') {
      return r.status === 'payment_completed' || r.status === 'offer_rejected';
    }
    return true;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Submitted — Awaiting Inspection
          </span>
        );
      case 'engineer_assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" />
            Engineer Assigned
          </span>
        );
      case 'inspection_completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3" />
            Inspection Completed
          </span>
        );
      case 'offer_ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 border border-amber-500 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Action: Offer Ready for Approval!
          </span>
        );
      case 'offer_accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Offer Accepted — Awaiting Slot
          </span>
        );
      case 'offer_rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
            Offer Rejected
          </span>
        );
      case 'pickup_scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <Truck className="w-3 h-3" />
            EV Door Pickup Scheduled
          </span>
        );
      case 'collected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3" />
            Appliance Collected (In Transit)
          </span>
        );
      case 'payment_completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            Payment Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Customer profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-2xl text-slate-900">
                Welcome back, {currentUser?.name || 'Priya Sharma'}!
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md uppercase">
                Customer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser?.address || 'Flat 402, Green Glen Layout, Bellandur, Bengaluru'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-emerald-700/20 text-xs sm:text-sm flex items-center gap-2 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Another Appliance</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Submitted</p>
          <p className="font-heading text-2xl font-bold text-slate-900 mt-1">{totalSubmitted}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">All appliances</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs text-amber-700 font-medium">Pending Inspections</p>
          <p className="font-heading text-2xl font-bold text-amber-700 mt-1">{pendingInspections}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Assigned to fleet</p>
        </div>

        <div className={`rounded-2xl p-4 border shadow-xs transition ${
          offersAwaitingApproval > 0
            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/40'
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-800 font-bold">Offers Awaiting</p>
            {offersAwaitingApproval > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <p className="font-heading text-2xl font-extrabold text-amber-900 mt-1">{offersAwaitingApproval}</p>
          <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
            {offersAwaitingApproval > 0 ? 'Requires Your Approval' : 'No pending offers'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs text-teal-700 font-medium">Scheduled Pickups</p>
          <p className="font-heading text-2xl font-bold text-teal-700 mt-1">{scheduledPickups}</p>
          <p className="text-[10px] text-teal-600 mt-0.5">EV Doorstep service</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs text-emerald-700 font-medium">Completed & Paid</p>
          <p className="font-heading text-2xl font-bold text-emerald-700 mt-1">{completedTransactions}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Receipts ready</p>
        </div>
      </div>

      {/* Offers Ready Urgent Alert Banner */}
      {offersAwaitingApproval > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base leading-tight">
                You have {offersAwaitingApproval} verified engineer offer awaiting your decision!
              </h4>
              <p className="text-xs text-slate-900/80 mt-0.5">
                Our field engineer has inspected your appliance and issued an offer. Review the
                inspection findings to accept or decline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('action_needed')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition"
          >
            Review Offer Now
          </button>
        </div>
      )}

      {/* Main Request History & Tracking List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Requests ({myRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('action_needed')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                statusFilter === 'action_needed'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Action Required ({offersAwaitingApproval})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'in_progress'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Completed & Paid ({completedTransactions})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, brand, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Requests List */}
        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-base text-slate-800">No appliance requests found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Submit your first electronic appliance to receive on-spot doorstep valuation and free EV pickup!
            </p>
            <button
              onClick={onOpenSubmit}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Appliance Now</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((req) => {
              const activeValuation = req.inspection?.revisedPrice || req.estimatedPrice;

              return (
                <div
                  key={req.id}
                  className="p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  {/* Left: Image & Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={req.photos[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'}
                      alt={req.model}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                        {getStatusBadge(req.status)}
                      </div>

                      <h4 className="font-heading font-bold text-slate-900 text-base">
                        {req.brand} {req.model}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {req.approxAgeYears} years old • Condition:{' '}
                        <span className="font-medium text-slate-700 capitalize">
                          {req.customerCondition.replace('_', ' ')}
                        </span>
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {req.assignedEngineerName && ` • Assigned: ${req.assignedEngineerName}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price & Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {req.inspection ? 'Verified Final Offer' : 'Estimated Valuation'}
                      </p>
                      <p className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-800">
                        {formatINR(activeValuation)}
                      </p>
                      {req.inspection && req.inspection.revisedPrice !== req.estimatedPrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          Est: {formatINR(req.estimatedPrice)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onSelectRequest(req)}
                        className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          req.status === 'offer_ready'
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs ring-2 ring-amber-400/50'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{req.status === 'offer_ready' ? 'Review & Approve Offer' : 'Track Status'}</span>
                      </button>

                      {req.status === 'payment_completed' && (
                        <button
                          onClick={() => onOpenReceipt(req)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition"
                          title="View Official E-Cycle Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
