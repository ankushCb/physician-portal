import React from 'react';
import map from 'lodash/map';
import MealListHeader from './MealListHeader';
import MealListRow from './MealListRow';

const MealList = (props) => (
  <div>
    <MealListHeader />
    {
      map(props.mealTimeData, ({ name, url, startTime, stopTime }) => (
        <MealListRow
          isActive={props.active === name}
          key={name}
          name={name}
          handleOnClickRow={props.handleOnClickRow}
          startTime={startTime}
          stopTime={stopTime}
        />
      ))
    }
  </div>
);

export default MealList;