import { takeEvery, put, call, select, take, all } from 'redux-saga/effects';
import request from 'axios';
import { fromJS, List, Map, Iterable } from 'immutable';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

import {
  baseUrl,
  hyperTension,
  practitionerApi,
} from 'scripts/helpers/api.js';

import isNull from 'lodash/isNull';
import isEqual from 'lodash/isEqual';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { logException } from 'scripts/helpers/pushToSentry.js';

import { deepSnakeCase, deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { processRequiredMedicationData } from '../../Common/helpers.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers,
});

const generateConfigForPost = (url, data, headers) => ({
  method: 'post',
  url,
  timeout: timeoutDuration,
  data,
  headers,
});

const generateConfigForPatch = (url, data, headers) => ({
  method: 'patch',
  url,
  timeout: timeoutDuration,
  data,
  headers,
});

const generateConfigForDelete = (url, headers) => ({
  method: 'delete',
  url,
  timeout: timeoutDuration,
  headers,
});

const generateMedicationData = (isPsuedoBid, dose, patient, hyperTensionMed, i, timeWindow) => {

  const result = {
    dose: (parseFloat(dose)/(isPsuedoBid ? 2 : 1)).toString(),
    patient,
    dose_unit: 'mg',
    medication: hyperTensionMed,
    schedule_priority: i,
  };
  result.time_windows = timeWindow ? timeWindow : null;
  console.log('api result', result);
  return result;
}

const anyDeletableChange = (data, patchData, headers) => {

  if (data.isInSchedule && patchData.isInSchedule && !isEqual(data.doseDetails.hyperTensionUrl, patchData.doseDetails.hyperTensionUrl)) {
      return [generateConfigForDelete(data.doseDetails.hyperTensionUrl, headers)];
  }
};

const formValueSelector = state => state.getIn(['form', 'hypertensionSettingsForm', 'values']);
const initialScheduleSelector = state => state.getIn(['form', 'hypertensionSettingsForm', 'initial', 'scheduleList']);
const patientUrlSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientData', 'url'])
const getHypertensionUrl = state => state.getIn(['apiData', 'patientCommonData', 'hypertensionSettingsData', 'url']);
const patientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMealIdMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']);
const cachedIdMealMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMedicationUrlToData = state => state.getIn(['derivedData', 'mappingFromApiData', 'medicationUrlToDataMap']);

