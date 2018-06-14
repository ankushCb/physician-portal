import { fork } from 'redux-saga/effects';

/* CheckUserScope */
import checkUserScopeSaga from '../modules/CheckUserScope/sagas/checkUserScopeSaga.js';

/* Practitioner and Patient Initial Fetch Saga */
import practitionerInitialFetchSaga from '../modules/Common/Sagas/practitionerInitialFetchSaga.js';
import patientInitialFetchSaga from '../modules/Common/Sagas/patientInitialFetchSaga.js';

/* Onboarding Saga */
import personalInformationPostSaga from '../modules/patientList/sagas/personalInformationPostSaga.js';
import dailySchedulePostSaga from '../modules/patientList/sagas/dailySchedulePostSaga.js'; // api
import checkEmailSaga from '../modules/patientList/sagas/checkEmailSaga.js'; // api
import checkPhoneSaga from '../modules/patientList/sagas/checkPhoneSaga.js'; // api
import submitCareDataSaga from '../modules/patientList/sagas/submitCareDataSaga.js';

import diabetesDisplayInitialFetchSaga from '../modules/Diabetes/Overview/sagas/diabetesDisplayInitialFetchSaga.js'; // api
import diabetesDisplaySpecificDataFetchSaga from '../modules/Diabetes/Overview/sagas/diabetesDisplaySpecificDataFetchSaga.js'; // api

import timeWindowFetchSaga from '../modules/Common/Sagas/timeWindowFetchSaga.js'; // api
import timeWindowDisplayUpdateSaga from '../modules/Common/Sagas/timeWindowDisplayUpdateSaga.js';
import timeWindowModifyValuesUpdateSaga from '../modules/Common/Sagas/timeWindowDisplayModifyValuesSaga.js';
import timeWindowDeletionSaga from '../modules/Common/Sagas/timeWindowDeletionSaga.js';
import timeWindowRestoreSaga from '../modules/Common/Sagas/timeWindowRestoreSaga.js';
import timeWindowPatchSaga from '../modules/Common/Sagas/timeWindowPatchSaga.js'; // api
import diabetesSettingsRestoreSaga from '../modules/Diabetes/Settings/sagas/diabetesSettingsRestore.js'
import timeWindowPatchSagaV2 from '../modules/common/data/timeWindow/sagas/timeWindowPatchSagaV2.js'; // api
import settingsInitialFetchSaga from '../modules/Diabetes/Settings/sagas/settingsInitialFetchSaga.js';
import diabetesSettingsPatchSaga from '../modules/Diabetes/Settings/sagas/diabetesSettingsPatchSaga.js'; // api
import diabetesSettingsPatchSagaV2 from '../modules/Diabetes/Settingsv2/sagas/diabetesSettingsPatchSagaV2.js'; // api
import setAllTrueSaga from '../modules/Diabetes/Settings/sagas/setAllTrueSaga.js';
import premadeRegimenUpdatePartialSaga from '../modules/Diabetes/Settings/sagas/premadeRegimenUpdatePartialSaga.js';
import premadeRegimenUpdateCompleteSaga from '../modules/Diabetes/Settings/sagas/premadeRegimenUpdateCompleteSaga.js';

import addHyperTensionSaga from '../modules/Diabetes/Settings/sagas/addHyperTensionSaga.js'; // api
import htOverviewInitialFetchSaga from '../modules/Hypertension/Overview/Sagas/overviewInitialFetchSaga.js'; // api
import HyperTensionSettingsInitialFetchSaga from '../modules/Hypertension/Settings/sagas/HyperTensionSettingsInitialFetchSaga.js';
import MedicationScheduleModifySaga from '../modules/Hypertension/Settings/sagas/MedicationScheduleModifySaga.js';
import RequiredMedicationDosesPatchAndFetchSaga from '../modules/Hypertension/Settings/sagas/RequiredMedicationDosesPatchAndFetchSaga.js';
import fetchPaginatedHypertensionLogbookData from '../modules/Hypertension/Overview/Sagas/fetchPaginatiedHypertensionLogbookData.js';

import remindersFetchSaga from '../modules/Hypertension/Reminders/Sagas/remindersFetchSaga.js';
import remindersPatchSaga from '../modules/Hypertension/Reminders/Sagas/remindersPatchAndFetchSaga.js';

import mealTimeInitialFetchSaga from '../modules/MealTimes/sagas/initialFetchSaga';
import updateMealTimeSaga from '../modules/mealTimes/sagas/updateMealTimeSaga';

export default function* rootSaga() {
  yield fork(checkUserScopeSaga);

  yield fork(practitionerInitialFetchSaga);
  yield fork(patientInitialFetchSaga);

  yield fork(personalInformationPostSaga);
  yield fork(dailySchedulePostSaga);
  yield fork(checkEmailSaga);
  yield fork(checkPhoneSaga);
  yield fork(submitCareDataSaga);

  yield fork(diabetesDisplayInitialFetchSaga);
  yield fork(diabetesDisplaySpecificDataFetchSaga);

  yield fork(timeWindowFetchSaga);
  yield fork(timeWindowDisplayUpdateSaga);
  yield fork(timeWindowModifyValuesUpdateSaga);
  yield fork(timeWindowDeletionSaga);
  yield fork(timeWindowRestoreSaga);
  yield fork(timeWindowPatchSaga);
  yield fork(timeWindowPatchSagaV2);
  yield fork(diabetesSettingsRestoreSaga);


  yield fork(settingsInitialFetchSaga);
  yield fork(diabetesSettingsPatchSaga);
  yield fork(diabetesSettingsPatchSagaV2);
  yield fork(setAllTrueSaga);
  yield fork(premadeRegimenUpdatePartialSaga);
  yield fork(premadeRegimenUpdateCompleteSaga);

  yield fork(addHyperTensionSaga);
  yield fork(htOverviewInitialFetchSaga);
  yield fork(HyperTensionSettingsInitialFetchSaga);
  yield fork(MedicationScheduleModifySaga);
  yield fork(RequiredMedicationDosesPatchAndFetchSaga);
  yield fork(fetchPaginatedHypertensionLogbookData);

  yield fork(remindersFetchSaga);
  yield fork(remindersPatchSaga);

  yield fork(mealTimeInitialFetchSaga);
  yield fork(updateMealTimeSaga);
}
