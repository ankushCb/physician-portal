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

const currentReminderDataSelector = state => state.getIn(['apiData', 'remindersData', 'data']);
const remindersApiDataSelector = state => state.getIn(['apiData', 'remindersData', 'initialData']);
const patientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const mealIdMapSelector = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']);

const prepareForGet = url => ({
  method: 'get',
  url,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const prepareForPost = (url, data) => ({
  method: 'post',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const prepareForPatch = (url, data) => ({
  method: 'patch',
  url,
  data,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const prepareForDelete = (url) => ({
  method: 'delete',
  url,
  timeout: timeoutDuration,
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const processDataForPost = (data, mealIdMap, patientId) => {
  const timeWindows = data.get('timeWindows').toJS()
  return {
    medication: data.get('medication'),
    dose: data.get('dose'),
    patient: `${baseUrl}/api/patients/${patientId}/`,
    time_windows: timeWindows.length === 0 ? null : timeWindows,
  };
};

const processDataForPatch = (data, mealIdMap, patientId) => {
  const timeWindows = data.get('timeWindows').toJS();
  return {
    medication: data.get('medication'),
    dose: data.get('dose'),
    patient: `${baseUrl}/api/patients/${patientId}/`,
    time_windows: timeWindows.length === 0 ? null : timeWindows,
  };
};

const segregateReminders = (currentData, initialData, mealIdMap, patientId) => {
  console.log('current Data ', currentData, patientId, reminders.postReminders(patientId));

  const {
    toPost,
    toPatch,
  } = currentData
    .toSeq()
    .reduce((accumulator, eachMealData) => {
      const {
        toPost,
        toPatch,
      } = accumulator;
      if (!eachMealData.get('id')) {
        // To POST
        // If there is no id then make it to post
        toPost.push(prepareForPost(reminders.postReminders(patientId), processDataForPost(eachMealData, mealIdMap, patientId)));
      } else if (eachMealData.get('id')) {
        const currentId = eachMealData.get('index');
        const originalId = initialData.findIndex(data => data.get('index') === currentId);

        if (originalId !== -1 && !eachMealData.equals(initialData.get(originalId))) {
          // Something changed so PATCH
          const id = eachMealData.get('id');
          if (id) {
            const url = reminders.patchReminders(patientId, id);
            toPatch.push(prepareForPatch(url, processDataForPatch(eachMealData, mealIdMap, patientId)));
          }
        }
        accumulator.toPost = toPost;
        accumulator.toPatch = toPatch;
        return accumulator;
      }
      return accumulator;

    }, {
      toPost: [],
      toPatch: [],
    });

  const {
    toDelete,
  } = initialData
    .toSeq()
    .reduce((accumulator, eachMealData) => {
      const currentId = eachMealData.get('index');
      const originalId = currentData.findIndex(data => data.get('index') === currentId);
      const { toDelete } = accumulator;

      if (originalId === -1) {
        // To Delete
        const url = reminders.deleteReminders(patientId, eachMealData.get('id'));
        toDelete.push(prepareForDelete(url));
      }
      accumulator.toDelete = toDelete;
      return accumulator;
    }, {
      toDelete: [],
    });
  return {
    toPost,
    toDelete,
    toPatch,
  }
}

function* remindersSaga(action) {
  try {
    const authHeaders = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };

    const currentReminderData = yield select(currentReminderDataSelector);
    const remindersApiData = yield select(remindersApiDataSelector);
    const patientId = yield select(patientIdSelector);
    const mealIdMap = yield select(mealIdMapSelector);

    const {
      toPost,
      toDelete,
      toPatch,
    } = segregateReminders(currentReminderData, remindersApiData, mealIdMap, patientId);


    yield all(map(toPatch, config => call(request, config)));
    yield all(map(toDelete, config => call(request, config)));
    yield all(map(toPost, config => call(request, config)));

    // Refetch
    yield put({
      type: 'REMINDERS_FETCH_INITIAL',
      payload: {
        patientId,
        forced: true,
      }
    });
    yield take('REMINDERS_FETCH_SUCCESS');

    yield put({
      type: 'REMINDERS_PATCH_AND_FETCH_SUCCESS',
    });
  } catch (error) {
    console.log(error);
    logException(error);
    yield put({
      type: 'REMINDERS_PATCH_AND_FETCH_FAILURE',
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: error.message || 'Network timed out',
      }
    });
  }
}

function* remindersFetch() {
  yield takeEvery('REMINDERS_PATCH_AND_FETCH', remindersSaga);
}

export default remindersFetch;
