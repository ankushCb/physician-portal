import { createSelector } from 'reselect';
import { List, Map, fromJS, Iterable } from 'immutable';
import { baseUrl } from 'scripts/helpers/api.js';
import times from 'lodash/times';
import isUndefined from 'lodash/isUndefined';
import moment from 'moment';

import { getIdFromUrl } from '../../Common/helpers';


/* Direct from reducers */

// const getHyperTensionData = state => state.getIn(['hyperTensionData']);
const getBpReadingsData = state => state.getIn(['apiData', 'hypertensionData', 'bpReadingsThirtyDaysData']);

const getBpReadingsCurrentDurationData = state => state.getIn(['apiData', 'hypertensionData', 'bpReadingsCurrentDurationData']);

const getRequiredMedicationData = state => state.getIn(['apiData', 'hypertensionData', 'requiredMedicationDosesData']);

const getLoggedMedicationDosesData = state => state.getIn(['apiData', 'hypertensionData', 'loggedMedicationDosesData']);

const getMealIdToNameMap = state => state.getIn(['derivedData', 'mappingFromApiData', 'idMealMap']);

export const getMealTimeData = state => state.getIn(['derivedData', 'mappingFromApiData', 'timeWindowNameTimeMap']);

export const getHtSettingsData = state => state.getIn(['apiData', 'patientCommonData', 'hypertensionSettingsData']);
// getRequiredMedicationData, getLoggedMedicationDosesData
/* Derived data */

export const isHavingHypertension = state => state.getIn(['apiData', 'patientCommonData', 'isHavingHypertension']);

const timeAlias = {
  breakfast: 'am',
  lunch: 'lunch',
  bedtime: 'pm',
};

const getEmptyLogDataBetweenDates = (startDate, limit, totalAmDose, totalLunchDose, totalPmDose) => {
  let count = 0;
  const allDates = List(
    times(limit, () => {
      const currentDate = moment(startDate, 'YYYY-MM-DD').clone().subtract({ days: count });
      count += 1;
      return currentDate.format('YYYY-MM-DD');
    }),
  );
  return allDates
    .toSeq()
    .reduce((accumulator, currentDate) => {
      return accumulator.set(currentDate, fromJS({
        date: currentDate,
        am: {
          bp: {
            systolic: '-',
            diastolic: '-',
          },
          hr: '-',
          meds: {
            doseTaken: 0,
            totalDose: totalAmDose,
          },
        },
        lunch: {
          bp: {
            systolic: '-',
            diastolic: '-',
          },
          hr: '-',
          meds: {
            doseTaken: 0,
            totalDose: totalLunchDose,
          },
        },
        pm: {
          bp: {
            systolic: '-',
            diastolic: '-',
          },
          hr: '-',
          meds: {
            doseTaken: 0,
            totalDose: totalPmDose,
          },
        },
      }));
    }, Map());
};

const getEmptyGraphDataBetweenDates = (startDate, limit) => {
  let count = 0;
  const allDates = List(
    times(limit, () => {
      const currentDate = moment(startDate, 'YYYY-MM-DD').clone().subtract({ days: count });
      count += 1;
      return currentDate.format('YYYY-MM-DD');
    }),
  );
  return allDates
    .toSeq()
    .reduce((accumulator, currentDate) => {
      return accumulator.set(currentDate, fromJS({
        date: currentDate,
        am: {
          systolic: 0,
          diastolic: 0,
        },
        pm: {
          systolic: 0,
          diastolic: 0,
        },
        lunch: {
          systolic: 0,
          diastolic: 0,
        },
      }));
    }, Map());
};

const getAmTime = () => ({
  startTime: '01:00',
  stopTime: '11:00',
});

const getPmTime = () => ({
  startTime: '13:00',
  stopTime: '22:00',
});

/* View Data */

