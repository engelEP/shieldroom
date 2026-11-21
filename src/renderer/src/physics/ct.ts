import {
  CT_ARCHER_CONCRETE,
  CT_ARCHER_LEAD,
  CT_BODY_PERIPHERAL_FACTOR,
  CT_KAPPA_BODY,
  CT_KAPPA_HEAD
} from './data/archerCt'
import { archerThickness, recommendLeadSheet, resolveDesignGoal } from './math'
import type { ArcherParams, CtResult, ShieldingInput } from './types'

/** CT secondary barrier using the DLP method (NCRP 147 Section 5.6). */
export function calculateCT(input: ShieldingInput): CtResult {
  const { modality, occupancyFactor, distance, material } = input

  const headProcedures = input.ctHeadProcedures || 30
  const bodyProcedures = input.ctBodyProcedures || 100
  const headDLP = input.ctHeadDLP || 1200
  const bodyDLP = input.ctBodyDLP || 550

  const P = resolveDesignGoal(input.areaType, input.customP)

  // K1_sec per procedure at 1 m (mGy)
  const K1_head = CT_KAPPA_HEAD * headDLP
  const K1_body = CT_BODY_PERIPHERAL_FACTOR * CT_KAPPA_BODY * bodyDLP

  // Weekly unshielded air kerma at 1 m (mGy/week)
  const K1_total = K1_head * headProcedures + K1_body * bodyProcedures
  const airKermaAtDistance = K1_total / (distance * distance)

  const P_adjusted = P / occupancyFactor
  const B_required = P_adjusted / airKermaAtDistance

  let archerParams: ArcherParams
  if (material === 'lead') {
    archerParams = CT_ARCHER_LEAD
  } else if (material === 'concrete') {
    archerParams = CT_ARCHER_CONCRETE
  } else {
    throw new Error(
      `No validated CT Archer parameters available for ${material}. CT supports lead and concrete only (NCRP 147).`
    )
  }

  const thickness = archerThickness(B_required, archerParams)

  return {
    type: 'ct',
    modality,
    P,
    occupancyFactor,
    distance,
    material,
    headProcedures,
    bodyProcedures,
    headDLP,
    bodyDLP,
    K1_total,
    airKermaAtDistance,
    B_required,
    thickness,
    recommendedSheet: recommendLeadSheet(material, thickness),
    archerParams
  }
}
