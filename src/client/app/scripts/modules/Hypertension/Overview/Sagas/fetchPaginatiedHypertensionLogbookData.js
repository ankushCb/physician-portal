import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import request from 'axios';
import moment from 'moment';
import { baseUrl, hyperTension } from 'scripts/helpers/api.js';
import { fromJS, List, Map } from 'immutable';


import { logException } from 'scripts/helpers/pushToSentry.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { getIdFromUrl } from '../../Common/helpers.js';

const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);


const prepareForGet = url => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

function* overviewTask(action) {
  try {
    const authHeaders = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };
    const patientId = yield select(cachedPatientIdSelector);
    const currentDate = action.payload.date;
    const backholdDate = currentDate.clone().subtract({ days: action.payload.limit - 1 });

    const { bpReadingsCurrentDurationData, loggedMedicationDosesData } = yield all({
      bpReadingsCurrentDurationData: call(request, prepareForGet(hyperTension.getBpReadings(backholdDate.format('YYYY-MM-DDT00:00:00'), currentDate.format('YYYY-MM-DDT23:59:59'), patientId), authHeaders)),
      loggedMedicationDosesData: call(request, prepareForGet(hyperTension.getMedicationDoses(backholdDate.format('YYYY-MM-DDT00:00:00'), currentDate.format('YYYY-MM-DDT23:59:59'), patientId), authHeaders)),
    });
    const loggedMedicationData = fromJS(deepCamelCase(loggedMedicationDosesData.data.results));
    const timeWindowUrlToNameMap = yield select(cachedTimeWindowUrlToNameMap);
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
      type: 'HT_OVERVIEW_LOG_UPDATED_FETCH_SUCCESS',
      payload: {
        bpReadingsCurrentDurationData: deepCamelCase(bpReadingsCurrentDurationData.data.results),
        loggedMedicationDosesData: loggedData,
        currentDate: currentDate.format('YYYY-MM-DDT00:00:00'),
        limit: action.payload.limit,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'HT_OVERVIEW_LOG_UPDATED_FETCH_FAILURE',
    });
  }
}

function* overviewInitialFetchSaga() {
  yield takeEvery('HT_OVERVIEW_LOG_UPDATED_FETCH', overviewTask);
}

export default overviewInitialFetchSaga;
