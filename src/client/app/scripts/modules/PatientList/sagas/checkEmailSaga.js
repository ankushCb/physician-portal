import { takeEvery, put, call, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { practitionerApi } from 'scripts/helpers/api.js';

import { deepSnakeCase } from 'scripts/helpers/deepCaseConvert.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

const generateConfigForPost = (url, authHeaders, data) => ({
  method: 'post',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* checkEmail(action) {
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  try {
    const config = generateConfigForPost(practitionerApi.checkEmailPhone(), authHeaders, deepSnakeCase(action.payload.data));
    yield race({
      emailData: call(request, config),
      timeout: call(delay, timeoutDuration),
    });
    yield put({
      type: 'CHECK_EMAIL_SUCCESS',
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'CHECK_EMAIL_REPEATED',
    });
  }
}

function* checkEmailSaga() {
  yield takeEvery('CHECK_EMAIL', checkEmail);
}

export default checkEmailSaga;
