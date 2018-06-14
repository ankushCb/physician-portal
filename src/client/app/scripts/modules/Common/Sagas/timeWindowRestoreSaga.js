import { takeEvery, put, select } from 'redux-saga/effects';

const timeWindowApiDataSelector = state => state.getIn(['apiData', 'patientCommonData', 'timeWindowData'])

function* timeWindowRestore() {
  try {
    // Push to redux state for ui display
    const timeWindowData = yield select(timeWindowApiDataSelector);

    yield put({
      type: 'TIMEWINDOW_RESTORE_DATA_SUCCESS',
      payload: {
        timeWindowData,
      }
    });
  } catch (error) {
    yield put({
      type: 'TIMEWINDOW_RESTORE_DATA_FAILURE',
    });
  }
}

function* timeWindowRestoreSaga() {
  yield takeEvery('TIMEWINDOW_RESTORE_DATA_NEW', timeWindowRestore);
}

export default timeWindowRestoreSaga;
