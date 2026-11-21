import type { ReactNode } from 'react'
import { FormField } from './FormField'
import { NumberInput, type NumberInputProps } from './NumberInput'

export interface NumberFieldProps extends NumberInputProps {
  label: ReactNode
  hint?: ReactNode
  hidden?: boolean
}

export function NumberField({
  label,
  hint,
  hidden,
  ...inputProps
}: NumberFieldProps): React.JSX.Element | null {
  return (
    <FormField
      id={inputProps.id}
      label={label}
      hint={hint}
      hidden={hidden}
      required={inputProps.required}
    >
      <NumberInput {...inputProps} />
    </FormField>
  )
}
