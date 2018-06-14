import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';

import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  displayData: List(),
});

const onHtSettingsInitialFetchSuccess = (state, { payload }) => {
  let newState = state;
  newState = newState.set('displayData', payload.requiredMedicationDosesData);
  return newState;
};


export default createReducer(initialState, {
  HT_SETTINGS_INITIAL_FETCH_REQUEST_SUCCESS: onHtSettingsInitialFetchSuccess
});
