import React from 'react';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker.js';
import PropTypes from 'prop-types';
import moment from 'moment';
import theme from './theme.scss';

const InputDatePicker = ({ input, name, ...props }) => {
  return (
    <DatePicker
      {...props}
      theme={theme}
      value={input.value}
      inputFormat={value => moment(value).format('M/D/YYYY')}
      onChange={input.onChange}
    />
  );
};

InputDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  input: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.shape({
    className: PropTypes.string,
    name: PropTypes.string,
  }),
};

InputDatePicker.defaultProps = {
  input: {},
  label: {},
};

export default InputDatePicker;
