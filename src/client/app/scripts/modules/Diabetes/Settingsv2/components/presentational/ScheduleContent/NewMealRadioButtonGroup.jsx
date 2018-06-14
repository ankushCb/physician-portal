import React from 'react';
import PropTypes from 'prop-types';
import InputRadioButton from '../../../../common/FormElements/InputRadioButton.js';

const NewMealRadioButtonGroup = props => (
  <div className="new-meal radio-btn-grp">
    <div className="sub-heading">
      Meal Name
    </div>
    <InputRadioButton
      name="mealName"
      radioClass="new-meal-radio-text"
      options={props.mealName}
      onChangeInput={props.onChangeInput}
      value={undefined}
    />
  </div>
);

NewMealRadioButtonGroup.propTypes = {
  mealName: PropTypes.array.isRequired,
  onChangeInput: PropTypes.func.isRequired,
};

export default NewMealRadioButtonGroup;
