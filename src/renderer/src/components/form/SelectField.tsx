import type { ReactNode } from 'react'
import { FormField } from './FormField'

export interface SelectOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SelectFieldProps<T extends string> {
  id: string
  label: ReactNode
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: ReactNode
  hidden?: boolean
  children?: ReactNode
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
  disabled,
  hint,
  hidden,
  children
}: SelectFieldProps<T>): React.JSX.Element | null {
  return (
    <FormField id={id} label={label} required={required} hint={hint} hidden={hidden}>
      <select
        className="form-select"
        id={id}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {children}
    </FormField>
  )
}
