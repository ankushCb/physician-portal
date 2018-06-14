import { takeEvery, put, take } from 'redux-saga/effects';

function* personalInformationCheck(action) {
  try {
    yield put({
      type: 'PERSONAL_INFORMATION_SUCCESS',
      payload: {
        personalData: action.payload.data,
      },
    });

    yield take('DAILY_SCHEDULE_POST_SUCCESS');
    yield put({
      type: 'ONBOARDING_SUCCESS',
    });
  } catch (error) {
    yield put({
      type: 'PERSONAL_INFORMATION_CHECK_FAILURE',
      payload: {
        errorMessage: error.message || 'Network timed out',
      },
    });
  }
}


function* personalInformationCheckSaga() {
  yield takeEvery('PERSONAL_INFORMATION_CHECK', personalInformationCheck);
}

export default personalInformationCheckSaga;
