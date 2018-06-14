import { takeEvery, put, call, all } from 'redux-saga/effects';
import request from 'axios';
import split from 'lodash/split';

import { convertToPatchData } from '../../../../../helpers/timeWindowHelpers';
import { timeWindowApi } from '../../../../../helpers/api.js';
import { timeoutDuration } from '../../../../../helpers/appConfig.js';
import { logException } from '../../../../../helpers/pushToSentry.js';

const generatePatchConfig = (id, data) => ({
  method: 'patch',
  url: timeWindowApi.patchTimeWindows(id),
  timeout: timeoutDuration,
  data,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* timeWindowPatch(action) {
  yield put({ type: 'TIMEWINDOW_PATCH_REQUEST_INITIATED' });
  const { scheduleData, selectedInsulins, regimenData, insulinList, patientId } = action.payload;

  try {
    yield all(scheduleData.map((meal) => {
      const mealId = split(meal.patchUrl, '/')[5];
      const mealPatchData = convertToPatchData(meal, selectedInsulins, regimenData, insulinList, patientId);
      return call(request, generatePatchConfig(mealId, mealPatchData));
    }));

    yield put({ type: 'TIMEWINDOW_PATCH_REQUEST_SUCCESS' });
  } catch (error) {
    logException(error);
    yield put({
      type: 'TIMEWINDOW_PATCH_REQUEST_FAILURE',
      payload: { success: false },
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      },
    });
  }
}

function* timeWindowSaga() {
  yield takeEvery('TIMEWINDOW_PATCH_REQUEST_V2', timeWindowPatch);
}

export default timeWindowSaga;
