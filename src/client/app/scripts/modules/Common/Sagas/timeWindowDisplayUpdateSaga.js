import { takeEvery, put } from 'redux-saga/effects';

function* timeWindowFetch(action) {
  try {
    // Push to redux state for ui display
    yield put({
      type: 'TIMEWINDOW_DISPLAY_UPDATE',
      payload: {
        timeWindowDisplay: action.payload.data,
      },
    });
  } catch (error) {
    yield put({
      type: 'TIMEWINDOW_DISPLAY_UPDATE_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* timeWindowSaga() {
  yield takeEvery('TIMEWINDOW_DISPLAY_UPDATE_NEW', timeWindowFetch);
}

export default timeWindowSaga;
