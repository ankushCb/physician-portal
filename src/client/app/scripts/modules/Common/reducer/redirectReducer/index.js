import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

const initialState = Map({
  shouldRedirect: null,
  to: '',
});

const onPatient = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['shouldRedirect'], true);
  newState = newState.setIn(['to'], 'patient');
  return newState;
};

const onPractitioner = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['shouldRedirect'], false);
  return newState;
};

const onLogin = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['shouldRedirect'], true);
  newState = newState.setIn(['to'], 'login');
  return newState;
}
export default createReducer(initialState, {
  IS_A_PATIENT: onPatient,
  IS_A_PRACTITIONER: onPractitioner,
  CHECK_USER_SCOPE_FAILURE: onLogin,
});
