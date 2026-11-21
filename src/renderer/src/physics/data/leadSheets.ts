import type { LeadSheet } from '../types'

/** US standard lead sheet sizes, thinnest first. */
export const LEAD_SHEETS: readonly LeadSheet[] = [
  { fraction: '1/64', mm: 0.4, inches: 0.015625 },
  { fraction: '1/32', mm: 0.79, inches: 0.03125 },
  { fraction: '1/16', mm: 1.58, inches: 0.0625 },
  { fraction: '3/32', mm: 2.38, inches: 0.09375 },
  { fraction: '1/8', mm: 3.18, inches: 0.125 },
  { fraction: '5/32', mm: 3.97, inches: 0.15625 },
  { fraction: '3/16', mm: 4.76, inches: 0.1875 },
  { fraction: '1/4', mm: 6.35, inches: 0.25 }
]

/** Common use of each lead sheet size, shown in the reference table. */
export const LEAD_SHEET_USES: Readonly<Record<string, string>> = {
  '1/64': 'Very light shielding',
  '1/32': 'Light dental, chest barriers',
  '1/16': 'Secondary barriers',
  '3/32': 'Secondary/primary radiography',
  '1/8': 'Primary radiography',
  '5/32': 'Heavy primary barriers',
  '3/16': 'Fluoroscopy, angiography',
  '1/4': 'High-workload fluoroscopy'
}

/** Thinnest standard commercial lead sheet (mm). */
export const MIN_LEAD_SHEET_MM = 0.4
