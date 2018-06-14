import { takeLatest, put, select } from 'redux-saga/effects';

const getDiabetesSettings = state => state.getIn(['apiData', 'patientCommonData', 'diabetesSettingsData']);

function* premadeRegimenUpdate(action) {
  try {
    const diabetesSettingsData = yield select(getDiabetesSettings);

    yield put({
      type: 'DIABETES_SETTINGS_RESTORE_UPDATED',
      payload: {
        diabetesSettingsData,
      },
    });

  } catch (error) {
    yield put({
      type: 'DIABETES_SETTINGS_RESTORE_FAILURE',
    });
  }
}

function* premadeRegimenUpdateSaga() {
  yield takeLatest('DIABETES_SETTINGS_RESTORE', premadeRegimenUpdate);
}

export default premadeRegimenUpdateSaga;
