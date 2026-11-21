import type { ReactNode } from 'react'

export interface FormFieldProps {
  id: string
  label: ReactNode
  required?: boolean
  hint?: ReactNode
  hidden?: boolean
  children: ReactNode
}

export function FormField({
  id,
  label,
  required,
  hint,
  hidden,
  children
}: FormFieldProps): React.JSX.Element | null {
  if (hidden) return null
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      {children}
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  )
}
