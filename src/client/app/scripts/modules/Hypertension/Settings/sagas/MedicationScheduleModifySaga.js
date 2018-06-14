import { takeEvery, take, put, call, race, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { fromJS, Map, List } from 'immutable';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

import {
   hyperTension,
   baseUrl,
} from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';
// import { getNetworkCallStatus } from '../selectors/index.js';


const cachedPatientIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);
const cachedPractitionerIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'practitionerId']);
const cachedTimeWindowUrlToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);

function* practitionerDetailsFetch(action) {

  try {
    switch(action.payload.modificationType) {
      case 'positionChange':
        yield put({
          type: 'MEDICATION_SCHEDULE_MODIFY_POSITION',
          payload: {
            index: action.payload.index,
            direction: action.payload.direction,
          },
        });
        break;
    }
  } catch (e) {
    yield put({
      type: 'HT_SETTINGS_INITIAL_FETCH_REQUEST_FAILURE',
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('MEDICATION_SCHEDULE_MODIFY', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
