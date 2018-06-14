import React, { Component } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

import EditReminderPanel from './EditReminderPanel.jsx';
import TimeWindowHeader from '../../Common/Presentational/TimeWindowHeader.jsx';

import styles from './styles.scss';

class EditReminders extends Component {
  constructor() {
    super();
    this.editReminder = this.editReminder.bind(this);
  }

  editReminder(index, name, dose, activeTimeWindows) {
    // console.log('index ', index, name, dose, activeTimeWindows);
    this.props.editReminder(
      index,
      name,
      activeTimeWindows,
    );
  }

  renderEditReminderPanels() {
    return map(this.props.reminders, (reminder, index) => (
      <EditReminderPanel
        key={index}
        index={index}
        reminder={reminder}
        editReminder={this.editReminder}
        editReminderContent={this.props.editReminderContent}
        deleteReminder={this.props.deleteReminder(index)}
        isInvalidPanel={indexOf(this.props.invalidFields, index) !== -1}
        twNameToUrl={this.props.twNameToUrl}
      />
    ));
  }

  render() {
    return (
      <div className={styles['edit-reminders']}>
        <div className="time-windows">
          <TimeWindowHeader timeWindows={this.props.timeWindows} />
        </div>
        <div className="edit-panel">
          {this.renderEditReminderPanels()}
        </div>
      </div>
    );
  }
}

EditReminders.propTypes = {
  reminders: PropTypes.arrayOf(),
  editReminder: PropTypes.func.isRequired,
};

EditReminders.defaultProps = {
  reminders: [],
};

export default EditReminders;
