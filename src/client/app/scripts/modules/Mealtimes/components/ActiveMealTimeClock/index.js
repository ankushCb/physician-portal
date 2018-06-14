import React from 'react';

import Button from '../../../Common/FormElements/ReduxForm/Toolbox/Button';
import ClockTimeRangeSlider from '../../../Common/TimeRangeSlider';
import styles from './index.scss';

class ActiveMealTimeClock extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const {
      startTime,
      stopTime,
    } = this.refs.mealTimeEditor.getTime();
    this.props.updateMealTime({
      startTime,
      stopTime,
    });
  }

  render() {
    return (
      <div className={styles['active-meal-time-clock']}>
        <ClockTimeRangeSlider
          startTime={this.props.startTime}
          endTime={this.props.endTime}
          ref="mealTimeEditor"
        />
        <Button
          label="Submit"
          className="primary-button"
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}


export default ActiveMealTimeClock;
