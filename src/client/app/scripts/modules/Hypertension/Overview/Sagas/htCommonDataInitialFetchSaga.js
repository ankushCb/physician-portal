import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import request from 'axios';

import { hyperTension } from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';

const prepareForGet = (url, authHeaders) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  ...authHeaders,
});

function* commonDataFetchTask(action) {
  try {
    const authHeaders = yield {
      headers: {
        Authorization: localStorage.getItem('token'),
      }
    };
    const { hyperTensionData, timeWindowsData, medicationsData, perDayMedicationsData } = yield all({
      hyperTensionData: call(request, prepareForGet(hyperTension.hyperTensionSettings(action.payload.htId), authHeaders)),
      timeWindowsData: call(request, prepareForGet(hyperTension.timeWindows(), authHeaders)),
      medicationsData: call(request, prepareForGet(hyperTension.medications(), authHeaders)),
      perDayMedicationsData: call(request, prepareForGet(hyperTension.requiredMedicationDoses(), authHeaders)),
    });

    yield put({
      type: 'HT_COMMONDATA_INITIAL_FETCH_SUCCESS',
      payload: {
        patientId: action.payload.patientId,
        hyperTensionData: hyperTensionData.data,
        timeWindowsData: timeWindowsData.data.results,
        medicationsData: medicationsData.data.results,
        perDayMedicationsData: perDayMedicationsData.data.results,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'HT_COMMONDATA_INITIAL_FETCH_FAILURE',
    });
  }
}

function* commonDataFetchInitialFetchSaga() {
  yield takeEvery('HT_COMMONDATA_INITIAL_FETCH', commonDataFetchTask);
}

export default commonDataFetchInitialFetchSaga;