export const getHyperTensionOverviewData = createSelector([getBpReadingsData, getAmTime, getPmTime, getMealIdToNameMap], (bp, am, pm, mealIdToNameMap) => {
  if (Iterable.isIterable(bp)) {
    const vitalsTwoWeekAvg = bp
      .toSeq()
      .reduce((accumulator, data) => {
        accumulator = accumulator.set('systolic', accumulator.get('systolic') + data.get('systolic'));    // eslint-disable-line
        accumulator = accumulator.set('diastolic', accumulator.get('diastolic') + data.get('diastolic')); // eslint-disable-line
        accumulator = accumulator.set('heartRate', accumulator.get('heartRate') + data.get('heartRate')); // eslint-disable-line

        const currentMealName = mealIdToNameMap.get(getIdFromUrl(data.get('timeWindow'), baseUrl, '/api/time-windows/'));
        if (currentMealName === 'breakfast') {
          accumulator = accumulator.set('amSystolic', accumulator.get('amSystolic') + data.get('systolic'));    // eslint-disable-line
          accumulator = accumulator.set('amDiastolic', accumulator.get('amDiastolic') + data.get('diastolic')); // eslint-disable-line
          accumulator = accumulator.set('amHeartRate', accumulator.get('amHeartRate') + data.get('heartRate')); // eslint-disable-line
          accumulator = accumulator.set('amCount', accumulator.get('amCount') + 1); // eslint-disable-line
        } else if (currentMealName === 'lunch') {
          accumulator = accumulator.set('pmSystolic', accumulator.get('pmSystolic') + data.get('systolic'));    // eslint-disable-line
          accumulator = accumulator.set('pmDiastolic', accumulator.get('pmDiastolic') + data.get('diastolic')); // eslint-disable-line
          accumulator = accumulator.set('pmHeartRate', accumulator.get('pmHeartRate') + data.get('heartRate')); // eslint-disable-line
          accumulator = accumulator.set('pmCount', accumulator.get('pmCount') + 1); // eslint-disable-line
        } else if (currentMealName === 'bedtime') {
          accumulator = accumulator.set('lunchSystolic', accumulator.get('lunchSystolic') + data.get('systolic'));    // eslint-disable-line
          accumulator = accumulator.set('lunchDiastolic', accumulator.get('lunchDiastolic') + data.get('diastolic')); // eslint-disable-line
          accumulator = accumulator.set('lunchHeartRate', accumulator.get('lunchHeartRate') + data.get('heartRate')); // eslint-disable-line
          accumulator = accumulator.set('lunchCount', accumulator.get('lunchCount') + 1); // eslint-disable-line
        }
        return accumulator;
      }, Map({
        systolic: 0,
        diastolic: 0,
        heartRate: 0,
        amSystolic: 0,
        amDiastolic: 0,
        amHeartRate: 0,
        amCount: 0,
        pmSystolic: 0,
        pmDiastolic: 0,
        pmHeartRate: 0,
        pmCount: 0,
        lunchSystolic: 0,
        lunchDiastolic: 0,
        lunchHeartRate: 0,
        lunchCount: 0,
      }));

    return {
      vitalsTwoWeekAvg: {
        systolic: bp.size ? Math.round(vitalsTwoWeekAvg.get('systolic') / bp.size) : 0,
        diastolic: bp.size ? Math.round(vitalsTwoWeekAvg.get('diastolic') / bp.size) : 0,
        heartRate: bp.size ? Math.round(vitalsTwoWeekAvg.get('heartRate') / bp.size) : 0,
      },
      bpAvgAm: {
        systolic: vitalsTwoWeekAvg.get('amCount') ? Math.round(vitalsTwoWeekAvg.get('amSystolic') / vitalsTwoWeekAvg.get('amCount')) : 0,
        diastolic: vitalsTwoWeekAvg.get('amCount') ? Math.round(vitalsTwoWeekAvg.get('amDiastolic') / vitalsTwoWeekAvg.get('amCount')) : 0,
        heartRate: vitalsTwoWeekAvg.get('amCount') ? Math.round(vitalsTwoWeekAvg.get('amHeartRate') / vitalsTwoWeekAvg.get('amCount')) : 0,
      },
      bpAvgPm: {
        systolic: vitalsTwoWeekAvg.get('pmCount') ? Math.round(vitalsTwoWeekAvg.get('pmSystolic') / vitalsTwoWeekAvg.get('pmCount')) : 0,
        diastolic: vitalsTwoWeekAvg.get('pmCount') ? Math.round(vitalsTwoWeekAvg.get('pmDiastolic') / vitalsTwoWeekAvg.get('pmCount')) : 0,
        heartRate: vitalsTwoWeekAvg.get('pmCount') ? Math.round(vitalsTwoWeekAvg.get('pmHeartRate') / vitalsTwoWeekAvg.get('pmCount')) : 0,
      },
      bpAvgLunch: {
        systolic: vitalsTwoWeekAvg.get('lunchCount') ? Math.round(vitalsTwoWeekAvg.get('lunchSystolic') / vitalsTwoWeekAvg.get('lunchCount')) : 0,
        diastolic: vitalsTwoWeekAvg.get('lunchCount') ? Math.round(vitalsTwoWeekAvg.get('lunchDiastolic') / vitalsTwoWeekAvg.get('lunchCount')) : 0,
        heartRate: vitalsTwoWeekAvg.get('lunchCount') ? Math.round(vitalsTwoWeekAvg.get('lunchHeartRate') / vitalsTwoWeekAvg.get('lunchCount')) : 0,
      },
      vitals: 'N/A',
      medications: 'N/A',
    };
  }
  return {};
});

