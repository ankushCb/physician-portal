import { Map, List, fromJS } from 'immutable';
import reduce from 'lodash/reduce';

import createReducer from 'scripts/helpers/createReducer.js';

const defaultFetchStatus = {
  isFetching: false,
  isFetched: false,
};

const defaultPostStatus = {
  isPosting: false,
  isPosted: false,
};

const initialState = fromJS({
  physicianRelatedData: defaultFetchStatus,
  patientRelatedData: defaultFetchStatus,
  diabetesDisplayData: defaultFetchStatus,
  diabetesSettingsData: defaultFetchStatus,
  hyperTensionData: defaultFetchStatus,
  diabetesLogData: defaultFetchStatus,
  hyperTensionLogData: defaultFetchStatus,
  settingsData: defaultFetchStatus,
  remindersData: {
    isFetching: false,
    isFetched: false,
    isPatching: false,
  },
  hypertensionFormData: {
    isUpdating: false,
  },
  careData: defaultPostStatus,
});

const onPractitionerInitialFetchRequest = (state) => {
  let newState = state;

  newState = newState.setIn(['physicianRelatedData', 'isFetching'], true);
  newState = newState.setIn(['physicianRelatedData', 'isFetched'], false);

  return newState;
};

const onPractitionerInitialFetchRequestSuccess = (state) => {
  let newState = state;

  newState = newState.setIn(['physicianRelatedData', 'isFetching'], false);
  newState = newState.setIn(['physicianRelatedData', 'isFetched'], true);

  return newState;
};

const onPatientInitialFetchRequest = (state) => {
  let newState = state;

  newState = newState.setIn(['patientRelatedData', 'isFetching'], true);
  newState = newState.setIn(['patientRelatedData', 'isFetched'], false);

  return newState;
};

const onPatientInitialFetchRequestSuccess = (state) => {
  let newState = state;

  newState = newState.setIn(['patientRelatedData', 'isFetching'], false);
  newState = newState.setIn(['patientRelatedData', 'isFetched'], true);

  return newState;
};

const onDiabetesDataFetchRequest = (state) => {
  let newState = state;

  newState = newState.setIn(['diabetesDisplayData', 'isFetching'], true);
  newState = newState.setIn(['diabetesDisplayData', 'isFetched'], false);

  return newState;
};

const onDiabetesDataFetchRequestSuccess = (state) => {
  let newState = state;

  newState = newState.setIn(['diabetesDisplayData', 'isFetching'], false);
  newState = newState.setIn(['diabetesDisplayData', 'isFetched'], true);

  return newState;
};

const onDiabetesSettingsFetchRequest = (state) => {
  let newState = state;

  newState = newState.setIn(['diabetesSettingsData', 'isFetching'], true);
  newState = newState.setIn(['diabetesSettingsData', 'isFetched'], false);

  return newState;
};

const onDiabetesSettingsFetchRequestSuccess = (state) => {
  let newState = state;

  newState = newState.setIn(['diabetesSettingsData', 'isFetching'], false);
  newState = newState.setIn(['diabetesSettingsData', 'isFetched'], true);

  return newState;
};

const onHypertensionOverviewFetch = state => {
  let newState = state;

  newState = newState.setIn(['hyperTensionData', 'isFetching'], true);
  newState = newState.setIn(['hyperTensionData', 'isFetched'], false);

  return newState;
};

const onHypertensionOverviewFetchSuccess = state => {
  let newState = state;

  newState = newState.setIn(['hyperTensionData', 'isFetching'], false);
  newState = newState.setIn(['hyperTensionData', 'isFetched'], true);

  return newState;
};

const onPatchAndFetchHtSettings = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['hyperTensionData', 'isFetching'], true);
  newState = newState.setIn(['hyperTensionData', 'isFetched'], false);

  return newState;
};

const onPatchAndFetchHtSettingsSuccess = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['hyperTensionData', 'isFetching'], false);
  newState = newState.setIn(['hyperTensionData', 'isFetched'], true);

  return newState;
};

