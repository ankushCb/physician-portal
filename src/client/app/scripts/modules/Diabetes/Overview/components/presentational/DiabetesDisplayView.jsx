import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import { Link } from 'react-router';

import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';

import Overview from './Overview';
import LogBookTable from '../presentational/LogBook/index.jsx';
import Schedule from '../presentational/Schedule/index.jsx';
import Graph from './DiabetesGraph/index.jsx';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import ShowPreLoader from '../../../../Common/Presentational/ShowPreloader.jsx';
import DiabetesLegend from './DiabetesLegend';
import styles from '../../styles/index.scss';

class DiabetesDisplayView extends Component {
  constructor(props) {
    super(props);

    this.offset = 0;

    this.state = {
      offset: this.offset,
    };

    this.currentDate = moment().utc().startOf('day');
    this.limit = 7;
    this.totalItems = 0;
    this.onLogBookPageChange = this.onLogBookPageChange.bind(this);
    this.onRowCountChange = this.onRowCountChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    const patientID = this.props.params.patientId;
    this.props.diabetesSpecificFetch(patientID, moment(this.currentDate, 'DD-MM-YYYY'), 0, this.limit);
    this.props.initialFetch(patientID);
  }

  onLogBookPageChange(currentDate, movePreviousCount) { // eslint-disable-line
    const patientID = this.props.params.patientId;

    this.props.diabetesSpecificFetch(patientID, moment(this.currentDate, 'DD-MM-YYYY'), movePreviousCount, this.limit);
  }

  onRowCountChange(name, newRowCount) {
    const patientID = this.props.params.patientId;
    this.limit = newRowCount;
    this.props.diabetesSpecificFetch(patientID, moment(this.currentDate, 'DD-MM-YYYY'), 0, this.limit);
  }

  handlePageChange(pageChange) {
    const currentDate = moment.isMoment(this.currentDate) ? this.currentDate.clone() : moment(this.currentDate, 'DD/MM/YYYY').clone();
    const movePreviousCount = this.limit * (this.state.offset + pageChange);
    this.onLogBookPageChange(currentDate, movePreviousCount); //eslint-disable-line
    this.setState({
      offset: this.state.offset + pageChange,
    });
  }

  render() {
    if (!this.props.fetchStatus.currentInsulinRegimenStatus.isFetching && isEmpty(this.props.currentInsulinRegimenData)) {
      return (
        <div className={cx(styles['diabetes-display-wrapper'], 'not-active')}>
          Click
            <Link to={`patients/${this.props.params.patientId}/settings`}>
              <Button
                className="primary-button"
                label="Write prescription"
              />
            </Link>
          to enable diabetes management for this patient.
        </div>
      );
    }

    const currentDate = moment.isMoment(this.currentDate) ? this.currentDate.clone() : moment(this.currentDate, 'DD/MM/YYYY').clone();
    const movePreviousCount = this.limit * this.state.offset;
    const startDate = currentDate.clone().subtract({ days: movePreviousCount }).format('DD/MM/YYYY');
    const endDate = currentDate.clone().subtract({ days: movePreviousCount + (this.limit - 1) }).format('DD/MM/YYYY');
    const {
      hyperglycemiaThresholdEmergency: hyper,
      hyperglycemiaTitrationThresholdSmall: goal,
      hypoglycemiaGlucoseThresholdMild: hypo
    } = this.props.diabetesSettings;
    console.log('hyper, goal ', hyper, goal, hypo);
    return (
      <div className={styles['diabetes-display-wrapper']}>
        <ShowPreLoader show={this.props.fetchStatus.currentInsulinRegimenStatus.isFetching}>
          <Overview
            showPreLoader={this.props.fetchStatus.currentInsulinRegimenStatus.isFetching}
            overviewData={this.props.overviewData}
          />
          <LogBookTable
            {...pick(this.props, ['logBookHeader', 'logBookData', 'logBookIsFetching'])}
            currentDate={this.currentDate}
            limit={this.limit}
            offset={this.offset}
            totalItems={this.totalItems}
            onRowCountChange={this.onRowCountChange}
            showPreLoader={this.props.fetchStatus.logBookStatus.isFetching}
            onPageChange={this.handlePageChange}
            startItem={endDate}
            endItem={startDate}
            patientId={this.props.params.patientId}
            hypo={hypo}
            goal={goal}
            hyper={hyper}
          />
          <Schedule
            scheduleDisplayData={this.props.currentInsulinRegimenData}
            showPreLoader={this.props.fetchStatus.currentInsulinRegimenStatus.isFetching}
          />
          <Graph
            graphData={this.props.graphData}
            showPreLoader={this.props.fetchStatus.currentInsulinRegimenStatus.isFetching}
            fetchStatus={this.props.fetchStatus.graphStatus}
            diabetesSettings={this.props.diabetesSettings}
          />
          <DiabetesLegend />
        </ShowPreLoader>
      </div>
    );
  }
}

DiabetesDisplayView.propTypes = {
  fetchInsulins: PropTypes.func.isRequired,
  currentInsulinRegimenData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  params: PropTypes.object.isRequired,
  showPreloader: PropTypes.object,
};

DiabetesDisplayView.defaultProps = {
  currentInsulinRegimenData: {},
  logBookData: {},
  showPreloader: {},
};

export default DiabetesDisplayView;
