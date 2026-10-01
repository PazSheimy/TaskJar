/**
 * Rough US take-home estimate for the money plan.
 * 2026 federal brackets and standard deduction (IRS Rev. Proc. 2025-32),
 * Social Security 6.2% up to the 2026 wage base, Medicare 1.45%,
 * plus an optional flat state rate. No credits, no other deductions.
 */

export type FilingStatus = "single" | "married";

// [upper edge of the bracket, rate]
const BRACKETS_2026: Record<FilingStatus, Array<[number, number]>> = {
  single: [
    [12_400, 0.1],
    [50_400, 0.12],
    [105_700, 0.22],
    [201_775, 0.24],
    [256_225, 0.32],
    [640_600, 0.35],
    [Infinity, 0.37],
  ],
  married: [
    [24_800, 0.1],
    [100_800, 0.12],
    [211_400, 0.22],
    [403_550, 0.24],
    [512_450, 0.32],
    [768_700, 0.35],
    [Infinity, 0.37],
  ],
};

const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16_100,
  married: 32_200,
};

const SS_WAGE_BASE_2026 = 184_500;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

export const TAX_YEAR = 2026;

export function federalIncomeTax(grossAnnual: number, status: FilingStatus): number {
  const taxable = Math.max(0, grossAnnual - STANDARD_DEDUCTION_2026[status]);
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of BRACKETS_2026[status]) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

export function ficaTax(grossAnnual: number): number {
  return (
    Math.min(grossAnnual, SS_WAGE_BASE_2026) * SS_RATE +
    grossAnnual * MEDICARE_RATE
  );
}

export type TakeHome = {
  federal: number;
  fica: number;
  state: number;
  net: number;
  effectiveRate: number;
};

export function estimateTakeHome({
  grossAnnual,
  status,
  stateRate,
}: {
  grossAnnual: number;
  status: FilingStatus;
  /** 0.05 for 5% */
  stateRate: number;
}): TakeHome {
  const federal = federalIncomeTax(grossAnnual, status);
  const fica = ficaTax(grossAnnual);
  const state = grossAnnual * stateRate;
  const total = federal + fica + state;
  return {
    federal,
    fica,
    state,
    net: Math.max(0, grossAnnual - total),
    effectiveRate: grossAnnual > 0 ? total / grossAnnual : 0,
  };
}
