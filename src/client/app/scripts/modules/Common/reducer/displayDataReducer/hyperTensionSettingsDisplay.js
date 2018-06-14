import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';

import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({


});

const onTimeWindowFetchSuccess = (state, { payload }) => {
  let newState = state;

  return newState;
};


export default createReducer(initialState, {

});
