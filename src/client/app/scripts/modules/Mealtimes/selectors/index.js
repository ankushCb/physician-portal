import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import indexOf from 'lodash/indexOf';

import { Iterable, List, fromJS } from 'immutable';

const mealNames = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];

export const getApiMapData = state => state.getIn(['derivedData', 'mappingFromApiData']);

export const getMealToTimeData = createSelector([getApiMapData], (apiData) => {
  if (Iterable.isIterable(apiData)) {
    return apiData.get('timeWindowNameTimeMap');
  }
});

export const getMealNameMap = createSelector([getApiMapData], (apiData) => {
  if (Iterable.isIterable(apiData)) {
    return apiData.get('mealNameMap');
  }
});

export const getMealTimeData = createSelector([getMealToTimeData, getMealNameMap], (mealToTimeMap, mealNameMap) => {
  if (Iterable.isIterable(mealToTimeMap) && Iterable.isIterable(mealNameMap)) {
    const result = mealToTimeMap
      .toSeq()
      .map((value, key) => fromJS({
        name: key,
        startTime: value.get('startTime'),
        stopTime: value.get('stopTime'),
        url: mealNameMap.get(key),
      }))
      .toList()
      .toJS();
    
    return sortBy(result, ({ name }) => indexOf(mealNames, name));
  }
  return List();
});

export const getFetchStatus = (state) => ({
  shouldLoadPreloader: 
    state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching']) || 
    state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']) || 
    state.getIn(['fetchStatus', 'mealTimeData', 'isPosting'])
})