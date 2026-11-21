export type ModalityId =
  | 'rad_room'
  | 'chest_room'
  | 'rf_room'
  | 'cardiac_angio'
  | 'periph_angio'
  | 'ct'
  | 'mammo'
  | 'dental_intra'
  | 'dental_pano'
  | 'dental_cbct'
  | 'carm'
  | 'petct'
  | 'spectct'

export type MaterialId = 'lead' | 'concrete' | 'steel' | 'gypsum'

export type AreaType = 'controlled' | 'uncontrolled'

export type BarrierType = 'primary' | 'secondary'

export type SpectStudyType = 'bone' | 'cardiac' | 'renal' | 'hida' | 'parathyroid' | 'custom'

export type UseFactorOption = '1.0' | '0.25' | '0.11' | '0.09' | 'custom'

export interface ArcherParams {
  alpha: number
  beta: number
  gamma: number
}

export interface LeadSheet {
  fraction: string
  mm: number
  inches: number
}

/**
 * Numeric fields hold the result of `parseFloat` on the raw form value, so an
 * empty or invalid field is `NaN`. The engine applies the same fallbacks as the
 * reference implementation (e.g. `value || default`).
 */
export interface ShieldingInput {
  modality: ModalityId
  areaType: AreaType
  occupancyFactor: number
  distance: number
  barrierType: BarrierType
  useFactor: UseFactorOption
  customUseFactor: number
  material: MaterialId
  patientsPerWeek: number
  customP: number
  xpre: number
  ctHeadProcedures: number
  ctBodyProcedures: number
  ctHeadDLP: number
  ctBodyDLP: number
  cbctK1: number
  spectStudyType: SpectStudyType
  petActivity: number
  petUptakeTime: number
  petScanTime: number
  petUptakeRoomDist: number
  petImagingRoomDist: number
}

export interface DiagnosticResult {
  type: 'diagnostic_xray'
  modality: ModalityId
  P: number
  occupancyFactor: number
  distance: number
  patientsPerWeek: number
  barrierType: BarrierType
  material: MaterialId
  U: number
  K1: number
  airKermaAtDistance: number
  B_required: number
  totalThickness: number
  xpre: number
  thickness: number
  recommendedSheet: LeadSheet | null
  archerParams: ArcherParams
}

export interface CtResult {
  type: 'ct'
  modality: ModalityId
  P: number
  occupancyFactor: number
  distance: number
  material: MaterialId
  headProcedures: number
  bodyProcedures: number
  headDLP: number
  bodyDLP: number
  K1_total: number
  airKermaAtDistance: number
  B_required: number
  thickness: number
  recommendedSheet: LeadSheet | null
  archerParams: ArcherParams
}

export interface PetResult {
  type: 'pet_spect'
  modality: ModalityId
  P_mgy: number
  P_usv: number
  occupancyFactor: number
  material: MaterialId
  activity: number
  uptakeTime: number
  scanTime: number
  distUptake: number
  distImaging: number
  gamma: number
  halfLife: number
  lambda: number
  dose_uptake: number
  dose_imaging_raw: number
  B_uptake: number
  B_imaging: number
  thicknessUptake: number
  thicknessImaging: number
  thicknessMethod: string
  archerParamsUsed: ArcherParams
  recommendedSheetUptake: LeadSheet | null
  recommendedSheetImaging: LeadSheet | null
  totalDoseImaging: number
}

export interface SpectResult {
  type: 'spect_ct'
  studyType: SpectStudyType
  studyLabel: string
  P_mgy: number
  P_usv: number
  occupancyFactor: number
  material: MaterialId
  activity: number
  uptakeTime: number
  scanTime: number
  distUptake: number
  distImaging: number
  patientsPerWeek: number
  nuclideData: RadionuclideData
  gamma: number
  halfLife: number
  lambda: number
  dose_uptake: number
  dose_imaging: number
  B_uptake: number
  B_imaging: number
  thicknessUptake: number
  thicknessImaging: number
  recommendedSheetUptake: LeadSheet | null
  recommendedSheetImaging: LeadSheet | null
  calcMethod: string
  archerParamsUsed: ArcherParams | null
}

export type ShieldingResult = DiagnosticResult | CtResult | PetResult | SpectResult

export type NuclideMaterialKey =
  'lead' | 'gypsum' | 'lw_concrete' | 'nw_concrete' | 'steel' | 'glass' | 'concrete'

export interface NuclideTvl {
  tvl?: number
  tvl1?: number
  tvle?: number
  hvl?: number
  cvl?: number
  unit: 'mm'
}

export interface RadionuclideData {
  isotope: string
  energy_keV: number
  halfLife_h: number
  gamma_unshielded: number
  gamma_patient: number
  bodyAttenuationIncluded: boolean
  transmissionMethod: 'archer'
  archerParams: Partial<Record<NuclideMaterialKey, ArcherParams>>
  tvl: Partial<Record<NuclideMaterialKey, NuclideTvl>>
  citations: string[]
  sourceVersion: string
}

export interface SpectExamPreset {
  label: string
  activity_MBq: number
  activityRange: string
  uptakeTime_min: number
  scanTime_min: number
  source: string
}
