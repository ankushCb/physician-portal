import { connect } from 'react-redux';

import toJS from '../../Common/Presentational/toJS';
import SettingsScreen from './components/SettingsScreen.jsx';

import { initialFetch } from './actionCreators/index';

import {
  getInsulins,
  getSelectedInsulins,
  getDiabetesThresholds,
  getRegimenData,
  getCorrectionalDetails,
  getCarbCountingDetails,
  getScheduleData,
  getGlucoseRowsLimit,
} from './selectors';

const mapStateToProps = state => ({
  insulinList: getInsulins(state),
  selectedInsulins: getSelectedInsulins(state),
  diabetesThresholds: getDiabetesThresholds(state),
  regimenData: getRegimenData(state),
  correctionalDetails: getCorrectionalDetails(state),
  carbCountingDetails: getCarbCountingDetails(state),
  scheduleData: getScheduleData(state),
  glucoseRowsLimit: getGlucoseRowsLimit(state),
});

const mapDispatchToProps = {
  initialFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SettingsScreen));
