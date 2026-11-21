import { LEAD_SHEETS } from './data/leadSheets'
import type { ArcherParams, LeadSheet } from './types'

/** Archer transmission: B(x) = [(1 + β/α)·exp(αγx) − β/α]^(−1/γ). */
export function archerTransmission(x: number, params: ArcherParams): number {
  const { alpha, beta, gamma } = params
  const ratio = beta / alpha
  const exponent = alpha * gamma * x

  if (exponent > 100) return 1e-20

  const base = (1 + ratio) * Math.exp(exponent) - ratio
  if (base <= 0) return 1e-20

  return Math.pow(base, -1 / gamma)
}

/** Inverse Archer: x = (1/(αγ))·ln[(B^(−γ) + β/α) / (1 + β/α)]. Returns 0 when B is outside (0, 1). */
export function archerThickness(B: number, params: ArcherParams): number {
  const { alpha, beta, gamma } = params

  if (B >= 1 || B <= 0) return 0

  const ratio = beta / alpha
  const numerator = Math.pow(B, -gamma) + ratio
  const denominator = 1 + ratio

  if (numerator / denominator <= 0) return 0

  const lnTerm = Math.log(numerator / denominator)
  return lnTerm / (alpha * gamma)
}

/** Thickness from a first TVL and an equilibrium TVL for transmission B. */
export function calculateTVL1TVLe(B: number, tvl1: number, tvle: number): number {
  if (B >= 1) return 0
  if (B <= 0) return 999

  const nTVL = -Math.log10(B)
  if (nTVL <= 1) {
    return tvl1 * nTVL
  }
  return tvl1 + (nTVL - 1) * tvle
}

/** Thinnest standard lead sheet at least as thick as `thickness`, or the thickest available. */
export function findLeadSheet(thickness: number): LeadSheet {
  for (const sheet of LEAD_SHEETS) {
    if (sheet.mm >= thickness) return sheet
  }
  return LEAD_SHEETS[LEAD_SHEETS.length - 1]
}

/** Lead sheet recommendation for a lead barrier, or null when no lead is required. */
export function recommendLeadSheet(material: string, thickness: number): LeadSheet | null {
  if (material === 'lead' && thickness > 0) return findLeadSheet(thickness)
  return null
}

/** Design goal P (mGy/week): area type default, overridden by a positive custom value. */
export function resolveDesignGoal(areaType: string, customP: number): number {
  let P = areaType === 'controlled' ? 0.1 : 0.02
  if (!isNaN(customP) && customP > 0) P = customP
  return P
}
