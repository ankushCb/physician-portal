import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import toJS from 'scripts/modules/Common/Presentational/toJS.js';

import {
  getReminderData,
  getTimeWindowTimings,
  getFetchStatus,
  getSubmitButtonStatus,
  getInvalidFields,
  getTimeWindowNameToUrl,
} from '../selectors/index.js';

import {
  fetchInitial,
  addReminder,
  editReminder,
  editReminderContent,
  deleteReminder,
  remindersPatchAndFetch,
} from '../actionCreators/index.js';

import RemindersScreen from './components/RemindersScreen.jsx';

const mapStateToProps = state => ({
  reminders: getReminderData(state),
  timeWindows: getTimeWindowTimings(state),
  fetchStatus: getFetchStatus(state),
  submitButtonEnabled: getSubmitButtonStatus(state),
  invalidFields: getInvalidFields(state),
  twNameToUrl: getTimeWindowNameToUrl(state),
});

const dispatchActionToProps = dispatch => ({
  fetchInitial: bindActionCreators(fetchInitial, dispatch),
  addReminder: bindActionCreators(addReminder, dispatch),
  deleteReminder: bindActionCreators(deleteReminder, dispatch),
  editReminder: bindActionCreators(editReminder, dispatch),
  remindersPatchAndFetch: bindActionCreators(remindersPatchAndFetch, dispatch),
  editReminderContent: bindActionCreators(editReminderContent, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(toJS(RemindersScreen));
