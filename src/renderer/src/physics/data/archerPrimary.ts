import type { ArcherParams } from '../types'

/** Primary barrier Archer parameters for lead (representative 80 kVp). NCRP 147 Appendix B. */
export const PRIMARY_ARCHER_LEAD: Readonly<Record<string, ArcherParams>> = {
  rad_room_chest: { alpha: 2.283, beta: 10.74, gamma: 0.637 },
  rad_room_floor: { alpha: 2.016, beta: 12.5, gamma: 0.5765 },
  chest_room: { alpha: 2.283, beta: 10.74, gamma: 0.637 }
}

/** Primary barrier Archer parameters for concrete (representative 80 kVp). NCRP 147 Appendix B. */
export const PRIMARY_ARCHER_CONCRETE: Readonly<Record<string, ArcherParams>> = {
  rad_room_chest: { alpha: 0.05087, beta: 1.696, gamma: 0.3847 },
  rad_room_floor: { alpha: 0.05087, beta: 1.696, gamma: 0.3847 },
  chest_room: { alpha: 0.05087, beta: 1.696, gamma: 0.3847 }
}
