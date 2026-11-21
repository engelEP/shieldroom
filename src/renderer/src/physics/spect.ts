import { NUCLIDE_MATERIAL_KEY, RADIONUCLIDE_DATA } from './data/radionuclides'
import { SPECT_EXAM_PRESETS } from './data/spectPresets'
import { archerThickness, recommendLeadSheet, resolveDesignGoal } from './math'
import type { ArcherParams, ShieldingInput, SpectResult } from './types'

/** SPECT (Tc-99m) uptake/waiting and imaging room barriers. No voiding factor is applied. */
export function calculateSPECT(input: ShieldingInput): SpectResult {
  const { occupancyFactor, material, spectStudyType: studyType } = input

  const activity = input.petActivity || 555
  const uptakeTime = input.petUptakeTime || 60
  const scanTime = input.petScanTime || 30
  const distUptake = input.petUptakeRoomDist || 3.0
  const distImaging = input.petImagingRoomDist || 3.0
  const patientsPerWeek = input.patientsPerWeek || 40

  const P_mgy = resolveDesignGoal(input.areaType, input.customP)
  const P_usv = P_mgy * 1000

  const nuclideData = RADIONUCLIDE_DATA['Tc-99m']
  // In-patient dose rate constant (includes body attenuation), Kusano & Caldwell 2014.
  const gamma = nuclideData.gamma_patient
  const halfLife = nuclideData.halfLife_h
  const lambda = Math.log(2) / halfLife

  const t_u = uptakeTime / 60
  const t_s = scanTime / 60

  const int_uptake = (1 / lambda) * (1 - Math.exp(-lambda * t_u))
  const dose_per_patient_uptake = (gamma * activity * int_uptake) / (distUptake * distUptake)
  const dose_uptake = dose_per_patient_uptake * patientsPerWeek

  const F_decay = Math.exp(-lambda * t_u)
  const int_scan = (1 / lambda) * (1 - Math.exp(-lambda * t_s))
  const dose_per_patient_imaging =
    (gamma * activity * F_decay * int_scan) / (distImaging * distImaging)
  const dose_imaging = dose_per_patient_imaging * patientsPerWeek

  const B_uptake = P_usv / occupancyFactor / dose_uptake
  const B_imaging = P_usv / occupancyFactor / dose_imaging

  const dataKey = NUCLIDE_MATERIAL_KEY[material] ?? material
  let thicknessUptake: number
  let thicknessImaging: number
  let calcMethod: string
  let archerParamsUsed: ArcherParams | null = null

  const archerParams = nuclideData.archerParams[dataKey]
  const tvlData = nuclideData.tvl[dataKey]
  if (nuclideData.transmissionMethod === 'archer' && archerParams) {
    archerParamsUsed = archerParams
    thicknessUptake = archerThickness(B_uptake, archerParams)
    thicknessImaging = archerThickness(B_imaging, archerParams)
    calcMethod = 'Archer (Oumano et al. 2025)'
  } else if (tvlData) {
    const tvl = (tvlData.tvl || tvlData.tvl1) ?? NaN
    thicknessUptake = Math.max(0, tvl * Math.log10(1 / Math.max(B_uptake, 1e-20)))
    thicknessImaging = Math.max(0, tvl * Math.log10(1 / Math.max(B_imaging, 1e-20)))
    calcMethod = 'TVL (reference)'
  } else {
    throw new Error(`No Tc-99m shielding data available for ${material}`)
  }

  return {
    type: 'spect_ct',
    studyType,
    studyLabel: (SPECT_EXAM_PRESETS[studyType]?.label || 'SPECT').replace('SPECT/CT', 'SPECT'),
    P_mgy,
    P_usv,
    occupancyFactor,
    material,
    activity,
    uptakeTime,
    scanTime,
    distUptake,
    distImaging,
    patientsPerWeek,
    nuclideData,
    gamma,
    halfLife,
    lambda,
    dose_uptake,
    dose_imaging,
    B_uptake,
    B_imaging,
    thicknessUptake,
    thicknessImaging,
    recommendedSheetUptake: recommendLeadSheet(material, thicknessUptake),
    recommendedSheetImaging: recommendLeadSheet(material, thicknessImaging),
    calcMethod,
    archerParamsUsed
  }
}
