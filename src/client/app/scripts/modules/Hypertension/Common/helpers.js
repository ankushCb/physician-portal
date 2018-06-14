import { fromJS, List, Map } from 'immutable';
import { baseUrl } from 'scripts/helpers/api';

import replace from 'lodash/replace';
import first from 'lodash/first';

export const getIdFromUrl = (url, bUrl, scrapUrl) => {
  const apiUrl = bUrl + scrapUrl;
  const resultUrl = url.replace(apiUrl, '');
  return resultUrl.substring(0, resultUrl.length - 1);
};

export const getIndexFromName = name => Number(replace(first(name.match(/\[.+\]/g)), /(\[|\])/g, ''));

export const processRequiredMedicationData = (requiredMedicationDosesData, timeWindowUrlToNameMap, mealIdMap, medicationUrlToDataMapping) => {
  if (medicationUrlToDataMapping) {
    const mealIdMapForThreeWindows = fromJS([
      `${baseUrl}/api/time-windows/${mealIdMap.get('breakfast')}/`,
      `${baseUrl}/api/time-windows/${mealIdMap.get('lunch')}/`,
      `${baseUrl}/api/time-windows/${mealIdMap.get('bedtime')}/`,
    ]);
    const result = requiredMedicationDosesData
      .toSeq()
      .reduce((accumulator, medication) => {
        const url = medication.getIn(['medication', 'url']);
        let medicationObject = Map();
        const medicationData = medicationUrlToDataMapping.get(url);
        if (!medicationData) {
          return accumulator.push(fromJS({
            hypertensionMedUrl: null,
            isInSchedule: true,
          }));
        }
        let doseDetails;
        let isPsuedoBid;

        if (medicationData.get('dosageFrequency') === 'qd') {
          const timeWindows = medication.get('timeWindows');
          const length = timeWindows.size;
          let isAM = false;
          let isPM = false;
          isPsuedoBid = false;
          if (length > 1) {
            isAM = true;
            isPM = true;
            isPsuedoBid = true;
          } else if (length === 1) {
            isAM = timeWindows.get(0) === mealIdMapForThreeWindows.get(0);
            isPM = timeWindows.get(0) === mealIdMapForThreeWindows.get(2);
          }
          doseDetails = fromJS({
            hyperTensionUrl: medication.get('url'),
            isHavingMedication: [isAM, false, isPM],
            timeWindow: ['breakfast', 'lunch', 'bedtime'],
            timeWindowUrl: mealIdMapForThreeWindows,
          });
        } else {
          doseDetails = fromJS({
            hyperTensionUrl: medication.get('url'),
            isHavingMedication: true,
            timeWindowUrl: mealIdMapForThreeWindows,
          });
        }

        medicationObject = medicationObject.set('dose', (medication.get('dose') * (isPsuedoBid ? 2 : 1)).toString());
        medicationObject = medicationObject.set('doseUnit', medication.get('doseUnit'));
        medicationObject = medicationObject.set('hyperTensionMedClass', medicationData.get('type'));
        medicationObject = medicationObject.set('hyperTensionMedName', medicationData.get('name'));
        medicationObject = medicationObject.set('hyperTensionMedFrequency', medicationData.get('dosageFrequency'));
        medicationObject = medicationObject.setIn(['hyperTensionMedUrl'], url);
        medicationObject = medicationObject.set('isInSchedule', true);
        medicationObject = medicationObject.set('isActive', medication.get('dose') !== 0);
        medicationObject = medicationObject.set('schedulePriority', medication.get('schedulePriority'));
        medicationObject = medicationObject.set('doseDetails', doseDetails);
        return accumulator.push(medicationObject);
      }, List());
    return result;
  }
  return List();
};
