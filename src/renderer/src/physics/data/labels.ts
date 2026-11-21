import type { MaterialId, ModalityId } from '../types'

export const MODALITY_LABELS: Readonly<Record<ModalityId, string>> = {
  rad_room: 'General Radiographic Room',
  chest_room: 'Dedicated Chest Room',
  rf_room: 'Radiographic & Fluoroscopic (R&F) Room',
  cardiac_angio: 'Cardiac Angiography',
  periph_angio: 'Interventional Angiography (Peripheral / Neuro)',
  ct: 'CT Scanner',
  mammo: 'Mammography',
  dental_intra: 'Dental Intraoral',
  dental_pano: 'Dental Panoramic',
  dental_cbct: 'Dental CBCT',
  carm: 'C-Arm Fluoroscopy',
  petct: 'PET (F-18)',
  spectct: 'SPECT (Tc-99m)'
}

export const MATERIAL_LABELS: Readonly<Record<MaterialId, string>> = {
  lead: 'Lead',
  concrete: 'Concrete',
  steel: 'Steel',
  gypsum: 'Gypsum Wallboard'
}

export function getModalityLabel(modality: string): string {
  return MODALITY_LABELS[modality as ModalityId] ?? modality
}

export function getMaterialLabel(material: string): string {
  return MATERIAL_LABELS[material as MaterialId] ?? material
}
