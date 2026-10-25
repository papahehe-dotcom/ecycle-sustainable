/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToastContainer } from './components/common/NotificationToastContainer';
import { LandingHero } from './components/home/LandingHero';
import { HowItWorksDetailedView } from './components/home/HowItWorksDetailedView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { EngineerDashboard } from './components/engineer/EngineerDashboard';
import { LogisticsRouteView } from './components/logistics/LogisticsRouteView';
import { SustainabilityImpactView } from './components/sustainability/SustainabilityImpactView';
import { RefurbishedStoreView } from './components/store/RefurbishedStoreView';
import { AuthModal } from './components/auth/AuthModal';
import { SubmitApplianceModal } from './components/customer/SubmitApplianceModal';
import { ApplianceTrackerModal } from './components/customer/ApplianceTrackerModal';
import { TransactionReceiptModal } from './components/customer/TransactionReceiptModal';
import { SupabaseConnectModal } from './components/common/SupabaseConnectModal';
import { ApplianceRequest } from './types';

const MainLayout: React.FC = () => {
  const { currentRole, requests } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [selectedReqForTracking, setSelectedReqForTracking] = useState<ApplianceRequest | null>(null);
  const [selectedReqForReceipt, setSelectedReqForReceipt] = useState<ApplianceRequest | null>(null);

  // Sync active request if data in state changed
  const currentTrackingReq = selectedReqForTracking
    ? requests.find((r) => r.id === selectedReqForTracking.id) || selectedReqForTracking
    : null;

  const currentReceiptReq = selectedReqForReceipt
    ? requests.find((r) => r.id === selectedReqForReceipt.id) || selectedReqForReceipt
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Header & Demo Switcher */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingHero
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksDetailedView
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'customer' && (
          <CustomerDashboard
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onSelectRequest={(req) => setSelectedReqForTracking(req)}
            onOpenReceipt={(req) => setSelectedReqForReceipt(req)}
          />
        )}

        {activeTab === 'engineer' && (
          <EngineerDashboard
            onOpenReceipt={(req) => setSelectedReqForReceipt(req)}
            onNavigateToRouting={() => setActiveTab('logistics')}
          />
        )}

        {activeTab === 'logistics' && <LogisticsRouteView />}

        {activeTab === 'impact' && <SustainabilityImpactView />}

        {activeTab === 'store' && (
          <RefurbishedStoreView onOpenSubmit={() => setIsSubmitOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Global Notifications */}
      <NotificationToastContainer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(role) => {
          setActiveTab(role === 'engineer' ? 'engineer' : 'customer');
        }}
      />

      <SubmitApplianceModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitted={(newId) => {
          setActiveTab('customer');
          const created = requests.find((r) => r.id === newId);
          if (created) setSelectedReqForTracking(created);
        }}
      />

      <ApplianceTrackerModal
        request={currentTrackingReq}
        isOpen={Boolean(currentTrackingReq)}
        onClose={() => setSelectedReqForTracking(null)}
        onOpenReceipt={(req) => {
          setSelectedReqForTracking(null);
          setSelectedReqForReceipt(req);
        }}
      />

      <TransactionReceiptModal
        request={currentReceiptReq}
        isOpen={Boolean(currentReceiptReq)}
        onClose={() => setSelectedReqForReceipt(null)}
      />

      <SupabaseConnectModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
