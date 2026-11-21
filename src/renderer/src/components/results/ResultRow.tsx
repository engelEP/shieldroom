import type { ReactNode } from 'react'

export interface ResultRowProps {
  label: ReactNode
  children: ReactNode
  /** Emphasizes the value (thicknesses, lead sheets). */
  highlight?: boolean
  /** Smaller, muted styling for metadata such as fit parameters and sources. */
  muted?: boolean
  /** Adds a divider above the row. */
  separated?: boolean
}

export function ResultRow({
  label,
  children,
  highlight,
  muted,
  separated
}: ResultRowProps): React.JSX.Element {
  const rowClass = ['result-row', muted && 'muted', separated && 'separated']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={rowClass}>
      <span className="result-label">{label}</span>
      <span className={highlight ? 'result-value highlight' : 'result-value'}>{children}</span>
    </div>
  )
}
