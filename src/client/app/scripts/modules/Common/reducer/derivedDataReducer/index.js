import { Map, fromJS } from 'immutable';
import reduce from 'lodash/reduce';

import { combineReducers } from 'redux-immutable';

import mappingFromApiReducer from './mappingFromApiReducer.js';

export default combineReducers({
  mappingFromApiData: mappingFromApiReducer,
  diabetesData: () => ('diabetesData'),
  hyperTensionData: () => ('hypertensionData'),
});
