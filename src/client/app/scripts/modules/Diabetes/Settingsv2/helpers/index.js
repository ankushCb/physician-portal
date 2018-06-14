import replace from 'lodash/replace';
import toString from 'lodash/toString';
import toArray from 'lodash/toArray';
import sortBy from 'lodash/sortBy';
import lowerCase from 'lodash/lowerCase';
import isNull from 'lodash/isNull';
import { Iterable } from 'immutable';

import validateTimeWindowPatch from './validateTimeWindowPatch';
import { insulinApi } from '../../../../helpers/api.js';

const insulinApiUrl = insulinApi.getInsulins;
const timeSlots = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];
const optionsOrder = ['bg', 'basal', 'bolus', 'mixed'];

const getIdFromUrl = fetchUrl => replace(toString(fetchUrl).substr(toString(fetchUrl).indexOf(insulinApiUrl) + insulinApiUrl.length), '/', '');

const getUrlFromId = id => `${insulinApiUrl}${id}/`;

const getSortedTimeWindows = timeWindows => (
  sortBy(toArray(timeWindows), option => timeSlots.indexOf(lowerCase(option.name)))
);

const isCarbCountingRegimen = (regimenDetails) => {
  let isPremadeRegimen;
  let insulinRegimen;
  if (Iterable.isIterable(regimenDetails)) {
    isPremadeRegimen = regimenDetails.get('isPremadeRegimen');
    insulinRegimen = regimenDetails.get('insulinRegimen');
  } else {
    isPremadeRegimen = regimenDetails.isPremadeRegimen;
    insulinRegimen = regimenDetails.insulinRegimen;
  }
  return (isPremadeRegimen && insulinRegimen && insulinRegimen.includes('carb_'));
};

const sortScheduleTableData = timeWindows => timeWindows.sortBy(timeWindow => timeSlots.indexOf(timeWindow.get('name')));
const sortInsulinsByType = insulinOptions => sortBy(insulinOptions, o => optionsOrder.indexOf(o.type));

/**
 * method to calculate the correct corrction factor on the basis of correctionalOn condition of timeWindow,
 * hyperglycemiaThresholdEmergency. correctionTarget and correctionFactor
 */
const getCorrectionFactor = (correctionalDetails, thresholds) => {
  return correctionalDetails.correctionalOn ? correctionalDetails.correctionFactor :
     (thresholds.hyperglycemiaThresholdEmergency - correctionalDetails.correctionTarget);
};

const getLogTableRange = (emergency, mild, factor) => Math.ceil((emergency - mild) / factor);

const getGlucoseRanges = (target, factor, emergency, maxRange = 5) => {
  // When empty or when factor is zero return empty array instead of going
  // into an infinite loop
  if (!factor || isNull(factor)) {
    return [];
  }

  const ranges = [];
  let min;
  let max = target;
  do {
    min = max;
    max += factor;
    if (ranges.length === maxRange) {
      ranges.push({ min, max: emergency });
      break;
    }
    if (max <= emergency) {
      ranges.push({ min, max });
    }
  } while (max < emergency);
  return ranges;
};

export default {
  getCorrectionFactor,
  getLogTableRange,
  getGlucoseRanges,
  getIdFromUrl,
  getUrlFromId,
  getSortedTimeWindows,
  validateTimeWindowPatch,
  isCarbCountingRegimen,
  sortScheduleTableData,
  sortInsulinsByType,
};
