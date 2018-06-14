import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import toJS from 'scripts/modules/Common/Presentational/toJS.js';

import OverviewScreen from './components/OverviewScreen.jsx';

import {
  getLogBook,
  getHyperTensionGraphData,
  getHyperTensionOverviewData,
  getCurrentMedicationOverview,
  getAverageChange,
  getFetchStatus,
  getHtSettingsData,
  getMealTimeData,
  isHavingHypertension,
} from './selectors/index.js';

const mapStateToProps = state => ({
  logData: getLogBook(state),
  graphData: getHyperTensionGraphData(state),
  overview: getHyperTensionOverviewData(state),
  medicationOverview: getCurrentMedicationOverview(state),
  fetchStatus: getFetchStatus(state),
  averageChangeData: getAverageChange(state),
  hypertensionSettings: getHtSettingsData(state),
  mealTimeData: getMealTimeData(state),
  isHavingHypertension: isHavingHypertension(state),
  logFetchStatus: state.getIn(['fetchStatus', 'hyperTensionLogData', 'isFetching']),
});

const dispatchActionToProps = dispatch => ({
  fetchInitialData: bindActionCreators(patientId => ({
    type: 'HT_OVERVIEW_INITIAL_FETCH',
    payload: {
      patientId, // Will be replaced based on route
      htId: '0cae5e07-d510-43e6-84be-bec533d0f89f', // will be replaced by patient.diabetesSettings
      offset: 0,
      limit: 7,
    },
  }), dispatch),
  fetchPaginatedLogData: bindActionCreators((date, limit) => {
    return {
      type: 'HT_OVERVIEW_LOG_UPDATED_FETCH',
      payload: {
        date,
        limit,
      },
    };
  }, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(toJS(OverviewScreen));
