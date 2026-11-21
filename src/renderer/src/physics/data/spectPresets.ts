import type { SpectExamPreset, SpectStudyType } from '../types'

export const SPECT_EXAM_PRESETS: Readonly<Record<SpectStudyType, SpectExamPreset>> = {
  bone: {
    label: 'Bone SPECT (Tc-99m MDP/HDP)',
    activity_MBq: 740,
    activityRange: '500–1110 MBq (14–30 mCi)',
    uptakeTime_min: 180,
    scanTime_min: 30,
    source: 'SNMMI Bone Scintigraphy 4.0'
  },
  cardiac: {
    label: 'Cardiac Perfusion SPECT (Tc-99m Sestamibi)',
    activity_MBq: 925,
    activityRange: '888–1110 MBq (24–30 mCi) stress dose',
    uptakeTime_min: 45,
    scanTime_min: 20,
    source: 'SNMMI MPI Guideline 3.3'
  },
  renal: {
    label: 'Renal SPECT (Tc-99m MAG3/DTPA)',
    activity_MBq: 370,
    activityRange: '185–370 MBq (5–10 mCi)',
    uptakeTime_min: 30,
    scanTime_min: 30,
    source: 'SNMMI/EANM Renal Scintigraphy 1.0'
  },
  hida: {
    label: 'Hepatobiliary SPECT (Tc-99m Mebrofenin)',
    activity_MBq: 185,
    activityRange: '111–185 MBq (3–5 mCi)',
    uptakeTime_min: 60,
    scanTime_min: 30,
    source: 'SNMMI Hepatobiliary 4.0'
  },
  parathyroid: {
    label: 'Parathyroid SPECT (Tc-99m Sestamibi)',
    activity_MBq: 740,
    activityRange: '740–925 MBq (20–25 mCi)',
    uptakeTime_min: 120,
    scanTime_min: 25,
    source: 'SNMMI Parathyroid Scintigraphy 4.0'
  },
  custom: {
    label: 'Custom SPECT Protocol',
    activity_MBq: 555,
    activityRange: 'User-defined',
    uptakeTime_min: 60,
    scanTime_min: 30,
    source: 'User-defined'
  }
}
