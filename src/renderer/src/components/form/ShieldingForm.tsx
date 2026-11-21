import type { FormEvent } from 'react'
import type { ShieldingFormApi } from '../../hooks/useShieldingForm'
import { AdvancedOptions } from './AdvancedOptions'
import { CbctFields } from './CbctFields'
import { CtFields } from './CtFields'
import { NuclearFields } from './NuclearFields'
import { NumberField } from './NumberField'
import { NumberInput } from './NumberInput'
import {
  AREA_TYPE_OPTIONS,
  BARRIER_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  OCCUPANCY_OPTIONS,
  USE_FACTOR_OPTIONS
} from './options'
import { SelectField } from './SelectField'

export interface ShieldingFormProps {
  form: ShieldingFormApi
  onSubmit: () => void
}

export function ShieldingForm({ form, onSubmit }: ShieldingFormProps): React.JSX.Element {
  const { values, view, error, setField } = form

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <section className="card input-card">
      <h2 className="section-title">Shielding Parameters</h2>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <SelectField
          id="modality"
          label="Imaging Modality"
          required
          value={values.modality}
          placeholder="-- Select Modality --"
          options={MODALITY_OPTIONS}
          onChange={(v) => setField('modality', v)}
        />

        <SelectField
          id="areaType"
          label="Area Type"
          required
          value={values.areaType}
          options={AREA_TYPE_OPTIONS}
          onChange={(v) => setField('areaType', v)}
          hint="Per NCRP 147 Section 4.1.1. Controlled: occupied by radiation workers. Uncontrolled: accessible to general public."
        />

        <SelectField
          id="occupancyFactor"
          label="Occupancy Factor (T)"
          required
          value={values.occupancyFactor}
          options={OCCUPANCY_OPTIONS}
          onChange={(v) => setField('occupancyFactor', v)}
          hint="NCRP 147 Table 4.1"
        />

        <NumberField
          id="distance"
          label="Distance (d) to Barrier"
          value={values.distance}
          onChange={(v) => setField('distance', v)}
          step={0.1}
          unit="meters"
          required
          hidden={!view.showDistance}
        />

        <SelectField
          id="barrierType"
          label="Barrier Type"
          required
          value={values.barrierType}
          options={BARRIER_TYPE_OPTIONS}
          onChange={(v) => setField('barrierType', v)}
          disabled={view.barrierTypeLocked}
          hidden={!view.showBarrierType}
        />

        <SelectField
          id="useFactor"
          label="Use Factor (U)"
          required
          value={values.useFactor}
          options={USE_FACTOR_OPTIONS}
          onChange={(v) => setField('useFactor', v)}
          hint="Fraction of workload directed at this barrier (NCRP 147 Section 3.2.2)"
          hidden={!view.showUseFactor}
        >
          {view.showCustomUseFactor && (
            <div className="stacked-input">
              <NumberInput
                id="customUseFactor"
                value={values.customUseFactor}
                onChange={(v) => setField('customUseFactor', v)}
                step={0.01}
                min={0.01}
                max={1.0}
                placeholder="Enter U (0.01–1.0)"
                autoFocus
              />
            </div>
          )}
        </SelectField>

        <SelectField
          id="material"
          label="Shielding Material"
          required
          value={values.material}
          options={view.materialOptions}
          onChange={(v) => setField('material', v)}
        />

        <NumberField
          id="patientsPerWeek"
          label="Number of Patients/Procedures per Week (N)"
          value={values.patientsPerWeek}
          onChange={(v) => setField('patientsPerWeek', v)}
          step={1}
          unit="patients"
          required
        />

        {view.showCtFields && <CtFields values={values} setField={setField} />}
        {view.showCbctFields && <CbctFields values={values} setField={setField} />}
        {view.showNuclearFields && (
          <NuclearFields
            values={values}
            setField={setField}
            showSpectStudy={view.showSpectStudy}
            spectStudySource={view.spectStudySource}
          />
        )}

        <AdvancedOptions
          values={values}
          setField={setField}
          showXpre={view.showXpre}
          xpreHint={view.xpreHint}
        />

        <button type="submit" className="btn-primary">
          Estimate Shielding
        </button>
      </form>
    </section>
  )
}
