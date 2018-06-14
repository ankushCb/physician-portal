import React from 'react';
import Switch from 'react-toolbox/lib/switch';
import PropTypes from 'prop-types';
import theme from './theme.scss';

const InputSwitch = ({ input, label, name, ...props }) => {
  return (
    <Switch
      checked={input.value}
      label={label}
      theme={theme}
      onChange={input.onChange}
      {...props}
    />
  );
};

InputSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  input: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.shape({
    className: PropTypes.string,
    name: PropTypes.string,
  }),
};

InputSwitch.defaultProps = {
  input: {},
  label: {},
};

export default InputSwitch;
