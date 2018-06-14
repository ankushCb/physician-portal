import { Map, fromJS } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  timeWindowData: Map(),
  diabetesSettingsData: Map(),
  patientData: Map(),
});

const onPatientInitialFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.set('patientData', fromJS(payload.patientData));
  newState = newState.set('diabetesSettingsData', fromJS(payload.diabetesSettingsData));
  newState = newState.set('timeWindowData', fromJS(payload.timeWindowData));
  newState = newState.set('hypertensionSettingsData', fromJS(payload.hypertensionSettingsData));
  newState = newState.set('patientId', payload.patientId);
  newState = newState.set('isHavingHypertension', payload.isHavingHypertension);
  return newState;
};

const onAfterPatchFetchSuccess = (state, { payload }) => {
  let newState = state.set('hypertensionSettingsData', fromJS(payload.hypertensionSettingsData));
  newState = newState.set('timeWindowData', fromJS(payload.timeWindowDisplay));
  return newState;
};

export default createReducer(initialState, {
  PATIENT_INITIAL_FETCH_REQUEST_SUCCESS: onPatientInitialFetch,
  REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_SUCCESS: onAfterPatchFetchSuccess,
});
