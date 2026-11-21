import { useRef } from 'react'
import { ShieldingForm } from '../components/form/ShieldingForm'
import { ReferenceTables } from '../components/reference/ReferenceTables'
import { ShieldingResults } from '../components/results/ShieldingResults'
import { useShieldingForm } from '../hooks/useShieldingForm'

export function ShieldingView(): React.JSX.Element {
  const form = useShieldingForm()
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (): void => {
    if (form.submit()) {
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    }
  }

  return (
    <main className="container-main">
      <h1 className="visually-hidden">
        Radiation Shielding Calculator – NCRP 147 and TG-108 Barrier Estimator
      </h1>
      <div className="layout-grid">
        <div className="layout-form">
          <ShieldingForm form={form} onSubmit={handleSubmit} />
        </div>
        <div className="layout-results">
          <div ref={resultsRef}>{form.result && <ShieldingResults result={form.result} />}</div>
          <ReferenceTables />
        </div>
      </div>
    </main>
  )
}
