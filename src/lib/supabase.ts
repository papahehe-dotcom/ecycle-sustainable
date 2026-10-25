/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApplianceRequest, LogisticsStop } from '../types';

const STORAGE_KEY_SUPABASE_CONFIG = 'ecycle_supabase_custom_credentials_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  // Check local storage override first (allows user to test live keys in preview)
  const saved = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  // Fallback to Vite environment variables
  return {
    url: (import.meta.env.VITE_SUPABASE_URL as string) || '',
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(
    STORAGE_KEY_SUPABASE_CONFIG,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  // Reinitialize client
  _client = null;
}

export function clearCustomSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_SUPABASE_CONFIG);
  _client = null;
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(
    config.url &&
    config.anonKey &&
    config.url.startsWith('https://') &&
    !config.url.includes('your-project-id') &&
    config.anonKey !== 'your-anon-public-key'
  );
}

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!_client) {
    const { url, anonKey } = getSupabaseConfig();
    try {
      _client = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      _client = null;
    }
  }

  return _client;
}

// Convert DB snake_case to React camelCase
export function mapDbToRequest(row: any): ApplianceRequest {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone || '',
    pickupAddress: row.pickup_address,
    city: row.city,
    pincode: row.pincode,
    category: row.category,
    brand: row.brand,
    model: row.model,
    approxAgeYears: row.approx_age_years,
    customerCondition: row.customer_condition,
    customerFaultsDescription: row.customer_faults_description || '',
    photos: Array.isArray(row.photos) ? row.photos : [],
    preferredSlot: row.preferred_slot || '',
    createdAt: row.created_at,
    status: row.status,
    estimatedPrice: Number(row.estimated_price),
    estimatedPriceBreakdown: row.estimated_price_breakdown || {
      baseModelValue: row.estimated_price,
      conditionMultiplier: 1.0,
      ageDepreciationFactor: 1.0,
      recoverablePartsBonus: 250,
      finalEstimatedTotal: row.estimated_price,
    },
    assignedEngineerId: row.assigned_engineer_id,
    assignedEngineerName: row.assigned_engineer_name,
    inspection: row.inspection,
    offerDecision: row.offer_decision,
    collectionSchedule: row.collection_schedule,
    payment: row.payment,
    auditTrail: Array.isArray(row.audit_trail) ? row.audit_trail : [],
    environmentalImpact: row.environmental_impact || {
      wasteDivertedKg: 5,
      co2AvoidedKg: 120,
      preciousMetalsGrams: 9,
      waterSavedLiters: 600,
      toxicMaterialsSafeguardedGrams: 70,
    },
  };
}

// Convert React camelCase to DB snake_case
export function mapRequestToDb(req: ApplianceRequest): any {
  return {
    id: req.id,
    user_id: req.userId,
    customer_name: req.customerName,
    customer_email: req.customerEmail,
    customer_phone: req.customerPhone,
    pickup_address: req.pickupAddress,
    city: req.city,
    pincode: req.pincode,
    category: req.category,
    brand: req.brand,
    model: req.model,
    approx_age_years: req.approxAgeYears,
    customer_condition: req.customerCondition,
    customer_faults_description: req.customerFaultsDescription,
    photos: req.photos,
    preferred_slot: req.preferredSlot,
    status: req.status,
    estimated_price: req.estimatedPrice,
    estimated_price_breakdown: req.estimatedPriceBreakdown,
    assigned_engineer_id: req.assignedEngineerId,
    assigned_engineer_name: req.assignedEngineerName,
    inspection: req.inspection,
    offer_decision: req.offerDecision,
    collection_schedule: req.collectionSchedule,
    payment: req.payment,
    audit_trail: req.auditTrail,
    environmental_impact: req.environmentalImpact,
    created_at: req.createdAt,
  };
}

export function mapDbToStop(row: any): LogisticsStop {
  return {
    stopId: row.stop_id,
    requestId: row.request_id || '',
    customerName: row.customer_name,
    address: row.address,
    area: row.area || '',
    city: row.city || 'Bengaluru',
    timeWindow: row.time_window || '',
    applianceSummary: row.appliance_summary || '',
    category: row.category,
    status: row.status,
    priority: row.priority || 'Normal',
    coordinates: row.coordinates || { lat: 12.9716, lng: 77.5946 },
    originalSequence: row.original_sequence || 1,
    optimizedSequence: row.optimized_sequence || 1,
    collected: Boolean(row.collected),
    distanceFromPrevKm: Number(row.distance_from_prev_km || 0),
    estimatedMinutes: Number(row.estimated_minutes || 0),
  };
}
