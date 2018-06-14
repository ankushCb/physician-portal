import { Map, fromJS, Iterable } from 'immutable';

import each from 'lodash/each';
import pick from 'lodash/pick';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';

// import _ from 'lodash';

const initialState = Map({
  timeSheetDisplay: {},
});

export const timeWindowReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'TIMEWINDOW_FETCH_REQUEST_INITIATED': {
      let newState = state;
      return newState;
    }
    case 'TIMEWINDOW_FETCH_SUCCESS': {
      let newState = state;
      newState = newState.set('timeSheetData', payload.timeSheetData);
      newState = newState.set('timeSheetCount', payload.timeSheetCount);
      newState = newState.set('cacheId', payload.id);
      return newState;
    }
    case 'TIMEWINDOW_FETCH_FAILURE': {
      let newState = state;
      newState = newState.set('timeWindowFetchFailure', true);
      newState = newState.set('data', payload);
      newState = newState.set('cacheId', '');
      return newState;
    }
    case 'TIMEWINDOW_DISPLAY_UPDATE': {
      let newState = state;
      let existingBranch = fromJS(newState.get('timeSheetDisplay') || {});
      existingBranch = fromJS(existingBranch);
      const mergingBranch = fromJS(payload.timeWindowDisplay);
      const newBranch = existingBranch.merge(mergingBranch);
      newState = newState.set('timeSheetDisplay', newBranch.toJS());
      return newState;
    }
    case 'TIMEWINDOW_DISPLAY_MODIFY_VALUES': {
      let newState = state;
      let existingBranch = newState.get('timeSheetDisplay') || {};

      const setValueInExistingBranch = (data) => {
        const { mealName, parameter } = data;
        existingBranch = Map(existingBranch);
        existingBranch = existingBranch.updateIn([mealName], (object) => {
          const newObject = Object.assign({}, object);
          newObject[parameter] = data.value;
          return newObject;
        });
      };

      if (isArray(payload.data)) {
        each(payload.data, (datum) => {
          setValueInExistingBranch(datum);
        });
      } else if (isObject(payload.data)) {
        setValueInExistingBranch(payload.data);
      }
      if (Iterable.isIterable(existingBranch)) {
        newState = newState.set('timeSheetDisplay', existingBranch.toJS());
      }
      return newState;
    }
    case 'TIMEWINDOW_DELETE_SUCCESS': {
      let newState = state;
      let existingBranch = Map(newState.get('timeSheetDisplay') || {});
      each(payload.deletionData, (values, key) => {
        if (values) {
          let currentMealValue = existingBranch.get(key);
          currentMealValue['bg_check_required'] = false;
          currentMealValue['insulin_dose_required'] = false;
          existingBranch = existingBranch.set(key, currentMealValue)
        }
      });
      newState = newState.set('timeSheetDisplay', existingBranch.toJS());
      return newState;
    }
    case 'TIMEWINDOW_RESTORE_DATA_SUCCESS': {
      let newState = state;
      const existingBranch = payload.timeWindowData.toJS();
      const timeWindowDisplay = reduce(existingBranch, (accumulator, data) => {
        accumulator[data.name] = pick(data, [ // eslint-disable-line
          'start_time',
          'stop_time',
          'base_dose',
          'name',
          'correctional_insulin_on',
          'bg_check_required',
          'bg_check_prescribed',
          'insulin_dose_required',
          'carb_counting_ratio',
        ]);
        return accumulator;
      }, {});
      newState = newState.set('timeSheetDisplay', timeWindowDisplay);
      return newState;
    }

    case 'TIMEWINDOW_PATCH_REQUEST_INITIATED': {
      let newState = state;
      newState = newState.set('isPatchingAndLoading', true);
      return newState;
    }
    case 'TIMEWINDOW_PATCH_REQUEST_SUCCESS': {
      let newState = state;
      newState = newState.set('isPatchingAndLoading', false);
      return newState;
    }
    case 'TIMEWINDOW_PATCH_REQUEST_FAILURE': {
      let newState = state;
      newState = newState.set('timeWindowFetchFailure', false);
      return newState;
    }
    case 'REPLACE_AFTER_SET': {
      let newState = state;
      newState = newState.set('timeSheetDisplay', payload.timeWindowData);
      return newState;
    }
    case 'DAILY_SCHEDULE_POST_SUCCESS': {
      let newState = state;
      newState = newState.set('timeSheetDisplay', {});
      return newState;
    }
    default : {
      return state;
    }
  }
};
