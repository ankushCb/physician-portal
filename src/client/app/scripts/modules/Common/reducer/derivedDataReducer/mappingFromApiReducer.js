import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';

import { baseUrl } from 'scripts/helpers/api.js';
import createReducer from 'scripts/helpers/createReducer.js';

const initialState = Map({
  mealIdMap: Map(),
  idMealMap: Map(),
  insulinIdMap: Map(),
  idInsulinMap: Map(),
  classDetails: Map(),
  medicationUrlToNameMap: Map(),
  modalMealTimeMap: {},
  requiredClasses: List()
});

const onTimeWindowFetchSuccess = (state, { payload }) => {
  let newState = state;
  const mealIdMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = data.id; // eslint-disable-line
    return accumulator;
  }, {});
  const mealUrlMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[`${baseUrl}/api/time-windows/${data.id}/`] = data.name; // eslint-disable-line
    return accumulator;
  }, {});
  const mealNameMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = `${baseUrl}/api/time-windows/${data.id}/`; // eslint-disable-line
    return accumulator;
  }, {});
  const idMealMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.id] = data.name; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('mealNameMap', fromJS(mealNameMap));
  newState = newState.set('mealUrlMap', fromJS(mealUrlMap));
  newState = newState.set('mealIdMap', fromJS(mealIdMap));
  newState = newState.set('idMealMap', fromJS(idMealMap));

  const urlMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[`${baseUrl}/api/time-windows/${data.id}/`] = {         // eslint-disable-line
      startTime: data.start_time,
      stopTime: data.stop_time,
    }; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('timeWindowUrlTimeMap', urlMealTimeMap);

  const nameMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = { // eslint-disable-line no-param-reassign
      startTime: data.start_time,
      stopTime: data.stop_time,
    };
    return accumulator;
  }, {});
  newState = newState.set('timeWindowNameTimeMap', fromJS(nameMealTimeMap));

  const modalMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = { // eslint-disable-line no-param-reassign
      startTime: data.start_time,
      stopTime: data.stop_time,
    }; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('modalMealTimeMap', modalMealTimeMap);

  return newState;
};

const onPractitionerFetchSuccess = (state, { payload }) => {
  let newState = state;

  const insulinIdMap = reduce(payload.insulinData, (accumulator, data) => {
    accumulator[data.name] = data.id; // eslint-disable-line
    return accumulator;
  }, {});
  const idInsulinMap = reduce(payload.insulinData, (accumulator, data) => {
    accumulator[data.id] = data.name; // eslint-disable-line
    return accumulator;
  }, {});

  const idInsulinTypeMap = reduce(payload.insulinData, (accumulator, data) => {
    accumulator[data.id] = data.type; // eslint-disable-line
    return accumulator;
  }, {});
  const insulinTypeMap = reduce(payload.insulinData, (accumulator, data) => {
    accumulator[data.name] = data.type; // eslint-disable-line
    return accumulator;
  }, {});

  newState = newState.set('idInsulinTypeMap', fromJS(idInsulinTypeMap));
  newState = newState.set('insulinIdMap', fromJS(insulinIdMap));
  newState = newState.set('idInsulinMap', fromJS(idInsulinMap));
  newState = newState.set('insulinTypeMap', fromJS(insulinTypeMap));

  /* medication url to name map */
  const medicationData = fromJS(payload.medicationData);
  const medicationUrlToNameMap = medicationData
    .toSeq()
    .reduce((accumulator, medication) => {
      return accumulator.set(medication.get('url'), medication.get('name'));
    }, Map());
  newState = newState.set('medicationUrlToNameMap', medicationUrlToNameMap);
  const medicationNameToUrlMap = medicationData
    .toSeq()
    .reduce((accumulator, medication) => {
      return accumulator.set(medication.get('name'), medication.get('url'));
    }, Map());
  newState = newState.set('medicationNameToUrlMap', medicationNameToUrlMap);
  const medicationNameToFrequencyMap = medicationData
    .toSeq()
    .reduce((accumulator, medication) => {
      return accumulator.set(medication.get('name'), medication.get('dosageFrequency'));
    }, Map());
  newState = newState.set('medicationNameToFrequencyMap', medicationNameToFrequencyMap);
  const medicationUrlToDataMap = medicationData
    .toSeq()
    .reduce((accumulator, medication) => {
      return accumulator.set(medication.get('url'), medication);
    }, Map());
  newState = newState.set('medicationUrlToDataMap', medicationUrlToDataMap);
  /* Class - medication mapping */

  
  const classData = medicationData
    .toSeq()
    .reduce((accumulator, medication) => {
      let currentClassData = accumulator.get(medication.get('type'));
      if (!currentClassData) {
        accumulator = accumulator.set(medication.get('type'), List([{
          medication: medication.get('name'),
          url: medication.get('url'),
          frequency: medication.get('dosageFrequency'),
        }]));
      } else {
        currentClassData = currentClassData.push({
          medication: medication.get('name'),
          url: medication.get('url'),
          frequency: medication.get('dosageFrequency'),
        });
        accumulator = accumulator.set(medication.get('type'), currentClassData);
      }
      return accumulator;
    }, Map());

  const result = classData
  .toSeq()
  .map((medications, name) => {
    const eachClass = fromJS({
      name,
      medications: medications.toJS(),
      // required: requiredClasses.findIndex(name) !== -1,
    });
    return eachClass;
  })
  .toList();
  return newState.set('classDetails', result);
};

