import { afterEach, describe, expect, it } from 'vitest'
import {
  INITIAL_FORM_STATE,
  deriveFormView,
  formReducer,
  runCalculation,
  type FormField,
  type FormState
} from '../src/renderer/src/hooks/formState'
import { archerThickness, archerTransmission, calculateTVL1TVLe } from '../src/renderer/src/physics'
import {
  PRIMARY_ARCHER_CONCRETE,
  PRIMARY_ARCHER_LEAD
} from '../src/renderer/src/physics/data/archerPrimary'
import { CT_ARCHER_CONCRETE, CT_ARCHER_LEAD } from '../src/renderer/src/physics/data/archerCt'
import {
  SEC_ARCHER_CONCRETE,
  SEC_ARCHER_GYPSUM,
  SEC_ARCHER_LEAD,
  SEC_ARCHER_STEEL
} from '../src/renderer/src/physics/data/archerSecondary'
import { DEFAULT_PATIENTS, K1_P, K1_SEC } from '../src/renderer/src/physics/data/k1'
import { LEAD_SHEETS } from '../src/renderer/src/physics/data/leadSheets'
import {
  GAMMA_F18,
  HALF_LIFE_F18,
  PET_TVL_CONCRETE,
  PET_TVL_LEAD,
  RADIONUCLIDE_DATA
} from '../src/renderer/src/physics/data/radionuclides'
import { SPECT_EXAM_PRESETS } from '../src/renderer/src/physics/data/spectPresets'
import { MATERIAL_LABELS, MODALITY_LABELS } from '../src/renderer/src/physics/data/labels'
import { loadLegacyApp, toPlain, type LegacyApp } from './legacyHarness'

const FIELDS = Object.keys(INITIAL_FORM_STATE) as FormField[]

type Step = [FormField, string]

interface ParityCase {
  name: string
  steps: Step[]
}

const MATERIALS = ['lead', 'concrete', 'steel', 'gypsum']
const AREAS = ['controlled', 'uncontrolled']
const DIAGNOSTIC_MODALITIES = [
  'rad_room',
  'chest_room',
  'rf_room',
  'cardiac_angio',
  'periph_angio',
  'mammo',
  'dental_intra',
  'dental_pano',
  'dental_cbct',
  'carm'
]
const PRIMARY_CAPABLE = ['rad_room', 'chest_room', 'rf_room', 'dental_intra', 'dental_pano']
const USE_FACTORS = ['1.0', '0.25', '0.11', '0.09', 'custom']
const SPECT_STUDIES = ['bone', 'cardiac', 'renal', 'hida', 'parathyroid', 'custom']
const CBCT_PRESETS = ['0.005', '0.010', '0.020', '0.040']

