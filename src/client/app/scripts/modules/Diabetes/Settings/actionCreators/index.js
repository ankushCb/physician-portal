export const patientDetailFetchActionCreator = (id) => {
  return {
    type: 'PATIENT_DETAIL_FETCH_REQUEST',
    payload: {
      id,
    },
  };
};

export const patientInitialFetchActionCreator = (patientId) => {
  return {
    type: 'PATIENT_INITIAL_FETCH_REQUEST',
    payload: {
      patientId,
    },
  };
};

export const timeWindowFetchActionCreator = (id) => {
  return {
    type: 'TIMEWINDOW_FETCH_REQUEST',
    payload: {
      id,
    },
  };
};

export const timeWindowDisplayUpdateActionCreator = (data) => {
  return {
    type: 'TIMEWINDOW_DISPLAY_UPDATE_NEW',
    payload: {
      data,
    },
  };
};

export const timeWindowDisplayModifyValuesActionCreator = (data) => {
  return {
    type: 'TIMEWINDOW_DISPLAY_MODIFY_VALUES_NEW',
    payload: {
      data,
    },
  };
};

export const deleteFromTimeWindowDisplayActionCreator = (deletionData) => {
  return {
    type: 'TIMEWINDOW_DELETE',
    payload: {
      deletionData,
    },
  };
};

export const timeWindowPatchActionCreator = ({ timeWindowFormData, logTableData, id }) => ({
  type: 'TIMEWINDOW_PATCH_REQUEST',
  payload: {
    id,
    timeWindowFormData,
    logTableData,
  },
});

/*
  Insulins Actions
 */
export const fetchInsulins = () => ({
  type: 'FETCH_INSULINS',
});

export const fetchDiabetesSettings = id => ({
  type: 'FETCH_DIABETES_SETTINGS_REQUEST',
  payload: {
    id,
  },
});

export const restoreScheduleTableToDefault = () => ({
  type: 'TIMEWINDOW_RESTORE_DATA_NEW',
});

/*
 Diabetes Settings Actions
 */
export const updateDiabetesSettingsDataItemActionCreator = payload => ({
  type: 'UPDATE_DIABETES_SETTINGS_DATA_ITEM',
  payload,
});

export const diabetesSettingsPatchActionCreator = (id, diabetesSettings) => ({
  type: 'DIABETES_SETTINGS_PATCH_REQUEST',
  payload: {
    id,
    diabetesSettings,
  },
});

export const diabetesSettingsRestoreActionCreator = () => ({
  type: 'DIABETES_SETTINGS_RESTORE',
});

export const premadeRegimenFetchActionCreator = () => ({
  type: 'PREMADE_REGIMEN_FETCH_REQUEST',
});

export const premadeRegimenUpdatePartialActionCreator = data => ({
  type: 'PREMADE_REGIMEN_UPDATE_PARTIAL',
  payload: {
    updateData: data,
  },
});

export const premadeRegimenUpdateCompleteActionCreator = data => ({
  type: 'PREMADE_REGIMEN_UPDATE_COMPLETE',
  payload: {
    updateData: data,
  },
});

export const initialFetch = ({ patientId, diabetesId }) => ({
  type: 'SETTINGS_INITIAL_FETCH',
  payload: {
    patientId,
    diabetesId,
  },
});

export const setAllTrue = data => ({
  type: 'SET_ALL_TRUE',
  payload: {
    data,
  },
});

export const updateModalTime = ({ mealName, startTime, stopTime }) => ({
  type: 'UPDATE_MODAL_TIME',
  payload: {
    mealName,
    startTime,
    stopTime,
  }
})
