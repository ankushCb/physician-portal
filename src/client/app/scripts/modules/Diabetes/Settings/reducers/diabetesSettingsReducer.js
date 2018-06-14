import { Map } from 'immutable';

import pick from 'lodash/pick';

import { deepCamelCase } from '../../../../helpers/deepCaseConvert.js';
import createReducer from '../../../../helpers/createReducer.js';

const requiredDiabetesSettingsProperties = [
  'hypoglycemiaGlucoseThresholdMild',
  'hyperglycemiaThresholdEmergency',
  'hyperglycemiaTitrationThresholdSmall',
  'correctionFactor',
  'correctionTarget',
  'correctionIncrement',
  'correctionalOn',
  'correctionalInsulin',
  'insulinRegimen',
  'basalInsulin',
  'bolusInsulin',
  'mixedInsulin',
  'negativeCorrectionalOn',
];

const initialState = Map({
  diabetesSettingsData: {},
});

const setDiabetesSettingsData = (state, { payload }) => {
  let newState = state;
  const diabetesSettings = pick(deepCamelCase(payload.diabetesSettingsData), requiredDiabetesSettingsProperties);
  newState = newState.set('diabetesSettingsData', diabetesSettings);
  return newState;
};

const onUpladDiabetesSettingsDataItem = (state, { payload }) => {
  const newState = state.toJS();
  return Map({
    ...newState,
    diabetesSettingsData: Object.assign({}, newState.diabetesSettingsData, payload),
  });
};

const onDiabetesSettingsRestore = (state, { payload }) => {
  return state.set('diabetesSettingsData', payload.diabetesSettingsData);
};

export default createReducer(initialState, {
  PATIENT_INITIAL_FETCH_REQUEST_SUCCESS: setDiabetesSettingsData,
  UPDATE_DIABETES_SETTINGS_DATA_ITEM: onUpladDiabetesSettingsDataItem,
  DIABETES_SETTINGS_PATCH_SUCCESS: setDiabetesSettingsData,
  DIABETES_SETTINGS_RESTORE_UPDATED: onDiabetesSettingsRestore,
});
