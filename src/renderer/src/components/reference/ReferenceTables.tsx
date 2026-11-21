import { LEAD_SHEET_USES, LEAD_SHEETS } from '../../physics/data/leadSheets'
import { ReferenceTable } from './ReferenceTable'

const OCCUPANCY_ROWS: [string, string][] = [
  [
    '1.0',
    'Office, laboratory, pharmacy, reception area, adjacent exam room, sitting/standing patient position'
  ],
  ['1/2', 'Nurse station, staff lounge, reception area (pass-through)'],
  ['1/5', 'Staff rest room, vending area'],
  ['1/8', 'Corridor door, hallway'],
  ['1/20', 'Parking lot (attended), street, unattended lot'],
  ['1/40', 'Outdoor area, stairway, elevator, unattended restroom']
]

export function ReferenceTables(): React.JSX.Element {
  return (
    <section className="card input-card reference-card">
      <ReferenceTable
        title="Reference: NCRP 147 Design Goals"
        headers={['Area Type', 'Design Goal (P)', 'Description']}
        rows={[
          ['Controlled', '0.1 mGy/week', 'Occupied by radiation workers'],
          ['Uncontrolled', '0.02 mGy/week', 'Accessible to general public']
        ]}
      />
      <ReferenceTable
        title="Occupancy Factors (T), NCRP 147 Table 4.1"
        headers={['Factor', 'Location']}
        rows={OCCUPANCY_ROWS.map(([factor, location]) => [
          <strong key="f">{factor}</strong>,
          location
        ])}
      />
      <ReferenceTable
        title="Lead Sheet Dimensions (US Standard)"
        headers={['Fraction', 'Millimeters', 'Common Use']}
        rows={LEAD_SHEETS.map((sheet) => [
          `${sheet.fraction}"`,
          `${sheet.mm.toFixed(2)} mm`,
          LEAD_SHEET_USES[sheet.fraction]
        ])}
      />
    </section>
  )
}
