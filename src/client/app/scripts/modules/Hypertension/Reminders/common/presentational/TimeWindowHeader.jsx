import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';

import styles from './styles.scss';

const TimeWindowHeader = ({ timeWindows }) => (
  <Row className={styles['time-window-headers']}>
    <Col xs={3} />
    <Col xs={9}>
      <Row>
        {
          map(timeWindows, timeWindow => (
            <Col xs={2}>
              <div className="name">{capitalize(timeWindow.name)}</div>
              <div className="time-slot">
                {timeWindow.startTime.substr(0, 5)} - {timeWindow.endTime.substr(0, 5)}
              </div>
            </Col>
          ))
        }
      </Row>
    </Col>
  </Row>
);

TimeWindowHeader.propTypes = {

};

TimeWindowHeader.defaultProps = {

};

export default TimeWindowHeader;
