/* Input text */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import Input from 'react-toolbox/lib/input/Input';

import theme from './theme.scss';

/*
 * Can have three objects
 * wrapper: { className }
 * label: { className, htmlFor, name }
 * meta will be present automatically based on form element
 */
const InputText = ({ error, wrapperClass, input, meta, ...props }) => {
  const errorMessage = (!meta.pristine && (meta.error || error)) ? (meta.error || error) : undefined;
  return (
    <Input
      type="text"
      {...input}
      {...props}
      theme={theme}
      error={!isEmpty(errorMessage) ? errorMessage : undefined}
    />
  )
}

InputText.propTypes = {
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }).isRequired,
  name: PropTypes.string.isRequired,
  input: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.shape({
    className: PropTypes.string,
    name: PropTypes.string,
  }),
  error: PropTypes.shape({
    className: PropTypes.string,
  }),
  wrapperClass: PropTypes.string,
};

InputText.defaultProps = {
  label: {},
  error: {},
  wrapperClass: '',
  input: {},
};

export default InputText;
