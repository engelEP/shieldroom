import { formatLeadSheet } from '../../lib/format'
import { MIN_LEAD_SHEET_MM } from '../../physics/data/leadSheets'
import type { LeadSheet } from '../../physics/types'
import { InfoBanner } from './InfoBanner'
import { ResultRow } from './ResultRow'

export interface LeadSheetRowProps {
  sheet: LeadSheet | null
  label?: string
}

export function LeadSheetRow({
  sheet,
  label = 'Standard Lead Sheet Size'
}: LeadSheetRowProps): React.JSX.Element | null {
  if (!sheet) return null
  return (
    <ResultRow label={label} highlight>
      {formatLeadSheet(sheet)}
    </ResultRow>
  )
}

export interface BelowMinLeadNoteProps {
  thickness: number
  material: string
}

/** Shown when a lead requirement is thinner than the thinnest commercial sheet. */
export function BelowMinLeadNote({
  thickness,
  material
}: BelowMinLeadNoteProps): React.JSX.Element | null {
  if (material !== 'lead' || !(thickness > 0 && thickness < MIN_LEAD_SHEET_MM)) return null
  return (
    <InfoBanner>
      Computed lead-equivalent requirement ({thickness.toFixed(2)} mm) is below the thinnest
      standard commercial lead sheet (1/64&quot;, 0.40 mm). Site-specific evaluation may show no
      added lead is required beyond standard construction.
    </InfoBanner>
  )
}

/** Below-minimum note for the thinnest non-zero thickness among several barriers. */
export function BelowMinLeadNoteForBarriers({
  thicknesses,
  material
}: {
  thicknesses: number[]
  material: string
}): React.JSX.Element | null {
  if (material !== 'lead') return null
  const minT = Math.min(...thicknesses.map((t) => (t > 0 ? t : Infinity)))
  return <BelowMinLeadNote thickness={minT} material={material} />
}
