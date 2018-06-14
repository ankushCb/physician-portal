import { createSelector } from 'reselect';

import map from 'lodash/map';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import filter from 'lodash/filter';
import each from 'lodash/each';
import mapValues from 'lodash/mapValues';
import forEach from 'lodash/forEach';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import includes from 'lodash/includes';

import { exceptionClientDomains, negativeCorrectionalDomains } from '../../../../../exceptions.js';
import { deepCamelCase } from '../../../../helpers/deepCaseConvert.js';
import * as mockData from '../mockData.js';

// root.settings
export const getSettings = state => (state.get('settings'));

// root.settings.timeWindowDetails
export const getTimeWindowReducer = createSelector([getSettings], params => params.get('timeWindowDetails'));

// root.settings.insulins
export const getInsulinDetails = createSelector([getSettings], reducer => reducer.get('insulins'));

// root.settings.premadeRegimenDetails
export const getPremadeRegimenDetails = createSelector([getSettings], reducer => reducer.get('premadeRegimenDetails'));

export const getPremadeRegimenData = state => state.getIn(['apiData', 'practitionerCommonData', 'premadeRegimenData']);

// root.settings.insulins.insulins
export const getInsulinData = state => state.getIn(['apiData', 'practitionerCommonData', 'insulinData']);

// root.settings.timeWindowDetails.timeSheetData
export const getTimeSheetData = state => state.getIn(['apiData', 'patientCommonData', 'timeWindowData']);

/*
  Diabetes Settings
 */
export const getDiabeticSettingsReducer = createSelector([getSettings], reducer => reducer.get('diabetesSettings'));

export const getDiabetesId = state => state.getIn(['apiData', 'patientCommonData', 'diabetesSettingsData', 'id']);
// timesheetdata API fetch status
export const getTimeSheetFetchStatus = createSelector([getTimeWindowReducer], (timeWindowDetails) => {
  const timeWindowFetchInitiated = timeWindowDetails.get('timeWindowFetchInitiated');
  const timeWindowFetchSuccess = timeWindowDetails.get('timeWindowFetchSuccess');
  const timeWindowIsPatchingAndLoading = timeWindowDetails.get('isPatchingAndLoading');
  return {
    timeWindowIsPatchingAndLoading,
    timeWindowFetchInitiated,
    timeWindowFetchSuccess,
  };
});

// diabetes settings API fetch status
export const getDiabetesFetchStatus = createSelector([getDiabeticSettingsReducer], (diabetesSettings) => {
  const diabetesSettingsFetchInitiated = diabetesSettings.get('diabetesSettingsFetchInitiated');
  const diabetesSettingsFetchSuccess = diabetesSettings.get('diabetesSettingsFetchSuccess');
  const diabetesSettingsFetchFailure = diabetesSettings.get('diabetesSettingsFetchFailure');
  return {
    diabetesSettingsFetchInitiated,
    diabetesSettingsFetchSuccess,
    diabetesSettingsFetchFailure,
  };
});

// Processing data for container
export const getApiData = createSelector([getTimeSheetData], (reducer) => {
  return map(reducer, (data) => {
    return deepCamelCase(
      merge(
        pick(data, [
          'id',
          'base_dose',
          'name',
          'start_time',
          'stop_time',
          'correctional_insulin_on',
          'bg_check_prescribed',
          'bg_check_required',
          'insulin_dose_required',
          'carb_counting_on',
          'carb_counting_ratio',
        ]),
        {
          insulinTypePreloaded: {},
        },
      ),
    );
  });
});

// Processing data for getNewMealDisplayData
export const getInsulinDataToSelectBoxFormat = createSelector([getInsulinData], (insulins) => {
  return map(insulins.toJS(), ({ name, id, generic, type }) => {
    return {
      name,
      value: id,
      generic,
      id,
      type,
    };
  });
});

// time-window meal - id map
export const getMealIdMap = createSelector([getApiData], (apiData) => {
  const result = {};
  each(apiData, (meal) => {
    result[meal.name] = meal.id;
  });
  return result;
});

export const getIdInsulinMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idInsulinMap']);

export const getIdInsulinTypeMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idInsulinTypeMap']);

export const getInsulinIdMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'insulinIdMap']);

export const isFetchingError = createSelector([getTimeWindowReducer, getDiabeticSettingsReducer], (timeWindow, diabetesSettings) => {
  return timeWindow.get('timeWindowFetchFailure') || diabetesSettings.get('diabetesSettingsFetchFailure');
});

export const getPatchStatus = createSelector([getTimeWindowReducer], (reducer) => {
  return reducer.get('requestCount');
});

export const getPatchInitiatedStatus = createSelector([getTimeWindowReducer], (reducer) => {
  return reducer.get('requestInitiatedCount');
});

/*
  Insulinss TODO: Already written. Remove one
 */
export const getInsulinsReducer = state => state.get(['apiData', 'practitionerCommonData', 'insulinData']);

export const getInsulins = createSelector([getInsulinData], (insulins) => {
  const unSortedInsulins = map(insulins.toJS(), ({ name, id, generic, type }) => {
    return {
      name,
      value: id,
      generic,
      id,
      type,
    };
  });
  const sortInsulins = (insulins) => {
    return sortBy(insulins, insulin => capitalize(insulin.name));
  };
  return sortInsulins(unSortedInsulins);
});


export const getDiabetesSettings = state => state.getIn(['settings', 'diabetesSettings', 'diabetesSettingsData']);
export const getDiabetesDisplay = state => state.getIn(['settings', 'diabetesSettings', 'diabetesSettingsData']);

