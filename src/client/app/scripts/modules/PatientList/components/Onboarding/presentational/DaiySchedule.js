import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, blur } from 'redux-form/immutable';
import moment from 'moment';
import { connect } from 'react-redux';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import times from 'lodash/times';
import cx from 'classnames';
import { Row, Col } from 'react-flexbox-grid';

import {
  WakeupIcon,
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  BedtimeIcon,
} from '../../../../Common/Icon/index.jsx';

import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';

import InputSelect from '../../../../Common/FormElements/ReduxForm/Toolbox/InputSelect';
import isValidTime from '../../../../../helpers/validations/isValidTime.js';
import timeSlotsByWakeupTime from './timeSlotsByWakeupTime.js';

import styles from '../../styles.scss';

const wakeUpTimes = ['morning', 'noon', 'afternoon', 'evening', 'night'];
const wakeupOptions = map(wakeUpTimes, time => ({ value: time, label: capitalize(time) }));

const mealTimes = ['morning', 'breakfast', 'lunch', 'dinner', 'bedtime'];

function getTimeFromMins(mins) {
  const h = mins / 60 || 0;
  const m = mins % 60 || 0;
  return moment.utc().hours(h).minutes(m).format('h:mm A', { trim: true });
}

let counter = 0;
const timeOptions = times(48, () => {
  const minutes = counter * 30;
  const currentTime = getTimeFromMins(minutes);
  const result = {
    label: currentTime,
    value: currentTime,
  };
  counter += 1;
  return result;
});

const DailySchedule = ({
  handleSubmit, valid, onClose, onBoardPatient, dispatch, updating,
}) => {
  const handleWakeUpTimeChange = (event, wakeUpTime) => {
    forEach(timeSlotsByWakeupTime[wakeUpTime], (value, field) => {
      dispatch(blur('patientOnboardingForm', field, value));
    });
  };

  const submit = (values) => {
    onBoardPatient(values.delete('wakeUpTime').set('email', toLower(values.get('email'))).map((value, key) => (
      includes(mealTimes, key) ? moment(value, 'h:mm A').format('HH:mm:ss') : value
    )));
  };
  const renderIcons = (index) => {
    if (index === 0) {
      return <WakeupIcon />;
    }
    if (index === 1) {
      return <BreakfastIcon />;
    }
    if (index === 2) {
      return <LunchIcon />;
    }
    if (index === 3) {
      return <DinnerIcon />;
    }
    if (index === 4) {
      return <BedtimeIcon />;
    }
    return null;
  };

  const renderMealTimeInputs = () => map(mealTimes, (mealTime, index) => (
    <Row key={index}>
      <Col xs={1}>
        {renderIcons(index)}
      </Col>
      <Col xs={11}>
        <label className="meal-time-label" htmlFor={mealTime}>{capitalize(mealTime)}</label>
        <Field
          name={mealTime}
          component={InputSelect}
          className="no-bottom-border"
          options={timeOptions}
          validate={isValidTime()}
        />
      </Col>
    </Row>
  ));

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={cx(styles['new-patient-personal-form'], 'daily-schedule')}>
        <div className="header">
          <div className="modal-info">Daily Schedule</div>
          <div className="modal-number">2 / 3</div>
          <div className="clearfix" />
        </div>
        <div className="question">What time does your patient wake up?</div>
        <div className="wake-up-time">
          <Field
            name="wakeUpTime"
            component={InputSelect}
            options={wakeupOptions}
            onChange={handleWakeUpTimeChange}
            noCheck
          />
        </div>
        {renderMealTimeInputs()}
        <div className="buttons">
          <Button
            className="inverted-button"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            type="submit"
            label="Next"
            disabled={!valid}
            className="primary-button"
            isWorking={updating}
          />
        </div>
      </div>
    </form>
  );
};

DailySchedule.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  onBoardPatient: PropTypes.func.isRequired,
};

export default connect(state => ({
  initialValues: {
    ...state.getIn(['form', 'patientOnboardingForm', 'values']).toObject(),
    ...timeSlotsByWakeupTime.morning,
    wakeUpTime: 'morning',
  },
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
}))(reduxForm({ form: 'patientOnboardingForm' })(DailySchedule));
