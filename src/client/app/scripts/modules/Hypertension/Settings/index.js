import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  settingsHyperTensionInitialFetchRequest,
  medicationScheduleModify,
  patchAndFetchHyperSettings,
} from './actionCreators';

import {
  getThresholdData,
  getClassDetails,
  getAccumulatedMedicationDosesData,
  getFetchStatus,
  getResultsData,
  getMealTimings,
  getMealTimingsReadOnly,
  isValidData,
} from './selectors';

import toJS from '../../Common/Presentational/toJS';
import SettingsScreen from './components/SettingsScreen.jsx';

const mapStateToProps = state => ({
  thresholdData: getThresholdData(state),
  classDetails: getClassDetails(state),
  medicationDoses: getAccumulatedMedicationDosesData(state),
  fetchStatus: getFetchStatus(state),
  resultData: getResultsData(state),
  mealTimings: getMealTimings(state),
  mealTimingsReadOnly: getMealTimingsReadOnly(state),
  scheduleIsValid: isValidData(state),
});

const dispatchActionToProps = dispatch => ({
  initialFetchRequest: bindActionCreators(settingsHyperTensionInitialFetchRequest, dispatch),
  medicationScheduleModify: bindActionCreators(medicationScheduleModify, dispatch),
  patchAndFetchHyperSettings: bindActionCreators(patchAndFetchHyperSettings, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(toJS(SettingsScreen));