const onHtSettingsFetchSuccess = (state, { payload }) => {
  let newState = state.set('htIdToNameMap', payload
    .requiredMedicationDosesData
    .toSeq()
    .reduce((accumulator, data) => {
      return accumulator.set(data.get('id'), data.getIn(['timeWindow', 0]));
    }, Map()));

  const requiredClasses = payload
    .requiredMedicationDosesData
    .toSeq()
    .reduce((accumulator, data) => {
      return accumulator.set(data.get('hyperTensionMedClass'), true);
    }, Map());
  newState = newState.set('requiredClasses', requiredClasses);


  return newState;
};

const onHtSettingsPatchSuccess = (state, { payload }) => {
  let newState = state.set('htIdToNameMap', payload
    .requiredMedicationDosesData
    .toSeq()
    .reduce((accumulator, data) => {
      return accumulator.set(data.get('id'), data.getIn(['timeWindow', 0]));
    }, Map()));

  const requiredClasses = payload
    .requiredMedicationDosesData
    .toSeq()
    .reduce((accumulator, data) => {
      return accumulator.set(data.get('hyperTensionMedClass'), true);
    }, Map());
  newState = newState.set('requiredClasses', requiredClasses);

  const urlMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[`${baseUrl}/api/time-windows/${data.id}/`] = { // eslint-disable-line no-param-reassign
      startTime: data.start_time,
      stopTime: data.stop_time,
    }; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('timeWindowUrlTimeMap', urlMealTimeMap);

  const modalMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = { // eslint-disable-line no-param-reassign
      startTime: data.start_time,
      stopTime: data.stop_time,
    }; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('modalMealTimeMap', modalMealTimeMap);

  const nameMealTimeMap = reduce(payload.timeWindowDisplay, (accumulator, data) => {
    accumulator[data.name] = { // eslint-disable-line no-param-reassign
      startTime: data.start_time,
      stopTime: data.stop_time,
    }; // eslint-disable-line
    return accumulator;
  }, {});
  newState = newState.set('timeWindowNameTimeMap', fromJS(nameMealTimeMap));

  const classData = fromJS(payload.medicationList)
    .toSeq()
    .reduce((accumulator, medication) => {
      let currentClassData = accumulator.get(medication.get('type'));
      if (!currentClassData) {
        // eslint-disable-next-line no-param-reassign
        accumulator = accumulator.set(medication.get('type'), List([{
          medication: medication.get('name'),
          url: medication.get('url'),
          frequency: medication.get('dosageFrequency'),
        }]));
      } else {
        currentClassData = currentClassData.push({
          medication: medication.get('name'),
          url: medication.get('url'),
          frequency: medication.get('dosageFrequency'),
        });
        // eslint-disable-next-line no-param-reassign
        accumulator = accumulator.set(medication.get('type'), currentClassData);
      }
      return accumulator;
    }, Map());

  const result = classData
  .toSeq()
  .map((medications, name) => {
    const eachClass = fromJS({
      name,
      medications: medications.toJS(),
      // required: requiredClasses.findIndex(name) !== -1,
    });
    return eachClass;
  })
  .toList();
  newState = newState.set('classDetails', result);
  return newState;
};

const onUpdateModalTime = (state, { payload }) => {
  let modalMealTimeMap = state.get('modalMealTimeMap');
  modalMealTimeMap[payload.mealName].startTime = payload.startTime;
  modalMealTimeMap[payload.mealName].stopTime = payload.stopTime;
  return state.set('modalMealTimeMap', modalMealTimeMap);
};

export default createReducer(initialState, {
  MEALID_MAP_UPDATE: onTimeWindowFetchSuccess,
  UPDATE_MODAL_TIME: onUpdateModalTime,
  PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS: onPractitionerFetchSuccess,
  HT_SETTINGS_INITIAL_FETCH_REQUEST_SUCCESS: onHtSettingsFetchSuccess,
  HT_OVERVIEW_INITIAL_FETCH_SUCCESS: onHtSettingsFetchSuccess,
  REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_SUCCESS: onHtSettingsPatchSuccess,
});
