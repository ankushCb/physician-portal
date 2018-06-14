import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize'

import { Row, Col } from 'react-flexbox-grid';

import InputText from '../../../../Common/FormElements/ReduxForm/Toolbox/InputText';
import InputCheckBox from '../../../../Common/FormElements/ReduxForm/Toolbox/InputCheckBox';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';

const AddReminderForm = ({ meals, handleSubmit, ...props }) => (
  <div>
    <Field
      component={InputText}
      name="medication"
      label="Medication"
    />
    <Field
      component={InputText}
      name="dose"
      label="Dose"
    />
    {
      map(meals, (meal, index) => (
        <Row className="each-reminder" key={index}>
          <Col xs={8}>{capitalize(meal)}</Col>
          <Col xs={4}>
            <Field
              component={InputCheckBox}
              name={`timewindows.${meal}`}
            />
          </Col>
        </Row>
      ))
    }
    <div className="add-reminder-buttons">
      <Button
        label="Add Reminder"
        className="primary-button"
        onClick={handleSubmit}
      />
      <Button
        label="Cancel"
        className="bordered-button"
        onClick={props.onCancel}
      />
    </div>
  </div>
);

export default reduxForm({ 
  form: 'addReminderfrom',
  // validate,
})(AddReminderForm);