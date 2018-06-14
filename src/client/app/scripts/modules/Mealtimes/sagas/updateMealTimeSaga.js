import { takeEvery, put, call, select, all, take } from 'redux-saga/effects';
import request from 'axios';
import moment from 'moment';
import { fromJS, List, Map } from 'immutable';
import map from 'lodash/map';

import {
  baseUrl,
 } from 'scripts/helpers/api.js';

import { logException } from 'scripts/helpers/pushToSentry.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';

const prepareForGet = (url, patientId) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const getConfigForPatch = (url, data) => ({
  method: 'patch',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* mealTimeSaga(action) {

  try {
    const {
      payload: {
        url,
        startTime,
        stopTime,
        patientId,
      }
    } = action;
    yield call(request, getConfigForPatch(url, {
      start_time: startTime,
      stop_time: stopTime,
    }));
    yield put({
      type: 'PATIENT_INITIAL_FETCH_REQUEST',
      payload: {
        forced: true,
        patientId,
      },
    });
    yield put({
      type: 'UPDATE_MEAL_TIME_SUCCESS',
    })
  } catch (error) {
    logException(error);
    yield put({
      type: 'UPDATE_MEAL_TIME_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    });
  }
}

function* mealTimeFetch() {
  yield takeEvery('UPDATE_MEAL_TIME', mealTimeSaga);
}

export default mealTimeFetch;
