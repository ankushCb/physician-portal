import isString from 'lodash/isString';
import every from 'lodash/every';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import toPlainObject from 'lodash/toPlainObject';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

/*
Group Patch and Response TW objects by tw Url
If any key contains odd number of objects, return false since req and resp should be same

Initial check whether following properties are matching in patch and res data
1. bgCheckReq
2. insulinDoseReq
3. start_time and stop_time

If any one not matching, patch incorrect

If all matched,
{
  if both bgCheckReq and insulinDoseReq are false,
    skip the checks
  else
    if bgCheckReq is true
      bgCheckPres should match
    if insulinDoseReq is true
      correctionalInsulinOn should match
      insulinUrl should match
    if carbCount is false
      dose should match
    else
      carb_ratio_should_match && insulinType should be bolus
    if req.insulinUrl is not null
      resp.insulinDoseReq should be true
    if req.bgCheckPrescribed is true
      resp.bgCheckReq should be true
}
*/

/* Helper Function to check whether each time window have both req and res timeWindow Obj */
const isGroupedDataEven = groupedTwCollByTwUrl => (
  every(groupedTwCollByTwUrl, (_value, key, coll) => (
    coll[key].length === 2
  ))
);

/* Used to check equality of patch and response data */
const isPatchMaintainedFor = (key, patchTwData = {}, respTwData = {}) => (
  (patchTwData[key] === respTwData[key])
);

/* Convert keyed objects to array of objects */
const convertKeyedObjToObjArr = coll => map(coll, obj => obj);

/* Structural Change and Data Seeding for responseTwDataColl */
const transformAndSeedTwColl = (responseTwColl) => {
  /* Structural Change for respTwColl for uniformity */
  let seededRespTwColl = deepCamelCase(responseTwColl);
  seededRespTwColl = convertKeyedObjToObjArr(seededRespTwColl);

  /* Seeding responseTwDataColl with new properties for easy comparison */
  seededRespTwColl = map(seededRespTwColl, (respTwData) => {
    /* To Handle null case */
    /* Creating new var as not to mutate arguments object */
    const respInsulinData = toPlainObject(respTwData.insulin);

    return ({
      ...respTwData,
      insulinUrl: respInsulinData.url,
      insulinType: respInsulinData.type,
    });
  });

  return seededRespTwColl;
};

/* Helper Method to check whether patch response is actually reflecting patched data for TimeWindowData Update Request */
const isCorrectPatchForTimeWindow = (patchTwColl, responseTwColl) => {
  const insulinTypeForCarbCountingRatio = 'bolus';
  /* Converting object of objects to array of objects for simplicity */
  const patchedTwColl = convertKeyedObjToObjArr(patchTwColl);
  const seededRespTwColl = transformAndSeedTwColl(responseTwColl);
  /* Changing the order of array spread should be also done at testing function */
  const groupedTwCollByTwUrl = groupBy([...patchedTwColl, ...seededRespTwColl], twData => twData.url);

  /* If any key contains odd number of objects, return false since req and resp is not matching in this case  */
  if (!isGroupedDataEven(groupedTwCollByTwUrl)) {
    return false;
  }

  return (
    every(groupedTwCollByTwUrl, ([currentPatchTwData, currentRespTwData]) => {
      /* Closure Function to eliminate redundant args passing for each check */
      const isValueNotChangedFor = key => (
        isPatchMaintainedFor(key, currentPatchTwData, currentRespTwData)
      );

      const highLevelDataSync = (
        isValueNotChangedFor('startTime') &&
        isValueNotChangedFor('stopTime') &&
        isValueNotChangedFor('bgCheckRequired') &&
        isValueNotChangedFor('insulinDoseRequired')
      );

      /* If basic flag variables are not same, no need to check further */
      if (!highLevelDataSync) {
        return false;
      }

      /* If both bgCheck and insulin are not required, skip the validation as there is no need */
      if (currentRespTwData.bgCheckPrescribed === false &&
          currentRespTwData.insulinDoseRequired === false
        ) {
        return true;
      }

      const boolPatchStatus = (
        (
          currentRespTwData.bgCheckRequired ?
            isValueNotChangedFor('bgCheckPrescribed') :
            true
        )
        &&
        (
          currentRespTwData.insulinDoseRequired ?
            (
              isValueNotChangedFor('correctionalInsulinOn') &&
              isValueNotChangedFor('insulinUrl')
            ) : true
        )
        &&
        (
          currentRespTwData.carbCountingOn ?
            (
              isValueNotChangedFor('carbCountingRatio') &&
              (currentRespTwData.insulinType === insulinTypeForCarbCountingRatio) &&
              (currentPatchTwData.insulinType === insulinTypeForCarbCountingRatio)
            ) :
            (
              isValueNotChangedFor('baseDose')
            )
        )
        &&
        (
          (isString(currentPatchTwData.insulinUrl) && currentPatchTwData.insulinUrl.length) ?
            currentRespTwData.insulinDoseRequired :
            true
        )
        &&
        (
          currentPatchTwData.bgCheckPrescribed ?
            currentRespTwData.bgCheckRequired :
            true
        )
      );

      return boolPatchStatus;
    })
  );
};

export default isCorrectPatchForTimeWindow;
