import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import FeatureCardWithHeader from '../../../../Common/Presentational/FeatureCardWithHeader';
import { StethoscopeIcon, VitalsIcon } from '../../../../Common/Icon/index.jsx';
import styles from './styles.scss';

const Overview = ({ overviewData: { vitalsTwoWeekAvg = {} } }) => (
  <FeatureCardWithHeader
    header="Overview"
    subHeader="2 week average"
  >
    <div className={styles['diabetes-overview']}>
      <Row>
        <Col className="each-item not-last" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              <div className="o-icon"><StethoscopeIcon /></div>
            </div>
            <div className="column-wrapper">
              <div className="title">Blood Pressure</div>
              <div className="display-value">{vitalsTwoWeekAvg.systolic} / {vitalsTwoWeekAvg.diastolic}</div>
            </div>
            <div className="clearfix" />
          </div>
        </Col>
        <Col className="each-item not-last" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              <div className="o-icon"><VitalsIcon /></div>
            </div>
            <div className="column-wrapper">
              <div className="title">Heart Rate</div>
              <div className="display-value">{vitalsTwoWeekAvg.heartRate}</div>
            </div>
            <div className="clearfix" />
          </div>
        </Col>
        <Col className="each-item" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              <div className="o-icon"><VitalsIcon /></div>
            </div>
            <div className="column-wrapper">
              <div className="title">Compliance</div>
              <div className="display-value">N/C</div>
            </div>
            <div className="clearfix" />
          </div>
        </Col>
      </Row>
    </div>
  </FeatureCardWithHeader>
);

Overview.propTypes = {
  overviewData: PropTypes.shape({
    vitalsTwoWeekAvg: PropTypes.object,
  }).isRequired,
};

export default Overview;
