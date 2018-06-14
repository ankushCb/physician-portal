import { createSelector } from 'reselect';

import concat from 'lodash/concat';
import map from 'lodash/map';
import times from 'lodash/times';

import moment from 'moment';

import { Map, Iterable, List, fromJS } from 'immutable';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert';
import { getIdFromUrl } from '../../Settings/helpers/getInsulin.js';

// TODO: move insulins to common

// root.settings
export const getInsulinData = state => (state.getIn(['apiData', 'practitionerCommonData', 'insulinData']));
export const getInsulinDetails = state => (state.getIn(['apiData', 'practitionerCommonData', 'insulinData']));

export const getIdInsulinMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idInsulinMap']);
export const getInsulinIdMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'insulinIdMap']);


// root.diabetesDisplay
export const getDiabetesDisplay = state => (state.get('diabetesDisplay'));

// root.settings.timeWindowDetails
// export const getPractitionerTimeWindow = createSelector([getDiabetesDisplay], params => params.get('practitionerTimeWindow'));
export const getPractitionerTimeWindow = state => fromJS(deepCamelCase(state.getIn(['apiData', 'patientCommonData', 'timeWindowData']).toJS()));

// root.settings.timeWindowDetails
// export const getPractitionerBgReadings = createSelector([getDiabetesDisplay], params => params.get('practitionerBgReadings'));
export const getPractitionerBgReadings = state => state.getIn(['apiData', 'diabetesData', 'bgReadingsData']);

// root.settings.timeWindowDetails
// export const getPractitionerInsulinDoses = createSelector([getDiabetesDisplay], params => params.get('practitionerInsulinDoses'));
export const getPractitionerInsulinDoses = state => state.getIn(['apiData', 'diabetesData', 'insulinDosesData']);

export const getStartLogbookDate = createSelector([getPractitionerBgReadings], params => params.get('currentDate'));
export const getLimit = createSelector([getPractitionerBgReadings], params => params.get('limit'));
export const patientData = (state) => (state.getIn(['apiData', 'patientCommonData', 'patientData']));

export const getOverviewData = createSelector([patientData], (patientData) => {
  if (Iterable.isIterable(patientData)) {
    return fromJS({
      bgReading: patientData.get('lastFourteenDayBgReadingsAverage'),
    })
  }
})

const timeSlots = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];

// Selector for returning current meal names. Used as sub selectors for dependencies
export const getCurrentMealNames = createSelector([getPractitionerTimeWindow], (timeWindowData) => {
  if (Iterable.isIterable(timeWindowData)) {
    const result = timeWindowData
      .toSeq()
      .reduce((accumulator, meal) => {
        if (meal.get('bgCheckPrescribed') || meal.get('insulinDoseRequired') || meal.get('carbCountingOn')) {
          // eslint-disable-next-line no-param-reassign
          accumulator = accumulator.push(meal.get('name'));
        }
        return accumulator;
      }, List())
      .sort((a, b) => {
        return timeSlots.indexOf(b) < timeSlots.indexOf(a);
      })
      .toList();
    return result.size > 0 ? result : List([]);
  }
  return List();
});

export const getCurrentInsulinRegimenData = createSelector([getPractitionerTimeWindow, getCurrentMealNames, getIdInsulinMap], (timeWindowData, mealName, mappingInsulin) => {
  if (Iterable.isIterable(timeWindowData) && Iterable.isIterable(mappingInsulin)) {
    const result = timeWindowData
      .toSeq()
      .reduce((accumulator, meal) => {
        if (mealName.indexOf(meal.get('name')) !== -1) {
          let mealObject = Map();
          mealObject = mealObject.set('name', meal.get('name'));
          mealObject = mealObject.set('bgCheckPrescribed', meal.get('bgCheckPrescribed'));
          mealObject = mealObject.set('bgCheckRequired', meal.get('bgCheckRequired'));
          mealObject = mealObject.set('correctionalInsulinOn', meal.get('correctionalInsulinOn'));
          mealObject = mealObject.set('carbCountingOn', meal.get('carbCountingOn'));
          mealObject = mealObject.set('carbCountingRatio', meal.get('carbCountingRatio'));
          mealObject = mealObject.set('baseDose', meal.get('baseDose'));
          mealObject = mealObject.set('startTime', meal.get('startTime'));
          mealObject = mealObject.set('stopTime', meal.get('stopTime'));
          mealObject = mealObject.set('insulin', mappingInsulin.get(getIdFromUrl(meal.getIn(['insulin', 'url']))));
          return accumulator.push(mealObject);
        }
        return accumulator;
      }, List())
      .sort((a, b) => {
        return timeSlots.indexOf(b.get('name')) < timeSlots.indexOf(a.get('name'));
      })
      .toList();
    return result;
  }
  return Map();
});

export const getLogBookHeader = createSelector([getCurrentMealNames], (mealNames) => {
  return concat(
    mealNames,
  );
});

