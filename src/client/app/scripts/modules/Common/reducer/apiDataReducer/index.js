import { Map, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import practitionerCommonDataReducer from './practitionerCommonDataReducer.js';
import patientCommonDataReducer from './patientCommonDataReducer.js';
import hypertensionDataReducer from './hypertensionDataReducer.js';
import diabetesDataReducer from './diabetesDataReducer.js';
import remindersDataReducer from './remindersDataReducer.js';

export default combineReducers({
  practitionerCommonData: practitionerCommonDataReducer,
  patientCommonData: patientCommonDataReducer,
  diabetesData: diabetesDataReducer,
  hypertensionData: hypertensionDataReducer,
  remindersData: remindersDataReducer,
});
