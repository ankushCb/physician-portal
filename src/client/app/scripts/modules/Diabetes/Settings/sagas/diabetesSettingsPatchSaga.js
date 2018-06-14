import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from 'axios';

import { logException } from 'scripts/helpers/pushToSentry.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { diabetesSettingsApi } from '../../../../helpers/api.js';


function* diabetesSettingsPatch(action) {
  yield put({ type: 'PATCH_DIABETES_SETTINGS_INITIATED' });
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  try {
    const config = {
      headers: {
        Authorization: localStorage.getItem('token'),
      }
    };
    const { data: diabetesSettingsData } = yield call(request,
      {
        method: 'patch',
        url: diabetesSettingsApi.getDiabetesSettings(action.payload.id),
        data: action.payload.diabetesSettings,
        headers: config.headers,
        timeout: 20000,
      }
    );
    yield put({
      type: 'DIABETES_SETTINGS_PATCH_SUCCESS',
      payload: {
        diabetesSettingsData,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'FETCH_DIABETES_SETTINGS_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    })
  }
}

function* diabetesSettingsPatchSaga() {
  yield takeEvery('DIABETES_SETTINGS_PATCH_REQUEST', diabetesSettingsPatch);
}

export default diabetesSettingsPatchSaga;
