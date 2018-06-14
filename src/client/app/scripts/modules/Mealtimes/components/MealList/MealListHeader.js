import React from 'react';

import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.scss';

const MealListHeader = () => (
  <Row className={styles['meal-list-header']}>
    <Col xs={6}>
      Mealtime
    </Col>
    <Col xs={6}>
      Duration
    </Col>
  </Row>
);

export default MealListHeader;
