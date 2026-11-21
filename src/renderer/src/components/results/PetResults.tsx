import { getMaterialLabel } from '../../physics/data/labels'
import type { PetResult } from '../../physics/types'
import { NuclearArcherParams } from './ArcherParamsRow'
import { BelowMinLeadNoteForBarriers } from './LeadSheetRecommendation'
import { CtComponentNote, NuclearBarrierPanel } from './NuclearBarrierPanel'
import { References } from './References'
import { ResultRow } from './ResultRow'
import { ResultsCard } from './ResultsCard'
import { ResultSection } from './ResultSection'

export function PetResults({ result }: { result: PetResult }): React.JSX.Element {
  return (
    <ResultsCard references={<References modality={result.modality} />}>
      <ResultSection title="PET Shielding Estimate (F-18)">
        <ResultRow label="Radiopharmaceutical">F-18 (511 keV)</ResultRow>
        <ResultRow label="Design Goal (P)">
          {result.P_mgy} mGy/week ({result.P_usv.toFixed(0)} μSv/week)
        </ResultRow>
        <ResultRow label="Occupancy Factor (T)">{result.occupancyFactor}</ResultRow>
      </ResultSection>

      <ResultSection title="Injection & Imaging Parameters">
        <ResultRow label="Administered Activity">{result.activity} MBq</ResultRow>
        <ResultRow label="Uptake Time">{result.uptakeTime} min</ResultRow>
        <ResultRow label="Scan/Imaging Time">{result.scanTime} min</ResultRow>
        <ResultRow label="Isotope Half-Life">{result.halfLife.toFixed(2)} hours</ResultRow>
      </ResultSection>

      <NuclearBarrierPanel
        title="Uptake Room Shielding"
        distance={result.distUptake}
        doseLabel="Unshielded Dose Rate"
        dose={result.dose_uptake}
        doseUnit="μSv/week"
        transmissionLabel="Required Transmission"
        transmission={result.B_uptake}
        thickness={result.thicknessUptake}
        sheet={result.recommendedSheetUptake}
      />

      <NuclearBarrierPanel
        title="Imaging Room Shielding (511 keV - F-18 component)"
        distance={result.distImaging}
        doseLabel="Unshielded Dose Rate (with 0.85 voiding)"
        dose={result.dose_imaging_raw}
        doseUnit="μSv/week"
        transmissionLabel="Required Transmission"
        transmission={result.B_imaging}
        thickness={result.thicknessImaging}
        sheet={result.recommendedSheetImaging}
      />

      <NuclearArcherParams
        params={result.archerParamsUsed}
        materialLabel={getMaterialLabel(result.material)}
      />

      <CtComponentNote>
        For a shared PET/CT barrier, calculate the PET 511 keV contribution and the CT scatter
        contribution at the barrier in the same quantity and time basis, then determine a single
        barrier thickness such that the sum of the transmitted PET and CT contributions is less than
        or equal to the design goal. The barrier must account for both 511 keV annihilation photons
        and the polyenergetic CT scatter field from 120-kVp operation.
      </CtComponentNote>

      <BelowMinLeadNoteForBarriers
        thicknesses={[result.thicknessUptake, result.thicknessImaging]}
        material={result.material}
      />
    </ResultsCard>
  )
}
