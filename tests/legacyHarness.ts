import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { JSDOM, VirtualConsole } from 'jsdom'
import type { FormField, FormState } from '../src/renderer/src/hooks/formState'

/** The untouched reference implementation; only ever read. */
export const LEGACY_HTML_PATH = resolve(__dirname, '../original/index.html')

let cachedHtml: string | null = null

function legacyHtml(): string {
  cachedHtml ??= readFileSync(LEGACY_HTML_PATH, 'utf8')
  return cachedHtml
}

export type LegacyOutcome = { result: unknown } | { error: string }

export interface LegacyVisibility {
  showDistance: boolean
  showBarrierType: boolean
  barrierTypeLocked: boolean
  showCustomUseFactor: boolean
  showCtFields: boolean
  showCbctFields: boolean
  showNuclearFields: boolean
  showSpectStudy: boolean
  showXpre: boolean
  xpreHint: string
  spectStudySource: string
  materialOptions: { value: string; label: string; disabled: boolean }[]
}

export interface LegacyApp {
  /** Sets a form control and fires `change`, like a user edit. */
  set: (field: FormField, value: string) => void
  /** Current raw value of every form control. */
  readForm: () => FormState
  visibility: () => LegacyVisibility
  /** Submits through the legacy `calculate()` and captures the result object or error text. */
  calculate: () => LegacyOutcome
  /** Evaluates an expression in the legacy page, e.g. `calculator.K1_SEC`. */
  evaluate: (expression: string) => unknown
  close: () => void
}

/** Copies a value from the jsdom realm into plain Node objects so deep equality works. */
export function toPlain(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toPlain)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toPlain(v)]))
  }
  return value
}

export function loadLegacyApp(fields: readonly FormField[]): LegacyApp {
  // Legacy `console.error` output for expected errors is dropped; script failures still throw.
  const virtualConsole = new VirtualConsole()
  const scriptErrors: Error[] = []
  virtualConsole.on('jsdomError', (err) => scriptErrors.push(err))

  const dom = new JSDOM(legacyHtml(), { runScripts: 'dangerously', virtualConsole })
  if (scriptErrors.length > 0) {
    throw new Error(`Legacy page failed to load: ${scriptErrors.map((e) => e.message).join('; ')}`)
  }
  const { window } = dom
  const { document } = window

  const control = (id: string): HTMLInputElement | HTMLSelectElement => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null
    if (!el) throw new Error(`Legacy control #${id} not found`)
    return el
  }
  const isShown = (id: string): boolean =>
    !document.getElementById(id)!.classList.contains('hidden')
  const evaluate = (expression: string): unknown => window.eval(expression)

  let lastResult: unknown = undefined
  ;(window as unknown as { __captureResult: (r: unknown) => void }).__captureResult = (r) => {
    lastResult = r
  }
  evaluate('calculator.displayResults = (result) => window.__captureResult(result)')

  return {
    set(field, value) {
      const el = control(field)
      el.value = value
      el.dispatchEvent(new window.Event('change', { bubbles: true }))
    },

    readForm() {
      return Object.fromEntries(fields.map((f) => [f, control(f).value])) as unknown as FormState
    },

    visibility() {
      const material = control('material') as HTMLSelectElement
      return {
        showDistance: isShown('distanceContainer'),
        showBarrierType: isShown('barrierTypeContainer'),
        barrierTypeLocked: control('barrierType').disabled,
        showCustomUseFactor: isShown('customUseFactorContainer'),
        showCtFields: isShown('ctFields'),
        showCbctFields: isShown('cbctFields'),
        showNuclearFields: isShown('petFields'),
        showSpectStudy: isShown('spectStudyContainer'),
        showXpre: isShown('xpreContainer'),
        xpreHint: document.getElementById('xpreHint')!.textContent!.trim(),
        spectStudySource: document.getElementById('spectStudySource')!.textContent!.trim(),
        materialOptions: Array.from(material.options).map((o) => ({
          value: o.value,
          label: o.textContent!.trim(),
          disabled: o.disabled
        }))
      }
    },

    calculate() {
      lastResult = undefined
      evaluate('calculator.calculate()')
      const errorDiv = document.getElementById('errorMessage')!
      if (errorDiv.classList.contains('show')) {
        return { error: errorDiv.textContent ?? '' }
      }
      return { result: toPlain(lastResult) }
    },

    evaluate: (expression) => toPlain(evaluate(expression)),

    close: () => window.close()
  }
}
