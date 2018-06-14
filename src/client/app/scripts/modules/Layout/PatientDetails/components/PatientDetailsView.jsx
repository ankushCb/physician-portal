import React, { Component } from 'react';
import PropTypes, { shape } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import axios from 'axios';
import cx from 'classnames';

import PrimaryView from './PrimaryView.jsx';
import SecondaryView from './SecondaryView.jsx';

import { PhoneIcon, EmailIcon } from 'scripts/modules/Common/Icon/index.jsx';
import ShowPreloader from 'scripts/modules/Common/Presentational/ShowPreloader.jsx';

import styles from './styles.scss';

class PatientsDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecondaryView: false,
    };

    this.onClickMore = this.onClickMore.bind(this);
  }
  onClickMore() {
    this.setState({
      showSecondaryView: !this.state.showSecondaryView
    })
  }

  render() {
    const {
      patientData,
      fetchStatus: { patientStatus: { isFetching } }
    } = this.props;
    return (
      <div className={cx(styles['patient-details-view'], `${this.state.showSecondaryView ? 'expand' : ''}`)}>
        <PrimaryView
          patientData={patientData}
          onClickMore={this.onClickMore}
          showSecondaryView={this.state.showSecondaryView}
          isFetching={isFetching}
        />
      </div>
    );
  }
}

PatientsDetailView.propTypes = {
  fetchStatus: shape({
    patientStatus: shape({
      isFetching: PropTypes.bool
    }).isRequired,
  }).isRequired,
  patientData: PropTypes.object,
  pcp: PropTypes.string,
};

PatientsDetailView.defaultProps = {
  patientData: {},
  pcp: '',
};

export default PatientsDetailView;
