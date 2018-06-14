import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import usStatesData from 'scripts/helpers/usStates.js';

import { baseUrl } from 'scripts/helpers/api';
import Toolbox from '../../../../Common/FormElements/ReduxForm/Toolbox';
import InputDate from '../../../../Common/FormElements/ReduxForm/InputDate';

import validations from '../../../../../helpers/validations';
import styles from '../../styles.scss';

const {
  InputText,
  InputSelect,
  RadioBtnGroup: MultiCheckBox,
  InputPhone,
  Button,
} = Toolbox;

const {
  isValidEmail,
  isRequired,
  isValidPhoneNumber,
} = validations;
const usStates = map(usStatesData, (label, value) => ({ label, value }));
let prevCheckedEmail;
let blurringFieldsChecked; // eslint-disable-line

const checkEmailAndPhone = (values, dispatch, props, blurredField) => {
  const email = values.get('email');
  if (blurredField === 'email' && !(email === prevCheckedEmail && props.anyTouched)) {
    props.checkEmail({ email });
  } else {
    props.checkPhone({ mobile_telecom: values.get('mobileTelecom') });
  }
  blurringFieldsChecked = true;
  prevCheckedEmail = email;
  return new Promise(resolve => resolve()).then(() => {});
};

const handleBlurringFieldsChange = () => {
  blurringFieldsChecked = false;
};

const formatPhone = (v = '') => {
  const value = v.replace(/\D/g, '');
  const firstPart = value.substring(0, 3);
  const secondPart = value.substring(3, 6);
  const thirdPart = value.substring(6, 10);
  let formattedValue = '';
  if (!isEmpty(firstPart)) {
    formattedValue += `(${firstPart}) `;
  }
  if (!isEmpty(secondPart)) {
    formattedValue += secondPart;
  }
  if (!isEmpty(thirdPart)) {
    formattedValue += '-';
    formattedValue += thirdPart;
  }
  return formattedValue;
};

const unformatPhone = (v) => {
  const value = v.replace(/\D/g, '');
  const firstPart = value.substring(0, 3);
  const secondPart = value.substring(3, 6);
  const thirdPart = value.substring(6, 10);
  let formattedValue = '';
  if (!isEmpty(firstPart)) {
    formattedValue += firstPart;
  }
  if (!isEmpty(secondPart)) {
    formattedValue += '-';
    formattedValue += secondPart;
  }
  if (!isEmpty(thirdPart)) {
    formattedValue += '-';
    formattedValue += thirdPart;
  }
  return formattedValue;
};

const getLocationUrl = (id) => {
  return `${baseUrl}/api/locations/${id}`;
};

class PersonalForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedClinic: this.props.currentLocationId,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(a, b) {
    this.setState({
      selectedClinic: b,
    });
  }

  render() {
    const {
      handleSubmit,
      pristine,
      valid,
      nextForm,
      onClose,
      updating,
      updatingEmail,
      emailAlreadyPresent,
      clinicData,
      clinicDoctorData,
      phoneAlreadyPresent,
    } = this.props;
    const doctorOptions = clinicDoctorData[getLocationUrl(this.state.selectedClinic)];
    return (
      <form onSubmit={handleSubmit(nextForm)}>
        <div className={styles['new-patient-personal-form']}>
          <div className="header">
            <div className="modal-info">Personal Info </div>
            <div className="modal-number">1 / 3</div>
            <div className="clearfix" />
          </div>
          <Row>
            <Col xs={6}>
              <Field
                name="firstName"
                label="First Name"
                component={InputText}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
              />
            </Col>
            <Col xs={6}>
              <Field
                name="lastName"
                label="Last Name"
                component={InputText}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                name="email"
                label="Email"
                component={InputText}
                validate={isValidEmail()}
                working={updatingEmail ? 1 : 0}
                warningFromOut={emailAlreadyPresent}
                onChange={handleBlurringFieldsChange}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                error={emailAlreadyPresent ? 'User Already Registered with this email' : null}
              />
            </Col>
            <Col xs={6}>
              <Field
                name="mobileTelecom"
                label="Phone Number"
                component={InputPhone}
                format={formatPhone}
                normalize={unformatPhone}
                onChange={handleBlurringFieldsChange}
                warningFromOut={phoneAlreadyPresent}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                validate={isValidPhoneNumber()}
                error={phoneAlreadyPresent ? 'User Already Registered with this Number' : null}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                name="state"
                component={InputSelect}
                options={usStates}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                label="State"
                floating
              />
            </Col>
            <Col xs={6}>
              <Field
                name="birthdate"
                component={InputDate}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                label="Birthday"
                labelClass="onboarding-label"
                hideValidIcon
                floating
              />
            </Col>
          </Row>
          <Row>
            <label className="gender-label" htmlFor="genderField">Gender</label>
            <Col xs={12}>
              <Field
                name="gender"
                id="genderField"
                component={MultiCheckBox}
                label="Gender"
                validate={isRequired()}
                options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                floating
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                name="location"
                component={InputSelect}
                options={clinicData}
                onChange={this.handleChange}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                label="Clinic"
                floating
              />
            </Col>
            <Col xs={6}>
              <Field
                name="doctor"
                component={InputSelect}
                options={doctorOptions}
                validate={isRequired()}
                className="active-highlighter"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="off"
                label="Doctor"
                floating
              />
            </Col>
          </Row>
          <div className="buttons">
            <Button
              className="inverted-button"
              label="Cancel"
              onClick={onClose}
            />
            <Button
              type="submit"
              label="Next"
              className="primary-button"
              disabled={pristine || !valid}
              isWorking={updating ? 1 : 0}
            />
          </div>
        </div>
      </form>
    );
  }
}

PersonalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  nextForm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  updatingEmail: PropTypes.bool.isRequired,
  emailAlreadyPresent: PropTypes.bool.isRequired,
  clinicData: PropTypes.array.isRequired,
  clinicDoctorData: PropTypes.object.isRequired,
  phoneAlreadyPresent: PropTypes.bool.isRequired,
  currentLocationId: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'patientOnboardingForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  asyncValidate: checkEmailAndPhone,
  asyncBlurFields: ['email', 'mobileTelecom'],
})(PersonalForm);
