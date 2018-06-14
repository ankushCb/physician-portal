import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

const initialState = Map({
  bgReadingsData: Map(),
  insulinDosesData: Map(),
});

const onHtReFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['bgReadingsData', 'bgReadings'], fromJS(deepCamelCase(payload.bgReadingsData)));
  newState = newState.setIn(['bgReadingsData', 'currentDate'], payload.currentDate);
  newState = newState.setIn(['bgReadingsData', 'limit'], payload.limit);
  newState = newState.setIn(['insulinDosesData', 'insulinDoses'], fromJS(deepCamelCase(payload.insulinDosesData)));
  newState = newState.setIn(['insulinDosesData', 'currentDate'], payload.currentDate);
  newState = newState.setIn(['insulinDosesData', 'limit'], payload.limit);
  return newState;
};

const onHtInitialFetch = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['bgReadingsData', 'lastThirtyDaysBgReadings'], fromJS(payload.lastThirtyDaysBgReadings));
  return newState;
};

export default createReducer(initialState, {
  DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST_SUCCESS: onHtReFetch,
  DIABETES_DISPLAY_INITIAL_FETCH_REQUEST_SUCCESS: onHtInitialFetch
});