const onDiabetesDisplaySpecificFetchRequest = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['diabetesLogData', 'isFetching'], true);
  newState = newState.setIn(['diabetesLogData', 'isFetched'], false);

  return newState;
};

const onDiabetesDisplaySpecificFetchRequestSuccess = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['diabetesLogData', 'isFetching'], false);
  newState = newState.setIn(['diabetesLogData', 'isFetched'], true);

  return newState;
};

const onHypertensionOverviewSpecificRequest = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['hyperTensionLogData', 'isFetching'], true);
  newState = newState.setIn(['hyperTensionLogData', 'isFetched'], false);

  return newState;
};

const onHypertensionOverviewSpecificRequestSuccess = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['hyperTensionLogData', 'isFetching'], false);
  newState = newState.setIn(['hyperTensionLogData', 'isFetched'], true);

  return newState;
};

const onSettingsFetchRequest = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['settingsData', 'isFetching'], true);
  newState = newState.setIn(['settingsData', 'isFetched'], false);

  return newState;
};

const onSettingsFetchRequestSuccess = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['settingsData', 'isFetching'], false);
  newState = newState.setIn(['settingsData', 'isFetched'], true);

  return newState;
};

const onRemindersInitialFetch = (state, { payload }) => {
  let newState = state;

  if (!state.getIn(['remindersData', 'isPatching'])) {
    newState = newState.setIn(['remindersData', 'isFetching'], true);
    newState = newState.setIn(['remindersData', 'isFetched'], false);
  }

  return newState;
}

const onRemindersInitialFetchSuccess = (state, { payload }) => {
  let newState = state;

  if (!state.getIn(['remindersData', 'isPatching'])) {
    newState = newState.setIn(['remindersData', 'isFetching'], false);
    newState = newState.setIn(['remindersData', 'isFetched'], true);
  }

  return newState;
}

const onRemindersPatchAndFetch = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['remindersData', 'isFetching'], true);
  newState = newState.setIn(['remindersData', 'isPatching'], true);
  newState = newState.setIn(['remindersData', 'isFetched'], false);

  return newState;
}

const onRemindersPatchAndFetchSuccess = (state, { payload }) => {
  let newState = state;

  newState = newState.setIn(['remindersData', 'isFetching'], false);
  newState = newState.setIn(['remindersData', 'isPatching'], false);
  newState = newState.setIn(['remindersData', 'isFetched'], true);

  return newState;
}

const onTimeWindowPatchRequest = (state, { payload }) => {
  let newState = state;
  return newState.setIn(['settingsData', 'isPatching'], true);
}

const onTimeWindowPatchRequestSuccess = (state) => {
  const newState = state;
  return newState.setIn(['settingsData', 'isPatching'], false);
};

const onFormDragStart = (state, { payload }) => {
  return state.setIn(['hypertensionFormData', 'isUpdating'], true);
}

const onFormDragEnd = (state, { payload }) => {
  return state.setIn(['hypertensionFormData', 'isUpdating'], false);
}

const onSubmittingCareData = (state, { payload }) => {
  state = state.setIn(['careData', 'isPosting'], true);
  state = state.setIn(['careData', 'isPosted'], false);
  return state;
}

const onSubmittingCareDataSuccess = (state, { payload }) => {
  state = state.setIn(['careData', 'isPosting'], false);
  state = state.setIn(['careData', 'isPosted'], true);
  return state;
}

const onUpdateMealTimeInitiated = (state, { payload }) => {
  state = state.setIn(['mealTimeData', 'isPosting'], true);
  state = state.setIn(['mealTimeData', 'isPosted'], false);
  return state;
}

const onUpdateMealTimeSuccess = (state, { payload }) => {
  state = state.setIn(['mealTimeData', 'isPosting'], false);
  state = state.setIn(['mealTimeData', 'isPosted'], true);
  return state;
}

