import React from 'react';

import { Row, Col } from 'react-flexbox-grid';

import findIndex from 'lodash/findIndex';
import MealList from './MealList';
import ActiveMealTimeClock from './ActiveMealTimeClock';

import ShowPreloader from '../../Common/Presentational/ShowPreloader.jsx';
import styles from './styles.scss';

class MealtimeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMeal: 'morning',
    }

    this.updateMealTime = this.updateMealTime.bind(this);
    this.handleOnClickRow = this.handleOnClickRow.bind(this);
  }

  componentDidMount() {
    this.props.initialFetch(this.props.params.patientId);
  }

  handleOnClickRow(activeMeal) {
    return () => {
      this.setState({
        activeMeal,
      });
    };
  }

  updateMealTime({ startTime, stopTime }) {
    const activeIndex = findIndex(this.props.mealTimeData, ({ name }) => name === this.state.activeMeal);
    this.props.updateMealTime({
      startTime,
      stopTime,
      mealName: this.state.activeMeal,
      url: this.props.mealTimeData[activeIndex].url,
      patientId: this.props.params.patientId,
    });
  }

  render() {
    const activeIndex = findIndex(this.props.mealTimeData, ({ name }) => name === this.state.activeMeal);
    const activeMealTime = this.props.mealTimeData[activeIndex] || {
      startTime: '12:00:00',
      stopTime: '12:00:00',
    };

    const {
      startTime: activeStartTime,
      stopTime: activeEndTime,
    } = activeMealTime;
    
    return (
      <ShowPreloader
        show={this.props.fetchStatus.shouldLoadPreloader}
      > 
        <div className={styles['meal-time']}>
          <Row>
            <Col xs={6} className="meallist-wrapper">
              <MealList
                active={this.state.activeMeal}
                mealTimeData={this.props.mealTimeData}
                handleOnClickRow={this.handleOnClickRow}
              />
            </Col>
            <Col xsOffset={1} xs={5}>
              <ActiveMealTimeClock
                startTime={activeStartTime}
                endTime={activeEndTime}
                updateMealTime={this.updateMealTime}
              />
            </Col>
          </Row>
        </div>
      </ShowPreloader>
    );
  }
}

export default MealtimeScreen;
