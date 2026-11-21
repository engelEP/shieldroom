import type { ShieldingResult } from '../../physics/types'
import { CtResults } from './CtResults'
import { DiagnosticResults } from './DiagnosticResults'
import { PetResults } from './PetResults'
import { SpectResults } from './SpectResults'

export function ShieldingResults({ result }: { result: ShieldingResult }): React.JSX.Element {
  switch (result.type) {
    case 'diagnostic_xray':
      return <DiagnosticResults result={result} />
    case 'ct':
      return <CtResults result={result} />
    case 'pet_spect':
      return <PetResults result={result} />
    case 'spect_ct':
      return <SpectResults result={result} />
  }
}
