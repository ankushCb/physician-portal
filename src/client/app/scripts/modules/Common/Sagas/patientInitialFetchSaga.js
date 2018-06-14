import { takeEvery, put, call, race, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';

import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import {
  diabetesSettingsApi,
  practitionerApi,
  hyperTension,
} from 'scripts/helpers/api.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

import { logException } from 'scripts/helpers/pushToSentry.js';
import { getCompletePatchData } from 'scripts/helpers/getCompletePatchData.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers,
});

const patientCachedIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);

function* practitionerDetailsFetch(action) {
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  const cachedPatientId = yield select(patientCachedIdSelector);
  if (cachedPatientId !== action.payload.patientId || action.payload.forced) {
    try {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };

      const { timeWindowData, patientData } = yield all({
        timeWindowData: call(request, getConfigForGet(practitionerApi.getTimeWindows(action.payload.patientId), headers)),
        patientData: call(request, getConfigForGet(practitionerApi.getPatientList(action.payload.patientId), headers)),
      });

      /*
          Validation Module to check whether timeWindow patch is reflecting in backend
      */
      if (action.payload.shouldValidate) {
        const {
          payload: {
            initialTimeWindowPatchData: twPatchData,
            initialDiabetesSettingsData: DiabetesPatchData,
            initialRegimenData: regimenData,
          },
        } = action;
        const extractInitialTimewindowPatchData = getCompletePatchData(twPatchData, DiabetesPatchData, regimenData);
        try {
          if (false) {
            yield put({
              type: 'ERROR_OCCURED',
              payload: {
                errorMessage: 'Time Window and Medication Data is not updated properly. Please try again',
              },
            });
          }
        } catch (e) {
          yield put({
            type: 'ERROR_OCCURED',
            payload: {
              errorMessage: `Error in validating patched response - ${e.message}`,
            },
          });
        }
      }

      const isHavingHypertension = !(isNull(patientData.data.hypertension_settings) || isUndefined(patientData.data.hypertension_settings));
      const diabetesSettingsData = yield call(request, getConfigForGet(patientData.data.diabetes_settings.url, headers));
      let hypertensionSettingsApiData;

      if (isHavingHypertension) {
        hypertensionSettingsApiData = yield call(request, getConfigForGet(patientData.data.hypertension_settings.url, headers));
      }
      const modifiedTimeWindowData = timeWindowData.data.results;
      yield put({
        type: 'TIMEWINDOW_DISPLAY_UPDATE_REQUEST',
        payload: {
          forced: action.payload.forced,
          timeWindowData: modifiedTimeWindowData,
        },
      });

      const patientDataPayload = {
        patientData: deepCamelCase(patientData.data),
        timeWindowData: timeWindowData.data.results,
        diabetesSettingsData: deepCamelCase(diabetesSettingsData.data),
        isHavingHypertension,
        patientId: action.payload.patientId,
      };

      const hypertensionSettingsData = isHavingHypertension ? deepCamelCase(hypertensionSettingsApiData.data) : null;

      if (isHavingHypertension) {
        patientDataPayload.hypertensionSettingsData = hypertensionSettingsData;
      }

      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST_SUCCESS',
        payload: {
          ...patientDataPayload,
        },
      });
    } catch (e) {
      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST_FAILURE',
      });
      yield put({
        type: 'ERROR_OCCURED',
        payload: {
          errorMessage: e.message || 'Network timed out',
        },
      });
    }
  } else {
    yield put({
      type: 'CACHED_PATIENT_INITIAL_FETCH_REQUEST',
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('PATIENT_INITIAL_FETCH_REQUEST', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
