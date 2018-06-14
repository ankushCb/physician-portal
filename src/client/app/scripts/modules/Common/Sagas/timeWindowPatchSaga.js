import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from 'axios';

import reduce from 'lodash/reduce';
import map from 'lodash/map';
import includes from 'lodash/includes';

import {
  convertTimeWindowDataFormat,
} from 'scripts/helpers/timeWindowHelpers.js';

import { timeWindowApi } from 'scripts/helpers/api.js';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

const generatePatchConfig = (id, authHeaders, data) => ({
  method: 'patch',
  url: timeWindowApi.patchTimeWindows(id),
  timeout: timeoutDuration,
  data,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const mealIdSelector = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']);
const insulinIdSelector = state => state.getIn(['derivedData', 'mappingFromApiData', 'insulinIdMap']);
const timeMealSelector = state => state.getIn(['settings', 'timeWindowDetails', 'timeSheetDisplay']);
const diabetesSettingsSelector = state => state.getIn(['settings', 'diabetesSettings', 'diabetesSettingsData']);
const regimenDataSelector = state => state.getIn(['settings', 'premadeRegimenDetails', 'regimenDisplay']);

function* timeWindowPatch(action) {
  yield put({ type: 'TIMEWINDOW_PATCH_REQUEST_INITIATED' });
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    }
  };
  const data = action.payload;

  const mealIdMap = yield select(mealIdSelector);
  const insulinIdMap = yield select(insulinIdSelector);
  const timeWindowData = yield select(timeMealSelector);
  const diabetesSettingsData = yield select(diabetesSettingsSelector);
  const regimenData = yield select(regimenDataSelector);
  const {
    bolusInsulin: correctionalInsulin,
    insulinRegimen,
  } = diabetesSettingsData;

  const otherData = reduce(data.timeWindowFormData, (accumulator, data, key) => {
    if(key === 'check') {
      return accumulator;
    }
    accumulator[key] = {
      ...data,
      start_time: timeWindowData[key].start_time,
      stop_time: timeWindowData[key].stop_time,
    };
    return accumulator;
  }, {});

  const timeWindows = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];

  const convertedTimeWindowData = timeWindows.map((timeWindow) => {
    return convertTimeWindowDataFormat(
      otherData[timeWindow],
      insulinIdMap,
      data.logTableData.get(timeWindow),
      correctionalInsulin,
      timeWindow,
    );
  });
  const initialTimeWindowDataForValidation = map(timeWindowData, (value, key) => ({
    ...value,
    carb_counting_on: includes(insulinRegimen, 'carb_count')
  }));

  try {
    yield map(convertedTimeWindowData, (timeWindowDatum, index) => {
      return call(request, generatePatchConfig(mealIdMap.get(timeWindows[index]), authHeaders, timeWindowDatum));
    });

    yield put({ type: 'TIMEWINDOW_PATCH_REQUEST_SUCCESS' });
    // On successful patch of timewindow data
    yield put({
      type: 'PATIENT_INITIAL_FETCH_REQUEST',
      payload: {
        patientId: data.id,
        initialTimeWindowPatchData: initialTimeWindowDataForValidation,
        initialDiabetesSettingsData: diabetesSettingsData,
        initialRegimenData: regimenData,
        shouldValidate: true,
        forced: true,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'TIMEWINDOW_PATCH_REQUEST_FAILURE',
      payload: {
        success: false,
      },
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    })
  }
}

function* timeWindowSaga() {
  yield takeEvery('TIMEWINDOW_PATCH_REQUEST', timeWindowPatch);
}

export default timeWindowSaga;
