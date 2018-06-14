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

const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedPractitionerIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);

function* mealTimeSaga(action) {
  const patientId = yield select(cachedPatientIdSelector);
  const practitionerId = yield select(cachedPractitionerIdSelector);

  if (action.payload.patientId !== patientId) {
    try {
      const authHeaders = {
        token: localStorage.getItem('token'),
      };

      // look for caching
      if (!practitionerId) {
        yield put({
          type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
        });
        yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
      }
      if (!patientId || (patientId !== action.payload.patientId)) {
        yield put({
          type: 'PATIENT_INITIAL_FETCH_REQUEST',
          payload: {
            patientId: action.payload.patientId,
            forced: true,
          },
        });
        yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
        yield take('MEALID_MAP_UPDATE');
      }
      
      yield put({
        type: 'MEALTIMES_FETCH_SUCCESS',
      });
    } catch (error) {
        logException(error);
        yield put({
          type: 'MEALTIMES_FETCH_FAILURE',
        });
        yield put({
          type: 'ERROR_OCCURED',
          payload: {
            errorMessage: error.message || 'Network timed out',
          }
        });
      }
    } else {
      yield put({
        type: 'CACHED_MEALTIMES',
      });
    }
}

function* mealTimeFetch() {
  yield takeEvery('MEALTIME_INITIAL_FETCH', mealTimeSaga);
}

export default mealTimeFetch;