export const getCurrentMedicationOverview = createSelector([getRequiredMedicationData], (medication) => {
  if (Iterable.isIterable(medication) && !medication.isEmpty()) {
    return medication
      .toSeq()
      .reduce((a, data) => {
        let accumulator = a;
        const doseDetails = data.get('doseDetails');
        const currentAmMedications = accumulator.get('am');
        const currentPmMedications = accumulator.get('pm');
        const currentLunchMedications = accumulator.get('lunch');

        if (data.get('hyperTensionMedFrequency') === 'qd') {
          if (doseDetails.getIn(['isHavingMedication', 0])) {
            const alteredAm = currentAmMedications.push({
              hypertensionMedName: data.get('hyperTensionMedName'),
              dose: data.get('dose'),
            });
            accumulator = accumulator.set('am', alteredAm);
          }
          if (doseDetails.getIn(['isHavingMedication', 2])) {
            const alteredPm = currentPmMedications.push({
              hypertensionMedName: data.get('hyperTensionMedName'),
              dose: data.get('dose'),
            });
            accumulator = accumulator.set('pm', alteredPm);
          }
        } else if (data.get('hyperTensionMedFrequency') === 'bid') {
          if (doseDetails.getIn(['isHavingMedication'])) {
            const alteredAm = currentAmMedications.push({
              hypertensionMedName: data.get('hyperTensionMedName'),
              dose: data.get('dose'),
            });
            const alteredPm = currentPmMedications.push({
              hypertensionMedName: data.get('hyperTensionMedName'),
              dose: data.get('dose'),
            });
            accumulator = accumulator.set('am', alteredAm);
            accumulator = accumulator.set('pm', alteredPm);
          }
        } else if (data.get('hyperTensionMedFrequency') === 'tid') {
          const alteredAm = currentAmMedications.push({
            hypertensionMedName: data.get('hyperTensionMedName'),
            dose: data.get('dose'),
          });
          const alteredPm = currentPmMedications.push({
            hypertensionMedName: data.get('hyperTensionMedName'),
            dose: data.get('dose'),
          });
          const alteredLunch = currentLunchMedications.push({
            hypertensionMedName: data.get('hyperTensionMedName'),
            dose: data.get('dose'),
          });

          accumulator = accumulator.set('am', alteredAm);
          accumulator = accumulator.set('pm', alteredPm);
          accumulator = accumulator.set('lunch', alteredLunch);
        }
        return accumulator;
      }, fromJS({
        am: [],
        pm: [],
        lunch: [],
      }));
  }
  return List();
});

const getLoggedMedicationCount = createSelector([getRequiredMedicationData, getLoggedMedicationDosesData], (required, logged) => {
  if (Iterable.isIterable(required) && Iterable.isIterable(logged)) {
    const loggedData = logged
      .toSeq()
      .reduce((a, data) => {
        let accumulator = a;
        if (isUndefined(data.getIn([data.get('date'), data.get('timeWindow')]))) {
          accumulator = accumulator.setIn([data.get('date'), timeAlias[data.get('timeWindow')], 'meds', 'doseTaken'], 1);
        } else {
          accumulator = accumulator.setIn([data.get('date'), timeAlias[data.get('timeWindow')], 'meds', 'doseTaken'], accumulator.getIn([data.get('date'), data.get('timeWindow')] + 1));
        }
        return accumulator;
      }, Map());

    const requiredData = required
      .toSeq()
      .reduce((a, data) => {
        let accumulator = a;
        const isHavingMedication = data.getIn(['doseDetails', 'isHavingMedication']);
        if (Iterable.isIterable(isHavingMedication)) {
          if (isHavingMedication.get(0)) {
            accumulator = accumulator.set('am', accumulator.get('am') + 1);
          }
          if (isHavingMedication.get(1)) {
            accumulator = accumulator.set('lunch', accumulator.get('lunch') + 1);
          }
          if (isHavingMedication.get(2)) {
            accumulator = accumulator.set('pm', accumulator.get('pm') + 1);
          }
        } else {
          // eslint-disable-next-line
          if (data.get('hyperTensionMedFrequency') === 'bid') {
            accumulator = accumulator.set('am', accumulator.get('am') + 1);
            accumulator = accumulator.set('pm', accumulator.get('pm') + 1);
          } else {
            accumulator = accumulator.set('am', accumulator.get('am') + 1);
            accumulator = accumulator.set('lunch', accumulator.get('lunch') + 1);
            accumulator = accumulator.set('pm', accumulator.get('pm') + 1);
          }
        }

        return accumulator;
      }, Map({
        am: 0,
        lunch: 0,
        pm: 0,
      }));
    return fromJS({
      loggedData,
      requiredData,
    });
  }
  return {};
});

