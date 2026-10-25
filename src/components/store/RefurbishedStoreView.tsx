/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HeartHandshake,
  Tag,
  Star,
  Sparkles,
  Info,
} from 'lucide-react';
import { formatINR } from '../../utils/valuation';

interface RefurbishedDevice {
  id: string;
  name: string;
  specs: string;
  originalPrice: number;
  studentPrice: number;
  warranty: string;
  grade: 'Pristine' | 'Excellent';
  category: 'Laptops' | 'Smartphones' | 'Monitors';
  image: string;
  stock: number;
}

const SAMPLE_STORE_DEVICES: RefurbishedDevice[] = [
  {
    id: 'REF-MBP-14',
    name: 'MacBook Air M1 (Silver)',
    specs: '8GB Unified RAM • 256GB SSD • 13.3" Retina Display • Battery Health 92%',
    originalPrice: 79900,
    studentPrice: 34999,
    warranty: '1 Year Full E-Cycle Hub Warranty',
    grade: 'Pristine',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
    stock: 3,
  },
  {
    id: 'REF-DELL-5420',
    name: 'Dell Latitude 5420 Core i5',
    specs: '16GB DDR4 • 512GB NVMe • 14" FHD Anti-Glare • Brand New Battery',
    originalPrice: 68000,
    studentPrice: 22500,
    warranty: '2 Years Circular Tech Warranty',
    grade: 'Excellent',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    stock: 5,
  },
  {
    id: 'REF-SAMS-A54',
    name: 'Samsung Galaxy A54 5G (Awesome Lime)',
    specs: '8GB/128GB • 120Hz Super AMOLED • 50MP OIS Camera • Factory Reset',
    originalPrice: 38999,
    studentPrice: 14200,
    warranty: '1 Year E-Cycle Warranty',
    grade: 'Pristine',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    stock: 4,
  },
  {
    id: 'REF-LG-MON-24',
    name: 'LG 24-inch Borderless IPS Monitor',
    specs: 'Full HD 1080p • 75Hz Refresh • HDMI/VGA • Clean Backlight Tested',
    originalPrice: 13500,
    studentPrice: 5400,
    warranty: '1 Year Replacement Guarantee',
    grade: 'Pristine',
    category: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    stock: 6,
  },
];

export const RefurbishedStoreView: React.FC<{ onOpenSubmit: () => void }> = ({ onOpenSubmit }) => {
  const [filterCat, setFilterCat] = useState<'all' | 'Laptops' | 'Smartphones' | 'Monitors'>('all');
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const filtered = SAMPLE_STORE_DEVICES.filter(
    (d) => filterCat === 'all' || d.category === filterCat
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Circular Technology Resale</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
            Certified Refurbished for Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            As outlined in our operating model, <strong>Reuse Before Recycling</strong> is our primary choice.
            Every device is repaired, tested under load at our solar warehouse, and offered with a 1–2 Year
            Warranty and Buyback Promise.
          </p>
        </div>

        <button
          onClick={onOpenSubmit}
          className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition shrink-0"
        >
          Sell Your Appliance to Fund Student Tech
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilterCat('all')}
          className={`px-4 py-2 rounded-xl transition ${
            filterCat === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Refurbished Tech ({SAMPLE_STORE_DEVICES.length})
        </button>
        <button
          onClick={() => setFilterCat('Laptops')}
          className={`px-4 py-2 rounded-xl transition ${
            filterCat === 'Laptops' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Laptops & PCs
        </button>
        <button
          onClick={() => setFilterCat('Smartphones')}
          className={`px-4 py-2 rounded-xl transition ${
            filterCat === 'Smartphones' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Smartphones
        </button>
        <button
          onClick={() => setFilterCat('Monitors')}
          className={`px-4 py-2 rounded-xl transition ${
            filterCat === 'Monitors' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Monitors & Displays
        </button>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider shadow-xs">
                  {item.grade} Grade
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  {item.stock} left in stock
                </span>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <h4 className="font-heading font-bold text-slate-900 text-base leading-snug">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.specs}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{item.warranty}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-1.5">
                    {formatINR(item.originalPrice)}
                  </span>
                  <span className="font-heading font-extrabold text-xl text-emerald-900">
                    {formatINR(item.studentPrice)}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Student Subsidy
                </span>
              </div>

              {purchasedId === item.id ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reserved with Student ID</span>
                </div>
              ) : (
                <button
                  onClick={() => setPurchasedId(item.id)}
                  className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Reserve with Student Discount</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
