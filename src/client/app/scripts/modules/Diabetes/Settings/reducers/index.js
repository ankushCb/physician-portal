import { combineReducers } from 'redux-immutable';

import { timeWindowReducer } from './timeWindowReducer.js';
import diabetesSettingsReducer from './diabetesSettingsReducer.js';
import premadeRegimenReducer from './premadeRegimenReducer.js';
import initialFetchStatusReducer from './initialFetchStatusReducer';

export default combineReducers({
  timeWindowDetails: timeWindowReducer,
  diabetesSettings: diabetesSettingsReducer,
  premadeRegimenDetails: premadeRegimenReducer,
  initialFetchStatus: initialFetchStatusReducer,
});
