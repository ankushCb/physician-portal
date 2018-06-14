import { takeEvery, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';
import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { practitionerApi } from 'scripts/helpers/api.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

const idSelector = state => state.getIn(['diabetesDisplay', 'practitionerInsulinDoses', 'cacheId']);
const currentDateSelector = state => state.getIn(['diabetesDisplay', 'practitionerInsulinDoses', 'currentDate']);

function* practitionerInsulinDosesFetch(action) {
  const cacheId = yield select(idSelector);
  const cacheCurrentDate = yield select(currentDateSelector);
  const authHeaders = {
    headers: {
      Authorization: localStorage.getItem('token'),
    }
  };

  if (action.payload.id !== cacheId || cacheCurrentDate !== action.payload.currentDate) {
    yield put({ type: 'PRACTITIONER_INSULINDOSES_FETCH_INITIATED' });
    try {
      const config = {
        method: 'get',
        url: practitionerApi.getInsulinDoses(action.payload),
        ...authHeaders,
      };

      const apiData = yield race({
        practitionerInsulinDoses: call(request, config),
        timeout: call(delay, timeoutDuration),
      });

      const { practitionerInsulinDoses } = apiData;

      yield put({
        type: 'PRACTITIONER_INSULINDOSES_FETCH_SUCCESS',
        payload: {
          practitionerInsulinDoses: deepCamelCase(practitionerInsulinDoses.data.results),
          id: action.payload.id,
          currentDate: action.payload.currentDate.clone().subtract({ days: action.payload.previousCount }).format('DD/MM/YYYY'),
          limit: action.payload.limit,
          success: true,
        },
      });
    } catch (error) {
      logException(error);
      yield put({
        type: 'PRACTITIONER_INSULINDOSES_FETCH_FAILURE',
        payload: {
          id: '',
          success: false,
        },
      });
    }
  }
}

function* InsulinDosesFetchSaga() {
  yield takeEvery('PRACTITIONER_INSULINDOSES_FETCH_REQUEST', practitionerInsulinDosesFetch);
}

export default InsulinDosesFetchSaga;
