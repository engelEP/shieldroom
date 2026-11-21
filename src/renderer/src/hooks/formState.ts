import { calculateShielding } from '../physics'
import { DEFAULT_PATIENTS } from '../physics/data/k1'
import { getMaterialLabel } from '../physics/data/labels'
import { SPECT_EXAM_PRESETS } from '../physics/data/spectPresets'
import type {
  AreaType,
  BarrierType,
  MaterialId,
  ModalityId,
  ShieldingInput,
  ShieldingResult,
  SpectStudyType,
  UseFactorOption
} from '../physics/types'

/** Raw form values, kept as strings exactly like the inputs hold them. */
export interface FormState {
  modality: ModalityId | ''
  areaType: AreaType
  occupancyFactor: string
  distance: string
  barrierType: BarrierType
  useFactor: UseFactorOption
  customUseFactor: string
  material: MaterialId
  patientsPerWeek: string
  ctHeadProcedures: string
  ctBodyProcedures: string
  ctHeadDLP: string
  ctBodyDLP: string
  cbctK1Preset: string
  cbctK1: string
  spectStudyType: SpectStudyType
  petActivity: string
  petUptakeTime: string
  petScanTime: string
  petUptakeRoomDist: string
  petImagingRoomDist: string
  customP: string
  xpre: string
}

export type FormField = keyof FormState

export type FormAction = { type: 'set'; field: FormField; value: string }

export const INITIAL_FORM_STATE: FormState = {
  modality: '',
  areaType: 'controlled',
  occupancyFactor: '1.0',
  distance: '3.0',
  barrierType: 'secondary',
  useFactor: '0.25',
  customUseFactor: '',
  material: 'lead',
  patientsPerWeek: '125',
  ctHeadProcedures: '30',
  ctBodyProcedures: '100',
  ctHeadDLP: '1200',
  ctBodyDLP: '550',
  cbctK1Preset: '0.040',
  cbctK1: '0.040',
  spectStudyType: 'bone',
  petActivity: '555',
  petUptakeTime: '60',
  petScanTime: '30',
  petUptakeRoomDist: '4.0',
  petImagingRoomDist: '3.0',
  customP: '',
  xpre: '0'
}

/** Modalities whose barrier type is forced to secondary. */
const SECONDARY_ONLY: ReadonlySet<string> = new Set([
  'ct',
  'petct',
  'spectct',
  'mammo',
  'dental_cbct',
  'carm',
  'cardiac_angio',
  'periph_angio'
])

/** Modalities that do not show the barrier type selector at all. */
const BARRIER_TYPE_HIDDEN: ReadonlySet<string> = new Set([
  'ct',
  'petct',
  'spectct',
  'dental_cbct',
  'carm',
  'cardiac_angio',
  'periph_angio'
])

/** Rooms with an image receptor assembly that provides pre-shielding on primary barriers. */
const XPRE_MODALITIES: ReadonlySet<string> = new Set(['chest_room', 'rad_room', 'rf_room'])

const XPRE_HINTS = {
  chest_room:
    'Chest bucky pre-shielding: 0.85 mm Pb (NCRP 147 Example 4.3.1). Adjust if your image receptor assembly differs.',
  rf_room:
    'Image receptor pre-shielding: 0.85 mm Pb typical for chest bucky wall, 0.3 mm for cross-table bucky (NCRP 147 Table 4.6). Adjust per your configuration.',
  default:
    'Lead-equivalent shielding provided by the image receptor assembly (NCRP 147 Section 4.3.1). Subtracted from the computed primary barrier thickness.'
} as const

function isXpreVisible(state: FormState): boolean {
  return state.barrierType === 'primary' && XPRE_MODALITIES.has(state.modality)
}

function applyXpreDefaults(state: FormState): FormState {
  if (!isXpreVisible(state)) return { ...state, xpre: '0' }
  const xpre = state.modality === 'chest_room' || state.modality === 'rf_room' ? '0.85' : '0'
  return { ...state, xpre }
}

function applyCbctPreset(state: FormState): FormState {
  if (state.cbctK1Preset === 'custom') return state
  return { ...state, cbctK1: state.cbctK1Preset }
}

function applySpectPreset(state: FormState): FormState {
  const preset = SPECT_EXAM_PRESETS[state.spectStudyType]
  if (!preset) return state
  return {
    ...state,
    petActivity: String(preset.activity_MBq),
    petUptakeTime: String(preset.uptakeTime_min),
    petScanTime: String(preset.scanTime_min)
  }
}

function isMaterialAvailable(modality: ModalityId | '', material: MaterialId): boolean {
  if (modality === 'petct') return material !== 'gypsum'
  if (modality === 'ct' || modality === 'dental_cbct') {
    return material === 'lead' || material === 'concrete'
  }
  return true
}