// TODO remove mock data
export const premadeRegimen = createSelector([getDiabetesSettings], settings => (settings.insulinRegimen));
export const getPremadeCriteria = createSelector([premadeRegimen], regimen => (mockData.premadeRegimenMockData[regimen]));

// API data for regimen criteria
export const getCurrentCriteriaFromApi = createSelector([getPremadeRegimenData, getDiabetesDisplay], (regimen, diabetesSettings) => {
  const result = (regimen && diabetesSettings.insulinRegimen) ? regimen.get(diabetesSettings.insulinRegimen) : undefined;
  return result;
});

export const timeSheetDisplay = createSelector([getSettings], (settings) => {
  return settings.getIn(['timeWindowDetails', 'timeSheetDisplay']);
});

// Get current criteria from store
export const getCurrentCriteriaFromStore = createSelector([getDiabetesSettings, getPremadeRegimenDetails, timeSheetDisplay], (diabetesSettings, regimen, timeWindowData) => {
  const regimenDisplay = regimen.get('regimenDisplay');

  // Dont change this line
  if (isEmpty(regimenDisplay)) {
    const result = {};
    each(timeWindowData, (data) => {

      if (data.bg_check_required || data.insulin_dose_required) {
        result[data.name] = (regimenDisplay && regimenDisplay[data.name]) ? regimenDisplay[data.name] : 'bg';
      }
    });

    return result;
  }
  return regimen.get('regimenDisplay');
});

// export const getDiabetesSettingsData = state => state.getIn(['settings', 'diabetesSettings', 'diabetesSettingsData']);// root.settings.timeWindowDetails.timeSheetDisplay
export const getTimeSheetDisplayData = createSelector([getTimeWindowReducer, getCurrentCriteriaFromStore], (reducer, insulinTypePreloaded) => {
  let insulinType;
  const result = {};
  // Filter if premade regimen doesn't have the current meal
  if (insulinTypePreloaded && !isEmpty(insulinTypePreloaded)) {
    forEach(reducer.get('timeSheetDisplay'), (value, key) => {
      if (insulinTypePreloaded && insulinTypePreloaded[value.name]) {
        result[key] = value;
      }
    });
  } else {
    const filteredResult = {};
    each(reducer.get('timeSheetDisplay'), (value, key) => {
      if (value.bg_check_required || value.insulin_dose_required) {
        filteredResult[key] = value;
      }
    });
    return deepCamelCase(filteredResult);
  }
  const interimResult = deepCamelCase(result);
  const alterResult = mapValues(interimResult, (value) => {
    if (!insulinTypePreloaded || !insulinTypePreloaded[value.name]) {
      insulinType = undefined;
    } else if (insulinTypePreloaded[value.name] === 'none') {
      insulinType = 'bg';
    } else if (insulinTypePreloaded[value.name]) {
      insulinType = insulinTypePreloaded[value.name];
    }

    let actualBaseDose;
    if (insulinType === 'bg') {
      actualBaseDose = 0;
    } else {
      actualBaseDose = (value.baseDose !== 0 && value.baseDose) ? value.baseDose : 1;
    }

    const result = {
      ...value,
      baseDose: actualBaseDose,
      insulinTypePreloaded: insulinType,
    };
    return result;
  });
  return alterResult;
});

const getLiveNameTimingMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'modalMealTimeMap']);
const getIdMealMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);

// Processing data for container
export const getNewMealDisplayData = createSelector([getTimeSheetDisplayData, getLiveNameTimingMap, getIdMealMap], (timeSheetDisplay, nameTimeMap, idMealMap) => {
  const durations = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];
  const result = {};
  const mealName = [];
  const mealDuration = {};
  const baseDose = {};
  const remainingDuration = filter(durations, duration => (!timeSheetDisplay[duration]));

  if (nameTimeMap && !isEmpty(nameTimeMap)) {
    const result = reduce(remainingDuration, (accumulator, mealName) => {
      accumulator[mealName] = {
        mealName,
        mealStartTime: nameTimeMap[mealName].startTime,
        mealStopTime: nameTimeMap[mealName].stopTime,
        correctionalOn: false,
        bgCheck: false,
        dose: 1,
      }
      return accumulator;
    }, {});
    return result;
  }
});

export const isValidCarbCounting = createSelector([getTimeSheetDisplayData, getDiabetesSettings], (data, diabetesSettings) => {
  if (diabetesSettings && includes(diabetesSettings.insulinRegimen, 'carb_count')) {
    return !(isNull(diabetesSettings.basalInsulin) || isNull(diabetesSettings.bolusInsulin));
  }
  return true;
});

export const getFetchStatus = state => {
  return {
    globalNavbarStatus: {
      isFetching: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    patientNavbarStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched']),
    },
    globalSettingsStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching']) || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched']) && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    scheduleFetchStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
        && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    insulinPrescriptionStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
        && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    firstTimeFetchCompleted: {
      isFetching: state.getIn(['fetchStatus', 'settingsData', 'isFetching']),
      isPatching: state.getIn(['fetchStatus', 'settingsData', 'isPatching']),
      isFetched: state.getIn(['fetchStatus', 'settingsData', 'isFetched']),
    },
  };
};

export const getPractitionerEmail = state => state.getIn(['apiData', 'practitionerCommonData',
  'currentPractitionerDetails', 'email']);

export const getGlucoseRowsLimit = createSelector(
  [getPractitionerEmail],
  (email) => { return includes(exceptionClientDomains, email.split('@')[1]) ? 99 : 5; },
);

export const getIfNegativeCorrectionalAllowed = createSelector(
  [getPractitionerEmail],
  email => includes(negativeCorrectionalDomains, email.split('@')[1]),
);
