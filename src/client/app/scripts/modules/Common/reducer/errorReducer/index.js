import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

const initialState = Map({
  isError: false,
  errorMessage: '',
});

const onHtReFetch = (state, { payload }) => {
  let newState = state;

  return newState;
};

const onError = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['isError'], true);
  newState = newState.setIn(['errorMessage'], payload.errorMessage || 'Some Error Occured');
  return newState;
};

export default createReducer(initialState, {
  ERROR_OCCURED: onError,
});
