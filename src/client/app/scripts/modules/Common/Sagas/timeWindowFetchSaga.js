import { takeLatest, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'axios';

import reduce from 'lodash/reduce';
import pick from 'lodash/pick';
import isNull from 'lodash/isNull';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { timeWindowApi } from 'scripts/helpers/api.js';
import { logException } from 'scripts/helpers/pushToSentry.js';

function* timeWindowFetch(action) {
  // yield put({ type: 'TIMEWINDOW_FETCH_REQUEST_INITIATED' });
  try {
    const timeWindowDisplay = reduce(action.payload.timeWindowData, (accumulator, data) => {
      accumulator[data.name] = pick(data, [ // eslint-disable-line
        'id',
        'start_time',
        'stop_time',
        'base_dose',
        'name',
        'correctional_insulin_on',
        'bg_check_required',
        'insulin_dose_required',
        'carb_counting_ratio',
        'bg_check_prescribed',
      ]);
      return accumulator;
    }, {});

    if (!action.payload.forced) {
      const premadeRegimenInitial = reduce(action.payload.timeWindowData, (accumulator, data) => {
        if (!isNull(data.insulin)) {
          accumulator[data.name] = data.insulin.type;
        } else if (data.bg_check_required) {
          accumulator[data.name] = 'bg';
        }
        return accumulator;
      }, {})

      yield put({
        type: 'PREMADE_REGIMEN_UPDATE_COMPLETE',
        payload: {
          updateData: {
            ...premadeRegimenInitial
          },
        },
      });
    }

    // Push to redux state for ui display
    yield put({
      type: 'TIMEWINDOW_DISPLAY_UPDATE',
      payload: {
        timeWindowDisplay,
      },
    });
    yield put({
      type: 'MEALID_MAP_UPDATE',
      payload: {
        timeWindowDisplay,
      },
    });
  } catch (error) {
    logException(error);
    yield put({
      type: 'TIMEWINDOW_FETCH_FAILURE',
      payload: {
        success: false,
      },
    });
    yield put({
      type: 'ERROR_OCCURED',
      payload: {
        errorMessage: e.message || 'Network timed out',
      }
    })
  }
}

function* timeWindowSaga() {
  yield takeLatest('TIMEWINDOW_DISPLAY_UPDATE_REQUEST', timeWindowFetch);
}

export default timeWindowSaga;