function buildCases(): ParityCase[] {
  const cases: ParityCase[] = [{ name: 'no modality selected', steps: [] }]

  for (const modality of DIAGNOSTIC_MODALITIES) {
    for (const material of MATERIALS) {
      for (const area of AREAS) {
        cases.push({
          name: `${modality} secondary ${material} ${area}`,
          steps: [
            ['modality', modality],
            ['material', material],
            ['areaType', area]
          ]
        })
      }
    }
  }

  for (const modality of PRIMARY_CAPABLE) {
    for (const material of MATERIALS) {
      for (const useFactor of USE_FACTORS) {
        const steps: Step[] = [
          ['modality', modality],
          ['barrierType', 'primary'],
          ['useFactor', useFactor],
          ['material', material]
        ]
        if (useFactor === 'custom') steps.push(['customUseFactor', '0.5'])
        cases.push({ name: `${modality} primary ${material} U=${useFactor}`, steps })
      }
    }
  }

  cases.push(
    {
      name: 'custom use factor left empty',
      steps: [
        ['modality', 'rad_room'],
        ['barrierType', 'primary'],
        ['useFactor', 'custom']
      ]
    },
    {
      name: 'chest room primary with custom xpre',
      steps: [
        ['modality', 'chest_room'],
        ['barrierType', 'primary'],
        ['xpre', '2']
      ]
    },
    {
      name: 'rad room primary with xpre',
      steps: [
        ['modality', 'rad_room'],
        ['barrierType', 'primary'],
        ['xpre', '0.5']
      ]
    },
    {
      name: 'rf room primary with empty xpre',
      steps: [
        ['modality', 'rf_room'],
        ['barrierType', 'primary'],
        ['xpre', '']
      ]
    },
    {
      name: 'xpre larger than required thickness',
      steps: [
        ['modality', 'chest_room'],
        ['barrierType', 'primary'],
        ['xpre', '10']
      ]
    },
    {
      name: 'custom geometry, occupancy and design goal',
      steps: [
        ['modality', 'rad_room'],
        ['distance', '1.5'],
        ['occupancyFactor', '0.025'],
        ['patientsPerWeek', '500'],
        ['customP', '0.05']
      ]
    },
    {
      name: 'non-positive custom P is ignored',
      steps: [
        ['modality', 'mammo'],
        ['customP', '-1']
      ]
    },
    {
      name: 'far barrier needs no shielding',
      steps: [
        ['modality', 'rad_room'],
        ['distance', '50']
      ]
    },
    {
      name: 'empty patients per week',
      steps: [
        ['modality', 'rad_room'],
        ['patientsPerWeek', '']
      ]
    },
    {
      name: 'thin dental lead below thinnest sheet',
      steps: [
        ['modality', 'dental_intra'],
        ['distance', '1'],
        ['areaType', 'uncontrolled']
      ]
    },
    {
      name: 'heavy angiography workload beyond thickest sheet',
      steps: [
        ['modality', 'cardiac_angio'],
        ['distance', '0.5'],
        ['patientsPerWeek', '500'],
        ['areaType', 'uncontrolled']
      ]
    },
    {
      name: 'switching from chest primary to rad room resets barrier type',
      steps: [
        ['modality', 'chest_room'],
        ['barrierType', 'primary'],
        ['modality', 'rad_room']
      ]
    },
    {
      name: 'switching from CT to general room re-enables materials',
      steps: [
        ['modality', 'ct'],
        ['modality', 'rad_room'],
        ['material', 'gypsum']
      ]
    }
  )

  for (const material of MATERIALS) {
    for (const area of AREAS) {
      cases.push({
        name: `ct ${material} ${area}`,
        steps: [
          ['modality', 'ct'],
          ['material', material],
          ['areaType', area]
        ]
      })
    }
  }
  cases.push(
    {
      name: 'ct custom workload',
      steps: [
        ['modality', 'ct'],
        ['ctHeadProcedures', '45'],
        ['ctBodyProcedures', '220'],
        ['ctHeadDLP', '950'],
        ['ctBodyDLP', '700'],
        ['distance', '2.2'],
        ['occupancyFactor', '0.2'],
        ['material', 'concrete']
      ]
    },
    {
      name: 'ct zero and empty fields fall back to defaults',
      steps: [
        ['modality', 'ct'],
        ['ctHeadProcedures', '0'],
        ['ctBodyDLP', '']
      ]
    },
    {
      name: 'ct gypsum selected before switching modality falls back to lead',
      steps: [
        ['material', 'gypsum'],
        ['modality', 'ct']
      ]
    }
  )

  for (const preset of CBCT_PRESETS) {
    for (const material of ['lead', 'concrete']) {
      cases.push({
        name: `dental cbct preset ${preset} ${material}`,
        steps: [
          ['modality', 'dental_cbct'],
          ['cbctK1Preset', preset],
          ['material', material]
        ]
      })
    }
  }
  cases.push(
    {
      name: 'dental cbct custom K1',
      steps: [
        ['modality', 'dental_cbct'],
        ['cbctK1Preset', 'custom'],
        ['cbctK1', '0.0023']
      ]
    },
    {
      name: 'dental cbct custom K1 left empty',
      steps: [
        ['modality', 'dental_cbct'],
        ['cbctK1Preset', 'custom'],
        ['cbctK1', '']
      ]
    },
    {
      name: 'dental cbct preset re-applied after switching modality',
      steps: [
        ['modality', 'dental_cbct'],
        ['cbctK1Preset', '0.010'],
        ['cbctK1', '0.033'],
        ['modality', 'rad_room'],
        ['modality', 'dental_cbct']
      ]
    }
  )

  for (const material of MATERIALS) {
    for (const area of AREAS) {
      cases.push({
        name: `pet ${material} ${area}`,
        steps: [
          ['modality', 'petct'],
          ['material', material],
          ['areaType', area]
        ]
      })
    }
  }
  cases.push(
    {
      name: 'pet custom protocol',
      steps: [
        ['modality', 'petct'],
        ['petActivity', '370'],
        ['petUptakeTime', '45'],
        ['petScanTime', '20'],
        ['petUptakeRoomDist', '2.5'],
        ['petImagingRoomDist', '6'],
        ['patientsPerWeek', '60'],
        ['occupancyFactor', '0.5'],
        ['material', 'steel']
      ]
    },
    {
      name: 'pet empty fields fall back to defaults',
      steps: [
        ['modality', 'petct'],
        ['petActivity', ''],
        ['petUptakeTime', ''],
        ['petScanTime', ''],
        ['petUptakeRoomDist', ''],
        ['petImagingRoomDist', ''],
        ['patientsPerWeek', '']
      ]
    },
    {
      name: 'pet far barriers need no shielding',
      steps: [
        ['modality', 'petct'],
        ['petUptakeRoomDist', '200'],
        ['petImagingRoomDist', '200'],
        ['occupancyFactor', '0.025']
      ]
    },
    {
      name: 'pet after spect keeps spect protocol values',
      steps: [
        ['modality', 'spectct'],
        ['spectStudyType', 'cardiac'],
        ['modality', 'petct']
      ]
    }
  )

  for (const study of SPECT_STUDIES) {
    for (const material of MATERIALS) {
      cases.push({
        name: `spect ${study} ${material}`,
        steps: [
          ['modality', 'spectct'],
          ['spectStudyType', study],
          ['material', material]
        ]
      })
    }
  }
  cases.push(
    {
      name: 'spect custom protocol edited',
      steps: [
        ['modality', 'spectct'],
        ['spectStudyType', 'custom'],
        ['petActivity', '1110'],
        ['petUptakeTime', '10'],
        ['petScanTime', '45'],
        ['petUptakeRoomDist', '1.5'],
        ['petImagingRoomDist', '2'],
        ['areaType', 'uncontrolled'],
        ['customP', '0.01']
      ]
    },
    {
      name: 'spect empty fields fall back to defaults',
      steps: [
        ['modality', 'spectct'],
        ['petActivity', ''],
        ['petUptakeRoomDist', ''],
        ['patientsPerWeek', '']
      ]
    }
  )

  return cases
}

