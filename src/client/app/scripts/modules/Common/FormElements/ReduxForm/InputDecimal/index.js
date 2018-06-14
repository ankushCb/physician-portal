import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import isNaN from 'lodash/isNaN';

import styles from './styles.scss';

var isNumber = (value) => /^\d+\.\d+$/.test(value) || /^\d+$/.test(value);

const getNumeric = (value) => {
  const numeric = Number(value);

  return isNaN(numeric) ? 0 : numeric;
};

const SimpleInputNumber = ({ input, min, max, ...props }) => {
  const handleOnBlur = () => {
    console.log('isNumber ', input.value, isNumber(input.value));
    const value = isNumber(input.value) ? value : 0;
    const valueNumeric = Number(value);
    if (valueNumeric > max) {
      input.onChange(max.toString());
    } else if (valueNumeric < min) {
      input.onChange(min.toString());
    } else {
      input.onChange(value != '' ? value : min.toString());
    }
  }
  const handleChange = (event) => {
    const value = event.currentTarget.value;
    input.onChange(value);
  };

  const handleKeyUp = (e) => {
    
    const value = getNumeric(e.currentTarget.value);
    
    switch (e.keyCode) {
      case 38:

        if (value + 1 <= max) {
          input.onChange((value + 1).toString());
        }
        break;
      case 40:
        if (value - 1 >= min) {
          input.onChange((value - 1).toString());
        }
        break;
      default:
        break;
    }
  };

  if (props.displayOnly) {
    return (
      <div className={styles['display-only']}>
        {input.value}
      </div>
    )
  }
  return (
    <input
      {...input}
      {...props}
      type="text"
      className={cx(styles['simple-input-decimal'], props.inputClass)}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      onBlur={handleOnBlur}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="off"
    />
  );
};

SimpleInputNumber.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
};

SimpleInputNumber.defaultProps = {
  min: 0,
  max: 100000000000000,
};

export default SimpleInputNumber;
