/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  Copy,
  ExternalLink,
  Github,
  Globe,
  Sparkles,
  Key,
  Layers,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSupabaseConfig } from '../../lib/supabase';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isSupabaseActive,
    supabaseStatus,
    saveSupabaseCredentials,
    disconnectSupabase,
    refreshData,
  } = useApp();

  const currentCfg = getSupabaseConfig();
  const [url, setUrl] = useState(currentCfg.url || '');
  const [anonKey, setAnonKey] = useState(currentCfg.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql' | 'deploy'>('connect');

  if (!isOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) return;
    saveSupabaseCredentials(url.trim(), anonKey.trim());
  };

  const handleCopySql = () => {
    fetch('/supabase/schema.sql')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 3000);
      })
      .catch(() => {
        // Fallback
        navigator.clipboard.writeText(
          `-- Open the file /supabase/schema.sql in your repository and run in Supabase SQL editor.`
        );
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 3000);
      });
  };

  const githubCommands = `# 1. Initialize and commit your repository
git init
git add .
git commit -m "feat: complete E-Cycle MVP connected to Supabase"

# 2. Add your GitHub repository remote and push
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main`;

  const handleCopyGithub = () => {
    navigator.clipboard.writeText(githubCommands);
    setCopiedGithub(true);
    setTimeout(() => setCopiedGithub(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Database className="w-4 h-4" />
            <span>Supabase & Cloud Deployment Center</span>
          </div>
          <h3 className="font-heading text-2xl font-bold mt-1">Connect Your Supabase Database</h3>
          <p className="text-xs text-slate-300 mt-1">
            Configure live PostgreSQL persistence, extract the SQL schema, and prepare for GitHub & Vercel deployment.
          </p>
        </div>

        {/* Status Indicator Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isSupabaseActive
                  ? 'bg-emerald-500 animate-pulse'
                  : supabaseStatus === 'connecting'
                  ? 'bg-amber-500 animate-bounce'
                  : 'bg-slate-400'
              }`}
            ></span>
            <span className="text-xs font-bold text-slate-800">
              {isSupabaseActive
                ? 'Status: Connected to Supabase PostgreSQL'
                : supabaseStatus === 'connecting'
                ? 'Status: Connecting to Supabase...'
                : 'Status: Local Demo Mode (Reactive LocalStorage)'}
            </span>
          </div>

          {isSupabaseActive && (
            <button
              onClick={refreshData}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              activeTab === 'connect'
                ? 'border-emerald-600 text-emerald-900 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Supabase Credentials
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-900 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. SQL Schema Script
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              activeTab === 'deploy'
                ? 'border-emerald-600 text-emerald-900 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. GitHub & Vercel Guide
          </button>
        </div>

        {/* Tab 1: Connect */}
        {activeTab === 'connect' && (
          <form onSubmit={handleConnect} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-700 space-y-1">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Where to find your Supabase credentials:
              </p>
              <p>
                In your{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5"
                >
                  Supabase Dashboard <ExternalLink className="w-3 h-3" />
                </a>{' '}
                → Select your project → <strong>Project Settings</strong> → <strong>API</strong>.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Project URL (VITE_SUPABASE_URL) *
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzabcdefg.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Anon / Public Key (VITE_SUPABASE_ANON_KEY) *
              </label>
              <input
                type="text"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Safe for client-side browsers and protected by Supabase Row Level Security (RLS).
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSupabaseActive ? (
                <button
                  type="button"
                  onClick={disconnectSupabase}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition"
                >
                  Disconnect & Use Local Demo
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Credentials persist in your browser and .env
                </span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Connect & Sync Supabase</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Schema */}
        {activeTab === 'sql' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-slate-900">
                1-Click Supabase Database Creation Script
              </h4>
              <p className="text-slate-600">
                The schema script is saved at <code>/supabase/schema.sql</code> in your project.
                It creates the <code>profiles</code>, <code>appliance_requests</code>, and{' '}
                <code>logistics_stops</code> tables with RLS and realtime replication enabled.
              </p>
            </div>

            <div className="bg-slate-900 text-emerald-300 p-4 rounded-2xl font-mono text-[11px] space-y-2 border border-slate-800">
              <p className="text-slate-400 font-sans font-semibold">How to run in Supabase:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 font-sans">
                <li>
                  Open your{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline font-bold"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>Go to the <strong>SQL Editor</strong> tab (left sidebar)</li>
                <li>Click <strong>New Query</strong>, paste the copied SQL below, and click <strong>Run</strong></li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href="/supabase/schema.sql"
                download="schema.sql"
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                Download schema.sql file
              </a>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>SQL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full SQL Schema</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Deploy to GitHub & Vercel */}
        {activeTab === 'deploy' && (
          <div className="p-6 space-y-4 text-xs">
            <div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Deploying E-Cycle to GitHub & Vercel
              </h4>
              <p className="text-slate-500 mt-0.5">
                The codebase includes <code>vercel.json</code>, clean SPA rewrites, and Vite build configuration.
              </p>
            </div>

            {/* Step A: GitHub */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-800" />
                  Step A: Push Code to GitHub
                </span>
                <button
                  onClick={handleCopyGithub}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  {copiedGithub ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGithub ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-3 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed">
                {githubCommands}
              </pre>
            </div>

            {/* Step B: Vercel */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                Step B: Deploy on Vercel
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
                <li>Log in to <strong>vercel.com</strong> and click <strong>Add New Project</strong></li>
                <li>Import your GitHub repository</li>
                <li>
                  Under <strong>Environment Variables</strong>, add:
                  <div className="mt-1 font-mono text-[10px] bg-white p-2 rounded border border-slate-200 space-y-1">
                    <p className="text-emerald-800 font-bold">VITE_SUPABASE_URL = your-supabase-project-url</p>
                    <p className="text-emerald-800 font-bold">VITE_SUPABASE_ANON_KEY = your-anon-key</p>
                  </div>
                </li>
                <li>Click <strong>Deploy</strong>. Vercel will build and launch your production app!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
