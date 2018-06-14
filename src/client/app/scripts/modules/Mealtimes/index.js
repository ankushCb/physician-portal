import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  initialFetch,
  updateMealTime,
} from './actionCreators';

import {
  getMealTimeData,
  getFetchStatus,
} from './selectors/index.js';

import toJS from '../Common/Presentational/toJS';
import MealtimeScreen from './components/MealtimeScreen.js';

const mapStateToProps = state => ({
  mealTimeData: getMealTimeData(state),
  fetchStatus: getFetchStatus(state),
});

const dispatchActionToProps = dispatch => ({
  initialFetch: bindActionCreators(initialFetch, dispatch),
  updateMealTime: bindActionCreators(updateMealTime, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(toJS(MealtimeScreen));
