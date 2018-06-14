import { Map, fromJS } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  patientList: Map(),
  practitionerData: Map(),
  insulinData: Map(),
  insulinRegimen: Map(),
});

const onPractitionerInitialFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.set('patientList', fromJS(payload.patientList));
  newState = newState.set('practitionerData', fromJS(payload.practitionerData));
  newState = newState.set('insulinData', fromJS(payload.insulinData));
  newState = newState.set('insulinRegimen', fromJS(payload.practitionerData));
  newState = newState.set('medicationData', fromJS(payload.medicationData));
  newState = newState.set('practitionerId', fromJS(payload.practitionerId));
  newState = newState.set('premadeRegimenData', fromJS(payload.premadeRegimenData));
  newState = newState.set('locationData', fromJS(payload.locationData));
  return newState;
};

const onPatientListFetchSuccess = (state, { payload }) => {
  const constructNewPatientList = (existingPatientList, patientListFromPayload) => (
    existingPatientList.toList().push(fromJS(patientListFromPayload)).toMap()
  );

  let newState = state;
  newState = newState.set('patientList', constructNewPatientList(newState.get('patientList'), payload.patientList));
  return newState;
};

const onCurrentPractitionerDetailsFetch = (state, { payload }) => {
  return state.set('currentPractitionerDetails', fromJS(payload.userData));
};

export default createReducer(initialState, {
  PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS: onPractitionerInitialFetch,
  PRACTITIONER_PATIENTLIST_FETCH_SUCCESS: onPatientListFetchSuccess,
  IS_A_PRACTITIONER: onCurrentPractitionerDetailsFetch,
});
