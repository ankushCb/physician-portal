import { fromJS, Map } from 'immutable';

import pick from 'lodash/pick';
import map from 'lodash/map';
import times from 'lodash/times';
import concat from 'lodash/concat';
import isNull from 'lodash/isNull';

import { isCarbCounting } from 'scripts/helpers/timeWindowHelpers.js';
import { getUrlFromId } from '../modules/Diabetes/Settings/helpers/getInsulin.js';
import getCorrectionFactor from 'scripts/modules/Diabetes/Settings/helpers/getCorrectionFactor.js';
import getGlucoseRanges from 'scripts/modules/Diabetes/Settings/helpers/getGlucoseRanges.js';

const correctionTargetParams = [
  'correctionTarget',
  'hyperglycemiaThresholdEmergency',
  'correctionFactor',
];

const extractDoses = (idInsulinMap, doseValue, baseInsulin, correctionalInsulin) => {
  if (typeof doseValue === 'string') {
    const splitValue = doseValue.split('+');
    const result = [{
      insulin_dose: parseInt(splitValue[0]),  // eslint-disable-line
      insulin_url: getUrlFromId(baseInsulin),
      insulin_name: idInsulinMap[baseInsulin],
    }, {
      insulin_dose: splitValue[1] ? parseInt(splitValue[1]) : 0, // eslint-disable-line
      insulin_name: idInsulinMap[correctionalInsulin],
      insulin_url: getUrlFromId(correctionalInsulin),
    }];
    return result;
  }
  const result = [{
    insulin_dose: doseValue > 0 ? doseValue : 0,
    insulin_url: getUrlFromId(baseInsulin),
    insulin_name: idInsulinMap[baseInsulin],
  }];
  // console.log('each meal', result);
  return result;
};

// Checks if it is a carb count meal & of bolus to create array of carbs
const isCarbCountingMeal = (insulinRegimen, timeWindow) => (
  isCarbCounting(insulinRegimen) &&
  insulinRegimen.includes('carb_counting') &&
  timeWindow.get('insulinTypePreloaded') === 'bolus'
);

/* Given a bgRange the dose table is calculated */
const getDoseTableForRange = (
  timeWindow,
  diabetesSettings,
) => {

  // Destructure diabetesSettings
  const {
    idInsulinMap,
    insulin,
    multiplyWith,
    bgReading,
    isBasal,
    correctionalDose,
    basalInsulin,
    correctionalOn,
    correctionalInsulin,
    hypoglycemiaGlucoseThresholdMild,
    isNegative,
    insulinRegimen,
    isBgAboveTarget,
  } = diabetesSettings;

  let doseValue = 0;
  const baseDose = timeWindow.get('baseDose');
  const isCCMeal = isCarbCountingMeal(insulinRegimen, timeWindow);
  // console.log('should calculate for the range ', bgReading, isBgAboveTarget);

  // If it is a carb counting meal
  if (isCCMeal) {
    let count = 0;

    // Generate carb count table for each meal
    const carbRatio = isNull(timeWindow.get('carbCountingRatio')) ? 15 : timeWindow.get('carbCountingRatio');

    const doseValueResult = times(10, () => {
      const carbRangeStart = count !== 0 ? (count * carbRatio + 1) : 0;
      count += 1; // Count should start at 1

      const ccCorrectedValue = count
        + multiplyWith // (Not multiplying, just adding because it is CC)
        + (isNegative && isBgAboveTarget ? 1 : 0);

      return {
        carb_entry: carbRangeStart,
        doses: extractDoses(idInsulinMap, ccCorrectedValue, insulin),
      };
    });

    // bg_reading is the bg Range start value
    // carb_table coming from here will always have 10 fields.
    return {
      bg_reading: (multiplyWith === 0 && !isNegative) ? hypoglycemiaGlucoseThresholdMild : bgReading,
      carb_table: doseValueResult,
    };
  } else {
    // Check whether correctionalDose is correct
    if (timeWindow.get('baseDose') === 0 || !isBasal) {
      // If not basal don't split the base and correctional
      doseValue = baseDose + correctionalDose;
      doseValue = doseValue > 0 ? doseValue : 0;
    } else {
      if (correctionalDose > 0) {
        doseValue = `${baseDose} + ${correctionalDose}`;
      } else {
        doseValue = baseDose;
      }
    }
    let actualInsulinDose;
    // If it is bg check only
    if (timeWindow.get('insulinTypePreloaded') === 'bg') {
      actualInsulinDose = [{
        insulin_dose: correctionalDose > 0 ? correctionalDose : 0,
        insulin_url: getUrlFromId(basalInsulin),
        insulin_name: idInsulinMap[basalInsulin],
      }];
      // console.log('bg ', bgReading, actualInsulinDose);
    } else {
      const extractBaseWithCorrectional = extractDoses(idInsulinMap, doseValue, basalInsulin, correctionalInsulin);
      const extractBase = extractDoses(idInsulinMap, doseValue, insulin);
      actualInsulinDose = isBasal ? extractBaseWithCorrectional : extractBase;
    }

    return {
      bg_reading: (multiplyWith === 0 && !isNegative) ? hypoglycemiaGlucoseThresholdMild : bgReading,
      carb_table: {
        carb_entry: 0,
        doses: actualInsulinDose,
      },
    };
  }
};