export const getTimeWindowUrlNameMap = createSelector([getPractitionerTimeWindow], (timeWindowData) => {
  if (Iterable.isIterable(timeWindowData)) {
    return timeWindowData
      .toSeq()
      .reduce((accumulator, meal) => {
        return accumulator.set(meal.get('url'), meal.get('name'));
      }, Map())
      .toMap();
  }
  return Map();
});

export const getLogBookDataFromImmutable = createSelector([getPractitionerBgReadings, getPractitionerInsulinDoses, getTimeWindowUrlNameMap, getCurrentMealNames], (bgReadings, insulinDoses, urlNameMap, validMeals) => {
  // let timeWindows = List();
  if (Iterable.isIterable(insulinDoses.get('insulinDoses')) && Iterable.isIterable(bgReadings.get('bgReadings'))) {
    const insulinDoseMap = insulinDoses
      .get('insulinDoses')
      .toSeq()
      .reduce((accumulator, data) => {
        const meal = data.get('meal');
        const dose = data.get('dose');
        const dateTime = moment(data.get('logDatetime'), 'YYYY-MM-DD').format('DD-MM-YYYY');
        if (validMeals.indexOf(meal) !== -1) {
          accumulator = accumulator.setIn([dateTime, meal, 'insulin'], dose); // eslint-disable-line
          accumulator = accumulator.setIn([dateTime, meal, 'name'], meal); // eslint-disable-line
          accumulator = accumulator.setIn([dateTime, meal, 'isCorrectionalMeal'], data.get('isCorrectionalDose'))
        }
        return accumulator;
      }, Map())
      .toMap();
    console.log('insulin dose map ', insulinDoseMap);
    const glucoseDoseMap = bgReadings
      .get('bgReadings')
      .toSeq()
      .reduce((accumulator, data) => {
        const url = data.get('timeWindow');
        const meal = urlNameMap.get(url);
        const dose = data.get('reading');
        const dateTime = moment(data.get('logDatetime'), 'YYYY-MM-DD').format('DD-MM-YYYY');
        if (meal) {
          accumulator = accumulator.setIn([dateTime, meal, 'glucose'], dose); //eslint-disable-line
          accumulator = accumulator.setIn([dateTime, meal, 'name'], meal); //eslint-disable-line
        }
        return accumulator;
      }, Map())
      .toMap();
    const timeWindows = insulinDoseMap.mergeDeep(glucoseDoseMap);
    // Format change
    const result = timeWindows
      .toSeq()
      .reduce((accumulator, value, key) => {
        let listObj = Map();
        listObj = listObj.set('date', key);
        listObj = listObj.set('timeWindows', value.toList());
        return accumulator.push(listObj);
      }, List())
      .sort((a, b) => {
        console.log('a & b ', a, b);
        if (a.get('date') && b.get('date')) {
          return a.get('date').localeCompare(b.get('date'))
        }
      })
      .toList();

    // Fill '-' only if counterpart not present
    const ret = result
      .toSeq()
      .reduce((accumulator, value) => {
        const timeWindow = value.get('timeWindows');
        let replacedTimeWindows = timeWindow
          .toSeq()
          .reduce((accumulatorSecond, valueSecond) => {
            if (!valueSecond.get('glucose')) {
              valueSecond = valueSecond.set('glucose', '-'); // eslint-disable-line
            }
            if (!valueSecond.get('insulin')) {
              valueSecond = valueSecond.set('insulin', '-'); // eslint-disable-line
            }
            return accumulatorSecond.push(valueSecond);
          }, List())
          .toList();
        replacedTimeWindows = replacedTimeWindows
          .toSeq()
          .reduce((accumulatorSecond, valueSecond) => {
            if (validMeals.indexOf(valueSecond.get('name')) !== -1) {
              accumulatorSecond = accumulatorSecond.push(valueSecond); // eslint-disable-line
            }
            return accumulatorSecond;
          }, List())
          .sort((a, b) => {
            return timeSlots.indexOf(b.get('name')) < timeSlots.indexOf(a.get('name'));
          })
          .toList();

          // calculate which complete pairs are missing
        const emptyTimeWindows = validMeals
          .toSeq()
          .map((meal) => {
            const found = replacedTimeWindows.find((data) => {
              return data.get('name') === meal;
            });
            if (!found) {
              return fromJS({
                name: meal,
                glucose: '-',
                insulin: '-',
              });
            } else { // eslint-disable-line
              return found;
            }
          })
          .toList();

        // replacedTimeWindows = emptyTimeWindows.mergeDeep(replacedTimeWindows);
        replacedTimeWindows = emptyTimeWindows;
        let eachObject = Map();
        eachObject = eachObject.set('date', value.get('date'));
        eachObject = eachObject.set('timeWindows', replacedTimeWindows);
        return accumulator.push(eachObject);
      }, List())
      .toList();

    return ret;
  }
});

export const getDataForEmptyDates = createSelector([getStartLogbookDate, getLimit, getCurrentMealNames], (currentDate, limit, validMeals) => {
  const validMealsJs = validMeals.toJS();
  if (currentDate) {
    const momentDate = moment(currentDate, 'DD/MM/YYYY');
    const emptyData = fromJS(
      times(limit, (index) => {
        return {
          date: momentDate.clone().subtract({ days: index }).format('DD-MM-YYYY'),
          timeWindows: map(validMealsJs, (meals) => {
            return {
              name: meals,
              glucose: '-',
              insulin: '-',
            };
          }),
        };
      }),
    );
    return emptyData;
  }

  return List();
});

