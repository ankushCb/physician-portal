import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import filter from 'lodash/filter';
import pull from 'lodash/pull';
import concat from 'lodash/concat';
import isNull from 'lodash/isNull';

import EditReminders from './EditReminders.jsx';
import FeatureCardWithHeader from '../../../../Common/Presentational/FeatureCardWithHeader';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import Modal from '../../../../Common/Presentational/Modal/index.jsx';
import ShowPreloader from '../../../../Common/Presentational/ShowPreloader.jsx';
import AddReminderForm from './AddReminder.jsx';


import styles from './styles.scss';

class RemindersScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddReminder: false,
    };

    this.toggleAddReminder = this.toggleAddReminder.bind(this);
    this.editReminder = this.editReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.onAddReminder = this.onAddReminder.bind(this);
  }

  componentDidMount() {
    this.props.fetchInitial(this.props.params.patientId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fetchStatus.isPatching && !nextProps.fetchStatus.isPatching) {
      this.props.router.push(this.props.location.pathname .substr(0, this.props.location.pathname.length-5))
    }
  }

  onAddReminder(addReminderFields) {
    this.props.addReminder({ ...addReminderFields });
  }

  deleteReminder(index) {
    return () => {
      this.props.deleteReminder({ index });
    };
  }

  editReminder(index, action, timeWindow) {
    // console.log('current time windows ', this.props.reminders[index].timeWindows);
    const selReminderWindows = map(filter(this.props.reminders[index].timeWindows, ({ dose }) => (!isNull(dose))), 'name');
    // console.log('selReminderWindows ', action, selReminderWindows);
    const activeTimeWindows = action === 'remove' ? pull(selReminderWindows, timeWindow) : concat(selReminderWindows, timeWindow);
    // console.log('activeWindows ', activeTimeWindows);
    this.props.editReminder({
      index,
      activeTimeWindows: map(activeTimeWindows, tw => this.props.twNameToUrl[tw]),
    });
  }

  toggleAddReminder() {
    this.setState({
      showAddReminder: !this.state.showAddReminder,
    });
  }

  renderCardSidePanel() {
    return (
      <div className="edit-buttons">
        <Button
          onClick={this.toggleAddReminder}
          className="primary-button"
          label="Add"
        />
        <Button
          onClick={this.props.remindersPatchAndFetch}
          disabled={!this.props.submitButtonEnabled}
          className="primary-button"
          label="Done"
        />
      </div>
    );
  }

  render() {
    return (
      <ShowPreloader
        show={this.props.fetchStatus.isFetching}
      >
      <div className={styles['reminders-screen']}>
        <FeatureCardWithHeader
          header="Reminders"
          sideElementType="other"
          sideElement={this.renderCardSidePanel()}
        >
          <EditReminders
            reminders={this.props.reminders}
            timeWindows={this.props.timeWindows}
            editReminder={this.editReminder}
            deleteReminder={this.deleteReminder}
            editReminderContent={this.props.editReminderContent}
            invalidFields={this.props.invalidFields}
            twNameToUrl={this.props.twNameToUrl}
          />
        </FeatureCardWithHeader>
        <Modal
          open={this.state.showAddReminder}
          onClose={this.toggleAddReminder}
          bodyClass="add-reminder-modal"
        >
          <AddReminderForm
            twNameToUrl={this.props.twNameToUrl}
            onSubmit={this.onAddReminder}
            onCancel={this.toggleAddReminder}
          />
        </Modal>
      </div>
    </ShowPreloader>
    );
  }
}

RemindersScreen.propTypes = {
  reminders: PropTypes.array.isRequired,
  timeWindows: PropTypes.array.isRequired,
  editReminder: PropTypes.func.isRequired,
  fetchInitial: PropTypes.func.isRequired,
  deleteReminder: PropTypes.func.isRequired,
  addReminder: PropTypes.func.isRequired,
  params: PropTypes.shape({
    patientId: PropTypes.string.isRequired,
  }).isRequired,
};

export default RemindersScreen;
