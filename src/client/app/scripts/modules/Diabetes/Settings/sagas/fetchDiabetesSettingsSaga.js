import { takeEvery, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

import { diabetesSettingsApi } from '../../../helpers/api.js';

function* patientDetailsFetch(action) {
  yield put({ type: 'FETCH_DIABETES_SETTINGS_REQUEST_INITIATED' });
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  try {
    const config = {
      method: 'get',
      url: diabetesSettingsApi.getDiabetesSettings(action.payload.id),
      ...authHeaders,
    };

    const apiData = yield race({
      diabetesSettings: call(request, config),
      timeout: call(delay, timeoutDuration),
    });

    const { diabetesSettings } = apiData;

    yield put({
      type: 'FETCH_DIABETES_SETTINGS_SUCCESS',
      payload: {
        diabetesSettings: diabetesSettings.data,
        success: true,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'FETCH_DIABETES_SETTINGS_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* patientDetailsFetchSaga() {
  yield takeEvery('FETCH_DIABETES_SETTINGS_REQUEST', patientDetailsFetch);
}

export default patientDetailsFetchSaga;
