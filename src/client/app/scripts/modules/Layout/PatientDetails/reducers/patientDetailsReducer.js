import { Map } from 'immutable';

import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  patientDetailFetchInitiated: false,
  patientDetailFetchSuccess: false,
  patientData: {},
});

// helpers for reducers
const setInitiatedAndSuccess = (state, initiated, success) => {
  let newState = state;
  newState = newState.set('patientDetailFetchInitiated', initiated);
  newState = newState.set('patientDetailFetchSuccess', success);
  return newState;
};

const onPatientDetailFetchInitiated = state => setInitiatedAndSuccess(state, true, false);

const onPatientDetailFetchFailure = state => setInitiatedAndSuccess(state, false, false);

const onPatientDetailFetchSuccess = (state, { payload }) => {
  let newState = setInitiatedAndSuccess(state, false, true);
  newState = newState.set('patientData', payload.patientData);
  return newState;
};

export default createReducer(initialState, {
  PATIENT_DETAIL_FETCH_INITIATED: onPatientDetailFetchInitiated,
  PATIENT_DETAIL_FETCH_SUCCESS: onPatientDetailFetchSuccess,
  PATIENT_DETAIL_FETCH_FAILURE: onPatientDetailFetchFailure,
});
