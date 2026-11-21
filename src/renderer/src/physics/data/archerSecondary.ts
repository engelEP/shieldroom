import type { ArcherParams } from '../types'

type ArcherTable = Readonly<Record<string, ArcherParams>>

/** Secondary barrier Archer parameters for lead (mm^-1). NCRP 147 Appendix C. */
export const SEC_ARCHER_LEAD: ArcherTable = {
  rad_room_all: { alpha: 2.298, beta: 5.478, gamma: 0.5678 },
  rad_room_chest: { alpha: 2.256, beta: 13.8, gamma: 0.6193 },
  rad_room_floor: { alpha: 2.513, beta: 17.34, gamma: 0.4994 },
  fluoro_tube_rf: { alpha: 2.322, beta: 12.91, gamma: 0.7575 },
  rad_tube_rf: { alpha: 2.272, beta: 13.6, gamma: 0.7184 },
  chest_room: { alpha: 2.288, beta: 9.848, gamma: 1.054 },
  cardiac_angio: { alpha: 2.354, beta: 14.94, gamma: 0.7481 },
  mammo: { alpha: 29.91, beta: 184.4, gamma: 0.355 },
  periph_angio: { alpha: 2.661, beta: 19.54, gamma: 0.5094 }
}

/** Secondary barrier Archer parameters for concrete (mm^-1). NCRP 147 Appendix C. */
export const SEC_ARCHER_CONCRETE: ArcherTable = {
  rad_room_all: { alpha: 0.0351, beta: 0.0775, gamma: 0.7832 },
  rad_room_chest: { alpha: 0.0361, beta: 0.1433, gamma: 0.56 },
  rad_room_floor: { alpha: 0.0392, beta: 0.1464, gamma: 0.4486 },
  fluoro_tube_rf: { alpha: 0.0363, beta: 0.0936, gamma: 0.5955 },
  rad_tube_rf: { alpha: 0.0356, beta: 0.1114, gamma: 0.662 },
  chest_room: { alpha: 0.0364, beta: 0.0659, gamma: 0.7543 },
  cardiac_angio: { alpha: 0.0371, beta: 0.1067, gamma: 0.5733 },
  mammo: { alpha: 0.2539, beta: 1.841, gamma: 0.3924 },
  periph_angio: { alpha: 0.04219, beta: 0.1559, gamma: 0.4472 }
}

/** Secondary barrier Archer parameters for steel (mm^-1). NCRP 147 Appendix C. */
export const SEC_ARCHER_STEEL: ArcherTable = {
  rad_room_all: { alpha: 0.2191, beta: 2.836, gamma: 0.7358 },
  rad_room_chest: { alpha: 0.244, beta: 3.012, gamma: 0.5019 },
  rad_room_floor: { alpha: 0.2331, beta: 2.213, gamma: 0.8051 },
  fluoro_tube_rf: { alpha: 0.2149, beta: 2.695, gamma: 0.8768 },
  rad_tube_rf: { alpha: 0.5798, beta: 1.829, gamma: 4.124 },
  chest_room: { alpha: 0.253, beta: 2.592, gamma: 7.999 },
  cardiac_angio: { alpha: 0.353, beta: 4.412, gamma: 3.918 },
  mammo: { alpha: 0.3579, beta: 3.466, gamma: 5.6 }
}

/** Secondary barrier Archer parameters for gypsum wallboard (mm^-1). NCRP 147 Appendix C. */
export const SEC_ARCHER_GYPSUM: ArcherTable = {
  rad_room_all: { alpha: 0.012, beta: 0.0267, gamma: 0.7832 },
  rad_room_chest: { alpha: 0.0138, beta: 0.0456, gamma: 0.7937 },
  rad_room_floor: { alpha: 0.0127, beta: 0.0456, gamma: 0.7472 },
  fluoro_tube_rf: { alpha: 0.0133, beta: 0.043, gamma: 0.9566 },
  rad_tube_rf: { alpha: 0.0129, beta: 0.0457, gamma: 0.9355 },
  chest_room: { alpha: 0.013, beta: 0.0297, gamma: 1.195 },
  cardiac_angio: { alpha: 0.0139, beta: 0.0464, gamma: 0.9185 },
  mammo: { alpha: 0.0883, beta: 0.07526, gamma: 3.786 }
}
