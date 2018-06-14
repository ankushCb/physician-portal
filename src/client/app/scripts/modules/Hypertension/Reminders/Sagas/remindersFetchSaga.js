import { takeEvery, put, call, select, all, take } from 'redux-saga/effects';
import request from 'axios';
import moment from 'moment';
import { fromJS, List, Map } from 'immutable';
import map from 'lodash/map';

import {
  baseUrl,
  reminders,
 } from 'scripts/helpers/api.js';

import { logException } from 'scripts/helpers/pushToSentry.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { processRequiredMedicationData } from '../../Common/helpers.js';

const prepareForGet = (url, patientId) => ({
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
const cachedIsRemindersDataFetched = state => state.getIn(['apiData', 'remindersData']);
const cachedLastRemindersFetchForPatient = state => state.getIn(['apiData', 'remindersData', 'patientId']);

function* remindersSaga(action) {
  const remindersData = yield select(cachedIsRemindersDataFetched);
  const cachedLastReminderId = yield select(cachedLastRemindersFetchForPatient);

  if (action.payload.patientId !== cachedLastReminderId || action.payload.forced) {
    try {
      const authHeaders = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const cachedPatientId = yield select(cachedPatientIdSelector);
      const cachedPractitionerId = yield select(cachedPractitionerIdSelector);

        // look for caching
        if (!cachedPractitionerId) {
          yield put({
            type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
          });
          yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
        }
        if (!cachedPatientId || (cachedPatientId !== action.payload.patientId)) {
          yield put({
            type: 'PATIENT_INITIAL_FETCH_REQUEST',
            payload: {
              patientId: action.payload.patientId,
              forced: true,
            },
          });
          yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
          yield take('MEALID_MAP_UPDATE');
        }
        const idMealMap = yield select(cachedIdMealMap);
        const mealIdMap = yield select(cachedMealIdMap);
        const apiData = yield call(request, prepareForGet(reminders.getReminders(action.payload.patientId)));
        const reminderData = map(apiData.data.results, (data, index) => {

          return deepCamelCase({
            ...data,
            index,
            time_windows: map(data.time_windows, timeWindow => timeWindow)
          });
        });

        yield put({
          type: 'REMINDERS_FETCH_SUCCESS',
          payload: {
            reminderData,
            patientId: action.payload.patientId,
          },
        });
      } catch (error) {
        logException(error);
        yield put({
          type: 'REMINDERS_FETCH_FAILURE',
        });
        yield put({
          type: 'ERROR_OCCURED',
          payload: {
            errorMessage: error.message || 'Network timed out',
          }
        });
      }
    } else {
      yield put({
        type: 'CACHED_REMINDERS',
      });
    }
}

function* remindersFetch() {
  yield takeEvery('REMINDERS_FETCH_INITIAL', remindersSaga);
}

export default remindersFetch;
