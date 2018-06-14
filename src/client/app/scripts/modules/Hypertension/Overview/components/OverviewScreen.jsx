import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cx from 'classnames';

import FeatureCardWithHeader from '../../../Common/Presentational/FeatureCardWithHeader';
import ShowPreloader from '../../../Common/Presentational/ShowPreloader.jsx';
import Overview from './Overview';
import MedicationOverview from './MedicationOverview.jsx';
import LogBook from './LogBook.jsx';
import OverviewGraph from './OverviewGraph.jsx';

import Button from '../../../Common/FormElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';

class OverviewScreen extends Component {
  componentDidMount() {
    this.props.fetchInitialData(this.props.params.patientId);
  }

  render() {
    if (!this.props.isHavingHypertension) {
      return (
        <div className={cx(styles['overview-screen'], 'not-active')}>
          Click
            <Link to={`patients/${this.props.params.patientId}/hypertension_settings`}>
              <Button
                className="primary-button"
                label="Write prescription"
              />
            </Link>
          to enable hypertension management for this patient.
        </div>
      );
    }
    return (
      <div className={styles['overview-screen']}>
        <ShowPreloader show={this.props.fetchStatus.isFetching}>
          <Overview
            overviewData={this.props.overview}
          />
          <FeatureCardWithHeader
            header="Current Medication Overview"
            wrapperClass="overview-screen-element"
          >
            <MedicationOverview
              overview={this.props.medicationOverview}
              mealTimeData={this.props.mealTimeData}
            />
          </FeatureCardWithHeader>
          <FeatureCardWithHeader
            header="Log Book"
            wrapperClass="overview-screen-element"
            sideElementType="linkButton"
            linkTo={`patients/${this.props.params.patientId}/hypertension_settings`}
            buttonValue="Write prescription"
          >
            <LogBook
              logBook={this.props.logData}
              newFetch={this.props.fetchPaginatedLogData}
              isRefetching={this.props.logFetchStatus}
              hypertensionSettings={this.props.hypertensionSettings}
            />
          </FeatureCardWithHeader>
        </ShowPreloader>
        <OverviewGraph
          graphData={this.props.graphData}
          fetchStatus={this.props.fetchStatus}
          showPreloader={this.props.fetchStatus.isFetching}
          hypertensionSettings={this.props.hypertensionSettings}
        />
      </div>
    );
  }
}

OverviewScreen.propTypes = {
  logData: PropTypes.array.isRequired,
  overview: PropTypes.object.isRequired,
  fetchInitialData: PropTypes.func.isRequired,
  medicationOverview: PropTypes.object.isRequired,
  graphData: PropTypes.array.isRequired,
  params: PropTypes.shape({
    patientId: PropTypes.string.isRequired,
  }).isRequired,
  isHavingHypertension: PropTypes.bool.isRequired,
  fetchStatus: PropTypes.object.isRequired,
  hypertensionSettings: PropTypes.object.isRequired,
  mealTimeData: PropTypes.object.isRequired,
  fetchPaginatedLogData: PropTypes.object.isRequired,
  logFetchStatus: PropTypes.bool.isRequired,
};

export default OverviewScreen;
