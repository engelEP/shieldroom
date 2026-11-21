import { MODALITY_LABELS } from '../../physics/data/labels'
import type {
  AreaType,
  BarrierType,
  ModalityId,
  SpectStudyType,
  UseFactorOption
} from '../../physics/types'
import type { SelectOption } from './SelectField'

export const MODALITY_OPTIONS: SelectOption<ModalityId>[] = (
  Object.keys(MODALITY_LABELS) as ModalityId[]
).map((value) => ({ value, label: MODALITY_LABELS[value] }))

export const AREA_TYPE_OPTIONS: SelectOption<AreaType>[] = [
  { value: 'controlled', label: 'Controlled (P = 0.1 mGy/week)' },
  { value: 'uncontrolled', label: 'Uncontrolled (P = 0.02 mGy/week)' }
]

export const OCCUPANCY_OPTIONS: SelectOption<string>[] = [
  { value: '1.0', label: '1.0' },
  { value: '0.5', label: '1/2' },
  { value: '0.2', label: '1/5' },
  { value: '0.125', label: '1/8' },
  { value: '0.05', label: '1/20' },
  { value: '0.025', label: '1/40' }
]

export const BARRIER_TYPE_OPTIONS: SelectOption<BarrierType>[] = [
  { value: 'secondary', label: 'Secondary Barrier (scatter/leakage)' },
  { value: 'primary', label: 'Primary Barrier (direct beam)' }
]

export const USE_FACTOR_OPTIONS: SelectOption<UseFactorOption>[] = [
  { value: '1.0', label: '1.0 – Floor (beam always directed at barrier)' },
  { value: '0.25', label: '1/4 – Wall (typical for radiographic rooms)' },
  { value: '0.11', label: '1/9 – Wall (3 walls + floor primary)' },
  { value: '0.09', label: '0.09 – Cross-table lateral wall (NCRP 147 Table 4.5)' },
  { value: 'custom', label: 'Custom...' }
]

export const CBCT_K1_PRESET_OPTIONS: SelectOption<string>[] = [
  { value: '0.005', label: 'Low / small FOV: 0.005 mGy/scan (5 µGy)' },
  { value: '0.010', label: 'Moderate: 0.010 mGy/scan (10 µGy)' },
  { value: '0.020', label: 'High: 0.020 mGy/scan (20 µGy)' },
  { value: '0.040', label: 'Conservative / unknown / large FOV: 0.040 mGy/scan (40 µGy)' },
  { value: 'custom', label: 'Custom vendor/measured/QMP-selected value' }
]

export const SPECT_STUDY_OPTIONS: SelectOption<SpectStudyType>[] = [
  { value: 'bone', label: 'Bone SPECT' },
  { value: 'cardiac', label: 'Cardiac Perfusion SPECT' },
  { value: 'renal', label: 'Renal SPECT' },
  { value: 'hida', label: 'Hepatobiliary (HIDA) SPECT' },
  { value: 'parathyroid', label: 'Parathyroid SPECT' },
  { value: 'custom', label: 'Custom Protocol' }
]
