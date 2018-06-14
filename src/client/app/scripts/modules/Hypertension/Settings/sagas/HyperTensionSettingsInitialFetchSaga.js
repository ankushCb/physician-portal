import { takeEvery, take, put, call, race, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { fromJS, Map, List } from 'immutable';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { processRequiredMedicationData } from '../../Common/helpers.js';

import {
   hyperTension,
   baseUrl,
} from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
// import { getNetworkCallStatus } from '../selectors/index.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers,
});

const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedPractitionerIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMealIdMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']);
const cachedIdMealMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMedicationUrlToData = state => state.getIn(['derivedData', 'mappingFromApiData', 'medicationUrlToDataMap']);
const isHavingHypertensionSelector = state => state.getIn(['apiData', 'patientCommonData', 'isHavingHypertension']);
function* practitionerDetailsFetch(action) {
  const authHeaders = {
    Authorization: localStorage.getItem('token'),
  };

  try {
    const cachedPatientId = yield select(cachedPatientIdSelector);
    const cachedPractitionerId = yield select(cachedPractitionerIdSelector);
    
    // look for caching and compare if it is different patient
    if (cachedPatientId !== action.payload.patientId) {
      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST',
        payload: {
          patientId: action.payload.patientId,
          forced: action.payload.forced,
        },
      });
      yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
    }
    // look for caching
    if (!cachedPractitionerId) {
      yield put({
        type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
        payload: {
          forced: action.payload.forced,
        }
      });
      yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
    }
    const isHavingHypertension = yield select(isHavingHypertensionSelector);
    if (!isHavingHypertension) {
      yield put({
        type: 'ADD_HYPERTENSION_SETTINGS',
        payload: {
          patientId: action.payload.patientId,
        }
      });
      yield take('ADD_HYPERTENSION_SETTINGS_SUCCESS');
    }

    const mealIdMap = yield select(cachedMealIdMap);
    const idMealMap = yield select(cachedIdMealMap);
    const medicationUrlToDataMapping = yield select(cachedMedicationUrlToData);

    const timeWindowUrlToNameMap = yield select(cachedTimeWindowUrlToNameMap);
    const apiData = yield call(request, getConfigForGet(hyperTension.getRequiredMedicationDoses(action.payload.patientId), authHeaders));
    // fetch current patient related HT settings

    const requiredMedicationDosesData = fromJS(deepCamelCase(apiData.data.results));
    const medicationData = processRequiredMedicationData(requiredMedicationDosesData, timeWindowUrlToNameMap, mealIdMap, medicationUrlToDataMapping);
    
    yield put({
      type: 'HT_SETTINGS_INITIAL_FETCH_REQUEST_SUCCESS',
      payload: {
        requiredMedicationDosesData: medicationData,
      },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: 'HT_SETTINGS_INITIAL_FETCH_REQUEST_FAILURE',
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('HT_SETTINGS_INITIAL_FETCH_REQUEST', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
