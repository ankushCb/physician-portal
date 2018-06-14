import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import isEmpty from 'lodash/isEmpty';

import Care from './Care';
import PersonalForm from './PersonalForm';
import DailySchedule from './DaiySchedule';
import timeSlotsByWakeupTime from './timeSlotsByWakeupTime';

import ExitWarning from './ExitWarning';

const isFalse = value => (value === false);

class NewPatient extends Component {
  constructor() {
    super();
    this.state = {

    };
    this.navigateToSettings = this.navigateToSettings.bind(this);
    this.handleSubmitCareData = this.handleSubmitCareData.bind(this);
  }

  componentDidMount() {
    this.props.reinitializeData();
  }

  componentWillReceiveProps({ newUserData, ...nextProps }) {
    if (!isEmpty(newUserData) && newUserData !== this.props.newUserData) {
      this.setState({
        newUserData,
      });

      if (nextProps.view !== 'cancel') {
        this.props.switchCareForm();
      }
    }

    const {
      fetchStatus: cFetchStatus,
    } = this.props;

    const {
      fetchStatus: nFetchStatus,
    } = nextProps;

    if (cFetchStatus.careStatus.isPosting && nFetchStatus.careStatus.isPosted) {
      this.navigateToSettings();
    }
  }

  navigateToSettings() {
    this.props.router.push(`/patients/${this.state.newUserData || '99b1bdf4-cf58-4716-b661-ae6024fb7bdb'}/settings`);
    this.props.onClose();
  }


  handleSubmitCareData(values) {
    this.props.submitCareData(values, this.state.newUserData || '99b1bdf4-cf58-4716-b661-ae6024fb7bdb');
  }

  render() {
    const initialValues = {
      location: this.props.clinicData[0].value,
      doctor: this.props.currentPractitionerId,
      wakeUpTime: 'morning',
      ...timeSlotsByWakeupTime.morning,
    };
    switch (this.props.view) {
      case 'personal': {
        const { checkEmail, checkPhone, postInitiated } = this.props.fetchStatus;
        return (
          <PersonalForm
            nextForm={this.props.switchDailyScheduleForm}
            onClose={this.props.switchToCancelForm}
            updating={postInitiated}
            updatingEmail={checkEmail.initiated}
            emailAlreadyPresent={isFalse(checkEmail.status)}
            phoneAlreadyPresent={isFalse(checkPhone.status)}
            checkEmail={this.props.checkEmail}
            clinicData={this.props.clinicData}
            clinicDoctorData={this.props.clinicDoctorData}
            initialValues={initialValues}
            currentLocationId={this.props.clinicData[0].value}
            checkPhone={this.props.checkPhone}
          />
        );
      }
      case 'schedule':
        return (
          <DailySchedule
            onBoardPatient={this.props.postDailySchedule}
            onClose={this.props.switchToCancelForm}
            updating={this.props.fetchStatus.postInitiated}
          />
        );
      case 'care':
        return (
          <Care
            updateCareRow={this.props.updateCareRow}
            validations={this.props.careFormValidation}
            navigateToSettings={this.navigateToSettings}
            switchToCancelForm={this.props.switchToCancelForm}
            submitCareData={this.handleSubmitCareData}
            fetchStatus={this.props.fetchStatus}
          />
        );
      case 'cancel':
        return (
          <ExitWarning
            onClose={this.props.onClose}
            cancelToView={this.props.cancelToView}
            rejectCancel={this.props.rejectCancel}
          />
        );
      default:
        return null;
    }
  }
}

NewPatient.propTypes = {
  postDailySchedule: PropTypes.func.isRequired,
  reinitializeData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchStatus: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  newUserData: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  switchCareForm: PropTypes.func.isRequired,
  submitCareData: PropTypes.func.isRequired,
  clinicData: PropTypes.object.isRequired,
  currentPractitionerId: PropTypes.string.isRequired,
  checkPhone: PropTypes.func.isRequired,
  checkEmail: PropTypes.func.isRequired,
  switchDailyScheduleForm: PropTypes.func.isRequired,
  switchToCancelForm: PropTypes.func.isRequired,
  clinicDoctorData: PropTypes.object.isRequired,
  updateCareRow: PropTypes.func.isRequired,
  careFormValidation: PropTypes.array.isRequired,
  cancelToView: PropTypes.func.isRequired,
  rejectCancel: PropTypes.func.isRequired,
};

export default withRouter(NewPatient);
