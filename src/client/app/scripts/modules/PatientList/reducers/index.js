import { combineReducers } from 'redux-immutable';
import practitionerPatientListReducer from 'scripts/modules/Common/data/practitionerPatientList/reducers/practitionerPatientListReducer.js';

export default combineReducers({
  practitionerPatientList: practitionerPatientListReducer,
});
