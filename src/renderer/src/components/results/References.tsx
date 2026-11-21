import type { ReactNode } from 'react'

function ReferenceList({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="reference-citations">
      <div className="reference-citations-title">References</div>
      <ul className="reference-list">{children}</ul>
    </div>
  )
}

/** References for diagnostic X-ray, CT, Dental CBCT and PET results. */
export function References({ modality }: { modality: string }): React.JSX.Element {
  return (
    <ReferenceList>
      <li>
        <strong>NCRP 147</strong> (2004): Structural Shielding Design for Medical X-Ray Imaging
        Facilities. National Council on Radiation Protection and Measurements.
      </li>
      {modality === 'ct' && (
        <li>
          <strong>NCRP 147, Section 5.6</strong>: CT Scanner Secondary Barrier Calculations using
          DLP-based methodology.
        </li>
      )}
      {modality === 'dental_cbct' && (
        <>
          <li>
            <strong>NCRP 145</strong> (2003): Radiation Protection in Dentistry. Appendix F,
            Shielding Design for Dental Facilities; shielding design by a qualified expert and
            site-specific survey verification.
          </li>
          <li>
            <strong>Dental CBCT shielding literature</strong>: Preliminary preset range uses 0.005,
            0.010, 0.020, and 0.040 mGy/scan at 1 m, consistent with published guidance ranges of
            approximately 2.3 to 40 µGy/scan at 1 m.
          </li>
          <li>
            <strong>
              Scattered Radiation Distribution Utilizing Three Different Cone-Beam Computed
              Tomography Devices
            </strong>{' '}
            (J Clin Med, 2023): measured scattered radiation around multiple dental/maxillofacial
            CBCT units using an anthropomorphic phantom and Victoreen 451P ionization chamber.
          </li>
          <li>
            <strong>Pauwels et al.</strong> (Dentomaxillofacial Radiology, 2021): field of view and
            beam energy affect scatter-to-primary ratio in dentomaxillofacial CBCT.
          </li>
          <li>
            <strong>Dental CBCT calculation method</strong>: simplified secondary-barrier
            calculation using selected K<sup>1</sup>
            <sub>sec</sub>, scans per week, distance, occupancy factor, and design goal. CT
            secondary Archer transmission parameters are used for lead/concrete attenuation as a
            conservative preliminary approximation. Formal room-specific design requires QMP review.
          </li>
        </>
      )}
      {modality === 'petct' && (
        <>
          <li>
            <strong>AAPM TG-108</strong> (2006): PET and PET/CT Shielding Requirements.{' '}
            <em>Medical Physics</em> 33(1):4–18, Madsen et al.
          </li>
          <li>
            <strong>Oumano et al.</strong> (2025): Broad-beam Archer parameters for F-18.{' '}
            <em>J Appl Clin Med Phys</em>, DOI:10.1002/acm2.70084.
          </li>
          <li>
            <strong>F-18 Properties</strong>: 511 keV annihilation photons, 109.77 minute half-life.
            Dose calculated per TG-108 methodology; transmission via Oumano (2025) Archer model.
          </li>
        </>
      )}
      <li>Distance scaling follows inverse-square law (K ∝ 1/d²).</li>
      <li>
        {modality === 'petct'
          ? 'Transmission calculations use Archer fitting parameters from Oumano et al. (2025) Table 2 (GATE Monte Carlo broad beam).'
          : 'Transmission calculations use Archer fitting parameters from NCRP 147 Appendix C (secondary) and Appendix B (primary).'}
      </li>
    </ReferenceList>
  )
}

export function SpectReferences(): React.JSX.Element {
  return (
    <ReferenceList>
      <li>
        <strong>Kusano &amp; Caldwell (2014)</strong>: Dose Equivalent Rate Constants and Barrier
        Transmission Data for Nuclear Medicine. <em>Health Physics</em> 107(1):60-72.
      </li>
      <li>
        <strong>Oumano et al. (2025)</strong>: Shielding resources for Tc-99m, F-18, I-131, and
        Lu-177. <em>J Applied Clinical Medical Physics</em>, DOI:10.1002/acm2.70084.
      </li>
      <li>
        <strong>NCRP 147 (2004)</strong>: Structural Shielding Design for Medical X-Ray Imaging
        Facilities. CT component methodology.
      </li>
      <li>
        <strong>IAEA Safety Standards Series No. SSG-46</strong> (2018): Radiation Protection and
        Safety in Medical Uses of Ionizing Radiation. Vienna: International Atomic Energy Agency.
      </li>
      <li>
        <strong>SNMMI/EANM</strong>: Procedure guidelines for administered activity defaults (bone,
        cardiac, renal, hepatobiliary, parathyroid).
      </li>
    </ReferenceList>
  )
}
