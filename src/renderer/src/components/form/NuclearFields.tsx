import type { SectionFieldsProps } from './CtFields'
import { FieldGroup } from './FieldGroup'
import { NumberField } from './NumberField'
import { SPECT_STUDY_OPTIONS } from './options'
import { SelectField } from './SelectField'

export interface NuclearFieldsProps extends SectionFieldsProps {
  showSpectStudy: boolean
  spectStudySource: string
}

export function NuclearFields({
  values,
  setField,
  showSpectStudy,
  spectStudySource
}: NuclearFieldsProps): React.JSX.Element {
  return (
    <FieldGroup title="Nuclear Medicine Parameters">
      <SelectField
        id="spectStudyType"
        label="SPECT Study Type"
        value={values.spectStudyType}
        options={SPECT_STUDY_OPTIONS}
        onChange={(v) => setField('spectStudyType', v)}
        hint={spectStudySource}
        hidden={!showSpectStudy}
      />
      <NumberField
        id="petActivity"
        label="Administered Activity"
        value={values.petActivity}
        onChange={(v) => setField('petActivity', v)}
        step="any"
        min={0}
        unit="MBq"
      />
      <NumberField
        id="petUptakeTime"
        label="Uptake Time"
        value={values.petUptakeTime}
        onChange={(v) => setField('petUptakeTime', v)}
        step={5}
        min={0}
        unit="minutes"
      />
      <NumberField
        id="petScanTime"
        label="Scan/Imaging Time"
        value={values.petScanTime}
        onChange={(v) => setField('petScanTime', v)}
        step={5}
        min={0}
        unit="minutes"
      />
      <NumberField
        id="petUptakeRoomDist"
        label="Distance to Uptake Room Barrier"
        value={values.petUptakeRoomDist}
        onChange={(v) => setField('petUptakeRoomDist', v)}
        step={0.5}
        min={0}
        unit="meters"
      />
      <NumberField
        id="petImagingRoomDist"
        label="Distance to Imaging Room Barrier"
        value={values.petImagingRoomDist}
        onChange={(v) => setField('petImagingRoomDist', v)}
        step={0.5}
        min={0}
        unit="meters"
      />
    </FieldGroup>
  )
}
