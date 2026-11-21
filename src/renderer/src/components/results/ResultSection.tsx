import type { ReactNode } from 'react'

export interface ResultSectionProps {
  title?: ReactNode
  className?: string
  children: ReactNode
}

export function ResultSection({
  title,
  className,
  children
}: ResultSectionProps): React.JSX.Element {
  return (
    <div className={className ? `results-section ${className}` : 'results-section'}>
      {title && <div className="results-title">{title}</div>}
      {children}
    </div>
  )
}
