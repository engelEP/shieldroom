import { PRIMARY_ARCHER_CONCRETE, PRIMARY_ARCHER_LEAD } from './data/archerPrimary'
import { CT_ARCHER_CONCRETE, CT_ARCHER_LEAD } from './data/archerCt'
import {
  SEC_ARCHER_CONCRETE,
  SEC_ARCHER_GYPSUM,
  SEC_ARCHER_LEAD,
  SEC_ARCHER_STEEL
} from './data/archerSecondary'
import { K1_P, K1_SEC } from './data/k1'
import { archerThickness, recommendLeadSheet, resolveDesignGoal } from './math'
import type {
  ArcherParams,
  DiagnosticResult,
  ModalityId,
  ShieldingInput,
  UseFactorOption
} from './types'

/** Workload distribution key used to look up K1_sec and secondary Archer parameters. */
const WORKLOAD_KEYS: Partial<Record<ModalityId, string>> = {
  chest_room: 'chest_room',
  rf_room: 'fluoro_tube_rf',
  cardiac_angio: 'cardiac_angio',
  periph_angio: 'periph_angio',
  mammo: 'mammo',
  dental_intra: 'mammo',
  dental_pano: 'mammo',
  dental_cbct: 'ct',
  carm: 'fluoro_tube_rf'
}

function getWorkloadKey(modality: ModalityId): string {
  return WORKLOAD_KEYS[modality] ?? 'rad_room_all'
}

/**
 * K1_P key for primary barriers. General rooms pick wall vs floor from the
 * selected use factor option; a custom option counts as a wall (U = 0.25).
 */
export function getPrimaryK1Key(modality: ModalityId, useFactor: UseFactorOption): string {
  if (modality === 'chest_room') return 'chest_room'
  if (modality === 'rf_room') return 'rf_room_rad'
  const U = parseFloat(useFactor) || 0.25
  return U >= 1.0 ? 'rad_room_floor' : 'rad_room_chest'
}

function selectArcherParams(
  input: ShieldingInput,
  workloadKey: string,
  primaryK1Key: string | null
): ArcherParams | undefined {
  const { modality, material, barrierType } = input
  const isPrimary = barrierType === 'primary'

  if (modality === 'dental_cbct') {
    if (material === 'lead') return CT_ARCHER_LEAD
    if (material === 'concrete') return CT_ARCHER_CONCRETE
    return undefined
  }

  switch (material) {
    case 'lead':
      return isPrimary
        ? PRIMARY_ARCHER_LEAD[primaryK1Key ?? ''] || PRIMARY_ARCHER_LEAD['rad_room_floor']
        : SEC_ARCHER_LEAD[workloadKey]
    case 'concrete':
      return isPrimary
        ? PRIMARY_ARCHER_CONCRETE[primaryK1Key ?? ''] || PRIMARY_ARCHER_CONCRETE['rad_room_floor']
        : SEC_ARCHER_CONCRETE[workloadKey]
    case 'steel':
      return SEC_ARCHER_STEEL[workloadKey]
    case 'gypsum':
      return SEC_ARCHER_GYPSUM[workloadKey]
    default:
      return undefined
  }
}

function selectK1(input: ShieldingInput, workloadKey: string, primaryK1Key: string | null): number {
  if (input.barrierType === 'primary') {
    return K1_P[primaryK1Key ?? '']
  }
  switch (input.modality) {
    case 'dental_intra':
      return K1_SEC['dental_intra']
    case 'dental_pano':
      return K1_SEC['dental_pano']
    case 'dental_cbct': {
      const K1 = input.cbctK1
      return isNaN(K1) || K1 <= 0 ? K1_SEC['dental_cbct'] : K1
    }
    default:
      return K1_SEC[workloadKey]
  }
}

function selectUseFactor(input: ShieldingInput): number {
  if (input.barrierType !== 'primary') return 1.0
  if (input.useFactor === 'custom') return input.customUseFactor || 0.25
  return parseFloat(input.useFactor) || 0.25
}

/** Diagnostic X-ray barrier (NCRP 147 Eq 4.7 primary, Eq 4.9 secondary). */
export function calculateDiagnosticXray(input: ShieldingInput): DiagnosticResult {
  const { modality, occupancyFactor, distance, patientsPerWeek, barrierType, material } = input

  const P = resolveDesignGoal(input.areaType, input.customP)
  const workloadKey = getWorkloadKey(modality)
  const primaryK1Key = barrierType === 'primary' ? getPrimaryK1Key(modality, input.useFactor) : null

  const archerParams = selectArcherParams(input, workloadKey, primaryK1Key)
  if (!archerParams) {
    throw new Error('Unable to find Archer parameters for selected combination')
  }

  const K1 = selectK1(input, workloadKey, primaryK1Key)
  const U = selectUseFactor(input)
  const xpre = barrierType === 'primary' ? input.xpre || 0 : 0

  // B = (P/T · d²) / (K1 · U · N)
  const P_adjusted = P / occupancyFactor
  const B_required = (P_adjusted * distance * distance) / (K1 * U * patientsPerWeek)
  const airKermaAtDistance = (K1 * patientsPerWeek) / (distance * distance)

  const totalThickness = archerThickness(B_required, archerParams)
  const thickness = Math.max(0, totalThickness - xpre)

  return {
    type: 'diagnostic_xray',
    modality,
    P,
    occupancyFactor,
    distance,
    patientsPerWeek,
    barrierType,
    material,
    U,
    K1,
    airKermaAtDistance,
    B_required,
    totalThickness,
    xpre,
    thickness,
    recommendedSheet: recommendLeadSheet(material, thickness),
    archerParams
  }
}
