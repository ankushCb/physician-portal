import React from 'react';
import PropTypes from 'prop-types';

import isNaN from 'lodash/isNaN';

import styles from './styles.scss';

const getNumeric = (value) => {
  const numeric = Number(value);
  return isNaN(numeric) ? 0 : numeric;
};

const SimpleInputNumber = ({ input, min, max, label, disable, ...props }) => {
  const handleOnBlur = () => {
    const value = getNumeric(input.value);
    input.onChange((value < min && min) || (value > max && max) || value);
  };
  const handleChange = (event) => {
    const value = getNumeric(event.currentTarget.value);
    input.onChange(value);
  };
  const handleKeyUp = (e) => {
    const value = getNumeric(e.currentTarget.value);
    switch (e.keyCode) {
      case 38:
        if (value + 1 <= max) {
          input.onChange(value + 1);
        }
        break;
      case 40:
        if (value - 1 >= min) {
          input.onChange(value - 1);
        }
        break;
      default:
        break;
    }
  };

  const field = props.displayOnly ? (
    <div className={styles['display-only']}>
      {input.value}
    </div>
  ) : (
    <input
      {...input}
      {...props}
      type="text"
      className={`${styles['simple-input-number']} ${props.inputClass}`}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      onBlur={handleOnBlur}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="off"
      disabled={disable}
    />
  );

  return (
    <span>
      <label htmlFor={props.name}>{label}</label>
      {field}
    </span>
  );
};

SimpleInputNumber.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  displayOnly: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  inputClass: PropTypes.string,
  disable: PropTypes.bool,
};

SimpleInputNumber.defaultProps = {
  min: 0,
  max: 100000000000000,
  displayOnly: false,
  label: '',
  inputClass: '',
  disable: false,
};

export default SimpleInputNumber;
