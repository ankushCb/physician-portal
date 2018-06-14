import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ValidInputIcon, WarningIcon } from '../../../Icon/index.jsx';

import styles from './styles.scss';

const InputText = ({ wrapperClass, input, meta, ...props }) => {
  if (props.displayOnly) {
    return (
      <div className={styles['display-only']}>
        {input.value}
      </div>
    )
  }
  return (
    <div
      className={classNames(
        styles['input-text'],
        wrapperClass,
      )}
    >
      {props.label ? <div><label htmlFor={input.name}>{props.label}</label></div> : null}
      <input
        type="text"
        id={input.name}
        {...input}
        {...props}
      />
    </div>
  );
};

InputText.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    touched: PropTypes.bool.isRequired,
  }).isRequired,
  wrapperClass: PropTypes.string,
  label: PropTypes.string,
  working: PropTypes.bool,
  warningFromOut: PropTypes.bool,
};

InputText.defaultProps = {
  wrapperClass: '',
  label: '',
  working: false,
  warningFromOut: false,
};

export default InputText;