const getCurrentDate = state => state.getIn(['apiData', 'hypertensionData', 'currentDuration']);
const getCurrentLimit = state => state.getIn(['apiData', 'hypertensionData', 'limit']);

export const getLogBook = createSelector([getBpReadingsCurrentDurationData, getLoggedMedicationCount, getMealIdToNameMap, getCurrentDate, getCurrentLimit], (bpReading, loggedMedicationCount, mealIdMap, actualCurrentDate, limit) => {
  if (Iterable.isIterable(loggedMedicationCount)) {
    const amTotalCount = loggedMedicationCount.getIn(['requiredData', 'am']);
    const lunchTotalCount = loggedMedicationCount.getIn(['requiredData', 'lunch']);
    const pmTotalCount = loggedMedicationCount.getIn(['requiredData', 'pm']);
    let currentDate;
    if (actualCurrentDate) {
      currentDate = moment(actualCurrentDate).format('YYYY-MM-DD');
    } else {
      currentDate = moment().startOf('day').format('YYYY-MM-DD');
    }
    const logBook = getEmptyLogDataBetweenDates(currentDate, limit || 7, amTotalCount, lunchTotalCount, pmTotalCount);
    const result = logBook.mergeDeep(loggedMedicationCount.get('loggedData'));

    const afterBp = bpReading
      .toSeq()
      .reduce((a, data) => {
        let accumulator = a;
        const timeWindow = mealIdMap.get(getIdFromUrl(data.get('timeWindow'), baseUrl));
        if (timeWindow === 'breakfast') {
          const dateCurrent = moment(data.get('logDatetime')).format('YYYY-MM-DD');
          accumulator = accumulator.setIn([dateCurrent, 'am', 'bp', 'systolic'], data.get('systolic'));
          accumulator = accumulator.setIn([dateCurrent, 'am', 'bp', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([dateCurrent, 'am', 'hr'], data.get('heartRate'));
        } else if (timeWindow === 'lunch') {
          const dateCurrent = moment(data.get('logDatetime')).format('YYYY-MM-DD');
          accumulator = accumulator.setIn([dateCurrent, 'lunch', 'bp', 'systolic'], data.get('systolic'));
          accumulator = accumulator.setIn([dateCurrent, 'lunch', 'bp', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([dateCurrent, 'lunch', 'hr'], data.get('heartRate'));
        } else if (timeWindow === 'bedtime') {
          const dateCurrent = moment(data.get('logDatetime')).format('YYYY-MM-DD');
          accumulator = accumulator.setIn([dateCurrent, 'pm', 'bp', 'systolic'], data.get('systolic'));
          accumulator = accumulator.setIn([dateCurrent, 'pm', 'bp', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([dateCurrent, 'pm', 'hr'], data.get('heartRate'));
        }
        return accumulator;
      }, result);
    const ret = afterBp
      .toList()
      .sort((a, b) => {
        if (a.get('date') && b.get('date')) {
          return b.get('date').localeCompare(a.get('date'));
        }
        return null;
      });
    return ret;
  }
  return List();
});

const getAverageValues = (am, pm) => {
  const systolicCount = (am.get('systolic') !== 0 ? 1 : 0) + (pm.get('systolic') !== 0 ? 1 : 0);
  const diastolicCount = (am.get('diastolic') !== 0 ? 1 : 0) + (pm.get('diastolic') !== 0 ? 1 : 0);
  return fromJS({
    systolic: systolicCount !== 0 ? (am.get('systolic') + pm.get('systolic')) / systolicCount : 0,
    diastolic: diastolicCount !== 0 ? (am.get('diastolic') + pm.get('diastolic')) / diastolicCount : 0,
  });
};

export const getHyperTensionGraphData = createSelector([getBpReadingsData, getMealIdToNameMap], (bp, mealIdMap) => {
  const startDate = moment().startOf('day').format('YYYY-MM-DD');
  const emptyData = getEmptyGraphDataBetweenDates(startDate, 30);
  if (Iterable.isIterable(bp)) {
    const result = bp
      .toSeq()
      .reduce((a, data) => {
        let accumulator = a;
        const timeWindow = mealIdMap.get(getIdFromUrl(data.get('timeWindow'), baseUrl));
        const currentDate = moment(data.get('logDatetime'));
        if (timeWindow === 'breakfast') {
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'am', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'am', 'systolic'], data.get('systolic'));
        } else if (timeWindow === 'bedtime') {
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'pm', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'pm', 'systolic'], data.get('systolic'));
        } else if (timeWindow === 'lunch') {
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'lunch', 'diastolic'], data.get('diastolic'));
          accumulator = accumulator.setIn([currentDate.format('YYYY-MM-DD'), 'lunch', 'systolic'], data.get('systolic'));
        }
        return accumulator;
      }, emptyData)
      .map((value, key) => {
        const averageValues = getAverageValues(value.get('am'), value.get('pm'));
        return fromJS({
          date: key,
          valueSystolic: averageValues.get('systolic'),
          valueDiastolic: averageValues.get('diastolic'),
          bgChecks: 2,
        });
      })
      .toList()
      .sort((a, b) => {
        const firstDate = moment(a.get('date'), 'YYYY-MM-DD');
        const secondDate = moment(b.get('date'), 'YYYY-MM-DD');

        if (firstDate.isAfter(secondDate)) {
          return -1;
        } else if (firstDate.isBefore(secondDate)) {
          return 1;
        }
        return 0;
      });

    return result;
  }
  return List();
});

