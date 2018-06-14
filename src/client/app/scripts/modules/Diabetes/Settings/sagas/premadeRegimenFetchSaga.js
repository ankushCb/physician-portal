import { takeEvery, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

import { premadeRegimenApi } from '../../../helpers/api.js';

function* premadeRegimenFetch() {
  yield put({ type: 'PREMADE_REGIMEN_FETCH_INITIATED' });
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  try {
    const config = {
      method: 'get',
      url: premadeRegimenApi.getPremadeRegimen(),
      timeout: 10,
      ...authHeaders,
    };

    const apiData = yield race({
      regimenData: call(request, config),
      timeout: call(delay, timeoutDuration),
    });

    const { regimenData } = apiData;
    yield put({
      type: 'PREMADE_REGIMEN_FETCH_SUCCESS',
      payload: {
        regimenData: regimenData.data,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'PREMADE_REGIMEN_FETCH_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* premadeRegimenFetchSaga() {
  yield takeEvery('PREMADE_REGIMEN_FETCH_REQUEST', premadeRegimenFetch);
}

export default premadeRegimenFetchSaga;
