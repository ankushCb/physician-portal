import { takeEvery, put, call, all } from 'redux-saga/effects';
import request from 'axios';

import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import {
  practitionerApi,
  reminders,
  baseUrl,
} from 'scripts/helpers/api.js';

import { logException } from 'scripts/helpers/pushToSentry.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers,
});

const generateConfigForPost = (url, data) => ({
  method: 'post',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const frequencyMap = {
  q6H: ['breakfast', 'lunch', 'dinner', 'bedtime'],
  q8H: ['breakfast', 'lunch', 'dinner'],
  q12H: ['breakfast', 'dinner'],
  q24HAM: ['breakfast'],
  q24HPM: ['bedtime'],
  qWakeup: ['morning'],
  q24HLunch: ['lunch'],
  q24Dinner: ['dinner'],
};

const synonymMap = {
  q6H: 'q6H',
  qiD: 'q6H',
  '4x/day': 'q6H',
  qAc: 'q6H',
  qACHS: 'q6H',
  q8H: 'q8H',
  tid: 'q8H',
  '3x/day': 'q8H',
  q12H: 'q12H',
  biD: 'q12H',
  '2x/day': 'q12H',
  q24H: 'q24HAM',
  qDay: 'q24HAM',
  qD: 'q24HAM',
  Daily: 'q24HAM',
  '1x/day': 'q24HAM',
  qAM: 'q24HAM',
  Wakeup: 'qWakeup',
  Breakfast: 'q24HAM',
  qHS: 'q24HPM',
  qNight: 'q24HPM',
  qPM: 'q24HPM',
  Lunch: 'q24HLunch',
  Bedtime: 'q24HPM',
  Dinner: 'q24Dinner',
};

function* updateCare(action) {
  const headers = {
    Authorization: localStorage.getItem('token'),
  };
  try {
    const careData = action.payload.data.toJS();
    const {
      payload: {
        patientId,
      },
    } = action;

    const { timeWindowData } = yield all({
      timeWindowData: call(request, getConfigForGet(practitionerApi.getTimeWindows(action.payload.patientId), headers)),
    });
    // console.log('timew ', timeWindowData);
    const mealNameToUrlMap = reduce(timeWindowData.data.results, (accumulator, tw) => {
      accumulator[tw.name] = tw.url; // eslint-disable-line
      return accumulator;
    }, {});
    const toPost = [];

    const generateCareInputData = (data) => {
      return {
        dose: data.medicationDose,
        medication: data.medicationName,
        patient: `${baseUrl}/api/patients/${patientId}/`,
        time_windows: map(frequencyMap[synonymMap[data.frequencyName]], freq => mealNameToUrlMap[freq]),
      };
    };

    forEach(careData.row, (data) => {
      if (
        !isEmpty(data) &&
        data.medicationName !== '' &&
        data.medicationDose !== '' &&
        data.unitName !== '' &&
        data.frequencyName !== ''
      ) {
        const postData = generateCareInputData(data);
        console.log('care data ', data, postData);
        toPost.push(generateConfigForPost(
          reminders.postReminders(patientId),
          postData,
          headers,
        ));
      }
    });
    yield all(map(toPost, config => call(request, config)));

    yield put({
      type: 'UPDATE_CARE_SUCCESS',
    });
  } catch (error) {
    logException(error);
    // console.log(error);
    yield put({
      type: 'UPDATE_CARE_FAILURE',
      payload: {
        errorMessage: error.message || 'Network timed out',
      },
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      },
    });
  }
}

function* updateCareSaga() {
  yield takeEvery('SUBMIT_CARE_DATA', updateCare);
}

export default updateCareSaga;
