import { formatPrecision4, formatThickness, formatThicknessOrNone } from '../../lib/format'
import { getMaterialLabel, getModalityLabel } from '../../physics/data/labels'
import type { DiagnosticResult } from '../../physics/types'
import { ArcherParamsRow } from './ArcherParamsRow'
import { ComponentPanel } from './ComponentPanel'
import { InfoBanner } from './InfoBanner'
import { BelowMinLeadNote, LeadSheetRow } from './LeadSheetRecommendation'
import { References } from './References'
import { ResultRow } from './ResultRow'
import { ResultsCard } from './ResultsCard'
import { ResultSection } from './ResultSection'

export function DiagnosticResults({ result }: { result: DiagnosticResult }): React.JSX.Element {
  const isPrimary = result.barrierType === 'primary'

  return (
    <ResultsCard references={<References modality={result.modality} />}>
      <ResultSection title="Estimate Summary">
        <ResultRow label="Modality">{getModalityLabel(result.modality)}</ResultRow>
        <ResultRow label="Design Goal (P)">{result.P} mGy/week</ResultRow>
        <ResultRow label="Occupancy Factor (T)">{result.occupancyFactor}</ResultRow>
        <ResultRow label="Distance to Barrier">{result.distance} m</ResultRow>
        <ResultRow label="Patients/Procedures per Week (N)">{result.patientsPerWeek}</ResultRow>
        <ResultRow label="Barrier Type">
          {isPrimary ? 'Primary (Direct Beam)' : 'Secondary (Scatter/Leakage)'}
        </ResultRow>
        {isPrimary && <ResultRow label="Use Factor (U)">{result.U}</ResultRow>}
        <ResultRow label="Shielding Material">{getMaterialLabel(result.material)}</ResultRow>
      </ResultSection>

      <ResultSection title="Physics Estimates">
        <ResultRow label="K¹ (Workload Factor)">
          {result.K1.toExponential(3)} mGy/patient at 1m
        </ResultRow>
        <ResultRow label={`Unshielded Air Kerma at ${result.distance}m`}>
          {formatPrecision4(result.airKermaAtDistance)} mGy/week
        </ResultRow>
        <ResultRow label="Required Transmission (B)">
          {result.B_required.toExponential(3)}
        </ResultRow>
      </ResultSection>

      <ResultSection title="Shielding Estimate">
        {result.xpre > 0 ? (
          <>
            <ResultRow label="Total Barrier Requirement">
              {formatThickness(result.totalThickness)}
            </ResultRow>
            <ResultRow
              label={
                <>
                  Pre-shielding (x<sub>pre</sub>)
                </>
              }
            >
              − {result.xpre.toFixed(2)} mm Pb
            </ResultRow>
            <ResultRow label="Structural Barrier Required" highlight>
              {formatThicknessOrNone(result.thickness)}
            </ResultRow>
          </>
        ) : (
          <ResultRow label="Estimated Thickness" highlight>
            {formatThicknessOrNone(result.thickness)}
          </ResultRow>
        )}
        <LeadSheetRow sheet={result.recommendedSheet} />
        <BelowMinLeadNote thickness={result.thickness} material={result.material} />
        <ArcherParamsRow
          params={result.archerParams}
          materialLabel={result.material}
          rounded
          separated
        />
      </ResultSection>

      {result.modality === 'rf_room' && (
        <ComponentPanel title="R&F Room: Two-Tube Consideration">
          <p className="panel-text">
            This estimate accounts for the combined radiographic and fluoroscopic tube workloads.
            For the detailed two-tube breakdown per NCRP 147 Section 4.3.2, where secondary barrier
            contributions from each tube are calculated separately and summed, consult a QMP.
          </p>
        </ComponentPanel>
      )}

      {result.modality === 'dental_cbct' && (
        <ResultSection>
          <InfoBanner>
            Dental CBCT estimates are preliminary and use a simplified secondary-barrier model with
            a user-selected or custom scatter/leakage air kerma per scan at 1 m. Use manufacturer,
            measured, or QMP-selected data when available. Formal CBCT shielding plans should be
            reviewed and signed by a Qualified Medical Physicist using the actual equipment, room
            layout, workload, FOV/protocols, beam geometry, and adjacent occupancies.
          </InfoBanner>
        </ResultSection>
      )}
    </ResultsCard>
  )
}
