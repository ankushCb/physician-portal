import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

const Button = ({ 
  wrapperClassName,
  label,
  labelClassName,
  isWorking,
  disabled,
  type,
  wrapperStyle,
  ...props,
}) => {
  return (
    <div
      className={classNames(styles.button, styles[wrapperClassName])}
      style={wrapperStyle}
    >
      <button
        {...props}
        disabled={isWorking || disabled}
        type={type}
      >
        <span className={classNames('button-label', labelClassName)}>
          {label}
        </span>
      </button>
    </div>
  );
}

Button.propTypes = {
  wrapperClassName: PropTypes.string, // className (string) applied for button wrapper element
  label: PropTypes.string.isRequired, // Text to be displayed as button label
  labelClassName: PropTypes.string, // className applied for label wrapper element
  isWorking: PropTypes.bool, // Bool to indicate action is under progress after button is clicked
  disabled: PropTypes.bool,
  /* Button Type */
  type: PropTypes.oneOf([
    'button',
    'submit',
  ]),
};

Button.defaultProps = {
  wrapperClassName: '',
  onClick: () => { },
  isWorking: false,
  disabled: false,
  type: 'button',
  labelClassName: '',
};

export default Button;
