import { createSelector } from 'reselect';

import sortBy from 'lodash/sortBy';
import indexOf from 'lodash/indexOf';

import { Iterable, Map, List, fromJS } from 'immutable';

export const getTimeWindowNameToTime = state => state.getIn(['derivedData', 'mappingFromApiData', 'timeWindowNameTimeMap']);
export const getTimeWindowUrlToName = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealUrlMap']);
export const getTimeWindowNameToUrl = state => state.getIn(['derivedData', 'mappingFromApiData', 'mealNameMap']);

export const timeWindowsOrder = [
  'morning',
  'breakfast',
  'lunch',
  'evening',
  'dinner',
  'bedtime',
];

export const getTimeWindowTimings = createSelector([getTimeWindowNameToTime], (data) => {
  if (data && Iterable.isIterable(data)) {
    const unSortedData = data
      .toSeq()
      .map((eachMeal, mealName) => {
        return {
          name: mealName,
          startTime: eachMeal.get('startTime'),
          endTime: eachMeal.get('stopTime'),
        };
      })
    .toList()
    .toJS();
    return sortBy(unSortedData, ({ name }) => indexOf(timeWindowsOrder, name))
  }
  return List();
});

  // {
  //   name: 'morning',
  //   startTime: '05:00:00',
  //   endTime: '07:00:00',
  // },
  // {
  //   name: 'breakfast',
  //   startTime: '07:00:00',
  //   endTime: '09:00:00',
  // },
  // {
  //   name: 'lunch',
  //   startTime: '09:00:00',
  //   endTime: '11:00:00',
  // },
  // {
  //   name: 'evening',
  //   startTime: '13:00:00',
  //   endTime: '15:00:00',
  // },
  // {
  //   name: 'dinner',
  //   startTime: '17:00:00',
  //   endTime: '19:00:00',
  // }


export const getRemindersApiData = state => state.getIn(['apiData', 'remindersData', 'data']);

const emptyTimeWindows = fromJS([
  {
    name: 'morning',
    dose: null,
  },
  {
    name: 'breakfast',
    dose: null,
  },
  {
    name: 'lunch',
    dose: null,
  },
  {
    name: 'evening',
    dose: null,
  },
  {
    name: 'dinner',
    dose: null,
  },
  {
    name: 'bedtime',
    dose: null,
  }
])
export const getReminderData = createSelector([getRemindersApiData, getTimeWindowUrlToName], (apiData, urlNameMap) => {
  if (Iterable.isIterable(apiData) && !apiData.isEmpty()) {
    const formattedData = apiData
      .toSeq()
      .reduce((accumulator, data) => {
        
        let reminderObject = Map()
        reminderObject = reminderObject.set('name', data.get('medication'));
        reminderObject = reminderObject.set('dose', data.get('dose'));
        reminderObject = reminderObject.set('type', 'oral');
        reminderObject = reminderObject.set('index', data.get('index'));
        
        const timeWindowData = data
          .get('timeWindows')
          .toSeq()
          .map((eachReminderData) => {
            console.log('each ', eachReminderData, data.get('dose'));
            return fromJS({
              name: eachReminderData,
              dose: data.get('dose'),
            });
          })
          .toList();
        reminderObject = reminderObject.set('timeWindows', timeWindowData);
        return accumulator.push(reminderObject);
      }, List());
      const result = formattedData
        .toSeq()
        .map((data) => {
          const currentMedicationTimewindow = data.get('timeWindows');
          const mealIndex = {
            morning: 0,
            breakfast: 1,
            lunch: 2,
            evening: 3,
            dinner: 4,
            bedtime: 5,
          };
          let instanceEmptyTimeWindows = emptyTimeWindows;
          const newtimeWindows = currentMedicationTimewindow
            .toSeq()
            .reduce((accumulatorSecond, data) => {
              const twName = urlNameMap.get(data.get('name'));
              data = data.set('name', twName);
              return accumulatorSecond.set(mealIndex[twName], data);
            }, instanceEmptyTimeWindows);
            // console.log('timeWindows', newtimeWindows);
          return data.set('timeWindows', newtimeWindows);
        })
        .toList();
    return result;
  }
});

const remindersFetchStatus = state => state.getIn(['fetchStatus', 'remindersData']);

export const getSubmitButtonStatus = createSelector([getRemindersApiData], (reminder) => {
  const shouldEnable = reminder
    .toSeq()
    .reduce((accumulator, data) => {
      return accumulator && (data.get('timeWindows').size > 0 && data.getIn(['timeWindows', 0])) && (data.get('dose').length > 0) && (data.get('medication').length > 0);
    }, true);

  return shouldEnable;
});

export const getInvalidFields = createSelector([getRemindersApiData], (reminder) => {
  const invalidFieldList = reminder
  .toSeq()
  .reduce((accumulator, data, index) => {
    const isCurrentFieldValid = (data.get('timeWindows').size > 0 && data.getIn(['timeWindows', 0])) && (data.get('dose').length > 0) && (data.get('medication').length > 0);
    if (!isCurrentFieldValid) {
      accumulator.push(index);
    }
    return accumulator;
  }, []);

return invalidFieldList;
})

export const getFetchStatus = createSelector([remindersFetchStatus], (fetchStatus) => {
  return {
    isFetching: fetchStatus.get('isFetching') || fetchStatus.get('isPatching'),
    isPatching: fetchStatus.get('isPatching'),
  };
})
