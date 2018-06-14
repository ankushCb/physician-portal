import { Iterable, Map } from 'immutable';
import includes from 'lodash/includes';

const getRegimenValidationSelector = (schedule, insulin, regimenData) => {
  if (Iterable.isIterable(schedule) && Iterable.isIterable(regimenData)) {
    const whatIsRequiredFromSchedule = schedule
      .toSeq()
      .reduce((accumulator, value) => {
        if (value.get('isDisplayed')) {
          const insulin = value.getIn(['insulin', 'type']);
          
          return Map({
            isBasalRequired: accumulator.get('isBasalRequired') || includes(insulin, 'basal'),
            isBolusRequired: accumulator.get('isBolusRequired') || includes(insulin, 'bolus'),
            isMixedRequired: accumulator.get('isMixedRequired') || includes(insulin, 'mixed'),
          });
        }
        return accumulator;
      }, Map({
        isBasalRequired: false,
        isBolusRequired: false,
        isMixedRequired: false,
      }))
    return {
      isPremadeRequired: regimenData.get('isPremadeRegimen') && regimenData.get('insulinRegimen') === 'custom',
      isBasalRequired: whatIsRequiredFromSchedule.get('isBasalRequired') && insulin.get('basal') === '',
      isBolusRequired: whatIsRequiredFromSchedule.get('isBolusRequired') && insulin.get('bolus') === '',
      isMixedRequired: whatIsRequiredFromSchedule.get('isMixedRequired') && insulin.get('mixed') === '',
    };
  };
}

export default getRegimenValidationSelector;