/** Legacy visibility that the derived view must reproduce. */
function comparableView(state: FormState): Record<string, unknown> {
  const view = deriveFormView(state)
  return {
    showDistance: view.showDistance,
    showBarrierType: view.showBarrierType,
    barrierTypeLocked: view.barrierTypeLocked,
    showCustomUseFactor: view.showCustomUseFactor,
    showCtFields: view.showCtFields,
    showCbctFields: view.showCbctFields,
    showNuclearFields: view.showNuclearFields,
    showSpectStudy: view.showSpectStudy,
    showXpre: view.showXpre,
    xpreHint: view.showXpre ? view.xpreHint : undefined,
    spectStudySource: view.showSpectStudy ? view.spectStudySource : undefined,
    materialOptions: view.materialOptions
  }
}

function legacyComparableView(legacy: LegacyApp): Record<string, unknown> {
  const v = legacy.visibility()
  return {
    ...v,
    xpreHint: v.showXpre ? v.xpreHint : undefined,
    spectStudySource: v.showSpectStudy ? v.spectStudySource : undefined
  }
}

let legacy: LegacyApp | null = null

afterEach(() => {
  legacy?.close()
  legacy = null
})

describe('data tables match the reference implementation', () => {
  it('copies every constant table verbatim', () => {
    legacy = loadLegacyApp(FIELDS)
    const tables: Record<string, unknown> = {
      K1_SEC,
      K1_P,
      SEC_ARCHER_LEAD,
      SEC_ARCHER_CONCRETE,
      SEC_ARCHER_STEEL,
      SEC_ARCHER_GYPSUM,
      PRIMARY_ARCHER_LEAD,
      PRIMARY_ARCHER_CONCRETE,
      CT_ARCHER_LEAD,
      CT_ARCHER_CONCRETE,
      PET_TVL_LEAD,
      PET_TVL_CONCRETE,
      GAMMA_F18,
      HALF_LIFE_F18,
      RADIONUCLIDE_DATA,
      LEAD_SHEETS,
      SPECT_EXAM_PRESETS,
      DEFAULT_PATIENTS
    }
    for (const [name, value] of Object.entries(tables)) {
      expect(toPlain(value), name).toEqual(legacy.evaluate(`calculator.${name}`))
    }
  })

  it('uses the same modality and material labels', () => {
    legacy = loadLegacyApp(FIELDS)
    for (const [id, label] of Object.entries(MODALITY_LABELS)) {
      expect(label).toBe(legacy.evaluate(`calculator.getModalityLabel(${JSON.stringify(id)})`))
    }
    for (const [id, label] of Object.entries(MATERIAL_LABELS)) {
      expect(label).toBe(legacy.evaluate(`calculator.getMaterialLabel(${JSON.stringify(id)})`))
    }
  })
})

