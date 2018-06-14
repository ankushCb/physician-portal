import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';
import { A1cIcon, TagIcon } from '../../../../../Common/Icon/index.jsx';

import styles from './styles.scss';

const Overview = ({ showPreLoader, overviewData }) => (
  <FeatureCardWithHeader
    header="Overview"
    showPreLoader={showPreLoader}
  >
    <div className={styles['diabetes-overview']}>
      <Row>
        <Col className="each-item not-last" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              <div className="o-icon"><TagIcon /></div>
            </div>
            <div className="column-wrapper">
              <div className="title">Avg bG (change)</div>
              <div className="display-value">{overviewData.bgReading}</div>
            </div>
            <div className="clearfix" />
          </div>
        </Col>
        <Col className="each-item not-last" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              <div className="o-icon"><A1cIcon /></div>
            </div>
            <div className="column-wrapper">
              <div className="title">A1c</div>
              <div className="display-value">N/C</div>
            </div>
            <div className="clearfix" />
          </div>
        </Col>
        <Col className="each-item" xs={4}>
          <div className="item-wrapper">
            <div className="column-wrapper">
              {
                /*
                <div className="o-icon"><A1cIcon /></div>
                */
              }
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

export default Overview;
