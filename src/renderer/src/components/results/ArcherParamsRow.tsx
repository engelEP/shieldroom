import type { ArcherParams } from '../../physics/types'
import { ResultRow } from './ResultRow'

export interface ArcherParamsRowProps {
  params: ArcherParams
  materialLabel: string
  /** Rounds parameters like the diagnostic and CT tables; nuclear fits are shown verbatim. */
  rounded?: boolean
  separated?: boolean
}

export function ArcherParamsRow({
  params,
  materialLabel,
  rounded,
  separated
}: ArcherParamsRowProps): React.JSX.Element {
  const alpha = rounded ? params.alpha.toFixed(4) : params.alpha
  const beta = rounded ? params.beta.toFixed(2) : params.beta
  const gamma = rounded ? params.gamma.toFixed(4) : params.gamma
  return (
    <ResultRow label={`Archer Parameters (${materialLabel})`} muted separated={separated}>
      α={alpha} mm⁻¹, β={beta}, γ={gamma}
    </ResultRow>
  )
}

/** Archer parameters plus the Oumano et al. source line used by the nuclear medicine results. */
export function NuclearArcherParams({
  params,
  materialLabel
}: {
  params: ArcherParams
  materialLabel: string
}): React.JSX.Element {
  return (
    <div className="results-section">
      <ArcherParamsRow params={params} materialLabel={materialLabel} />
      <ResultRow label="Source" muted>
        Oumano et al. (2025) JACMP Table 2, GATE Monte Carlo broad beam
      </ResultRow>
    </div>
  )
}
