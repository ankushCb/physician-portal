import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Row, Col } from 'react-flexbox-grid';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';

import { PlusIcon } from '../../../../Common/Icon/index.jsx';
import InputTextbox from '../../../../Common/FormElements/Formsy/InputText';

import styles from './styles.scss';


const EditReminderPanel = ({ reminder: { timeWindows, ...reminder }, ...props }) => {
  const renderTimeWindows = timeWindows1 => map(timeWindows1, timeWindow => (
    <Col xs={2} key={timeWindow.name}>
      <div className="time-window-name">{capitalize(timeWindow.name)}</div>
      <div
        onClick={() => {
          props.editReminder(props.index, timeWindow.dose ? 'remove' : 'add', timeWindows.dose, timeWindow.name)
        }}
        className="dose"
      >
        {timeWindow.dose || <span className="plus-icon"><PlusIcon /></span>}
      </div>
    </Col>
  ));

  const onChangeReminderField = (name, value) => {
    const data = name.split('.');
    const action = {
      field: data[0],
      index: parseInt(data[1]),
      value,
    };
    props.editReminderContent(action);
  }
  return (
    <div className={classNames(styles['edit-reminder-panel'], 'clearfix')} key={props.index}>
      <div className="delete-button" onClick={props.deleteReminder}>D</div>
      <div className={`edit-section ${props.isInvalidPanel ? 'invalid' : ''}`}>
        <Row>
          <Col xs={3}>
            <div className="small-heading">Medication</div>
            <div className="name">
              <InputTextbox
                name={`name.${reminder.index}`}
                value={reminder.name}
                onChangeInput={onChangeReminderField}
                fieldClass="field-name"
                lengthLimit={15}
              />
            </div>
            <div className="dose-and-type">
              <InputTextbox
                name={`dose.${reminder.index}`}
                value={reminder.dose}
                onChangeInput={onChangeReminderField}
                fieldClass="field-name"
                lengthLimit={10}
              />
            </div>
          </Col>
          <Col xs={9}>
            <Row>
              {renderTimeWindows(timeWindows)}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

EditReminderPanel.propTypes = {
  reminder: PropTypes.shape({
    timeWindows: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      dose: PropTypes.number,
    })),
  }),
};

EditReminderPanel.defaultProps = {
  reminder: {},
};

export default EditReminderPanel;
