import { getMaterialLabel } from '../../physics/data/labels'
import { SPECT_EXAM_PRESETS } from '../../physics/data/spectPresets'
import type { SpectResult } from '../../physics/types'
import { NuclearArcherParams } from './ArcherParamsRow'
import { BelowMinLeadNoteForBarriers } from './LeadSheetRecommendation'
import { CtComponentNote, NuclearBarrierPanel } from './NuclearBarrierPanel'
import { SpectReferences } from './References'
import { ResultRow } from './ResultRow'
import { ResultsCard } from './ResultsCard'
import { ResultSection } from './ResultSection'

function MethodologyBadges({
  studyType
}: {
  studyType: SpectResult['studyType']
}): React.JSX.Element {
  const activitySource =
    studyType !== 'custom' ? SPECT_EXAM_PRESETS[studyType]?.source || 'SNMMI/EANM' : 'User-defined'
  return (
    <ResultSection title="Methodology Sources" className="methodology">
      <div className="badge-list">
        <span className="badge badge-primary">Tc-99m dose: Kusano &amp; Caldwell (2014)</span>
        <span className="badge badge-info">Tc-99m transmission: Oumano et al. (2025)</span>
        <span className="badge badge-success">Activity: {activitySource}</span>
        <span className="badge badge-neutral">CT component: NCRP 147 (2004)</span>
      </div>
    </ResultSection>
  )
}

export function SpectResults({ result }: { result: SpectResult }): React.JSX.Element {
  return (
    <ResultsCard references={<SpectReferences />}>
      <MethodologyBadges studyType={result.studyType} />

      <ResultSection title={`SPECT Shielding (Tc-99m): ${result.studyLabel}`}>
        <ResultRow label="Radiopharmaceutical">Tc-99m (140 keV)</ResultRow>
        <ResultRow label="Design Goal (P)">
          {result.P_mgy} mGy/week ({result.P_usv.toFixed(0)} µSv/week)
        </ResultRow>
        <ResultRow label="Occupancy Factor (T)">{result.occupancyFactor}</ResultRow>
        <ResultRow label="Patients per Week">{result.patientsPerWeek}</ResultRow>
      </ResultSection>

      <ResultSection title="Protocol Parameters">
        <ResultRow label="Administered Activity">
          {result.activity} MBq ({(result.activity / 37).toFixed(1)} mCi)
        </ResultRow>
        <ResultRow label="Post-Injection Wait / Uptake">{result.uptakeTime} min</ResultRow>
        <ResultRow label="SPECT Scan Time">{result.scanTime} min</ResultRow>
        <ResultRow label="Dose Rate Constant (in-patient)">{result.gamma} µSv·m²/(MBq·h)</ResultRow>
        <ResultRow label="Half-Life">{result.halfLife.toFixed(3)} hours</ResultRow>
      </ResultSection>

      <NuclearBarrierPanel
        title="Uptake / Waiting Room (Tc-99m)"
        distance={result.distUptake}
        doseLabel="Unshielded Weekly Dose"
        dose={result.dose_uptake}
        doseUnit="µSv/week"
        transmissionLabel="Required Transmission (B)"
        transmission={result.B_uptake}
        thickness={result.thicknessUptake}
        sheet={result.recommendedSheetUptake}
        method={`${result.calcMethod}, no voiding factor applied`}
      />

      <NuclearBarrierPanel
        title="Scanner / Imaging Room (Tc-99m)"
        distance={result.distImaging}
        doseLabel="Unshielded Weekly Dose"
        dose={result.dose_imaging}
        doseUnit="µSv/week"
        transmissionLabel="Required Transmission (B)"
        transmission={result.B_imaging}
        thickness={result.thicknessImaging}
        sheet={result.recommendedSheetImaging}
        method={
          <>
            {result.calcMethod}, activity decayed by e
            <sup>
              −λt<sub>u</sub>
            </sup>
            , no voiding factor
          </>
        }
      />

      {result.archerParamsUsed && (
        <NuclearArcherParams
          params={result.archerParamsUsed}
          materialLabel={getMaterialLabel(result.material)}
        />
      )}

      <CtComponentNote>
        For a shared SPECT/CT imaging-room barrier, calculate the CT scatter contribution and the
        Tc-99m contribution at the barrier in the same quantity and time basis, then determine a
        single barrier thickness such that the sum of the transmitted CT and transmitted Tc-99m
        contributions is less than or equal to the design goal. The barrier must account for both
        Tc-99m 140 keV photons and the polyenergetic CT scatter field from 120-kVp operation.
      </CtComponentNote>

      <BelowMinLeadNoteForBarriers
        thicknesses={[result.thicknessUptake, result.thicknessImaging]}
        material={result.material}
      />
    </ResultsCard>
  )
}
