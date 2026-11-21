import type { ReactNode } from 'react'
import { CallToAction } from './CallToAction'

export interface ResultsCardProps {
  children: ReactNode
  /** Reference list rendered after the call to action. */
  references: ReactNode
}

export function ResultsCard({ children, references }: ResultsCardProps): React.JSX.Element {
  return (
    <div className="card results-card">
      {children}
      <CallToAction />
      {references}
    </div>
  )
}
