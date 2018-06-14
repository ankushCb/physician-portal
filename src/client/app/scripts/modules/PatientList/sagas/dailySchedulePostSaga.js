import { takeEvery, put, call, race, spawn } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import moment from 'moment';
import toLower from 'lodash/toLower';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { practitionerApi } from 'scripts/helpers/api.js';

import { deepSnakeCase } from 'scripts/helpers/deepCaseConvert.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

import { patientListFetch } from './patientListFetchSaga.js';

const generateConfigForPost = (url, authHeaders, data) => ({
  method: 'post',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* reloadPractionionerPatientList(newPatientId) {
  const actionPayload = {
    payload: {
      id: newPatientId,
    },
  };

  yield spawn(patientListFetch, actionPayload);
}

function* dailySchedulePost(action) {
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  try {
    const apiFormData = action.payload.data.toJS();
    const formData = {
      ...apiFormData,
      email: toLower(apiFormData.email),
      birthdate: moment(apiFormData.birthdate).format('YYYY-MM-DD'),
    };

    const config = generateConfigForPost(practitionerApi.onBoarding(), authHeaders, deepSnakeCase(formData));

    const apiData = yield race({
      dailyScheduleData: call(request, config),
      timeout: call(delay, timeoutDuration),
    });

    const { dailyScheduleData } = apiData;

    yield put({
      type: 'DAILY_SCHEDULE_POST_SUCCESS',
      payload: {
        onBoardData: dailyScheduleData.data.id,
      },
    });

    const onBoardedPatientId = dailyScheduleData.data.id;

    yield spawn(reloadPractionionerPatientList, onBoardedPatientId);
  } catch (error) {
    logException(error);
    yield put({
      type: 'DAILY_SCHEDULE_POST_FAILURE',
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

function* dailySchedulePostSaga() {
  yield takeEvery('DAILY_SCHEDULE_POST', dailySchedulePost);
}

export default dailySchedulePostSaga;
