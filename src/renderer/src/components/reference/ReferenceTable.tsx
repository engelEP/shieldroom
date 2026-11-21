import type { ReactNode } from 'react'

export interface ReferenceTableProps {
  title: string
  headers: string[]
  rows: ReactNode[][]
}

export function ReferenceTable({ title, headers, rows }: ReferenceTableProps): React.JSX.Element {
  return (
    <>
      <h3 className="section-title">{title}</h3>
      <table className="reference-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rowIndex) => (
            <tr key={rowIndex}>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
