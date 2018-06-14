import { takeEvery, put } from 'redux-saga/effects';

function* premadeRegimenUpdate(action) {
  try {
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_PARTIAL_INITIATED',
      payload: action.payload,
    });
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_PARTIAL_SUCCESS',
    });
  } catch (error) {
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_PARTIAL_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* premadeRegimenUpdateSaga() {
  yield takeEvery('PREMADE_REGIMEN_UPDATE_PARTIAL', premadeRegimenUpdate);
}

export default premadeRegimenUpdateSaga;
