import { takeEvery, put, select } from 'redux-saga/effects';
import reduce from 'lodash/reduce';

const currentRegimenSelector = state => state.getIn(['settings', 'premadeRegimenDetails', 'regimenDisplay']);

function* timeWindowFetch(action) {
  try {
    // Push to redux state for ui display
    yield put({
      type: 'TIMEWINDOW_DELETE_SUCCESS',
      payload: {
        deletionData: action.payload.deletionData,
      },
    });
    const currentRegimen = yield select(currentRegimenSelector);
    const newPremadeRegimenData = reduce(currentRegimen, (accumulator, value, key) => {
      if (!action.payload.deletionData[key]) {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});
    yield put({
      type: 'PREMADE_REGIMEN_UPDATE_COMPLETE',
      payload: {
        updateData: newPremadeRegimenData,
      }
    });
  } catch (error) {
    yield put({
      type: 'TIMEWINDOW_DELETE_FAILURE',
      payload: {
        success: false,
      },
    });
  }
}

function* timeWindowSaga() {
  yield takeEvery('TIMEWINDOW_DELETE', timeWindowFetch);
}

export default timeWindowSaga;
