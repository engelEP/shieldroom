import type { LeadSheet } from '../physics/types'

export function formatThickness(mm: number): string {
  if (isNaN(mm) || mm < 0) return '0.00 mm (0.00")'
  const inches = mm / 25.4
  return `${mm.toFixed(2)} mm (${inches.toFixed(3)}")`
}

export function formatThicknessOrNone(thickness: number | null | undefined): string {
  if (thickness === 0 || thickness === null || thickness === undefined) {
    return 'No shielding required'
  }
  return formatThickness(thickness)
}

export function formatLeadSheet(sheet: LeadSheet | null): string {
  if (!sheet) return 'N/A'
  return `${sheet.fraction}" (${sheet.mm.toFixed(2)} mm)`
}

/** Four significant digits without trailing zeros. */
export function formatPrecision4(value: number): string {
  return String(parseFloat(value.toPrecision(4)))
}