describe('math helpers match the reference implementation', () => {
  it('archer transmission and thickness agree across materials and inputs', () => {
    legacy = loadLegacyApp(FIELDS)
    const paramSets = [
      SEC_ARCHER_LEAD.rad_room_all,
      SEC_ARCHER_STEEL.chest_room,
      PRIMARY_ARCHER_CONCRETE.rad_room_floor,
      CT_ARCHER_LEAD,
      RADIONUCLIDE_DATA['F-18'].archerParams.nw_concrete!,
      RADIONUCLIDE_DATA['Tc-99m'].archerParams.lead!,
      RADIONUCLIDE_DATA['Tc-99m'].archerParams.steel!
    ]
    const thicknesses = [0, 0.1, 0.5, 1, 2.5, 10, 100, 1000]
    const transmissions = [1.5, 1, 0.9, 0.5, 0.1, 1e-3, 1e-6, 1e-12, 0, -1]

    for (const params of paramSets) {
      const p = JSON.stringify(params)
      for (const x of thicknesses) {
        expect(archerTransmission(x, params)).toBe(
          legacy.evaluate(`calculator.archerTransmission(${x}, ${p})`)
        )
      }
      for (const B of transmissions) {
        expect(archerThickness(B, params)).toBe(
          legacy.evaluate(`calculator.archerThickness(${B}, ${p})`)
        )
      }
    }

    for (const B of transmissions) {
      expect(calculateTVL1TVLe(B, 17, 15)).toBe(
        legacy.evaluate(`calculator.calculateTVL1TVLe(${B}, 17, 15)`)
      )
    }
  })
})

describe('form behaviour and results match the reference implementation', () => {
  const cases = buildCases()

  it.each(cases.map((c) => [c.name, c] as const))('%s', (_name, testCase) => {
    legacy = loadLegacyApp(FIELDS)
    let state: FormState = INITIAL_FORM_STATE

    expect(state).toEqual(legacy.readForm())

    for (const [field, value] of testCase.steps) {
      legacy.set(field, value)
      state = formReducer(state, { type: 'set', field, value })
    }

    expect(state).toEqual(legacy.readForm())
    expect(comparableView(state)).toEqual(legacyComparableView(legacy))
    expect(toPlain(runCalculation(state))).toEqual(legacy.calculate())
  })
})
