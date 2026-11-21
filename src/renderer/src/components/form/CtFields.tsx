import type { FormField, FormState } from '../../hooks/formState'
import { FieldGroup } from './FieldGroup'
import { NumberField } from './NumberField'

export interface SectionFieldsProps {
  values: FormState
  setField: (field: FormField, value: string) => void
}

export function CtFields({ values, setField }: SectionFieldsProps): React.JSX.Element {
  return (
    <FieldGroup title="CT-Specific Parameters">
      <NumberField
        id="ctHeadProcedures"
        label="Head Procedures per Week"
        value={values.ctHeadProcedures}
        onChange={(v) => setField('ctHeadProcedures', v)}
        step={1}
        min={0}
      />
      <NumberField
        id="ctBodyProcedures"
        label="Body Procedures per Week"
        value={values.ctBodyProcedures}
        onChange={(v) => setField('ctBodyProcedures', v)}
        step={1}
        min={0}
      />
      <NumberField
        id="ctHeadDLP"
        label="Average DLP per Head Procedure"
        value={values.ctHeadDLP}
        onChange={(v) => setField('ctHeadDLP', v)}
        step={10}
        min={0}
        unit="mGy·cm"
      />
      <NumberField
        id="ctBodyDLP"
        label="Average DLP per Body Procedure"
        value={values.ctBodyDLP}
        onChange={(v) => setField('ctBodyDLP', v)}
        step={10}
        min={0}
        unit="mGy·cm"
      />
    </FieldGroup>
  )
}
