import { takeEvery, put, call } from 'redux-saga/effects';
import request from 'axios';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import {
  practitionerApi,
} from 'scripts/helpers/api.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers: {
    ...headers,
  },
});

function* practitionerDetailsFetch(action) {
  const authHeaders = {
    Authorization: localStorage.getItem('token'),
  };

  try {
    const bgReadingsData = yield call(request, getConfigForGet(practitionerApi.getBgReadings(action.payload), authHeaders));
    const insulinDosesData = yield call(request, getConfigForGet(practitionerApi.getInsulinDoses(action.payload), authHeaders));


    yield put({
      type: 'DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST_SUCCESS',
      payload: {
        bgReadingsData: bgReadingsData.data.results,
        insulinDosesData: insulinDosesData.data.results,
        currentDate: action.payload.currentDate.clone().subtract({ days: action.payload.previousCount }).format('DD/MM/YYYY'),
        limit: action.payload.limit,
      },
    });
  } catch (e) {
    yield put({
      type: 'DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: e.message || 'Network timed out',
      }
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
