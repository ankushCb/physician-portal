import { takeLatest, put, take, select } from 'redux-saga/effects';

import includes from 'lodash/includes';

const practitionerCachedIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);
const patientCachedIdSelector = state => state.getIn(['apiData', 'patientCommonData', 'patientId']);

function* timeWindowFetch(action) {
  try {
    const practitionerCachedId = yield select(practitionerCachedIdSelector);
    const patientCachedId = yield select(patientCachedIdSelector);

    if (patientCachedId !== action.payload.patientId) {
      yield put({
        type: 'PATIENT_INITIAL_FETCH_REQUEST',
        payload: {
          patientId: action.payload.patientId,
        },
      });
      yield take('PATIENT_INITIAL_FETCH_REQUEST_SUCCESS');
    }

    if (!practitionerCachedId) {
      yield put({
        type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
      });
      yield take('PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS');
    }

    yield put({
      type: 'SETTINGS_INITIAL_FETCH_SUCCESS',
    });
  } catch (e) {
    yield put({
      type: 'SETTINGS_INITIAL_FETCH_FAILURE',
    });
  }
}

function* timeWindowSaga() {
  yield takeLatest('SETTINGS_INITIAL_FETCH', timeWindowFetch);
}

export default timeWindowSaga;
