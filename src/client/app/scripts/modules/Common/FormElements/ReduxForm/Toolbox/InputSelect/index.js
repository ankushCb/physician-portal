import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropdown from 'react-toolbox/lib/dropdown';

import theme from './theme.scss';

const DropdownTest = ({ options, input, meta, ...props }) => {
  const errorClass = props.inlineError ? 'inline-error' : '';
  return (
    <Dropdown
      source={options}
      auto
      theme={theme}
      {...input}
      {...props}
      onBlur={() => {}} // Necessary to safeguard values in on blur
      error={props.error || (!meta.pristine ? meta.error : undefined)}
    />
  );
};

DropdownTest.propTypes = {
  options: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    pristine: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
};

DropdownTest.defaultProps = {
  meta: {
    error: 'Not valid',
  },
};

export default DropdownTest;
