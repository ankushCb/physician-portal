import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';

import map from 'lodash/map';
import filter from 'lodash/filter';
import compact from 'lodash/compact';
import includes from 'lodash/includes';
import lowerCase from 'lodash/lowerCase';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import capitalize from 'lodash/capitalize';

import FeatureCardWithHeader from '../../../../Common/Presentational/FeatureCardWithHeader';
import SearchInput from '../../../../Common/styledFormElements/SearchInput.jsx';
import List from '../../../../Common/Presentational/List.jsx';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import Modal from '../../../../Common/Presentational/Modal/index.jsx';
import { SortAscIcon, SortDescIcon } from '../../../../Common/Icon/index.jsx';
import NewPatient from '../../Onboarding';

import styles from '../../styles.scss';

const isPatientNameOrEmailSimilar = (patient, value) => {
  const firstName = lowerCase(patient.firstName);
  const lastName = lowerCase(patient.lastName);
  const searchingValue = lowerCase(value);
  const email = lowerCase(patient.email);
  const clinic = lowerCase(patient.clinic);
  return (includes(firstName, searchingValue)
    || includes(lastName, searchingValue)
    || includes(`${firstName} ${lastName}`, searchingValue)
    || includes(clinic, searchingValue)
    || includes(email, searchingValue));
};

class PatientListDisplay extends Component {
  constructor(props) {
    super();
    this.state = {
      patientList: props.patientListData,
      showAddPatient: false,
      sortPatientsBy: '',
      sortReverse: false,
      view: 'care',
      previousView: 'personal',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddPaitient = this.handleAddPaitient.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.sortByProp = this.sortByProp.bind(this);
    this.switchDailyScheduleForm = this.switchDailyScheduleForm.bind(this);
    this.switchCareForm = this.switchCareForm.bind(this);
    this.switchToCancelForm = this.switchToCancelForm.bind(this);
    this.rejectCancel = this.rejectCancel.bind(this);
  }

  componentDidMount() {
    this.props.practitionerInitialFetch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      patientList: nextProps.patientListData,
    });
  }

  getSearchInput() {
    return (
      <div className={styles['side-elements-wrapper']}>
        <div>
          <SearchInput
            placeholder="Search"
            onChange={this.handleSearchChange}
            name="patient-search"
            wrapperClass="patient-list-search"
          />
        </div>
        <div>
          <Button
            label="Add Patient"
            onClick={this.handleAddPaitient}
            className="primary-button rounded-corners"
          />
        </div>
      </div>
    );
  }

  switchDailyScheduleForm() {
    this.setState({
      view: 'schedule',
      previousView: 'schedule',
    });
  }

  switchCareForm() {
    this.setState({
      view: 'care',
      previousView: 'care',
    });
  }

  switchToCancelForm() {
    this.setState({
      view: 'cancel',
    });
  }

  rejectCancel() {
    this.setState({
      view: this.state.previousView,
    });
  }

  handleSorting(sortPatientsBy) {
    return () => {
      this.setState({ sortPatientsBy, sortReverse: !this.state.sortReverse });
    };
  }

  handleAddPaitient() {
    this.setState({
      showAddPatient: true,
    });
  }

  handleModalClose() {
    this.setState({
      showAddPatient: false,
      view: 'personal',
    }, () => {
      this.props.clearOnboardingForm();
    });
  }

  handleSearchChange(value) {
    let filteredPatients = this.props.patientListData;
    if (value) {
      filteredPatients = compact(filter(this.props.patientListData, patient => (isPatientNameOrEmailSimilar(patient, value) ? patient : null)));
    }

    this.setState({
      patientList: filteredPatients,
    });
  }

  sortByProp(patient) {
    switch (this.state.sortPatientsBy) {
      case 'first_name':
        return `${patient.firstName}`;
      case 'last_name':
        return `${patient.lastName}`;
      case 'birthdate':
      case 'created':
        return moment(patient[this.state.sortPatientsBy], 'DD/MM/YYYY').unix();
      case 'avg_bg':
        return `${patient.lastSevenDayBgReadingsAverage}`;
      case 'clinic':
        return patient[this.state.sortPatientsBy];
      default:
        return null;
    }
  }

  renderSortField(field, label) {
    const isSortedField = (field === this.state.sortPatientsBy);
    return (
      <div
        onClick={this.handleSorting(field)}
        className={isSortedField ? classNames('sorted-field') : ''}
      >
        {label}
        {
          (this.state.sortReverse ? <SortDescIcon displayIcon={isSortedField} /> : <SortAscIcon displayIcon={isSortedField} />)
        }
      </div>
    );
  }

  renderPatients() {
    const sortedList = sortBy(this.state.patientList, this.sortByProp);
    return map((this.state.sortReverse ? reverse(sortedList) : sortedList), patient => (
      <tr key={patient.id}>
        <td className="align-left link bold">
          <Link to={`/patients/${patient.id}/diabetes`}>
            {capitalize(patient.firstName)}
          </Link>
        </td>
        <td className="bold">
          {capitalize(patient.lastName)}
        </td>
        <td>{moment(patient.birthdate, 'DD/MM/YYYY').format('M/D/YYYY')}</td>
        <td>{moment(patient.created, 'DD/MM/YYYY').format('M/D/YYYY')}</td>
        <td>{patient.lastSevenDayBgReadingsAverage}</td>
        <td>-</td>
      </tr>
    ));
  }

  render() {
    return (
      <div className={styles['patient-list']}>
        <FeatureCardWithHeader
          header="Patients"
          sideElementType="other"
          sideElement={this.getSearchInput()}
          showPreLoader={this.props.fetchStatus.patientListStatus.isFetching}
        >
          <div className="list">
            <List itemList={this.state.patientList}>
              <table>
                <thead>
                  <tr>
                    <th className="align-left">
                      {this.renderSortField('first_name', 'FIRST NAME')}
                    </th>
                    <th>
                      {this.renderSortField('last_name', 'LAST NAME')}
                    </th>
                    <th>
                      {this.renderSortField('birthdate', 'BIRTHDATE')}
                    </th>
                    <th>
                      {this.renderSortField('created', 'ON BOARDING')}
                    </th>
                    <th>
                      {this.renderSortField('avg_bg', 'AVG BG')}
                    </th>
                    <th>
                      {this.renderSortField('avg_bp', 'AVG BP')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderPatients()}
                </tbody>
              </table>
            </List>
          </div>
        </FeatureCardWithHeader>
        <Modal
          open={this.state.showAddPatient}
          overlayBlock={this.state.view === 'care'}
          className={this.state.view === 'care' ? 'care-modal' : 'onboard-modal'}
        >
          <NewPatient
            onClose={this.handleModalClose}
            switchToCancelForm={this.switchToCancelForm}
            cancelToView={this.state.previousView}
            rejectCancel={this.rejectCancel}
            view={this.state.view}
            switchDailyScheduleForm={this.switchDailyScheduleForm}
            switchCareForm={this.switchCareForm}
          />
        </Modal>
      </div>
    );
  }
}

PatientListDisplay.propTypes = {
  practitionerInitialFetch: PropTypes.func.isRequired,
  clearOnboardingForm: PropTypes.func.isRequired,
  patientListData: PropTypes.array,
  fetchStatus: PropTypes.object,
};

PatientListDisplay.defaultProps = {
  patientListData: [],
  fetchStatus: {},
};

export default PatientListDisplay;
