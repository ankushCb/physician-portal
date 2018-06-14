import { combineReducers } from 'redux-immutable';
import practitionerBgReadingsReducer from 'scripts/modules/Common/data/practitionerBgReadings/reducers/practitionerBgReadingsReducer.js';
import practitionerTimeWindowReducer from 'scripts/modules/Common/data/practitionerTimeWindow/reducers/practitionerTimeWindowReducer.js';
import practitionerInsulinDosesReducer from './practitionerInsulinDosesReducer.js';

export default combineReducers({
  practitionerTimeWindow: practitionerTimeWindowReducer,
  practitionerBgReadings: practitionerBgReadingsReducer,
  practitionerInsulinDoses: practitionerInsulinDosesReducer,
});
