/** Secondary unshielded air kerma per patient at 1 m, K1_sec (mGy/patient). NCRP 147. */
export const K1_SEC: Readonly<Record<string, number>> = {
  rad_room_all: 0.034,
  rad_room_chest: 0.0027,
  rad_room_floor: 0.023,
  fluoro_tube_rf: 0.66,
  rad_tube_rf: 0.028,
  chest_room: 0.0027,
  cardiac_angio: 3.8,
  periph_angio: 1.8,
  mammo: 0.036,
  dental_intra: 0.0001,
  dental_pano: 0.0005,
  dental_cbct: 0.04,
  carm: 0.66
}

/** Primary unshielded air kerma per patient at 1 m, K1_P (mGy/patient). NCRP 147. */
export const K1_P: Readonly<Record<string, number>> = {
  rad_room_chest: 2.3,
  rad_room_floor: 5.2,
  rf_room_rad: 5.9,
  chest_room: 1.2
}

/** Default patients/procedures per week when a modality is selected. */
export const DEFAULT_PATIENTS: Readonly<Record<string, number>> = {
  rad_room: 125,
  chest_room: 300,
  rf_room: 80,
  cardiac_angio: 25,
  periph_angio: 15,
  ct: 100,
  mammo: 150,
  dental_intra: 200,
  dental_pano: 100,
  dental_cbct: 40,
  carm: 20,
  petct: 40,
  spectct: 40
}
