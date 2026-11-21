import type { ReactNode } from 'react'

export function InfoBanner({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="warning-banner">
      <span aria-hidden="true">&#9432;</span>
      <span>{children}</span>
    </div>
  )
}
