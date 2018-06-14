import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import snakeCase from 'lodash/snakeCase';

import { deepSnakeCase } from 'scripts/helpers/deepCaseConvert.js';
import {
  getUrlFromId,
  getIdFromUrl,
} from '../modules/Diabetes/Settings/helpers/getInsulin.js';

export const mapNameToObject = (name, value, shouldSnake) => {
  const nameArray = name.split('.');
  return {
    mealName: nameArray[0],
    parameter: shouldSnake ? snakeCase(nameArray[1]) : nameArray[1],
    value,
  };
};

export const convertTimeWindowDataFormat = (data, insulinIdMap, doseTable, correctionalInsulin, mealName) => {
  const newData = Object.assign({}, data);
  if (!isEmpty(newData)) {
    const insulin = insulinIdMap.get(data.insulin) ? getUrlFromId(insulinIdMap.get(data.insulin)) : '';

    if (!newData.carbCountingRatio) {
      return deepSnakeCase(merge(newData, {
        dose_table: doseTable,
        insulin,
        carb_counting_on: false,
        carb_counting_ratio: null,
        bg_check_prescribed: newData.bgCheckPrescribed || (newData.insulin === 'bg'),
        correctional_insulin: newData.correctionalInsulinOn ? correctionalInsulin : null,
        start_time: newData.start_time,
        stop_time: newData.stop_time,
      }));
    }
    return deepSnakeCase(merge(newData, {
      dose_table: doseTable,
      base_dose: 0,
      insulin,
      bg_check_prescribed: newData.bgCheckPrescribed || (newData.insulin === 'bg'),
      correctional_insulin: newData.correctionalInsulinOn ? correctionalInsulin : null,
      carb_counting_on: true,
      carb_counting_ratio: newData.carbCountingRatio,
      carb_counting_insulin: insulin,
      start_time: newData.start_time,
      stop_time: newData.stop_time,
    }));
  }
  return {
    bg_check_prescribed: false,
    bg_check_required: false,
    correctional_insulin: null,
    insulin: null,
  };
};

export const isCarbCounting = (meal) => {
  return includes(meal, 'carb_counting');
};

export const isValidCarbCountMeal = (meal) => {
  return includes(['breakfast', 'lunch', 'dinner'], meal);
};

export const isCarbCountingMeal = (insulinRegimen, mealName) =>
  isCarbCounting(insulinRegimen) && mealName && isValidCarbCountMeal(mealName.toLowerCase());

export const isBolus = insulin => insulin && insulin.type && insulin.type === 'bolus';

export const toDoseRange = (value) => {
  return value > 200 ? 200 : value;
};

export const insulinTypeChooseOptions = () => {
  return [
    { name: 'BG Check Only', value: 'bg' },
    { name: 'Choose Basal', value: 'basal' },
    { name: 'Choose Bolus', value: 'bolus' },
    { name: 'Choose Mixed', value: 'mixed' },
  ];
};

export const canHaveInsulinTypesGen = () => {
  return {
    basal: false,
    bolus: false,
    mixed: false,
  };
};

export const canHaveInsulinTypesModifier = (regimen) => {
  const canHaveInsulinTypes = canHaveInsulinTypesGen();
  if (regimen !== 'custom') {
    if (includes(regimen, 'basal_bolus')) {
      canHaveInsulinTypes.basal = true;
      canHaveInsulinTypes.bolus = true;
    } else if (includes(regimen, 'basal')) {
      canHaveInsulinTypes.basal = true;
    } else if (includes(regimen, 'bolus')) {
      canHaveInsulinTypes.bolus = true;
    } else if (includes(regimen, 'mixed')) {
      canHaveInsulinTypes.mixed = true;
    }
  } else {
    canHaveInsulinTypes.basal = true;
    canHaveInsulinTypes.bolus = true;
    canHaveInsulinTypes.mixed = true;
  }

  return canHaveInsulinTypes;
};

export const  getInsulinName = (idInsulinMap, url) => { // eslint-disable-line
  return idInsulinMap[getIdFromUrl(url)];
};

