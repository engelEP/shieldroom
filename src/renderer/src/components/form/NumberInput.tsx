import type { ReactNode } from 'react'

export interface NumberInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  unit?: ReactNode
  step?: number | 'any'
  min?: number
  max?: number
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
}

/** Number input with an optional unit suffix. */
export function NumberInput({
  id,
  value,
  onChange,
  unit,
  ...inputProps
}: NumberInputProps): React.JSX.Element {
  const input = (
    <input
      type="number"
      className="form-control"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...inputProps}
    />
  )
  if (!unit) return input
  return (
    <div className="input-group">
      {input}
      <span className="input-group-text">{unit}</span>
    </div>
  )
}
