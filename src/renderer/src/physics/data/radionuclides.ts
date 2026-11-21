import type { RadionuclideData } from '../types'

/** F-18 in-patient dose rate constant used by the PET engine, uSv·m²/(MBq·h). TG-108 Table IV. */
export const GAMMA_F18 = 0.092
/** F-18 half-life used by the PET engine (hours). */
export const HALF_LIFE_F18 = 109.77 / 60

/** Legacy PET TVL values (mm), kept for reference. */
export const PET_TVL_LEAD = { tvl1: 17.0 } as const
export const PET_TVL_CONCRETE = { tvl1: 176 } as const

/** Fraction of activity remaining after the patient voids before imaging (TG-108). */
export const PET_VOIDING_FACTOR = 0.85

export const RADIONUCLIDE_DATA: Readonly<Record<'F-18' | 'Tc-99m', RadionuclideData>> = {
  'F-18': {
    isotope: 'F-18',
    energy_keV: 511,
    halfLife_h: 1.8295,
    gamma_unshielded: 0.143,
    gamma_patient: 0.092,
    bodyAttenuationIncluded: true,
    transmissionMethod: 'archer',
    archerParams: {
      lead: { alpha: 0.166, beta: -0.02184, gamma: 0.2436 },
      lw_concrete: { alpha: 0.01126, beta: -0.006463, gamma: 0.7475 },
      nw_concrete: { alpha: 0.01558, beta: -0.008775, gamma: 0.86 },
      steel: { alpha: 0.05032, beta: -0.02632, gamma: 1.223 }
    },
    tvl: {
      lead: { tvl1: 17.0, tvle: 17.0, unit: 'mm' },
      concrete: { tvl1: 176, tvle: 176, unit: 'mm' }
    },
    citations: [
      'TG-108 (Madsen et al., 2006)',
      'NCRP 147 (2004)',
      'Oumano et al. (2025) JACMP Table 2, DOI:10.1002/acm2.70084'
    ],
    sourceVersion: 'v2.0-oumano2025'
  },
  'Tc-99m': {
    isotope: 'Tc-99m',
    energy_keV: 140,
    halfLife_h: 6.007,
    gamma_unshielded: 0.0195,
    gamma_patient: 0.0161,
    bodyAttenuationIncluded: true,
    transmissionMethod: 'archer',
    // Oumano et al. 2025 JACMP Table 2, GATE Monte Carlo broad beam, mm. Beta can be negative.
    archerParams: {
      lead: { alpha: 2.558, beta: 1.01, gamma: 4.344 },
      gypsum: { alpha: 0.009549, beta: -0.005312, gamma: 1.43 },
      lw_concrete: { alpha: 0.02047, beta: -0.01122, gamma: 0.4389 },
      nw_concrete: { alpha: 0.03102, beta: -0.01729, gamma: 0.3622 },
      steel: { alpha: 0.1581, beta: -0.04346, gamma: 0.2602 },
      glass: { alpha: 0.03419, beta: -0.02009, gamma: 0.3076 }
    },
    // Oumano et al. 2025 Table 3 (mm)
    tvl: {
      lead: { tvl: 0.87, hvl: 0.243, cvl: 1.77, unit: 'mm' },
      gypsum: { tvl: 299, hvl: 115, cvl: 542, unit: 'mm' },
      lw_concrete: { tvl: 176, hvl: 64.6, cvl: 305, unit: 'mm' },
      nw_concrete: { tvl: 122, hvl: 44.3, cvl: 211, unit: 'mm' },
      steel: { tvl: 18.4, hvl: 5.86, cvl: 34.8, unit: 'mm' },
      glass: { tvl: 119, hvl: 43.3, cvl: 204, unit: 'mm' }
    },
    citations: [
      'Kusano & Caldwell (2014) Health Physics 107(1):60-72',
      'Oumano et al. (2025) J Appl Clin Med Phys 26:e70084, Table 2 & 3'
    ],
    sourceVersion: 'v2.0-oumano2025'
  }
}

/** Maps UI materials to radionuclide data keys; concrete defaults to normal-weight concrete. */
export const NUCLIDE_MATERIAL_KEY = {
  lead: 'lead',
  concrete: 'nw_concrete',
  steel: 'steel',
  gypsum: 'gypsum'
} as const
