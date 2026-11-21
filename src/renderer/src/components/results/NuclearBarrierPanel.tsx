import type { ReactNode } from 'react'
import { formatThicknessOrNone } from '../../lib/format'
import type { LeadSheet } from '../../physics/types'
import { ComponentPanel } from './ComponentPanel'
import { LeadSheetRow } from './LeadSheetRecommendation'
import { ResultRow } from './ResultRow'

export interface NuclearBarrierPanelProps {
  title: string
  distance: number
  doseLabel: string
  dose: number
  doseUnit: string
  transmissionLabel: string
  transmission: number
  thickness: number
  sheet: LeadSheet | null
  /** Optional calculation method note shown at the bottom of the panel. */
  method?: ReactNode
}

/** Uptake or imaging room barrier for PET and SPECT results. */
export function NuclearBarrierPanel({
  title,
  distance,
  doseLabel,
  dose,
  doseUnit,
  transmissionLabel,
  transmission,
  thickness,
  sheet,
  method
}: NuclearBarrierPanelProps): React.JSX.Element {
  return (
    <ComponentPanel title={title}>
      <ResultRow label="Distance to Barrier">{distance} m</ResultRow>
      <ResultRow label={doseLabel}>
        {dose.toFixed(3)} {doseUnit}
      </ResultRow>
      <ResultRow label={transmissionLabel}>{transmission.toExponential(3)}</ResultRow>
      <ResultRow label="Estimated Thickness" highlight>
        {formatThicknessOrNone(thickness)}
      </ResultRow>
      <LeadSheetRow sheet={sheet} label="Standard Lead Sheet" />
      {method && (
        <ResultRow label="Method" muted separated>
          {method}
        </ResultRow>
      )}
    </ComponentPanel>
  )
}

/** Guidance for rooms that also contain a CT scanner. */
export function CtComponentNote({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ComponentPanel title="If this room also contains a CT scanner">
      <p className="panel-text">{children}</p>
      <p className="panel-text secondary">
        Use the <strong>CT Scanner</strong> modality in this tool to estimate the CT scatter
        component separately.
      </p>
    </ComponentPanel>
  )
}
