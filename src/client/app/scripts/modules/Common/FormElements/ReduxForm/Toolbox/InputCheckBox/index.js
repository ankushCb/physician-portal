import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'react-toolbox/lib/checkbox/Checkbox';

const InputCheckBox = ({ label, input, wrapperClass, ...props }) => {
  return (
    <div className={wrapperClass}>
      <Checkbox
        id={props.name}
        label={label.name}
        {...input}
        {...props}
        checked={input.value}
      />
    </div>
  );
};

InputCheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  input: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.shape({
    className: PropTypes.string,
    name: PropTypes.string,
  }),
  wrapperClass: PropTypes.string,
};

InputCheckBox.defaultProps = {
  input: {},
  label: {},
  wrapperClass: '',
};

export default InputCheckBox;
