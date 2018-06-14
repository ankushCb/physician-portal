import { fromJS, Map, List } from 'immutable';
import createReducer from '../../../helpers/createReducer.js';

const initialState = Map({
  fetchInitiated: false,
  fetchSucess: false,
  insulinDoses: List(),
});

// helpers for reducers
const setInitiatedAndSuccess = (state, initiated, success) => {
  let newState = state;
  newState = newState.set('fetchInitiated', initiated);
  newState = newState.set('fetchSucess', success);
  return newState;
};

const onFetchInitiated = state => setInitiatedAndSuccess(state, true, false);

const onFetchFailure = state => setInitiatedAndSuccess(state, false, false);

const onFetchSuccess = (state, { payload }) => {
  let newState = setInitiatedAndSuccess(state, false, true);
  newState = newState.set('insulinDoses', fromJS(payload.practitionerInsulinDoses));
  newState = newState.set('cacheId', payload.id);
  newState = newState.set('currentDate', payload.currentDate);
  newState = newState.set('limit', payload.limit);
  return newState;
};

export default createReducer(initialState, {
  PRACTITIONER_INSULINDOSES_FETCH_INITIATED: onFetchInitiated,
  PRACTITIONER_INSULINDOSES_FETCH_FAILURE: onFetchFailure,
  PRACTITIONER_INSULINDOSES_FETCH_SUCCESS: onFetchSuccess,
});
