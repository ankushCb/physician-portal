import { takeEvery, take, put, call, race, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { fromJS, Map, List } from 'immutable';
import moment from 'moment';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

import {
   hyperTension,
   baseUrl,
   practitionerApi,
} from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
// import { getNetworkCallStatus } from '../selectors/index.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  headers,
  timeout: timeoutDuration,
});

const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedPractitionerIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);

const getIdFromUrl = (url, baseUrl) => {
  const apiUrl = baseUrl + '/api/time-windows/';
  const resultUrl = url.replace(apiUrl, '');
  return resultUrl.substring(0, resultUrl.length-1);
};

function* practitionerDetailsFetch(action) {
  const authHeaders = {
    authorization: localStorage.getItem('token'),
  };

  try {
    const cachedPatientId = yield select(cachedPatientIdSelector);
    const cachedPractitionerId = yield select(cachedPractitionerIdSelector);

    // look for caching and compare if it is different patient
    if (cachedPatientId !== action.payload.patientId) {
      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST',
        payload: {
          patientId: action.payload.patientId,
        },
      });
      yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
    }
    
    // look for caching
    if (!cachedPractitionerId) {
      yield put({
        type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
      });
      yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
    }

    const currentDate = moment();
    const options = {
      currentDate: moment(),
      id: action.payload.patientId,
      previousCount: 0,
      limit: 30,
    }
    const lastThirtyDaysData = yield call(request, getConfigForGet(practitionerApi.getBgReadings(options), authHeaders));
    const {
      data: {
        results: lastThirtyDaysBgReadings
      }
    } = lastThirtyDaysData;

    yield put({
      type: 'DIABETES_DISPLAY_INITIAL_FETCH_REQUEST_SUCCESS',
      payload: {
        lastThirtyDaysBgReadings: deepCamelCase(lastThirtyDaysBgReadings),
      }
    });
  } catch (e) {
    yield put({
      type: 'DIABETES_DISPLAY_INITIAL_FETCH_REQUEST_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      errorMessage: e.message || 'Network timed out',
    })
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('DIABETES_DISPLAY_INITIAL_FETCH_REQUEST', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