const onDiabetesSettingsPatchRequestSuccess = (state) => {
  return state.setIn(['settingsData', 'isPatching'], false);
};

const onDiabetesSettingsPatchRequest = (state) => {
  return state.setIn(['settingsData', 'isPatching'], true);
};

export default createReducer(initialState, {
  PRACTITIONER_INITIAL_FETCH_REQUEST: onPractitionerInitialFetchRequest,
  PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS: onPractitionerInitialFetchRequestSuccess,
  CACHED_PRACTITIONER_INITIAL_FETCH_REQUEST: onPractitionerInitialFetchRequestSuccess,
  PATIENT_INITIAL_FETCH_REQUEST: onPatientInitialFetchRequest,
  PATIENT_INITIAL_FETCH_REQUEST_SUCCESS: onPatientInitialFetchRequestSuccess,
  CACHED_PATIENT_INITIAL_FETCH_REQUEST: onPatientInitialFetchRequestSuccess,
  DIABETES_DISPLAY_INITIAL_FETCH_REQUEST: onDiabetesDataFetchRequest,
  DIABETES_DISPLAY_INITIAL_FETCH_REQUEST_SUCCESS: onDiabetesDataFetchRequestSuccess,
  DIABETES_SETTINGS_PATCH_SUCCESS: onDiabetesSettingsPatchRequestSuccess,
  DIABETES_SETTINGS_PATCH_SUCCESS_V2: onDiabetesSettingsPatchRequestSuccess,
  DIABETES_SETTINGS_PATCH_REQUEST_V2: onDiabetesSettingsPatchRequest,
  SETTINGS_INITIAL_FETCH: onSettingsFetchRequest,
  SETTINGS_INITIAL_FETCH_SUCCESS: onSettingsFetchRequestSuccess,
  HT_OVERVIEW_INITIAL_FETCH: onHypertensionOverviewFetch,
  HT_OVERVIEW_INITIAL_FETCH_SUCCESS: onHypertensionOverviewFetchSuccess,
  HT_SETTINGS_INITIAL_FETCH_REQUEST: onPatchAndFetchHtSettings,
  HT_SETTINGS_INITIAL_FETCH_REQUEST_SUCCESS: onPatchAndFetchHtSettingsSuccess,
  REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_REQUEST: onPatchAndFetchHtSettings,
  REQUIRED_MEDICATION_DOSES_PATCH_AND_FETCH_SUCCESS: onPatchAndFetchHtSettingsSuccess,
  DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST: onDiabetesDisplaySpecificFetchRequest,
  DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST_SUCCESS: onDiabetesDisplaySpecificFetchRequestSuccess,
  HT_OVERVIEW_LOG_UPDATED_FETCH: onHypertensionOverviewSpecificRequest,
  HT_OVERVIEW_LOG_UPDATED_FETCH_SUCCESS: onHypertensionOverviewSpecificRequestSuccess,
  REMINDERS_FETCH_INITIAL: onRemindersInitialFetch,
  REMINDERS_FETCH_SUCCESS: onRemindersInitialFetchSuccess,
  REMINDERS_PATCH_AND_FETCH: onRemindersPatchAndFetch,
  REMINDERS_PATCH_AND_FETCH_SUCCESS: onRemindersPatchAndFetchSuccess,
  CACHED_REMINDERS: onRemindersInitialFetchSuccess,
  TIMEWINDOW_PATCH_REQUEST: onTimeWindowPatchRequest,
  TIMEWINDOW_PATCH_REQUEST_SUCCESS: onTimeWindowPatchRequestSuccess,
  FORM_DRAG_START: onFormDragStart,
  FORM_DRAG_END: onFormDragEnd,
  SUBMIT_CARE_DATA: onSubmittingCareData,
  UPDATE_CARE_SUCCESS: onSubmittingCareDataSuccess,
  UPDATE_MEAL_TIME: onUpdateMealTimeInitiated,
  UPDATE_MEAL_TIME_SUCCESS: onUpdateMealTimeSuccess,
});
