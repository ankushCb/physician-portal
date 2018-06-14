import { takeEvery, put, call, all, select, take } from 'redux-saga/effects';
import request from 'axios';
import map from 'lodash/map';

import {
  baseUrl,
  practitionerApi,
  hyperTension,
} from 'scripts/helpers/api.js';

import { logException } from 'scripts/helpers/pushToSentry.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';

const generatePostConfig = (id, authHeaders, data) => ({
  method: 'post',
  url: `${baseUrl}/api/hypertension-settings/`,
  data,
  timeout: timeoutDuration,
  headers: {
    ...authHeaders,
  },
});

const generatePatchConfig = (url, authHeaders, data) => ({
  method: 'patch',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    ...authHeaders,
  },
});

const patientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const patientUrlSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientData', 'url']);
const practitionerUrlSelector = state => state.getIn(['apiData', 'patientCommonData', 'diabetesSettingsData', 'primaryPractitioner']);
const dosedrUrlSelector = state => state.getIn(['apiData', 'patientCommonData', 'diabetesSettingsData', 'dosedr']);
const timeWindowUrlSelector = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealNameMap']);

function* timeWindowPatch(action) {

  const authHeaders = {
    Authorization: localStorage.getItem('token'),
  };

  const data = action.payload;

  const patientId = yield select(patientIdSelector);
  const patientUrl = `${baseUrl}/api/patients/${patientId}/`;
  const practitionerUrl = yield select(practitionerUrlSelector);
  const dosedrUrl = yield select(dosedrUrlSelector);

  const postData = {
    reminders_on: false,
    hypotension_threshold: 70,
    hypertension_threshold_mild: 140,
    hypertension_threshold_severe: 200,
    patient: patientUrl,
    primary_practitioner: practitionerUrl || null,
    dosedr: dosedrUrl || null,
  };
  try {
    const config = generatePostConfig(patientId, authHeaders, postData);
    
    // On successful post of hyper tension settings
    const mealNameUrlMap = yield select(timeWindowUrlSelector);

    const patchData = {
      bp_check_required: true,
    };
    const allPatches = [
      generatePatchConfig(mealNameUrlMap.get('breakfast'), authHeaders, patchData),
      generatePatchConfig(mealNameUrlMap.get('lunch'), authHeaders, patchData),
      generatePatchConfig(mealNameUrlMap.get('dinner'), authHeaders, patchData),
    ] 
    
    yield all(map(allPatches, eachPatch => call(request, eachPatch)));
    yield call(request, config);
    yield put({
      type: 'PATIENT_INITIAL_FETCH_REQUEST',
      payload: {
        patientId,
        forced: true,
      },
    });
    yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
    yield put({
      type: 'ADD_HYPERTENSION_SETTINGS_SUCCESS',
    })
  } catch (error) {
    logException(error);
    yield put({
      type: 'ADD_HYPERTENSION_SETTINGS_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    })
  }
}

function* AddHypertensionSaga() {
  yield takeEvery('ADD_HYPERTENSION_SETTINGS', timeWindowPatch);
}

export default AddHypertensionSaga;
