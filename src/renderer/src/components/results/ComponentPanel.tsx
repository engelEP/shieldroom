import type { ReactNode } from 'react'

export interface ComponentPanelProps {
  title: ReactNode
  children: ReactNode
}

/** Highlighted panel for a sub-component of the estimate (a room, a note). */
export function ComponentPanel({ title, children }: ComponentPanelProps): React.JSX.Element {
  return (
    <div className="results-section">
      <div className="component-panel">
        <div className="component-panel-title">{title}</div>
        {children}
      </div>
    </div>
  )
}
