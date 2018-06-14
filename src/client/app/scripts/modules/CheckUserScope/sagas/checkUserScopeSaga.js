import { takeEvery, take, put, call, race, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { fromJS, Map, List } from 'immutable';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

import {
   practitionerApi,
   baseUrl,
   userApi,
} from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
// import { getNetworkCallStatus } from '../selectors/index.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers,
});

function* practitionerDetailsFetch(action) {
  const authHeaders = {
    Authorization: localStorage.getItem('token'),
  };

  try {
    const meResponse = yield call(request, getConfigForGet(practitionerApi.getMe(), authHeaders));
    const {
      data: {
        id: userId,
      }
    } = meResponse;
    const userData = yield call(request, getConfigForGet(userApi.getUser(userId), authHeaders));
    const {
      data: {
        is_practitioner: isPractitioner,
        first_name,
        last_name,
        id,
        url,
        practitioner,
        email,
      },
    } = userData;
    // const isPractitioner = true;
    if (isPractitioner) {
      yield put({
        type: 'IS_A_PRACTITIONER',
        payload: {
          userData: deepCamelCase({
            first_name,
            last_name,
            id,
            url,
            practitioner,
            email,
          })
        }
      });
    } else {
      yield put({
        type: 'IS_A_PATIENT',
      });
    }
  } catch (e) {
    yield put({
      type: 'CHECK_USER_SCOPE_FAILURE',
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('CHECK_USER_SCOPE', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
