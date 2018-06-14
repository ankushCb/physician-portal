/**
* Action creator to fetch all the initial data required for diabetes settings
*/
export const initialFetch = ({ patientId, diabetesId }) => ({
  type: 'SETTINGS_INITIAL_FETCH',
  payload: {
    patientId,
    diabetesId,
  },
});

// /**
// * Action creator called when schedule time window data is modified
// */
// export const timeWindowDisplayModifyValuesActionCreator = (data) => {
//   return {
//     type: 'TIMEWINDOW_DISPLAY_MODIFY_VALUES_NEW',
//     payload: {
//       data,
//     },
//   };
// };

/**
*  Action creator for patching of schedule table data
*/
export const timeWindowPatchActionCreator = payload => ({
  type: 'TIMEWINDOW_PATCH_REQUEST_V2',
  payload,
});

/**
* Action creator for patching diabetes settings data
*/
export const diabetesSettingsPatchActionCreator = payload => ({
  type: 'DIABETES_SETTINGS_PATCH_REQUEST_V2',
  payload,
});
