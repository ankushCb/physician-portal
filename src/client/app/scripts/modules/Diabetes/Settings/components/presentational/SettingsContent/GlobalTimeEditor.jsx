import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import capitalize from 'lodash/capitalize';

import { replaceTime } from '../../../../../../helpers/time.js';
import TimeRangeSlider from '../../../../../Common/TimeRangeSlider/index.js';
import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';

import styles from './styles.scss';

class GlobalTimeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mealStartTime: props.startTime,
      mealEndTime: props.endTime,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  handleSubmit() {
    const {
      startTime,
      stopTime,
    } = this.refs.clockEditor.getTime();
    this.props.onUpdateTime({
      mealName: this.props.mealName,
      startTime: moment(startTime, 'HH:mm').format('HH:mm:ss'),
      endTime: moment(stopTime, 'HH:mm').format('HH:mm:ss'),
    });
    this.props.closeParentModal();
  }

  handleTimeChange(from) {
    return ({ startTime, endTime }) => {
      const [
        mealStartTime,
        mealEndTime,
      ] = from === 'slider' ? [
        replaceTime(0)(this.state.mealStartTime)(startTime),
        replaceTime(0)(this.state.mealEndTime)(endTime),
      ] : [
        startTime,
        endTime,
      ];

      this.setState({ mealStartTime, mealEndTime });
    };
  }

  render() {
    return (
      <div className={styles['global-time-editor']}>
        <div className="selected-meal">{capitalize(this.props.mealName)}</div>
        <TimeRangeSlider
          startTime={this.state.mealStartTime}
          endTime={this.state.mealEndTime}
          ref="clockEditor"
        />
        <div className="btn-wrapper">
          <Button
            label="Change"
            onClick={this.handleSubmit}
            className="primary-button"
          />
        </div>
      </div>
    );
  }
}

GlobalTimeEditor.propTypes = {
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  mealName: PropTypes.string,
  closeParentModal: PropTypes.func.isRequired,
};

export default GlobalTimeEditor;
