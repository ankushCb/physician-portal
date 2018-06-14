import { createSelector } from 'reselect';
import { Iterable, List, Map, fromJS } from 'immutable';
import { baseUrl } from 'scripts/helpers/api.js';

import isNull from 'lodash/isNull';
import reduce from 'lodash/reduce';
import upperFirst from 'lodash/upperFirst';

/* direct data */

export const getHyperTensionSettingsData = state => state.getIn(['apiData', 'patientCommonData', 'hypertensionSettingsData']);


/* UI data */

// move this to derived data ht settings
export const getThresholdData = createSelector([getHyperTensionSettingsData], (htSettings) => {
  if (Iterable.isIterable(htSettings)) {
    return {
      hypertensionDiastolicThreshold: htSettings.get('hypertensionDiastolicThreshold'),
      hypertensionSystolicThreshold: htSettings.get('hypertensionSystolicThreshold'),
      hypertensionThresholdMild: htSettings.get('hypertensionThresholdMild'),
      hypertensionThresholdSevere: htSettings.get('hypertensionThresholdSevere'),
      hypotensionDiastolicThreshold: htSettings.get('hypotensionDiastolicThreshold'),
      hypotensionSystolicThreshold: htSettings.get('hypotensionSystolicThreshold'),
      hypotensionThreshold: htSettings.get('hypotensionThreshold'),
    };
  }
});

export const getClassPrimaryDetail = state => state.getIn(['derivedData', 'mappingFromApiData', 'classDetails']);
export const getRequiredClasses = state => state.getIn(['derivedData', 'mappingFromApiData', 'requiredClasses']);

export const getClassDetail = createSelector([getClassPrimaryDetail, getRequiredClasses], (classes, required) => {
  if (Iterable.isIterable(classes) && Iterable.isIterable(required)) {
    return classes
      .toSeq()
      .reduce((accumulator, data) => {
        data = data.set('required', required.get(data.get('name')));
        return accumulator.push(data);
      }, List());
  }
});

export const getRequiredMedicationDoses = state => state.getIn(['apiData', 'hypertensionData', 'requiredMedicationDosesData']);


export const getClassDetails = createSelector([getClassDetail, getRequiredMedicationDoses], (classDetails, requiredMedication) => {
  if (Iterable.isIterable(classDetails) && Iterable.isIterable(requiredMedication) && !requiredMedication.isEmpty()) {
    const findFromRequiredMedication = medication => requiredMedication.findIndex(data => data.get('hyperTensionMedUrl') === medication);

    const result = classDetails
      .toSeq()
      .reduce((classAccumulator, medications) => {
        const isFound = medications
          .get('medications')
          .toSeq()
          .reduce((medicationAccumulator, medication) => {
            const index = findFromRequiredMedication(medication.get('url'));
            if (index >= 0) {
              medicationAccumulator = medicationAccumulator.set('url', medication.get('url'));
            }
            return medicationAccumulator;
          }, Map());
          medications = medications.set('selectedMedicationId', isFound.get('url'));
          classAccumulator = classAccumulator.push(medications);
        return classAccumulator;
      }, List());
    return result;
  }
  return classDetails;
});

const getResult = state => state.getIn(['form', 'hypertensionSettingsForm', 'values', 'scheduleList']);

