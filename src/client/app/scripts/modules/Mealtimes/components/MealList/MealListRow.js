import React from 'react';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.scss';

const MealListRow = ({ name, startTime, stopTime, handleOnClickRow, isActive }) => (
  <Row className={cx(styles['meal-list-row'], { active: isActive })} onClick={handleOnClickRow(name)}>
    <Col xs={6}>
      {capitalize(name)}
    </Col>
    <Col xs={6}>
      {moment(startTime, 'HH:mm').format('hh:mm A')} - {moment(stopTime, 'HH:mm').format('hh:mm A')} 
    </Col>
  </Row>
);

export default MealListRow;
