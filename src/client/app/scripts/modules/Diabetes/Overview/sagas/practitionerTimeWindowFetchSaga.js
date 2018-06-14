import { takeEvery, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { practitionerApi } from 'scripts/helpers/api.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

function* practitionerTimeWindowFetch(action) {
  yield put({ type: 'PRACTITIONER_TIMEWINDOWS_FETCH_INITIATED' });
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    }
  };
  try {
    const config = {
      method: 'get',
      url: practitionerApi.getTimeWindows(action.payload.id),
      ...authHeaders,
    };
    const apiData = yield race({
      practitionerTimeWindow: call(request, config),
      timeout: call(delay, timeoutDuration),
    });

    const { practitionerTimeWindow } = apiData;
    yield put({
      type: 'PRACTITIONER_TIMEWINDOWS_FETCH_SUCCESS',
      payload: {
        practitionerTimeWindow: deepCamelCase(practitionerTimeWindow.data.results),
        success: true,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'PRACTITIONER_TIMEWINDOWS_FETCH_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* timeWindowFetchSaga() {
  yield takeEvery('PRACTITIONER_TIMEWINDOWS_FETCH_REQUEST', practitionerTimeWindowFetch);
}

export default timeWindowFetchSaga;
