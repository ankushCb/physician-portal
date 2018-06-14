import React, { Component } from 'react';
import { shape, string, array, arrayOf, func } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';

import FeatureCardWithHeader from '../../../../Common/Presentational/FeatureCardWithHeader';
import ShowPreloader from '../../../../Common/Presentational/ShowPreloader.jsx';
import TimeWindowHeader from '../../Common/Presentational/TimeWindowHeader.jsx';

import styles from './styles.scss';

class RemindersViewScreen extends Component {
  componentDidMount() {
    this.props.fetchInitial(this.props.params.patientId);
  }

  renderReminders() {
    return map(this.props.reminders, ({ timeWindows, ...reminder }, index) => (
      <div className="each-row" key={index}>
        <Row>
          <Col xs={3}>
            <div className="name">{capitalize(reminder.name)}</div>
            <div className="dose">{reminder.dose} / {reminder.type}</div>
          </Col>
          <Col xs={9}>
            <Row>
              {map(timeWindows, (timeWindow, lowerIndex) => <Col xs={2} key={`${index}.${lowerIndex}`} style={{ textAlign: 'center' }}>{timeWindow.dose || '-'}</Col>)}
            </Row>
          </Col>
        </Row>
      </div>
    ));
  }
  render() {
    return (
      <div className={styles['reminders-view-screen']}>
        <ShowPreloader
          show={this.props.fetchStatus && this.props.fetchStatus.isFetching}
        >
          <FeatureCardWithHeader
            header="Reminders"
            sideElementType="linkButton"
            linkTo={`${this.props.location.pathname}_edit`}
            buttonValue="Edit Reminders"
          >
            <TimeWindowHeader timeWindows={this.props.timeWindows} />
            {this.renderReminders()}
          </FeatureCardWithHeader>
        </ShowPreloader>
      </div>
    );
  }
}

RemindersViewScreen.propTypes = {
  location: shape({
    name: string.isRequired,
  }).isRequired,
  timeWindows: array.isRequired,
  reminders: arrayOf({
    name: string.isRequired,
    timeWindows: array.isRequired,
  }).isRequired,
  fetchInitial: func.isRequired,
};

RemindersViewScreen.defaultProps = {

};

export default RemindersViewScreen;
