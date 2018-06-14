import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import toJS from 'scripts/modules/Common/Presentational/toJS.js';

import { getReminderData, getTimeWindowTimings, getFetchStatus } from '../selectors/index.js';

import RemindersViewScreen from './components/RemindersViewScreen.jsx';

import { fetchInitial } from '../actionCreators/index.js';

const mapStateToProps = state => ({
  reminders: getReminderData(state),
  timeWindows: getTimeWindowTimings(state),
  fetchStatus: getFetchStatus(state),
});

const mapDispatchToProps = dispatch => ({
  fetchInitial: bindActionCreators(fetchInitial, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(RemindersViewScreen));
