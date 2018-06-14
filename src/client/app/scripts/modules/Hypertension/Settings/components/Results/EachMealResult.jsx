import React from 'react';

import map from 'lodash/map';

import { Row, Col } from 'react-flexbox-grid';
import Card from '../../../../Common/Presentational/MaterialCard';

import MealTimeResults from './TimeDisplay.jsx';

const EachMealResult = ({ data, meal, mealTimings }) => {
  let mealName = 'AM';
  if (meal === 'pm') {
    mealName = 'PM';
  } else if (meal === 'lunch') {
    mealName = 'Lunch';
  }

  const titleRender = () => (
    <MealTimeResults
      meal={meal}
      mealTimings={mealTimings}
      mealName={mealName}
    />
  );

  return (
    <Card
      TitleComponent={titleRender}
    >
      {
        map(data, (data, index) => (
          <Row key={index} className="results-each-row">
            {
              (data && data.medName && data.dose) ? (
                <React.Fragment>
                  <Col md={9} xs={8}>
                    { data.medName }
                  </Col>
                  <Col md={3} xs={4}>
                    { `${data.dose} mg` }
                  </Col>
                </React.Fragment>
              ) : (
                <Col md={12} xs={12} className="empty-col">
                  -
                </Col>
              )
            }
          </Row>
        ))
      }
    </Card>
  )
}

export default EachMealResult;