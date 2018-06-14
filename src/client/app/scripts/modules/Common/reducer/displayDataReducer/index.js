import { combineReducers } from 'redux-immutable';
import hyperTensionSettingsDisplayReducer from './hyperTensionSettingsDisplay.js';
import medicationDataDisplayReducer from './medicationDisplay.js';

export default combineReducers({
  medicationDataDisplay: medicationDataDisplayReducer,
  hyperTensionSettingsDisplay: hyperTensionSettingsDisplayReducer,
});
