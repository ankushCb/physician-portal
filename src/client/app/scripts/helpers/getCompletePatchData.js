import reduce from 'lodash/reduce';
import { deepCamelCase } from './deepCaseConvert.js';
import { baseUrl } from 'scripts/helpers/api';

export const getCompletePatchData = (twPatchData, diabetesPatchData, regimenData) => {
  return deepCamelCase(
    twPatchData
      .map((twData) => {
        const currentTwName = twData.name;
        const insulinType = regimenData[currentTwName];
        let insulinName = null;
        if (insulinType && (insulinType !== 'none' && insulinType !== 'bg')) {
          insulinName = diabetesPatchData[`${insulinType}Insulin`]
        }

        return {
          ...twData,
          insulinType: (insulinType && (insulinType !== 'none' && insulinType !== 'bg')) ? insulinType : null, 
          insulinUrl: (insulinType && (insulinType !== 'none' && insulinType !== 'bg')) ? insulinName : null,
          url: `${baseUrl}/api/time-windows/${twData.id}/`,
        }
      })
  )
}