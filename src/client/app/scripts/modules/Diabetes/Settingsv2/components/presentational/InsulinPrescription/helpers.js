import { Iterable } from 'immutable';
import concat from 'lodash/concat';
import reverse from 'lodash/reverse';

import helpers from '../../../helpers/';
import { isCarbCounting, isBolus } from '../../../../../../helpers/timeWindowHelpers';

const extractDoses = (doseValue, baseInsulin, correctionalInsulin) => {
  if (typeof doseValue === 'string') {
    // String in case of basal. As base is basal and correctional is bolus
    const splitValue = doseValue.split('+');
    return [{
      insulin_dose: parseInt(splitValue[0], 10),
      insulin_url: baseInsulin.url,
      insulin_name: baseInsulin.name,
    }, {
      insulin_dose: splitValue[1] ? parseInt(splitValue[1], 10) : 0,
      insulin_url: correctionalInsulin.url,
      insulin_name: correctionalInsulin.name,
    }];
  }
  return [{
    insulin_dose: doseValue,
    insulin_url: baseInsulin.url,
    insulin_name: baseInsulin.name,
  }];
};

const getDoseTableForRange = (
  scheduleDataRow,
  thresholds,
  isCarbCountingMeal,
  currentBgIndex,
  currentBg,
  correctionalDose,
  correctionalInsulin,
  negativeCorrectionalOn = false,
) => {
  let { insulin, carbCountingRatio } = scheduleDataRow;
  const { base_dose } = scheduleDataRow;
  const { hypoglycemiaGlucoseThresholdMild } = thresholds;
  let doseValue = base_dose;

  insulin = insulin || {};

  if (isCarbCountingMeal) {
    // Generate carb count table row. For 10 different carb entries
    carbCountingRatio = carbCountingRatio || 15;
    const carbTable = [];
    for (let count = 0; count < 10; count += 1) {
      carbTable.push({
        carb_entry: (count !== 0) ? (count * carbCountingRatio) : 0,
        doses: extractDoses((currentBgIndex + 1 + count), insulin, correctionalInsulin),
      });
    }

    return {
      bg_reading: (currentBgIndex === 0 && !negativeCorrectionalOn) ? hypoglycemiaGlucoseThresholdMild : currentBg,
      carb_table: carbTable,
    };
  }

  let actualInsulinDose;
  // Negative correction is applied only on bolus type as the correctional
  // insulins are always bolus. Basal cannot reduce/negate Bolus.
  if (base_dose === 0 || insulin.type === 'bolus') {
    // Since you're adding bolus with bolus, keep it as one value (doseValue)
    doseValue = base_dose + correctionalDose;
  } else {
    // If basal split and write the correctional dose saperately
    doseValue = `${base_dose} + ${correctionalDose}`;
  }

  if (insulin.type === 'bg' || !insulin.type) {
    // If it is bg check only, dose is just the correctional value
    actualInsulinDose = [{
      insulin_dose: correctionalDose,
      insulin_url: correctionalInsulin.url,
      insulin_name: correctionalInsulin.name,
    }];
  } else {
    actualInsulinDose = extractDoses(doseValue, insulin, correctionalInsulin);
  }

  return {
    bg_reading: (currentBgIndex === 0 && !negativeCorrectionalOn) ? hypoglycemiaGlucoseThresholdMild : currentBg,
    carb_table: {
      carb_entry: 0,
      doses: actualInsulinDose,
    },
  };
};

