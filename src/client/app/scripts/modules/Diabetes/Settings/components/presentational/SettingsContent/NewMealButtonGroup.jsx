import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../Common/FormElements/Button.js';

const NewMealRadioButtonGroup = props => (
  <div className="new-meal btn-grp clearfix">
    <Button
      value="Add"
      onClick={props.onConfirmAdd}
      className="add-btn btn"
    />
  </div>
);

NewMealRadioButtonGroup.propTypes = {
  onConfirmAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default NewMealRadioButtonGroup;
