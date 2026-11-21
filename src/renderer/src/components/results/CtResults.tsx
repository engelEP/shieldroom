import { formatPrecision4, formatThicknessOrNone } from '../../lib/format'
import type { CtResult } from '../../physics/types'
import { BelowMinLeadNote, LeadSheetRow } from './LeadSheetRecommendation'
import { References } from './References'
import { ResultRow } from './ResultRow'
import { ResultsCard } from './ResultsCard'
import { ResultSection } from './ResultSection'

export function CtResults({ result }: { result: CtResult }): React.JSX.Element {
  return (
    <ResultsCard references={<References modality="ct" />}>
      <ResultSection title="CT Scanner Shielding Estimate">
        <ResultRow label="Design Goal (P)">{result.P} mGy/week</ResultRow>
        <ResultRow label="Occupancy Factor (T)">{result.occupancyFactor}</ResultRow>
        <ResultRow label="Distance to Barrier">{result.distance} m</ResultRow>
      </ResultSection>

      <ResultSection title="Workload Summary">
        <ResultRow label="Head Procedures/Week">{result.headProcedures}</ResultRow>
        <ResultRow label="Body Procedures/Week">{result.bodyProcedures}</ResultRow>
        <ResultRow label="Avg DLP (Head)">{result.headDLP} mGy·cm</ResultRow>
        <ResultRow label="Avg DLP (Body)">{result.bodyDLP} mGy·cm</ResultRow>
      </ResultSection>

      <ResultSection title="Physics Estimates">
        <ResultRow label="Total K¹_sec (all procedures)">
          {formatPrecision4(result.K1_total)} mGy/week at 1m
        </ResultRow>
        <ResultRow label={`Unshielded Air Kerma at ${result.distance}m`}>
          {formatPrecision4(result.airKermaAtDistance)} mGy/week
        </ResultRow>
        <ResultRow label="Required Transmission (B)">
          {result.B_required.toExponential(3)}
        </ResultRow>
      </ResultSection>

      <ResultSection title="Shielding Estimate">
        <ResultRow label="Estimated Thickness" highlight>
          {formatThicknessOrNone(result.thickness)}
        </ResultRow>
        <LeadSheetRow sheet={result.recommendedSheet} />
        <BelowMinLeadNote thickness={result.thickness} material={result.material} />
      </ResultSection>
    </ResultsCard>
  )
}