export const getResultsData = createSelector([getResult], (result) => {
  if (Iterable.isIterable(result)) {
    return result
      .toSeq()
      .reduce((accumulator, data) => {
        if (data.get('isInSchedule')) {
          const frequency = data.get('hyperTensionMedFrequency');
          let result = Map();
          if (frequency === 'qd') {
            const isPsuedoBid = data.getIn(['doseDetails', 'isHavingMedication', 0]) && data.getIn(['doseDetails','isHavingMedication', 2]);
            result = result.set('dose', data.get('dose'));
            result = result.set('isPsuedoBid', isPsuedoBid);
            if (!isPsuedoBid) {
              const isAm = data.getIn(['doseDetails', 'isHavingMedication', 0]);
              const isPm = data.getIn(['doseDetails', 'isHavingMedication', 2]);
              const windows = [];

              if (isAm) {
                windows.push('AM');
              }
              if (isPm) {
                windows.push('PM');
              }
              result = result.set('qdWindow', List(windows));
            }
            result = result.set('frequency', frequency);
            result = result.set('hyperTensionMedName', data.get('hyperTensionMedName'));
            result = result.set('schedulePriority', data.get('schedulePriority'));
          } else {
            result = result.set('dose', data.get('dose'));
            result = result.set('frequency', frequency);
            result = result.set('hyperTensionMedName', data.get('hyperTensionMedName'));
            result = result.set('schedulePriority', data.get('schedulePriority'));
          }
          accumulator = accumulator.push(result);
        }
        return accumulator;
      }, List())
      .sort((a, b) => (a.get('schedulePriority')) > b.get('schedulePriority'));
  }
});

export const getAccumulatedMedicationDosesData = createSelector([getRequiredMedicationDoses, getClassDetails], (medicationDoses, classData) => {
  if (Iterable.isIterable(classData) && Iterable.isIterable(medicationDoses)) {
    const result = classData
      .toSeq()
      .reduce((accumulator, medication) => {
        let result = Map();
        const className = medication.get('name');
        const classIndex = !medicationDoses.isEmpty() ? medicationDoses.findIndex(data => data.get('hyperTensionMedClass') === className) : -1;
        const doseDetails = fromJS({
          hyperTensionUrl: null,
          isHavingMedication: null,
          timeWindow: null,
          timeWindowUrl: null,
        });
        if (classIndex !== -1) {
          result = medicationDoses.getIn([classIndex]);
        } else {
          result = result.set('isInSchedule', false);
          result = result.set('dose', 0);
          result = result.set('doseDetails', doseDetails);
          result = result.set('hyperTensionMedClass', className);
          result = result.set('hyperTensionMedName', null);
          result = result.set('hyperTensionMedFrequency', null);
          result = result.set('hyperTensionMedUrl', null);
        }
        return accumulator.push(result);
      }, List());
    return result;
  }
});

export const getMealTimings = (state) => {
  const timeWindows = {
    am: 'breakfast',
    lunch: 'lunch',
    pm: 'bedtime',
  };

  const timeTypes = ['startTime', 'stopTime'];
  const path = ['derivedData', 'mappingFromApiData', 'timeWindowNameTimeMap'];

  const result = reduce(timeWindows, (obj, timeWindowName, timeWindowCode) => ({
    ...obj,
    [timeWindowCode]: reduce(timeTypes, (innerObj, timeType) => ({
      ...innerObj,
      [timeType]: state.getIn([...path, timeWindowName, timeType]),
    }), {}),
  }), {});
  return result;
};

export const getMealTimingsReadOnly = (state) => {
  return state.getIn(['form', 'hypertensionSettingsForm', 'values', 'data']);
}

const getHtRequiredMedicationDosesData = state => state.getIn(['apiData', 'hypertensionData', 'requiredMedicationDosesData']);

export const isValidData = createSelector([getHtRequiredMedicationDosesData], (result) => {
  if (result) {
    const isValid = result
      .toSeq()
      .reduce((accumulator, data) => {
        let isValidMedication;
        if (data.get('isInSchedule')) {
          const isValidMedication = !isNull(data.get('hypertensionMedUrl'));
          return accumulator & isValidMedication;
        }
        return accumulator;
      }, true)
    return isValid;
  } else {
    return true;
  }
});

export const getFetchStatus = (state) => {
  return {
    isFetching: state.getIn(['fetchStatus', 'hyperTensionData', 'isFetching'])
      || state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching'])
      || state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
    isFetched: state.getIn(['fetchStatus', 'hyperTensionData', 'isFetched'])
      && state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched'])
      && state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    formIsUpdating: state.getIn(['fetchStatus', 'hypertensionFormData', 'isUpdating']),
  };
};
