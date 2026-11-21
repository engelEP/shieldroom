import type { SectionFieldsProps } from './CtFields'
import { FieldGroup } from './FieldGroup'
import { NumberField } from './NumberField'
import { CBCT_K1_PRESET_OPTIONS } from './options'
import { SelectField } from './SelectField'

export function CbctFields({ values, setField }: SectionFieldsProps): React.JSX.Element {
  return (
    <FieldGroup title="Dental CBCT-Specific Parameters">
      <SelectField
        id="cbctK1Preset"
        label="Scatter/leakage preset at 1 m"
        value={values.cbctK1Preset}
        options={CBCT_K1_PRESET_OPTIONS}
        onChange={(v) => setField('cbctK1Preset', v)}
        hint="Literature-supported preliminary planning range: approximately 0.0023 to 0.040 mGy/scan at 1 m. Larger FOV, higher exposure settings, and higher workload may require a more conservative value."
      />
      <NumberField
        id="cbctK1"
        label={
          <>
            Selected scatter/leakage air kerma per scan at 1 m (K<sup>1</sup>
            <sub>sec</sub>)
          </>
        }
        value={values.cbctK1}
        onChange={(v) => setField('cbctK1', v)}
        step={0.001}
        min={0}
        unit="mGy/scan at 1 m"
        hint="Preliminary planning value only. Replace with manufacturer, measured, or QMP-selected data when available."
      />
    </FieldGroup>
  )
}
