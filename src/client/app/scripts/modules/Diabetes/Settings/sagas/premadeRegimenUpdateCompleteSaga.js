import { takeLatest, put } from 'redux-saga/effects';

function* premadeRegimenUpdate(action) {
  try {
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_COMPLETE_INITIATED',
      payload: action.payload,
    });
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_COMPLETE_SUCCESS',
    });
  } catch (error) {
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_COMPLETE_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* premadeRegimenUpdateSaga() {
  yield takeLatest('PREMADE_REGIMEN_UPDATE_COMPLETE', premadeRegimenUpdate);
}

export default premadeRegimenUpdateSaga;
