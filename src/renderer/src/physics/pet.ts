import {
  GAMMA_F18,
  HALF_LIFE_F18,
  NUCLIDE_MATERIAL_KEY,
  PET_VOIDING_FACTOR,
  RADIONUCLIDE_DATA
} from './data/radionuclides'
import { archerThickness, recommendLeadSheet, resolveDesignGoal } from './math'
import type { ArcherParams, MaterialId, ModalityId, PetResult, ShieldingInput } from './types'

interface NuclearThicknesses {
  uptake: number
  imaging: number
  method: string
  archerParams: ArcherParams
}

/** F-18 barrier thicknesses for the uptake and imaging rooms (Oumano et al. 2025 Archer fits). */
export function calculatePetThickness(
  B_uptake: number,
  B_imaging: number,
  modality: ModalityId,
  material: MaterialId
): NuclearThicknesses {
  const dataKey = NUCLIDE_MATERIAL_KEY[material] ?? material

  if (modality === 'petct') {
    const nuclideData = RADIONUCLIDE_DATA['F-18']
    const params = nuclideData.archerParams[dataKey]
    if (nuclideData.transmissionMethod === 'archer' && params) {
      return {
        uptake: archerThickness(B_uptake, params),
        imaging: archerThickness(B_imaging, params),
        method: 'Archer (Oumano et al. 2025)',
        archerParams: params
      }
    }
  }

  throw new Error(
    `No validated F-18 transmission data available for ${material}. PET supports lead, concrete, and steel only.`
  )
}

/** PET (F-18) uptake and imaging room barriers (AAPM TG-108). */
export function calculatePET(input: ShieldingInput): PetResult {
  const { modality, occupancyFactor, material } = input

  const activity = input.petActivity || 555
  const uptakeTime = input.petUptakeTime || 60
  const scanTime = input.petScanTime || 30
  const distUptake = input.petUptakeRoomDist || 4.0
  const distImaging = input.petImagingRoomDist || 3.0
  const patientsPerWeek = input.patientsPerWeek || 40

  const P_mgy = resolveDesignGoal(input.areaType, input.customP)
  const P_usv = P_mgy * 1000

  const gamma = GAMMA_F18
  const halfLife = HALF_LIFE_F18
  const lambda = Math.log(2) / halfLife

  const t_u = uptakeTime / 60
  const t_s = scanTime / 60

  // Uptake room (TG-108 Eqs 3-6): no voiding factor.
  const int_uptake = (1 / lambda) * (1 - Math.exp(-lambda * t_u))
  const dose_per_patient_uptake = (gamma * activity * int_uptake) / (distUptake * distUptake)
  const dose_uptake = dose_per_patient_uptake * patientsPerWeek

  // Imaging room (TG-108 Eqs 9-12): decay during uptake and voiding before imaging.
  const F_U = Math.exp(-lambda * t_u)
  const int_scan = (1 / lambda) * (1 - Math.exp(-lambda * t_s))
  const dose_per_patient_imaging =
    (gamma * activity * PET_VOIDING_FACTOR * F_U * int_scan) / (distImaging * distImaging)
  const dose_imaging_raw = dose_per_patient_imaging * patientsPerWeek

  const B_uptake = P_usv / occupancyFactor / dose_uptake
  const B_imaging = P_usv / occupancyFactor / dose_imaging_raw

  const thicknesses = calculatePetThickness(B_uptake, B_imaging, modality, material)

  return {
    type: 'pet_spect',
    modality,
    P_mgy,
    P_usv,
    occupancyFactor,
    material,
    activity,
    uptakeTime,
    scanTime,
    distUptake,
    distImaging,
    gamma,
    halfLife,
    lambda,
    dose_uptake,
    dose_imaging_raw,
    B_uptake,
    B_imaging,
    thicknessUptake: thicknesses.uptake,
    thicknessImaging: thicknesses.imaging,
    thicknessMethod: thicknesses.method,
    archerParamsUsed: thicknesses.archerParams,
    recommendedSheetUptake: recommendLeadSheet(material, thicknesses.uptake),
    recommendedSheetImaging: recommendLeadSheet(material, thicknesses.imaging),
    totalDoseImaging: dose_imaging_raw
  }
}