function applyModality(state: FormState): FormState {
  const { modality } = state
  let next: FormState = {
    ...state,
    patientsPerWeek: String(DEFAULT_PATIENTS[modality] || 100)
  }

  if (modality === 'dental_cbct') next = applyCbctPreset(next)

  if (!isMaterialAvailable(modality, next.material)) next = { ...next, material: 'lead' }

  if (modality === 'spectct') next = applySpectPreset(next)

  if (SECONDARY_ONLY.has(modality) || modality === 'rad_room') {
    next = { ...next, barrierType: 'secondary' }
  }

  return applyXpreDefaults(next)
}

export function formReducer(state: FormState, action: FormAction): FormState {
  const next = { ...state, [action.field]: action.value } as FormState

  switch (action.field) {
    case 'modality':
      return applyModality(next)
    case 'barrierType':
      return applyXpreDefaults(next)
    case 'cbctK1Preset':
      return applyCbctPreset(next)
    case 'spectStudyType':
      return applySpectPreset(next)
    default:
      return next
  }
}

export interface MaterialOption {
  value: MaterialId
  label: string
  disabled: boolean
}

function materialOptionLabel(modality: ModalityId | '', material: MaterialId): string {
  const label = getMaterialLabel(material)
  if (isMaterialAvailable(modality, material)) return label
  if (modality === 'petct') return `${label} (not available for PET)`
  return `${label} (not available for ${modality === 'dental_cbct' ? 'CBCT' : 'CT'})`
}

const MATERIAL_ORDER: readonly MaterialId[] = ['lead', 'concrete', 'steel', 'gypsum']

/** Visibility and option state derived from the current form values. */
export interface FormView {
  showDistance: boolean
  showBarrierType: boolean
  barrierTypeLocked: boolean
  showUseFactor: boolean
  showCustomUseFactor: boolean
  showCtFields: boolean
  showCbctFields: boolean
  showNuclearFields: boolean
  showSpectStudy: boolean
  showXpre: boolean
  xpreHint: string
  spectStudySource: string
  materialOptions: MaterialOption[]
}

export function deriveFormView(state: FormState): FormView {
  const { modality } = state
  const isNuclear = modality === 'petct' || modality === 'spectct'
  const barrierTypeLocked = SECONDARY_ONLY.has(modality)
  const preset = SPECT_EXAM_PRESETS[state.spectStudyType]

  return {
    showDistance: !isNuclear,
    showBarrierType: !BARRIER_TYPE_HIDDEN.has(modality),
    barrierTypeLocked,
    showUseFactor: state.barrierType === 'primary' && !barrierTypeLocked,
    showCustomUseFactor: state.useFactor === 'custom',
    showCtFields: modality === 'ct',
    showCbctFields: modality === 'dental_cbct',
    showNuclearFields: isNuclear,
    showSpectStudy: modality === 'spectct',
    showXpre: isXpreVisible(state),
    xpreHint:
      modality === 'chest_room' || modality === 'rf_room'
        ? XPRE_HINTS[modality]
        : XPRE_HINTS.default,
    spectStudySource: preset ? `Activity: ${preset.activityRange} | Source: ${preset.source}` : '',
    materialOptions: MATERIAL_ORDER.map((value) => ({
      value,
      label: materialOptionLabel(modality, value),
      disabled: !isMaterialAvailable(modality, value)
    }))
  }
}

export type CalculationOutcome = { result: ShieldingResult } | { error: string }

/** Validates the form and runs the engine, producing the same error text as the reference UI. */
export function runCalculation(state: FormState): CalculationOutcome {
  const { modality } = state
  if (!modality) return { error: 'Please select a modality.' }
  try {
    return { result: calculateShielding(toShieldingInput({ ...state, modality })) }
  } catch (err) {
    return { error: `Error: ${err instanceof Error ? err.message : String(err)}` }
  }
}

/** Converts raw form values into engine input. Requires a selected modality. */
export function toShieldingInput(state: FormState & { modality: ModalityId }): ShieldingInput {
  return {
    modality: state.modality,
    areaType: state.areaType,
    occupancyFactor: parseFloat(state.occupancyFactor),
    distance: parseFloat(state.distance),
    barrierType: state.barrierType,
    useFactor: state.useFactor,
    customUseFactor: parseFloat(state.customUseFactor),
    material: state.material,
    patientsPerWeek: parseFloat(state.patientsPerWeek),
    customP: parseFloat(state.customP),
    xpre: parseFloat(state.xpre),
    ctHeadProcedures: parseFloat(state.ctHeadProcedures),
    ctBodyProcedures: parseFloat(state.ctBodyProcedures),
    ctHeadDLP: parseFloat(state.ctHeadDLP),
    ctBodyDLP: parseFloat(state.ctBodyDLP),
    cbctK1: parseFloat(state.cbctK1),
    spectStudyType: state.spectStudyType,
    petActivity: parseFloat(state.petActivity),
    petUptakeTime: parseFloat(state.petUptakeTime),
    petScanTime: parseFloat(state.petScanTime),
    petUptakeRoomDist: parseFloat(state.petUptakeRoomDist),
    petImagingRoomDist: parseFloat(state.petImagingRoomDist)
  }
}
