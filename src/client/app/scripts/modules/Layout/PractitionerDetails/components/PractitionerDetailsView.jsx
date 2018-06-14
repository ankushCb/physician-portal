import React, { Component } from 'react';
import PropTypes, { shape } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import ShowPreloader from '../../../Common/Presentational/ShowPreloader.jsx';

import styles from './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
class PractitionerDetailsView extends Component {
  render() {
    const practitionerDetails = this.props.practitionerDetails;
    return (
      <div className={styles['practitioner-details-view']}>
        <ShowPreloader show={this.props.fetchStatus.practitionerStatus.isFetching}>
          <Row className="details-bar">
            <Col xsOffset={1} xs={3} className="name">
              Dr. {practitionerDetails.firstName} {practitionerDetails.lastName}
            </Col>
            <Col xsOffset={1} xs={2} />
            <Col xsOffset={1} xs={2} className="practitioner-value">
              {practitionerDetails.phone}
            </Col>
          </Row>
        </ShowPreloader>
      </div>
    );
  }
}

PractitionerDetailsView.propTypes = {
  practitionerDetails: PropTypes.object,
  fetchStatus: shape({
    practitionerStatus: shape({
      isFetching: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

PractitionerDetailsView.defaultProps = {
  practitionerDetails: {},
  fetching: false,
};

export default PractitionerDetailsView;
