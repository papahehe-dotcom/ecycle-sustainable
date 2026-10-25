/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApplianceCategory, EnvironmentalImpact, PriceBreakdown, WorkingCondition } from '../types';

interface BrandTier {
  multiplier: number;
}

const BRAND_TIERS: Record<string, BrandTier> = {
  // Premium
  apple: { multiplier: 1.35 },
  sony: { multiplier: 1.25 },
  daikin: { multiplier: 1.20 },
  bose: { multiplier: 1.25 },
  dell: { multiplier: 1.15 },
  hp: { multiplier: 1.10 },
  lenovo: { multiplier: 1.10 },
  samsung: { multiplier: 1.15 },
  lg: { multiplier: 1.15 },
  bosch: { multiplier: 1.20 },
  whirlpool: { multiplier: 1.05 },
  oneplus: { multiplier: 1.10 },
  xiaomi: { multiplier: 0.95 },
  voltas: { multiplier: 1.00 },
  havells: { multiplier: 1.00 },
  other: { multiplier: 0.90 },
};

const CATEGORY_BASE_VALUES: Record<ApplianceCategory, { base: number; avgWeightKg: number }> = {
  phones_pcs_tvs: { base: 14000, avgWeightKg: 4.5 },
  home_appliances: { base: 18000, avgWeightKg: 45.0 },
  lights_tools_medical: { base: 4500, avgWeightKg: 3.2 },
  batteries_special: { base: 2200, avgWeightKg: 2.0 },
};

export function calculateEstimatedValuation(
  category: ApplianceCategory,
  brand: string,
  approxAgeYears: number,
  condition: WorkingCondition
): { estimatedPrice: number; breakdown: PriceBreakdown } {
  const catData = CATEGORY_BASE_VALUES[category] || { base: 8000, avgWeightKg: 5 };
  const normalizedBrand = brand.toLowerCase().trim();
  const brandFactor = BRAND_TIERS[normalizedBrand]?.multiplier || 1.0;

  const baseModelValue = Math.round(catData.base * brandFactor);

  // Condition Multiplier
  let conditionMultiplier = 1.0;
  if (condition === 'partially_working') {
    conditionMultiplier = 0.55;
  } else if (condition === 'non_working') {
    conditionMultiplier = 0.22;
  }

  // Age Depreciation factor (capped)
  // Each year takes ~10-14%, floor at 18% base value
  const depreciationRate = 0.12;
  const rawAgeFactor = Math.max(0.18, 1 - approxAgeYears * depreciationRate);
  const ageDepreciationFactor = Number(rawAgeFactor.toFixed(2));

  // Recoverable Parts / Scrap bonus (guaranteed minimum value for recycling)
  const recoverablePartsBonus = condition === 'non_working' ? 450 : 250;

  // Calculate total
  const preliminaryVal = Math.round(
    baseModelValue * conditionMultiplier * ageDepreciationFactor + recoverablePartsBonus
  );

  // Round to clean nearest ₹50
  const finalEstimatedTotal = Math.max(300, Math.round(preliminaryVal / 50) * 50);

  return {
    estimatedPrice: finalEstimatedTotal,
    breakdown: {
      baseModelValue,
      conditionMultiplier,
      ageDepreciationFactor,
      recoverablePartsBonus,
      finalEstimatedTotal,
    },
  };
}

export function calculateEnvironmentalImpact(
  category: ApplianceCategory,
  approxWeightKgOverride?: number
): EnvironmentalImpact {
  const avgWeightKg = approxWeightKgOverride || CATEGORY_BASE_VALUES[category]?.avgWeightKg || 5.0;

  // Scientific benchmarks for Indian e-waste circular recovery:
  // ~26 kg CO2e saved per kg of e-waste reused or recycled vs mining virgin ore.
  // ~0.08g gold/precious metals per kg of printed circuit boards / devices.
  // ~140 Litres water saved per kg.
  const co2AvoidedKg = Math.round(avgWeightKg * 24.5 * 10) / 10;
  const preciousMetalsGrams = Math.round(avgWeightKg * 1.85 * 10) / 10;
  const waterSavedLiters = Math.round(avgWeightKg * 125);
  const toxicMaterialsSafeguardedGrams = Math.round(avgWeightKg * 14);

  return {
    wasteDivertedKg: Math.round(avgWeightKg * 10) / 10,
    co2AvoidedKg,
    preciousMetalsGrams,
    waterSavedLiters,
    toxicMaterialsSafeguardedGrams,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
