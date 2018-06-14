import { put, call, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { practitionerApi } from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

export function* patientListFetch(action) {
  yield put({ type: 'PRACTITIONER_PATIENTLIST_FETCH_INITIATED' });
  const headers = {
    Authorization: localStorage.getItem('token'),
  };
  try {
    let id;
    let isWithId = false;
    if (action.payload && action.payload.id) {
      id = action.payload.id; // eslint-disable-line
      isWithId = true;
    }
    const config = {
      method: 'get',
      url: practitionerApi.getPatientList(id),
      headers,
    };

    const apiData = yield race({
      patientList: call(request, config),
      timeout: call(delay, timeoutDuration),
    });

    const { patientList } = apiData;

    yield put({
      type: 'PRACTITIONER_PATIENTLIST_FETCH_SUCCESS',
      payload: {
        patientList: isWithId ? deepCamelCase(patientList.data) : deepCamelCase(patientList.data.results),
        id: action.payload ? action.payload.id : '',
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'PRACTITIONER_PATIENTLIST_FETCH_FAILURE',
      id: '',
      payload: {},
    });
  }
}