export const getFinalLogBookData = createSelector([getLogBookDataFromImmutable, getDataForEmptyDates], (logBookData, emptyData) => {
  let unsortedData = emptyData
    .toSeq()
    .reduce((accumulator, data) => {
      console.log('log data is ', data, logBookData);
      const index = logBookData.findIndex((dataSecond) => {
        return dataSecond.get('date') === data.get('date');
      });
      if (index !== -1) {
        accumulator = accumulator.push(logBookData.get(index)); // eslint-disable-line
      } else {
        accumulator = accumulator.push(data); // eslint-disable-line
      }
      return accumulator;
    }, List())
    .toList();
  unsortedData = unsortedData
    .toSeq()
    .reduce((accumulator, data) => {
      let timeWindowData = data.get('timeWindows');
      timeWindowData = timeWindowData
        .toSeq()
        .reduce((accumulator, data) => {
          const correctionalData = data.get('correctional');
          if (correctionalData && correctionalData !== '-') {
            data = data.set('insulin', `${data.get('insulin')}(+${correctionalData})`)
          }
          return accumulator.push(data);
        }, List())
      timeWindowData = timeWindowData
        .sort((a, b) => {
          return timeSlots.indexOf(b.get('name')) < timeSlots.indexOf(a.get('name'));
        });
      data = data.set('timeWindows', timeWindowData); // eslint-disable-line
      accumulator = accumulator.push(data); // eslint-disable-line
      return accumulator;
    }, List())
    .toList();
  console.log('log data unsorted', unsortedData);
  return unsortedData;
});

export const getPreloaderStatus = createSelector([getPractitionerTimeWindow, getPractitionerBgReadings, getPractitionerInsulinDoses], (timeWindow, bgReadings, insulinDoses) => {
  return {
    forTimeWindow: timeWindow.get('fetchInitiated'),
    forBgReadings: bgReadings.get('fetchInitiated'),
    forInsulinDoses: insulinDoses.get('fetchInitiated'),
  };
});

const getLastThirtyDaysBgReadings = createSelector([getPractitionerBgReadings], bg => bg.get('lastThirtyDaysBgReadings'));

const getEmptyGraphData = (date, days) => {
  const startDate = moment(date, 'YYYY-MM-DD');
  let count = 0;
  let result = Map();
  const emptyObject = fromJS({
    morning: -1,
    breakfast: -1,
    lunch: -1,
    evening: -1,
    dinner: -1,
    bedtime: -1,
  });

  times(days, () => {

    const currentDate = startDate.clone().subtract({ days: count }).format('YYYY-MM-DD');
    result = result.setIn([currentDate], emptyObject);
    count += 1;
  });
  return result;
}

export const getGraphData = createSelector([getLastThirtyDaysBgReadings, getTimeWindowUrlNameMap], (bg, urlMapping) => {
  if (bg && Iterable.isIterable(bg)) {
    const graphData = getEmptyGraphData(moment().startOf('day').format('YYYY-MM-DD'), 30);
    const result = bg
      .toSeq()
      .reduce((accumulator, data) => {
        const currentDate = moment(data.get('logDatetime')).format('YYYY-MM-DD');
        return accumulator.setIn([currentDate, urlMapping.get(data.get('timeWindow'))], data.get('reading'))
      }, graphData)
      .map((value, key) => {
        const mealValue = value
          .toSeq()
          .reduce((accumulator, diabetes, meal) => {
            if (diabetes !== -1) {
              accumulator.total += diabetes;
              accumulator.count += 1;
            }
            return accumulator;
          }, {
            count: 0,
            total: 0,
          });
          return fromJS({
            date: key,
            value: mealValue.count != 0 ? Math.floor(mealValue.total / mealValue.count) : 0,
            bgChecks: 3,
          })
      })
      .toList()
      .sort((a, b) => {
        const firstDate = moment(a.get('date'), 'YYYY-MM-DD');
        const secondDate = moment(b.get('date'), 'YYYY-MM-DD');

        if (firstDate.isAfter(secondDate)) {
          return -1;
        } else if (firstDate.isBefore(secondDate)) {
          return 1;
        } else {
          return 0;
        }

      });
      return result;
  }
  return [];
});

export const getFetchStatus = (state) => {
  return {
    currentInsulinRegimenStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
        && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    logBookStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'diabetesDisplayData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
        && state.getIn(['fetchStatus', 'diabetesDisplayData', 'isFetched']),
    },
    scheduleStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'diabetesRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
        && state.getIn(['fetchStatus', 'diabetesRelatedata', 'isFetched']),
    },
    graphStatus: {
      isFetching: state.getIn(['fetchStatus', 'diabetesDisplayData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'diabetesDisplayData', 'isFetched']),
    }
  };
};
