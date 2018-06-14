import { createSelector } from 'reselect';
import { Iterable, List, Map } from 'immutable';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import each from 'lodash/each';
import includes from 'lodash/includes';

import helpers from '../helpers';
import { exceptionClientDomains, negativeCorrectionalDomains } from '../../../../../exceptions.js';

/**
* Common Selectors
*/
export const getSettings = state =>
  state.get('settings');
export const getDiabetesSettings = state =>
  state.getIn(['settings', 'diabetesSettings', 'diabetesSettingsData']);
export const timeSheetDisplay = state =>
  state.getIn(['settings', 'timeWindowDetails', 'timeSheetDisplay']);
export const getPatientId = state =>
  state.getIn(['apiData', 'patientCommonData', 'patientId']);
export const getDiabetesPatchUrl = state =>
  state.getIn(['apiData', 'patientCommonData', 'patientData', 'diabetesSettings', 'url']);
export const getPractitionerEmail = state =>
  state.getIn(['apiData', 'practitionerCommonData', 'currentPractitionerDetails', 'email']);
export const getIsPatchingSettings = state =>
  state.getIn(['fetchStatus', 'settingsData', 'isPatching']);
export const getGlucoseRowsLimit = createSelector([getPractitionerEmail],
  (email) => { return includes(exceptionClientDomains, email.split('@')[1]) ? 99 : 5; });

export const getSelectedInsulins = createSelector([getDiabetesSettings], settings => ({
  basal: helpers.getIdFromUrl(settings.basalInsulin),
  bolus: helpers.getIdFromUrl(settings.bolusInsulin),
  mixed: helpers.getIdFromUrl(settings.mixedInsulin),
}));

/**
* Selector for getting the time windows data
*/
export const getTimeWindowData = (state) => {
  const timeWindowData = state.getIn(['apiData', 'patientCommonData', 'timeWindowData']);

  // Sort time windows based on schedule names
  return helpers.sortScheduleTableData(timeWindowData);
};

/**
* Selector for getting data for diabetes settings schedule section
*/
export const getScheduleData = createSelector(getTimeWindowData, (timeWindows) => {
  if (Iterable.isIterable(timeWindows)) {
    return timeWindows.toSeq().reduce((accumulator, tw) => {
      return accumulator.push({
        isDisplayed: tw.get('insulin_dose_required') || tw.get('bg_check_required'),
        checked: false,
        name: capitalize(tw.get('name')),
        insulin: tw.get('insulin'),
        base_dose: tw.get('base_dose'),
        timings: [tw.get('start_time'), tw.get('stop_time')],
        bgCheck: tw.get('bg_check_prescribed'),
        correctionalInsulinOn: tw.get('correctional_insulin_on'),
        carbCountingRatio: tw.get('carb_counting_ratio'),
        patchUrl: tw.get('url'),
      });
    }, List());
  }

  return null;
});

/**
* Selector for gettting list of insulins as obtained from the api
*/
export const getInsulinData = state => state.getIn(['apiData', 'practitionerCommonData', 'insulinData']);

export const getInsulins = createSelector([getInsulinData], (insulins) => {
  const unSortedInsulins = map(insulins.toJS(), ({ name, id, generic, type, url }) => {
    return {
      name,
      value: id,
      generic,
      id,
      type,
      url,
    };
  });
  return sortBy(unSortedInsulins, i => capitalize(i.name));
});

/**
* Selectors for getting details for Premade Regimen Card
*/
export const getPremadeRegimenDisplay = state => state.getIn(['settings', 'premadeRegimenDetails', 'regimenDisplay']);
export const getPremadeRegimenList = state => state.getIn(['apiData', 'practitionerCommonData', 'premadeRegimenData']);

export const getDiabetesThresholds = createSelector([getDiabetesSettings], settings => ({
  hyperglycemiaThresholdEmergency: settings.hyperglycemiaThresholdEmergency,
  hyperglycemiaTitrationThresholdSmall: settings.hyperglycemiaTitrationThresholdSmall,
  hypoglycemiaGlucoseThresholdMild: settings.hypoglycemiaGlucoseThresholdMild,
}));

// Get current criteria from store
export const getPremadeRegimenDetails = createSelector([
  getDiabetesSettings,
  getPremadeRegimenDisplay,
  timeSheetDisplay,
], (diabetesSettings, regimenDisplay, timeWindowData) => {
  // If the regimen Data is empty, populate using timeSheetDisplay
  // It is empty when 1. API is loading or when 2. no meals selected
  if (isEmpty(regimenDisplay)) {
    const result = {};
    each(timeWindowData, (data) => {
      if (data.bg_check_required || data.insulin_dose_required) {
        result[data.name] = (regimenDisplay && regimenDisplay[data.name]) ? regimenDisplay[data.name] : 'bg';
      }
    });
    return result;
  }
  return regimenDisplay;
});

export const getRegimenData = createSelector([
  getDiabetesSettings,
  getPremadeRegimenDetails,
  getPremadeRegimenList,
], (settings, premadeRegimenDetails, regimenList) => ({
  isPremadeRegimen: (settings.insulinRegimen !== 'custom' && !isEmpty(settings.insulinRegimen)),
  insulinRegimen: settings.insulinRegimen,
  premadeRegimenDetails,
  regimenList,
}));

/**
* Selectors for getting Correctional card details
*/

export const getCorrectionalDetails = createSelector([getDiabetesSettings, getPractitionerEmail],
  (settings, pracEmail) => {
    return {
      displayCorrectionalCard: settings.insulinRegimen !== '',
      allowNegativeCorrectional: includes(negativeCorrectionalDomains, pracEmail.split('@')[1]),
      correctionalOn: settings.correctionalOn,
      negativeCorrectionalOn: settings.negativeCorrectionalOn,
      correctionTarget: settings.correctionTarget,
      correctionFactor: settings.correctionFactor,
      correctionIncrement: settings.correctionIncrement,
      hypoglycemiaGlucoseThresholdMild: settings.hypoglycemiaGlucoseThresholdMild,
      onChangeInDiabetesSettings: settings.onChangeInDiabetesSettings,
    };
  });

  /**
  * Selectors for getting Carb Counting settings card
  */
export const getCarbCountingDetails = () => ({
  carbCountingRatio: 0,
  insulinUnits: 1,
});

/*
 * Selector to list which of Basal / bolus / Mixed is to be validated
 */
const getScheduleFormData = state => state.getIn(['form', 'diabetesSettingsForm', 'values', 'scheduleData']);
const getSelectedInsulinsFromForm = state =>  state.getIn(['form', 'diabetesSettingsForm', 'values', 'selectedInsulins']);