/* Gets Data for a meal */
const getDataForMeal = (
  timeWindow,
  glucoseRanges,
  diabetesSettings,
) => {
  // Destructure it
  const {
    basalInsulin,
    bolusInsulin,
    mixedInsulin,
    correctionIncrement,
    negativeCorrectionOn,
    allowNegativeCorrectional,
    hypoglycemiaGlucoseThresholdMild,
    correctionalOn,
    correctionTarget,
    correctionFactor,
  } = diabetesSettings;

  // get insulin name
  let insulin = null;
  const insulinType = timeWindow.get('insulinTypePreloaded');

  const isBasal = insulinType === 'basal';

  // get the insulin of appropriate type
  if (insulinType === 'basal') {
    insulin = basalInsulin;
  } else if (insulinType === 'bolus') {
    insulin = bolusInsulin;
  } else if (insulinType === 'mixed') {
    insulin = mixedInsulin;
  }

  let currentBg = 30;
  const minToHypo = [];
  // 30 to hypo (if negative)
  let currentBgCount = Math.ceil((hypoglycemiaGlucoseThresholdMild - 30) / correctionFactor);

  // Dose Table 1 - 30 to hypo value
  while (currentBg < hypoglycemiaGlucoseThresholdMild) {
    const correctionalDose = (
      timeWindow.get('correctionalInsulinOn') && currentBgCount > 0
    ) ? ((-1) * currentBgCount * correctionIncrement) : 0;

    minToHypo.push(
      getDoseTableForRange(
        timeWindow,
        {
          ...diabetesSettings,
          bgReading: currentBg,
          correctionalOn,
          isNegative: allowNegativeCorrectional && negativeCorrectionOn, // if currently is in negative range
          multiplyWith: -currentBgCount, // Current Bg Count is the subtraction Count from hypo
          correctionalDose, // Correctional Dose during in the 30 to hypo
          isBasal,
          insulin,
        },
      ),
    );
    currentBgCount -= 1;
    currentBg += correctionFactor;
  }

  // Hypo to target (if negative)
  const hypoToTarget = [];
  while (currentBg < correctionTarget) {
    hypoToTarget.push(
      getDoseTableForRange(
        timeWindow,
        {
          ...diabetesSettings,
          bgReading: currentBg,
          correctionalOn,
          isNegative: allowNegativeCorrectional && negativeCorrectionOn, // if currently is in negative range
          multiplyWith: 0,
          correctionalDose: 0, // Correctional Dose during in the 30 to hypo
          isBasal,
          insulin,
        }),
      );
    currentBg += correctionFactor;
  }

  // Above Target
  const doseValueForTimeWindow = map(glucoseRanges, (doseSecond, factorMultiplierSecond) => {
    // Go through each bg range and set the insulin for that corresponding bg

    // doseSecond is object having min max of each ranges
    // Factor multiplier is the index of each range

    let correctionalDose;
    if (!negativeCorrectionOn) {
      correctionalDose = (
        timeWindow.get('correctionalInsulinOn') && factorMultiplierSecond >= 0
      ) ? (factorMultiplierSecond) * correctionIncrement : 0;
    } else {
      correctionalDose = (
        timeWindow.get('correctionalInsulinOn') && factorMultiplierSecond >= 0
      ) ? (factorMultiplierSecond + 1) * correctionIncrement : 0; // Adding 1 because the 0th range has 1 factor of correctional by default
    }
    const bgReading = (allowNegativeCorrectional && negativeCorrectionOn) ?
      (currentBg + (factorMultiplierSecond * correctionFactor)) : doseSecond.min;

    return getDoseTableForRange(

      timeWindow,
      {
        ...diabetesSettings,
        bgReading,
        multiplyWith: factorMultiplierSecond, // Current Bg Count is the subtraction Count from hypo
        correctionalDose,
        isNegative: allowNegativeCorrectional && negativeCorrectionOn, // if currently is in negative range
        isBasal,
        insulin,
        isBgAboveTarget: true,
      }
    );
  });

  if (allowNegativeCorrectional && negativeCorrectionOn) {
    return concat(minToHypo, hypoToTarget, doseValueForTimeWindow);
  } else {
     // Hypo value (if not negative)
    return doseValueForTimeWindow; // eslint-disable-line
  }
};


