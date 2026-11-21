import type { ArcherParams } from '../types'

/** CT secondary Archer parameters (120 kVp). NCRP 147. */
export const CT_ARCHER_LEAD: Readonly<ArcherParams> = { alpha: 2.246, beta: 8.95, gamma: 0.5873 }
export const CT_ARCHER_CONCRETE: Readonly<ArcherParams> = {
  alpha: 0.03566,
  beta: 0.07109,
  gamma: 0.4922
}

/** CT scatter fractions per cm, NCRP 147 Eq 5.5a,b / 5.10a,b (cm^-1). */
export const CT_KAPPA_HEAD = 9e-5
export const CT_KAPPA_BODY = 3e-4
/** Peripheral vs central axis factor applied to body scatter. */
export const CT_BODY_PERIPHERAL_FACTOR = 1.2
