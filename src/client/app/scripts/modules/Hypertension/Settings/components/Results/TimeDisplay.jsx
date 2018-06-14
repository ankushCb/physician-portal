import React from 'react';
import moment from 'moment';

import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.scss';


const changeTiming = data => moment(data.substring(0, 5), 'HH:mm').format('hh:mm A').replace(/^(?:00:)?0?/, '');
const MealtimeResults = (props) => {
  const {
    mealName,
    mealTimings,
    meal
  } = props;

  if (!mealTimings) {
    return null;
  }
  return (
    <Row className={styles['time-display-header']}>
      <Col xs={12}>
        <div className="meal-name">
          {mealName}
        </div>
        <div className="meal-time">
          {changeTiming(mealTimings[meal].startTime)}-{changeTiming(mealTimings[meal].stopTime)}
        </div>
      </Col>
    </Row>
  )
}

export default MealtimeResults;