export const generateLogBookData = (props) => {
  const {
    idInsulinMap,
    timeWindows,
    hyperglycemiaThresholdEmergency,
    correctionTarget,
    correctionIncrement,
    correctionalOn,
    insulinRegimen,
    basalInsulin,
    bolusInsulin,
    mixedInsulin,
    hypoglycemiaGlucoseThresholdMild,
    correctionalInsulin,
    negativeCorrectionOn,
    allowNegativeCorrectional,
  } = props;

  // Time Window Data
  const timeWindowData = fromJS(timeWindows);

  // Gets the correction factor
  const correctionFactor = getCorrectionFactor(correctionalOn, pick(props, correctionTargetParams));

  const range = Math.ceil((hyperglycemiaThresholdEmergency - hypoglycemiaGlucoseThresholdMild) / correctionFactor);

  // Gets the glucose ranges in { min, max } format
  let glucoseRanges;
  if (allowNegativeCorrectional) {
    glucoseRanges = getGlucoseRanges(correctionTarget, correctionFactor, hyperglycemiaThresholdEmergency, range);
  } else {
    glucoseRanges = getGlucoseRanges(correctionTarget, correctionFactor, hyperglycemiaThresholdEmergency, 5);
  };

  // Accumulate data in diabetesSettings
  const diabetesSettings = {
    basalInsulin,
    bolusInsulin,
    mixedInsulin,
    correctionIncrement,
    idInsulinMap,
    correctionalInsulin,
    negativeCorrectionOn,
    allowNegativeCorrectional,
    hypoglycemiaGlucoseThresholdMild,
    correctionalOn,
    insulinRegimen,
    correctionTarget,
    correctionFactor,
  };

  // Generates the dose Table
  const timeWindowDataCalculated = timeWindowData
    .toSeq()
    .reduce((accumulator, timeWindow) => {
      // Go through each time window and calculate the dose table for it and store it with the correct format

      // This will be the dose table for each Time Window
      const getDataForTw = getDataForMeal(
        timeWindow,
        glucoseRanges,
        diabetesSettings,
      );

      // Store with key name and value generated from that function
      accumulator = accumulator.set(timeWindow.get('name'), getDataForTw); // eslint-disable-line
      return accumulator;
    }, Map());
    console.log('dose table: ', timeWindowDataCalculated);
  return timeWindowDataCalculated;
};
