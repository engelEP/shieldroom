import { calculateCT } from './ct'
import { calculateDiagnosticXray } from './diagnostic'
import { calculatePET } from './pet'
import { calculateSPECT } from './spect'
import type { ShieldingInput, ShieldingResult } from './types'

/** Runs the calculator matching the input modality. Throws on unsupported combinations. */
export function calculateShielding(input: ShieldingInput): ShieldingResult {
  switch (input.modality) {
    case 'ct':
      return calculateCT(input)
    case 'petct':
      return calculatePET(input)
    case 'spectct':
      return calculateSPECT(input)
    default:
      return calculateDiagnosticXray(input)
  }
}

export { calculateCT } from './ct'
export { calculateDiagnosticXray, getPrimaryK1Key } from './diagnostic'
export { calculatePET, calculatePetThickness } from './pet'
export { calculateSPECT } from './spect'
export * from './math'
export * from './types'
