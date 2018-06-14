import { takeLatest, put } from 'redux-saga/effects';

function* timeWindowFetch(action) {
  try {
    // Push to redux state for ui display
    yield put({
      type: 'TIMEWINDOW_DISPLAY_MODIFY_VALUES',
      payload: {
        data: action.payload.data,
      },
    });
  } catch (error) {
    yield put({
      type: 'TIMEWINDOW_DISPLAY_MODIFY_VALUES_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* timeWindowSaga() {
  yield takeLatest('TIMEWINDOW_DISPLAY_MODIFY_VALUES_NEW', timeWindowFetch);
}

export default timeWindowSaga;
