import { takeEvery, put, select } from 'redux-saga/effects';
import { fromJS, Map } from 'immutable';

const timeWindowDisplaySelector = state => state.getIn(['settings', 'timeWindowDetails', 'timeSheetDisplay']);
function* premadeRegimenUpdate(action) {
  const data = action.payload.data;

  let timeWindowData = fromJS(yield select(timeWindowDisplaySelector));
  if (data.params === 'bgCheckPrescribed' || data.params === 'bgCheckRequired') {
    timeWindowData = timeWindowData
      .toSeq()
      .reduce((accumulator, value, key) => {
        value = value.set('bg_check_prescribed', true); // eslint-disable-line
        if (!data.noForce) {
          value = value.set('base_dose', 1);
        }
        accumulator = accumulator.set(key, value); // eslint-disable-line
        return accumulator;
      }, Map())
      .toJS();
    yield put({
      type: 'REPLACE_AFTER_SET',
      payload: {
        timeWindowData,
      },
    });
  }
  if (data.params === 'correctional') {
    timeWindowData = timeWindowData
      .toSeq()
      .reduce((accumulator, value, key) => {
        value = value.set('correctional_insulin_on', true); // eslint-disable-line
        accumulator = accumulator.set(key, value); // eslint-disable-line
        return accumulator;
      }, Map())
      .toJS();
    yield put({
      type: 'REPLACE_AFTER_SET',
      payload: {
        timeWindowData,
      },
    });
  }
}

function* premadeRegimenUpdateSaga() {
  yield takeEvery('SET_ALL_TRUE', premadeRegimenUpdate);
}

export default premadeRegimenUpdateSaga;
