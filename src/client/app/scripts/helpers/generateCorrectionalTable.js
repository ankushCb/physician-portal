import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import concat from 'lodash/concat';

import getCorrectionFactor from 'scripts/modules/Diabetes/Settings/helpers/getCorrectionFactor.js';
import getGlucoseRanges from 'scripts/modules/Diabetes/Settings/helpers/getGlucoseRanges.js';

const correctionTargetParams = [
  'target',
  'hyperglycemiaThresholdEmergency',
  'correctionFactor',
];

const generateIncrementalDoses = (rangeStart, rangeEnd, to, correctionFactor) => {
  const result = [];
  let currentRangeStart = rangeStart;
  let factorMultiplier = to < 0 ? Math.floor((rangeEnd - rangeStart) / correctionFactor) : 1;

  while (currentRangeStart < rangeEnd) {
    const currentRange = {
      glucose_low: currentRangeStart,
      glucose_high: currentRangeStart + correctionFactor,
      dose_addition: to * factorMultiplier,
    };

    currentRangeStart += correctionFactor;
    factorMultiplier = factorMultiplier + (to < 0 ? -1 : 1);
    result.push(currentRange);
  }
  return {
    result,
    currentRangeStart,
  };
};

export const generateCorrectionalTable = (props) => {
  const {
    hyperglycemiaThresholdEmergency: hyper,
    correctionTarget: target,
    correctionIncrement: to,
    correctionalOn,
    negativeCorrectionalOn: isNegative,
    allowNegativeCorrectional,
    hypoglycemiaGlucoseThresholdMild: hypo,
  } = props;

  // CorrectionalOn, correctionTargetParams
  const correctionFactor = getCorrectionFactor(correctionalOn, pick(props, correctionTargetParams));
  // getGlucoseRanges(target, factor, emergencyRanges);

  /* This function will change as per negative correctional */
  const range = Math.ceil((hyper - hypo) / correctionFactor);

  // Pass in range only if it is diabetes carela
  const glucoseRanges = getGlucoseRanges(target, correctionFactor, hyper, allowNegativeCorrectional ? range : 5);

  let previous = null;

  let currentCorrectionalValue = 0;
  let finalResult;
  // Extracts the exact correctional table based on bg value (Handling diabetesCarela separately)
  if (!isNegative) {
    // Try replacing this logic as in the case of negative
    finalResult = reduce(glucoseRanges, (accumulator, doseSecond, factorMultiplierSecond) => {
      if (previous === null) {
        previous = factorMultiplierSecond === 0 ? hypo : doseSecond.min;
        return accumulator;
      }
      const result = {
        glucose_low: previous,
        glucose_high: doseSecond.min,
        dose_addition: currentCorrectionalValue,
      };
      previous = doseSecond.min;
      currentCorrectionalValue += to;
      accumulator.push(result);
      return accumulator;
    }, []);

    // Do this only if it is diabetesCarela without negative
    if (finalResult.length >= 1) {
      finalResult.push({
        glucose_low: previous,
        glucose_high: glucoseRanges[glucoseRanges.length - 1].max,
        dose_addition: currentCorrectionalValue,
      });
    }
  } else {
    finalResult = [];

    // This will be value of current range since a range might partially cross its limit
    let updatedRangeStart = hypo <= 30 ? hypo : 30;

    // Hypo to target just subtract correctional
    if (hypo > 30) {
      const {
        result: negativeRangeDoses,
        currentRangeStart,
      } = generateIncrementalDoses(30, hypo, -1 * to, correctionFactor);

      finalResult = concat(finalResult, negativeRangeDoses);

      updatedRangeStart = currentRangeStart;
    }

    // hypo to Target just leave as it is.
    if (target >= hypo) {
      const {
        result: hypoToTarget,
        currentRangeStart,
      } = generateIncrementalDoses(updatedRangeStart, target, 0, correctionFactor);
      finalResult = concat(finalResult, hypoToTarget);

      updatedRangeStart = currentRangeStart;
    }

    // Target to hyper increment with correction
    if (hyper >= updatedRangeStart) {
      const {
        result: targetToHyper,
      } = generateIncrementalDoses(updatedRangeStart, hyper, to, correctionFactor);
      finalResult = concat(finalResult, targetToHyper);
    }
  }
  return finalResult;
};
