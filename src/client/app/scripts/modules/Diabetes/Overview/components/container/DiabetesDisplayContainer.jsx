import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import toJS from 'scripts/modules/Common/Presentational/toJS.js';

import DiabetesDisplayView from '../presentational/DiabetesDisplayView.jsx';

import {
  getCurrentInsulinRegimenData,
  getCurrentMealNames,
  getTimeWindowUrlNameMap,
  getIdInsulinMap,
  getInsulinIdMap,
  getPreloaderStatus,
  getFinalLogBookData,
  getFetchStatus,
  getGraphData,
  getOverviewData,
} from '../../selectors/index.js';

import {
  fetchInsulins,
  diabetesDisplayInitialFetch,
  diabetesSpecificFetch,
} from '../../actionCreators/index.js';

const mapStateToProps = (state) => {
  return {
    currentInsulinRegimenData: getCurrentInsulinRegimenData(state),
    logBookHeader: getCurrentMealNames(state),
    timeWindowIdToNameMap: getTimeWindowUrlNameMap(state),
    logBookData: getFinalLogBookData(state),
    showPreloader: getPreloaderStatus(state),
    fetchStatus: getFetchStatus(state),
    graphData: getGraphData(state),
    overviewData: getOverviewData(state),
    logBookIsFetching: state.getIn(['fetchStatus', 'diabetesLogData', 'isFetching']),
    diabetesSettings: state.getIn(['apiData', 'patientCommonData', 'diabetesSettingsData']),
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    fetchInsulins: bindActionCreators(fetchInsulins, dispatch),
    initialFetch: bindActionCreators(diabetesDisplayInitialFetch, dispatch),
    diabetesSpecificFetch: bindActionCreators(diabetesSpecificFetch, dispatch),
  };
};

export default connect(mapStateToProps, dispatchActionToProps)(toJS(DiabetesDisplayView));
