import { useState } from 'react'
import type { SectionFieldsProps } from './CtFields'
import { NumberField } from './NumberField'

export interface AdvancedOptionsProps extends SectionFieldsProps {
  showXpre: boolean
  xpreHint: string
}

export function AdvancedOptions({
  values,
  setField,
  showXpre,
  xpreHint
}: AdvancedOptionsProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <div className="advanced-options">
      <button
        type="button"
        className="advanced-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        + Advanced Options
      </button>
      {open && (
        <div className="advanced-section">
          <NumberField
            id="customP"
            label="Custom Design Goal (P)"
            value={values.customP}
            onChange={(v) => setField('customP', v)}
            step={0.01}
            placeholder="Leave blank to use area type"
            unit="mGy/week"
            hint="Override the standard design goal for this calculation."
          />
          <NumberField
            id="xpre"
            label={
              <>
                Pre-shielding (x<sub>pre</sub>)
              </>
            }
            value={values.xpre}
            onChange={(v) => setField('xpre', v)}
            step={0.01}
            min={0}
            placeholder="0"
            unit="mm Pb"
            hint={xpreHint}
            hidden={!showXpre}
          />
        </div>
      )}
    </div>
  )
}