export const generateInsulinTypeOptions = (diabetesSettings, canHaveInsulinTypes, idInsulinMap) => {
  const insulinTypeOptions = [
    { name: 'BG Check Only', value: 'bg' },
  ];

  if (canHaveInsulinTypes.basal) {
    if (diabetesSettings.basalInsulin) {
      insulinTypeOptions.push({
        name: getInsulinName(idInsulinMap, diabetesSettings.basalInsulin),
        value: getInsulinName(idInsulinMap, diabetesSettings.basalInsulin),
      });
    } else {
      insulinTypeOptions.push({
        name: 'Choose Basal',
        value: 'Choose Basal',
      });
    }
  }

  if (canHaveInsulinTypes.bolus) {
    if (diabetesSettings.bolusInsulin) {
      insulinTypeOptions.push({
        name: getInsulinName(idInsulinMap, diabetesSettings.bolusInsulin),
        value: getInsulinName(idInsulinMap, diabetesSettings.bolusInsulin),
      });
    } else {
      insulinTypeOptions.push({
        name: 'Choose Bolus',
        value: 'Choose Bolus',
      });
    }
  }

  if (canHaveInsulinTypes.mixed) {
    if (diabetesSettings.mixedInsulin) {
      insulinTypeOptions.push({
        name: getInsulinName(idInsulinMap, diabetesSettings.mixedInsulin),
        value: getInsulinName(idInsulinMap, diabetesSettings.mixedInsulin),
      });
    } else {
      insulinTypeOptions.push({
        name: 'Choose Mixed',
        value: 'Choose Mixed',
      });
    }
  }

  return insulinTypeOptions;
};

export const getInsulinOfType = (insulinType, diabetesSettings, mealValues) => {
  let setInsulin = '';
  if (insulinType[mealValues.name] === 'basal') {
    setInsulin = getIdFromUrl(diabetesSettings.basalInsulin);
  }
  if (insulinType[mealValues.name] === 'bolus') {
    setInsulin = getIdFromUrl(diabetesSettings.bolusInsulin);
  }
  if (insulinType[mealValues.name] === 'mixed') {
    setInsulin = getIdFromUrl(diabetesSettings.mixedInsulin);
  }
  if (insulinType[mealValues.name] === 'bg') {
    setInsulin = 'bg';
  }
  return setInsulin;
};

export const convertToPatchData = (mealInfo, selectedInsulins, regimenData, insulinList, patientId) => {
  let correctionalInsulin = insulinList.filter(i => (i.id === selectedInsulins.bolus));
  correctionalInsulin = (correctionalInsulin.length && correctionalInsulin[0].url) || null;
  return {
    base_dose: mealInfo.base_dose,
    bg_check_prescribed: mealInfo.bgCheck,
    carb_counting_insulin: mealInfo.correctionalInsulinOn ? correctionalInsulin : null,
    carb_counting_ratio: mealInfo.carbCountingRatio,
    correctional_insulin: mealInfo.correctionalInsulinOn ? correctionalInsulin : null,
    dose_table: mealInfo.doseTable,
    insulin: mealInfo.insulin && mealInfo.insulin.url || null,
    start_time: mealInfo.timings[0],
    stop_time: mealInfo.timings[1],
    url: mealInfo.patchUrl,
  };
};

export const generateDiabetesSettingsPatchData = (
  diabetesThresholds,
  regimenData,
  correctionalDetails,
  selectedInsulins,
  insulinList,
  correctionalTable,
) => {
  const basal_insulin = selectedInsulins.basal && insulinList.filter(i => (i.id === selectedInsulins.basal))[0].url;
  const bolus_insulin = selectedInsulins.bolus && insulinList.filter(i => (i.id === selectedInsulins.bolus))[0].url;
  const mixed_insulin = selectedInsulins.mixed && insulinList.filter(i => (i.id === selectedInsulins.mixed))[0].url;
  return {
    basal_insulin,
    bolus_insulin,
    mixed_insulin,
    correction_factor: correctionalDetails.correctionFactor,
    correction_increment: correctionalDetails.correctionIncrement,
    correction_target: correctionalDetails.correctionTarget,
    correctional_insulin: bolus_insulin,
    correctional_on: correctionalDetails.correctionalOn,
    correctional_table: correctionalTable,
    hyperglycemia_threshold_emergency: diabetesThresholds.hyperglycemiaThresholdEmergency,
    hyperglycemia_titration_threshold_small: diabetesThresholds.hyperglycemiaTitrationThresholdSmall,
    hypoglycemia_glucose_threshold_mild: diabetesThresholds.hypoglycemiaGlucoseThresholdMild,
    insulin_regimen: regimenData.insulinRegimen,
    negative_correctional_on: correctionalDetails.negativeCorrectionalOn,
  };
};
