import { useCallback, useMemo, useReducer, useState } from 'react'
import type { ShieldingResult } from '../physics'
import {
  INITIAL_FORM_STATE,
  deriveFormView,
  formReducer,
  runCalculation,
  type FormField,
  type FormState,
  type FormView
} from './formState'

export interface ShieldingFormApi {
  values: FormState
  view: FormView
  result: ShieldingResult | null
  error: string | null
  setField: (field: FormField, value: string) => void
  submit: () => ShieldingResult | null
}

export function useShieldingForm(): ShieldingFormApi {
  const [values, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE)
  const [result, setResult] = useState<ShieldingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const view = useMemo(() => deriveFormView(values), [values])

  const setField = useCallback((field: FormField, value: string) => {
    dispatch({ type: 'set', field, value })
  }, [])

  const submit = useCallback((): ShieldingResult | null => {
    const outcome = runCalculation(values)
    if ('error' in outcome) {
      setError(outcome.error)
      return null
    }
    setError(null)
    setResult(outcome.result)
    return outcome.result
  }, [values])

  return { values, view, result, error, setField, submit }
}
