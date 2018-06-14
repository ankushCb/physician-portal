import { Map } from 'immutable';

import createReducer from '../../../../helpers/createReducer.js';

const initialState = Map({
  initialFetchInitiated: true,
  initialFetchSuccess: false,
  initialFetchFailure: false,
});

const onInitiated = (state) => {
  let newState = state;
  newState = newState.set('initialFetchInitiated', true);
  newState = newState.set('initialFetchSuccess', false);
  return newState;
};

const onSuccess = (state) => {
  let newState = state;
  newState = newState.set('initialFetchInitiated', false);
  newState = newState.set('initialFetchSuccess', true);
  return newState;
};

const onFailure = (state) => {
  let newState = state;
  newState = newState.set('initialFetchInitiated', false);
  newState = newState.set('initialFetchSuccess', false);
  return newState;
};

export default createReducer(initialState, {
  SETTINGS_INITIAL_FETCH: onInitiated,
  SETTINGS_INITIAL_FETCH_SUCCESS: onSuccess,
  SETTINGS_INITIAL_FETCH_FAILURE: onFailure,
  TIMEWINDOW_PATCH_REQUEST: onInitiated,
  TIMEWINDOW_PATCH_REQUEST_SUCCESS: onSuccess,
  TIMEWINDOW_PATCH_REQUEST_FAILURE: onFailure,
});
