import { Map, fromJS, List } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  bpReadingsData: Map(),                // Fetched only during settings
  requiredMedicationDosesData: Map(),   // Fetched during settings and overview
  bpReadingsTwoWeeksData: List(),        // Fetched during overview
  bpReadingsCurrentDurationData: List(), // Fetched during overview
});

const onHtSettingsInitialFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.set('bpReadingsData', fromJS(payload.bpReadingsData));
  newState = newState.set('requiredMedicationDosesData', fromJS(payload.requiredMedicationDosesData));
  return newState;
};

const onHtOverviewInitialFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.set('bpReadingsThirtyDaysData', fromJS(payload.bpReadingsThirtyDaysData));
  newState = newState.set('requiredMedicationDosesData', payload.requiredMedicationDosesData);
  newState = newState.set('bpReadingsCurrentDurationData', fromJS(payload.bpReadingsCurrentDurationData));
  newState = newState.set('loggedMedicationDosesData', payload.loggedMedicationDosesData);
  return newState;
};

const onHtOverviewUpdatedLog = (state, { payload }) => {
  let newState = state;
  newState = newState.set('bpReadingsCurrentDurationData', fromJS(payload.bpReadingsCurrentDurationData));
  newState = newState.set('currentDuration', payload.currentDate);
  newState = newState.set('limit', payload.limit);
  newState = newState.set('loggedMedicationDosesData', payload.loggedMedicationDosesData);
  return newState;
}

const onAfterPatchFetchSuccess = (state, { payload }) => {
  let newState = state;
  newState = newState.set('requiredMedicationDosesData', fromJS(payload.requiredMedicationDosesData));
  return newState;
};

export default createReducer(initialState, {
  HT_SETTINGS_INITIAL_FETCH_REQUEST_SUCCESS: onHtSettingsInitialFetch,
  HT_OVERVIEW_INITIAL_FETCH_SUCCESS: onHtOverviewInitialFetch,
  HT_OVERVIEW_LOG_UPDATED_FETCH_SUCCESS: onHtOverviewUpdatedLog,
  REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_SUCCESS: onAfterPatchFetchSuccess,
});