export const getAverageChange = createSelector([getBpReadingsData], (bp) => {
  if (Iterable.isIterable(bp)) {
    const currentDate = moment();
    const pastWeekStartedDate = currentDate.clone().subtract({ days: 6 });
    const result = bp
      .toSeq()
      .reduce((accumulator, data) => {
        const date = moment(data.get('logDatetime'));
        if (date.isBetween(currentDate.format('YYYY-MM-DD'), pastWeekStartedDate.format('YYYY-MM-DD'))) {
          return accumulator
            .set('systolicCurrentWeek', accumulator.get('systolicCurrentWeek') + data.get('systolic'))
            .set('diastolicCurrentWeek', accumulator.get('diastolicCurrentWeek') + data.get('diastolic'))
            .set('currentWeekCount', accumulator.get('currentWeekCount') + 1);
        }
        return accumulator
          .set('systolicPastWeek', accumulator.get('systolicPastWeek') + data.get('systolic'))
          .set('diastolicPastWeek', accumulator.get('diastolicPastWeek') + data.get('diastolic'))
          .set('pastWeekCount', accumulator.get('pastWeekCount') + 1);
      }, Map({
        systolicCurrentWeek: 0,
        systolicPastWeek: 0,
        diastolicCurrentWeek: 0,
        diastolicPastWeek: 0,
        currentWeekCount: 0,
        pastWeekCount: 0,
      }));
    const currentWeekCount = result.get('currentWeekCount') !== 0 ? result.get('currentWeekCount') : 1;
    const pastWeekCount = result.get('pastWeekCount') !== 0 ? result.get('pastWeekCount') : 1;
    return {
      systolic: Math.floor((result.get('systolicCurrentWeek') / currentWeekCount) - (result.get('systolicPastWeek') / pastWeekCount)),
      diastolic: Math.floor((result.get('diastolicCurrentWeek') / currentWeekCount) - (result.get('diastolicPastWeek') / pastWeekCount)),
    };
  }
  return null;
});
export const getFetchStatus = (state) => {
  return {
    graphStatus: {
      isFetching: state.getIn(['fetchStatus', 'hyperTensionData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'hyperTensionData', 'isFetched']),
    },
    isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
      || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching'])
      || state.getIn(['fetchStatus', 'hyperTensionData', 'isFetching']),
    isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
      && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched'])
      && state.getIn(['fetchStatus', 'hypertensionData', 'isFetched']),
  };
};
