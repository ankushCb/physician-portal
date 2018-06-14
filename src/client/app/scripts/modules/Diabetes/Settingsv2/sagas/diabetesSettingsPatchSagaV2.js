import { takeEvery, put, call } from 'redux-saga/effects';
import request from 'axios';

import { generateDiabetesSettingsPatchData } from '../../../../helpers/timeWindowHelpers';
import { logException } from '../../../../helpers/pushToSentry.js';

const generatePatchConfig = (patchUrl, diabetesSettings) => ({
  method: 'patch',
  url: patchUrl,
  timeout: 20000,
  data: diabetesSettings,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* diabetesSettingsPatch(action) {
  yield put({ type: 'PATCH_DIABETES_SETTINGS_INITIATED' });
  const {
    diabetesSettingsUrl,
    diabetesThresholds,
    regimenData,
    correctionalDetails,
    selectedInsulins,
    insulinList,
    correctionalTable,
  } = action.payload;

  try {
    const settings = generateDiabetesSettingsPatchData(
      diabetesThresholds,
      regimenData,
      correctionalDetails,
      selectedInsulins,
      insulinList,
      correctionalTable,
    );
    const { data: diabetesSettingsData } = yield call(request, generatePatchConfig(diabetesSettingsUrl, settings));
    yield put({
      type: 'DIABETES_SETTINGS_PATCH_SUCCESS_V2',
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
      },
    });
  }
}

function* diabetesSettingsPatchSaga() {
  yield takeEvery('DIABETES_SETTINGS_PATCH_REQUEST_V2', diabetesSettingsPatch);
}

export default diabetesSettingsPatchSaga;