// const htIdToNameMap
function* settingsPatch(action) {

  const headers = {
    authorization: localStorage.getItem('token'),
  };
  const data = action.payload;

  const formData = yield select(formValueSelector);
  // const patient = yield select(patientUrlSelector);
  const hypertensionUrl = yield select(getHypertensionUrl);
  const patientId = yield select(patientIdSelector);
  const timeWindowUrlToNameMap = yield select(cachedTimeWindowUrlToNameMap);
  const mealIdMap = yield select(cachedMealIdMap);
  const idMealMap = yield select(cachedIdMealMap);
  const initialScheduleList = yield select(initialScheduleSelector);
  const patient = `${baseUrl}/api/patients/${patientId}/`;
  
  try {

    // Take all form related data
    const timeData = formData
      .get('data')
      .toJS();

    const patchData = formData
      .get('scheduleList')
      .toJS();

    const hyperTensionSettingData = deepSnakeCase(
      formData.get('thresholds').toJS()
    );

    // Contains all the necessary patch and delete config
    let toDelete = [];
    let toPatch = [];
    forEach(initialScheduleList.toJS(), (data, index) => {
      const result = anyDeletableChange(data, patchData[index], headers);
      if (result && !isEmpty(result)) {

        toDelete.push(result[0]);
        if (result.length === 2) {
          toDelete.push(result[1]);
        }
      }
    });
    // PATCH HyperTension settings Added here
    toPatch.push(generateConfigForPatch(hypertensionUrl, hyperTensionSettingData, headers));

    // Doing patch of time Windows start
    const timeWindowAmUrl = `${baseUrl}/api/time-windows/${mealIdMap.get('breakfast')}/`;
    const timeWindowAmData = {
      start_time: timeData.am.startTime,
      stop_time: timeData.am.stopTime,
    };
    const timeWindowPmUrl = `${baseUrl}/api/time-windows/${mealIdMap.get('bedtime')}/`;
    const timeWindowPmData = {
      start_time: timeData.pm.startTime,
      stop_time: timeData.pm.stopTime,
    };

    // PATCH Timewindow data
    toPatch.push(generateConfigForPatch(timeWindowAmUrl, timeWindowAmData, headers));
    toPatch.push(generateConfigForPatch(timeWindowPmUrl, timeWindowPmData, headers));
    // Doing patch of time windows ends

    // PATCH each meal
    for (var i = 0; i < patchData.length; i++ ) {
      let data = fromJS(patchData[i]);
      data = data.set('dose', parseFloat(data.get('dose')));
      if (data.get('isInSchedule')) {
        const freq = data.get('hyperTensionMedFrequency');
        if (freq === 'qd') {
          // qd starts here
          console.log('debug came inside qd');
          // Gets whether which meal should be patched
          const shouldPatchAm = data.getIn(['doseDetails', 'isHavingMedication', 0]);
          const shouldPatchPm = data.getIn(['doseDetails', 'isHavingMedication', 2]);
          console.log('debug came inside qd - patch windows', shouldPatchAm, shouldPatchPm);
          // Gets the hypertension URL
          const htUrl = data.getIn(['doseDetails', 'hyperTensionUrl']);
          console.log('debug came inside qd - htUrl', htUrl);
          // Check if it is psuedo BID.
          const isPsuedoBid = (shouldPatchAm && shouldPatchPm);

          const isNullUrls = (urls) => {
            if (Iterable.isIterable(urls)) {
              return !(!isNull(urls.get(0)) || !isNull(urls.get(1)) || !isNull(urls.get(2)));
            } else {
              return isNull(urls)
            }
          }
          let config; 
          const method = isNullUrls(htUrl) ? 'post' : 'patch';
          const hyperTensionMed = data.getIn(['hyperTensionMedUrl']);
          const schedulePriority = data.getIn(['schedulePriority']);
          const dose = data.getIn(['dose']);

          const timeWindowObject = data.getIn(['doseDetails', 'timeWindowUrl']);
          let timeWindow = [];
          if (shouldPatchAm) {
            timeWindow.push(timeWindowObject.get(0));
          }
          if (shouldPatchPm) {
            timeWindow.push(timeWindowObject.get(2));
          }
        
          if (timeWindow.length > 0) {
            if (method === 'post') {
              const url = `${baseUrl}/api/required-doses/`;
              const data = generateMedicationData(isPsuedoBid, dose, patient, hyperTensionMed, schedulePriority, timeWindow);
              const postConfig = generateConfigForPost(url, data, headers);
              toPatch.push(postConfig);
            } else if (method === 'patch') {
              const data = generateMedicationData(isPsuedoBid, dose, patient, hyperTensionMed, schedulePriority, timeWindow);
              const patchConfig = generateConfigForPatch(htUrl, data, headers);
              toPatch.push(patchConfig);
            }
          }
            // qd ends here
          } else {
            // bid or tid starts here
            const htUrl = data.getIn(['doseDetails', 'hyperTensionUrl']);
            const method = isNull(htUrl) ? 'post' : 'patch';
            const hyperTensionMed = data.getIn(['hyperTensionMedUrl']);
            const schedulePriority = data.getIn(['schedulePriority']);
            const dose = data.getIn(['dose']);
            const timeWindowObject = data.getIn(['doseDetails', 'timeWindowUrl']);
  
            const timeWindow = (freq === 'bid') ? [timeWindowObject.get(0), timeWindowObject.get(2)] : timeWindowObject.toJS();

            console.log('hypertensionmed', hyperTensionMed);
            let config;
            if (method === 'post') {
              const url = `${baseUrl}/api/required-doses/`;
              const data = generateMedicationData(false, dose, patient, hyperTensionMed, schedulePriority, timeWindow);
              toPatch.push(generateConfigForPost(url, data, headers));
            } else if (method === 'patch') {
              const data = generateMedicationData(false, dose, patient, hyperTensionMed, schedulePriority, timeWindow);
              toPatch.push(generateConfigForPatch(htUrl, data, headers));
            }
          }
        } else {
          // If not in schedule, check whether to delete it TODO
          let hyperTensionUrl = data.getIn(['doseDetails', 'hyperTensionUrl']);
          if (!isNull(hyperTensionUrl)) {
            toDelete.push(generateConfigForDelete(hyperTensionUrl, headers));
          }
        }
      }
    console.log('toPatch ', toPatch);  
    yield all(map(toPatch, config => call(request, config)));
    yield all(map(toDelete, config => call(request, config)));

      // Refetch whatever required
    const medicationList = yield call(request, getConfigForGet(hyperTension.getMedications(), headers));
    const toFetch = [
      getConfigForGet(hypertensionUrl, headers),
      getConfigForGet(hyperTension.getRequiredMedicationDoses(patientId), headers),
      getConfigForGet(practitionerApi.getTimeWindows(patientId), headers),
    ];
    // fetch time window data also
    const { hypertensionSettingsData, requiredMedicationDosesData, timeWindowData } = yield all({
      hypertensionSettingsData: call(request, toFetch[0]),
      requiredMedicationDosesData: call(request, toFetch[1]),
      timeWindowData: call(request, toFetch[2]),
    });
    const medicationUrlToDataMapping = yield select(cachedMedicationUrlToData);
    const requiredMedicationData = fromJS(deepCamelCase(requiredMedicationDosesData.data.results));
    const medicationData = processRequiredMedicationData(requiredMedicationData, timeWindowUrlToNameMap, mealIdMap, medicationUrlToDataMapping);
    yield put({
      type: 'REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_SUCCESS',
      payload: {
        hypertensionSettingsData: deepCamelCase(hypertensionSettingsData.data),
        requiredMedicationDosesData: medicationData,
        timeWindowDisplay: timeWindowData.data.results,
        medicationList: deepCamelCase(medicationList.data.results),
      },
    });
  } catch (error) {
    logException(error);
    console.log(error);
    yield put({
      type: 'REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_FAILURE',
      payload: {
        success: false,
      },
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    });
  }
}

function* settingsSaga() {
  yield takeEvery('REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_REQUEST', settingsPatch);
}

export default settingsSaga;
