export const settingsHyperTensionInitialFetchRequest = (patientId, forced) => ({
  type: 'HT_SETTINGS_INITIAL_FETCH_REQUEST',
  payload: {
    patientId,
    forced,
  },
});

export const medicationScheduleModify = (data) => ({
  type: 'MEDICATION_SCHEDULE_MODIFY',
  payload: {
    ...data
  },
});

export const patchAndFetchHyperSettings = () => ({
  type: 'REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_REQUEST',
});
