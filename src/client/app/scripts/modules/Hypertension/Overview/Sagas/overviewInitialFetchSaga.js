import { takeEvery, put, call, select, all, take } from 'redux-saga/effects';
import request from 'axios';
import moment from 'moment';
import { fromJS, List, Map } from 'immutable';

import { hyperTension, baseUrl } from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { processRequiredMedicationData, getIdFromUrl } from '../../Common/helpers.js';

const prepareForGet = url => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedPractitionerIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMealIdMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']);
const cachedIdMealMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);
const cachedMedicationUrlToData = state => state.getIn(['derivedData', 'mappingFromApiData', 'medicationUrlToDataMap']);

function* overviewTask(action) {
  try {
    const authHeaders = {
      headers: {
        Authorization: localStorage.getItem('token'),
      }
    };
    const cachedPatientId = yield select(cachedPatientIdSelector);
    const cachedPractitionerId = yield select(cachedPractitionerIdSelector);

    if (cachedPatientId !== action.payload.patientId) {
      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST',
        payload: {
          patientId: action.payload.patientId,
        },
      });
      yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
    }

    // look for caching
    if (!cachedPractitionerId) {
      yield put({
        type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
      });
      yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
    }

    const limit = action.payload.limit;
    const offset = action.payload.offset;
    const medicationUrlToDataMapping = yield select(cachedMedicationUrlToData);
    const currentDate = moment().startOf('day').subtract({ days: (limit * offset) }).format('YYYY-MM-DDT00:00:00');
    const backholdDate = moment().startOf('day').subtract({ days: limit - ((limit * offset) + 1) }).format('YYYY-MM-DDT00:00:00');

    const pastThirtyStartDate = moment().startOf('day').format('YYYY-MM-DDT00:00:00');
    const pastThirtyEndDate = moment().startOf('day').subtract({ days: 29 }).format('YYYY-MM-DDT00:00:00');

    const { bpReadingsThirtyDaysData, requiredMedicationDosesData, bpReadingsCurrentDurationData, loggedMedicationDosesData } = yield all({
      bpReadingsThirtyDaysData: call(request, prepareForGet(hyperTension.getBpReadings(pastThirtyEndDate, pastThirtyStartDate, action.payload.patientId), authHeaders)),
      requiredMedicationDosesData: call(request, prepareForGet(hyperTension.getRequiredMedicationDoses(action.payload.patientId), authHeaders)),
      bpReadingsCurrentDurationData: call(request, prepareForGet(hyperTension.getBpReadings(backholdDate, currentDate, action.payload.patientId), authHeaders)),
      loggedMedicationDosesData: call(request, prepareForGet(hyperTension.getMedicationDoses(backholdDate, currentDate, action.payload.patientId), authHeaders)),
    });

    const mealIdMap = yield select(cachedMealIdMap);
    const idMealMap = yield select(cachedIdMealMap);
    const timeWindowUrlToNameMap = yield select(cachedTimeWindowUrlToNameMap);
    // fetch current patient related HT settings
    const medicationDosesData = fromJS(deepCamelCase(requiredMedicationDosesData.data.results));
    const medicationData = processRequiredMedicationData(medicationDosesData, timeWindowUrlToNameMap, mealIdMap, medicationUrlToDataMapping, idMealMap);

    const loggedMedicationData = fromJS(deepCamelCase(loggedMedicationDosesData.data.results));
    const loggedData = loggedMedicationData
      .toSeq()
      .reduce((accumulator, medication) => {
        const url = medication.get('timeWindow');
        const timeWindowId = getIdFromUrl(url, baseUrl, '/api/time-windows/');
        let medicationObject = Map();
        medicationObject = medicationObject.set('dose', medication.get('dose'));
        medicationObject = medicationObject.set('id', medication.get('id'));
        medicationObject = medicationObject.set('date', moment(medication.get('logDatetime')).format('YYYY-MM-DD'));
        medicationObject = medicationObject.set('timeWindow', timeWindowUrlToNameMap.get(timeWindowId));
        medicationObject = medicationObject.set('hyperTensionMedName', medication.getIn(['hypertensionMed', 'name']));
        medicationObject = medicationObject.set('hyperTensionMedUrl', medication.getIn(['hypertensionMed', 'url']));
        return accumulator.push(medicationObject);
      }, List());
    yield put({
      type: 'HT_OVERVIEW_INITIAL_FETCH_SUCCESS',
      payload: {
        bpReadingsThirtyDaysData: deepCamelCase(bpReadingsThirtyDaysData.data.results),
        bpReadingsCurrentDurationData: deepCamelCase(bpReadingsCurrentDurationData.data.results),
        loggedMedicationDosesData: loggedData,
        requiredMedicationDosesData: medicationData,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'HT_OVERVIEW_INITIAL_FETCH_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      },
    });
  }
}

function* overviewInitialFetchSaga() {
  yield takeEvery('HT_OVERVIEW_INITIAL_FETCH', overviewTask);
}

export default overviewInitialFetchSaga;
