import type { ReactNode } from 'react'

export interface FieldGroupProps {
  title: string
  children: ReactNode
}

/** Titled block of modality-specific fields. */
export function FieldGroup({ title, children }: FieldGroupProps): React.JSX.Element {
  return (
    <fieldset className="field-group">
      <legend className="field-group-title">{title}</legend>
      {children}
    </fieldset>
  )
}
