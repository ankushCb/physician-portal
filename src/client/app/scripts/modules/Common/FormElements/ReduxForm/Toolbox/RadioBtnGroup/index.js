import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RadioGroup from 'react-toolbox/lib/radio/RadioGroup.js';
import RadioButton from 'react-toolbox/lib/radio/RadioButton.js';

import map from 'lodash/map';

import theme from './theme.scss';

const MultiChoice = ({ label, wrapperClass, input, meta, ...props }) => {
  const { valid, pristine } = meta;

  const handleClick = (value) => {
    console.log('value is ', value);
    input.onChange(value);
  }

  const renderOptions = () => map(props.options, ({ value, label: optionLabel }) => (
    <RadioButton
      label={optionLabel}
      value={value}
      theme={theme}
    />
  ));

  return (
    <RadioGroup
      value={input.value}
      onChange={handleClick}
      theme={theme}
    >
      {renderOptions()}
    </RadioGroup>
  );
};

MultiChoice.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  label: PropTypes.string,
  wrapperClass: PropTypes.string,
};

MultiChoice.defaultProps = {
  options: [],
  wrapperClass: '',
  label: '',
};

export default MultiChoice;