const generateDoseTableDataForMeal = (
  row,
  thresholds,
  regimenData,
  correctionalDetails,
  gRanges,
  correctionalInsulin,
) => {
  let glucoseRanges = [...gRanges];
  const { hypoglycemiaGlucoseThresholdMild, hyperglycemiaThresholdEmergency } = thresholds;
  const {
    correctionFactor,
    correctionIncrement,
    correctionTarget,
    allowNegativeCorrectional,
    negativeCorrectionalOn,
  } = correctionalDetails;
  const isCarbCountingMeal = isCarbCounting(regimenData.insulinRegimen) && isBolus(row.insulin);
  const minToHypo = [];
  const belowHypoBgCount = Math.ceil((hypoglycemiaGlucoseThresholdMild - 30) / correctionFactor);

  if (!row.correctionalInsulinOn && isCarbCountingMeal) {
    glucoseRanges = [{
      min: (allowNegativeCorrectional && negativeCorrectionalOn) ? 30 : hypoglycemiaGlucoseThresholdMild,
      max: hyperglycemiaThresholdEmergency,
    }];

    return glucoseRanges.map(range => getDoseTableForRange(
      row,
      thresholds,
      true,
      0,
      range.min,
      0,
      correctionalInsulin,
      true,
    ));
  }

  // Dose Table Part 1 - 30 to hypo value (if negative)
  // If negativeCorrection is on, reduce correctional value for every factor decrease
  // Only, Bolus can be subtracted from Bolus. Hence, when Basal, do not subtract
  let currentBg = 30;
  if (allowNegativeCorrectional && negativeCorrectionalOn) {
    currentBg = correctionTarget - correctionFactor;
    let currentBgIndex = 0;
    while(currentBg >= 30) {
      const correctionalDose = row.correctionalInsulinOn ? (-1 * currentBgIndex * correctionIncrement) : 0;
      minToHypo.push(getDoseTableForRange(
        row,
        thresholds,
        isCarbCountingMeal,
        (-1 * currentBgIndex),
        currentBg,
        correctionalDose,
        correctionalInsulin,
        negativeCorrectionalOn
      ));
      if (currentBg <= thresholds.hypoglycemiaGlucoseThresholdMild) {
        currentBgIndex += 1;
      }
      currentBg -= correctionFactor;
    }
    if (currentBg + correctionFactor !== 30) {
      currentBg = 30;
      const correctionalDose = row.correctionalInsulinOn ? (-1 * currentBgIndex * correctionIncrement) : 0;
      minToHypo.push(getDoseTableForRange(
        row,
        thresholds,
        isCarbCountingMeal,
        (-1 * currentBgIndex),
        currentBg,
        correctionalDose,
        correctionalInsulin,
        negativeCorrectionalOn
      ));
    }
  }

  // Part 2 - Target to Hyper
  // For every incement in the factor, increase the base dose (Basal or Bolus)
  // with correctionIncrement of correctionalInsulin (Bolus)
  const targetToHyper = glucoseRanges.map((range, currentBgIndex) => {
    let doseFactor = 1;
    currentBg = range.min;
    if (!negativeCorrectionalOn) {
      doseFactor = (currentBgIndex === 0) ? 0 : 1;
      currentBg = (currentBgIndex === 0) ? range.min : (range.min + correctionFactor);
    }

    const correctionalDose = row.correctionalInsulinOn ? (currentBgIndex + doseFactor) * correctionIncrement : 0;
    return getDoseTableForRange(
      row,
      thresholds,
      isCarbCountingMeal,
      currentBgIndex,
      currentBg,
      correctionalDose,
      correctionalInsulin,
      true,
    );
  });

  return concat(minToHypo.reverse(), targetToHyper);
};

export const generateLogTable = ({
  scheduleData,
  diabetesThresholds,
  regimenData,
  correctionalDetails,
  insulinList,
  selectedInsulins,
}) => {
  const { hyperglycemiaThresholdEmergency, hypoglycemiaGlucoseThresholdMild } = diabetesThresholds;
  const { allowNegativeCorrectional, negativeCorrectionalOn, correctionTarget } = correctionalDetails;

  const correctionalFactor = helpers.getCorrectionFactor(correctionalDetails, diabetesThresholds);
  const range = allowNegativeCorrectional ? helpers.getLogTableRange(
    hyperglycemiaThresholdEmergency,
    hypoglycemiaGlucoseThresholdMild,
    correctionalFactor,
  ) : 5;
  let glucoseRanges = helpers.getGlucoseRanges(
    correctionTarget,
    correctionalFactor,
    hyperglycemiaThresholdEmergency,
    range,
  );
  if (!negativeCorrectionalOn && glucoseRanges && glucoseRanges.length) {
    glucoseRanges = [{ min: hypoglycemiaGlucoseThresholdMild, max: glucoseRanges[0].min}, ...glucoseRanges];
  }

  const correctionalInsulin = selectedInsulins.bolus && insulinList.length &&
    insulinList.filter(i => i.id === selectedInsulins.bolus)[0];

  // For every time window (every row in the schedule table)
  // compute the dose table and store it inside the row
  const updatedScheduleData = [];
  scheduleData.forEach((r) => {
    const row = { ...r };
    row.doseTable = generateDoseTableDataForMeal(
      row,
      diabetesThresholds,
      regimenData,
      correctionalDetails,
      glucoseRanges,
      correctionalInsulin,
    );
    updatedScheduleData.push(row);
  });

  return helpers.getSortedTimeWindows(updatedScheduleData);
};

export const getCorrectionalTable = (
  diabetesThresholds,
  correctionalDetails,
  scheduleData,
  glucoseRowsLimit,
) => {
  const { hypoglycemiaGlucoseThresholdMild: hypo } = diabetesThresholds;
  const {
    correctionTarget: target,
    correctionIncrement: to,
    correctionalOn,
    correctionFactor,
    negativeCorrectionalOn: isNegative,
    allowNegativeCorrectional,
  } = correctionalDetails;

  const doseTable = scheduleData[0].doseTable;
  let corrTable = [];
  if (allowNegativeCorrectional && isNegative) {
    let doseAddition = 0;
    doseAddition = -1 * Math.ceil((hypo - 30) / correctionFactor);
    corrTable = doseTable.map((range) => {
      if (((range.bg_reading < hypo) || (range.bg_reading >= target))) {
        doseAddition += 1;
      }
      return {
        glucose_low: range.bg_reading,
        glucose_high: range.bg_reading + to,
        dose_addition: doseAddition,
      };
    });
  } else if (correctionalOn) {
    corrTable = doseTable.map((range, index) => {
      return {
        glucose_low: range.bg_reading,
        glucose_high: range.bg_reading + to,
        dose_addition: index,
      };
    });
  }

  return corrTable;
};

export const limitDose = (dose, min = 0, max = 200) => {
  let limitedDose = (dose >= min) ? dose : min;
  limitedDose = (limitedDose > max) ? max : limitedDose;
  return limitedDose;
};
