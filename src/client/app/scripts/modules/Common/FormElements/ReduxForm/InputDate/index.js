import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

import map from 'lodash/map';
import range from 'lodash/range';
import slice from 'lodash/slice';
import indexOf from 'lodash/indexOf';
import reverse from 'lodash/reverse';
import concat from 'lodash/concat';

import { ValidInputIcon } from '../../../Icon/index.jsx';

import styles from './styles.scss';

const reverseIfTrue = (arr, should) => (should ? reverse(arr) : arr);

const standardDatePattern = 'YYYY-MM-DD';
const dateMatchingPattern = /[1-2][0|9][0-9][0-9]-(0?[1-9]|1[0-2])-(0|1|2|3)?[0-9]/;
const getDateFromString = dateString => (dateMatchingPattern.test(dateString) ? moment(dateString, standardDatePattern) : undefined);
const getDateFromNumbers = (year, month, date) => getDateFromString(`${year}-${month}-${date}`);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getMonthOptions = (start, end) => map(slice(months, start - 1, end), label => ({ label, value: indexOf(months, label) + 1 }));

const dropDownEmptyOption = { label: '-' };
const insertEmptyOptionToDropdown = options => concat([dropDownEmptyOption], options);

const getMaxNoDays = (monthIndex, year) => {
  switch (months[monthIndex - 1]) {
    case 'Jan':
    case 'Mar':
    case 'May':
    case 'Jul':
    case 'Aug':
    case 'Oct':
    case 'Dec':
      return 31;
    case 'Apr':
    case 'Jun':
    case 'Sep':
    case 'Nov':
      return 30;
    case 'Feb':
      return year % 4 === 0 ? 29 : 28;
    default:
      return 0;
  }
};
const getDateOptions = (month, year, min, max) => map(range(min || 1, max + 1 || getMaxNoDays(month, year) + 1), date => ({ value: date, label: date }));

const getYearOptions = (start, end) => map(range(start, end + 1), year => ({ value: year, label: year }));

class InputDate extends React.Component {

  constructor(props) {
    super();
    const defaultDate = getDateFromString(props.input.value);
    let dateInState = {
      date: null,
      month: null,
      year: null,
    };

    if (defaultDate) {
      dateInState = {
        date: defaultDate.year(),
        month: defaultDate.month() + 1,
        year: defaultDate.year(),
      };
    }

    this.state = { ...dateInState };
  }
  componentDidMount() {
    console.log('mounting component');
  }
  handleChange(element) {
    return (event) => {
      this.setState({ [element]: Number(event.target.value) }, () => {
        const onChange = this.props.input.onChange;
        const { date, month, year } = this.state;
        const fullDate = getDateFromNumbers(year, month, date);
        onChange(fullDate ? fullDate.format(standardDatePattern) : null);
      });
    };
  }

  renderDropDown(options, properties) { // eslint-disable-line class-methods-use-this
    return (
      <select {...properties} className={classNames(styles.dropdown, this.props.className)}>
        {map(insertEmptyOptionToDropdown(options), ({ value, label }, index) => <option key={index} value={value}>{label}</option>)}
      </select>
    );
  }

  render() {
    const {
      label,
      labelClass,
      wrapperClass,
      hideValidIcon,
      meta: { valid },
    } = this.props;

    const yearProps = {
      onChange: this.handleChange('year'),
    };

    const monthProps = {
      onChange: this.handleChange('month'),
    };

    const dateProps = {
      onChange: this.handleChange('date'),
    };

    const maxDate = getDateFromString(this.props.maxDate);
    const minDate = getDateFromString(this.props.minDate);

    const minYear = minDate.year();
    const minMonth = minDate.month() + 1;
    const minDay = minDate.date();

    const maxYear = maxDate.year();
    const maxMonth = maxDate.month() + 1;
    const maxDay = maxDate.date();

    const currentYear = this.state.year;
    const currentMonth = this.state.month;
    const getMonthExtreme = (compared, trueValue, falseValue) => (currentYear === compared ? trueValue : falseValue);
    const getDateExtreme = (yrCmp, mnthCmp, trueValue) => (currentYear === yrCmp && currentMonth === mnthCmp ? trueValue : undefined);
    return (
      <div
        className={classNames(
          wrapperClass,
          'clearfix',
          styles['input-date'],
          styles['redux-input'],
          { valid },
        )}
      >
        {label && <div className={labelClass}>{label}</div>}
        <div className="dropdowns">
          {this.renderDropDown(getMonthOptions(getMonthExtreme(minYear, minMonth, 1), getMonthExtreme(maxYear, maxMonth, 12)), { ...monthProps })}
          {this.renderDropDown(getDateOptions(currentMonth, currentYear, getDateExtreme(minYear, minMonth, minDay), getDateExtreme(maxYear, maxMonth, maxDay)), { ...dateProps })}
          {this.renderDropDown(reverseIfTrue(getYearOptions(minYear, maxYear), this.props.descending), { ...yearProps })}
        </div>
        {valid && !hideValidIcon && <span className="valid-icon"><ValidInputIcon /></span>}
      </div>
    );
  }
}

InputDate.propTypes = {
  meta: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
  }).isRequired,
  input: PropTypes.shape({
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  wrapperClass: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  descending: PropTypes.bool,
};

InputDate.defaultProps = {
  maxDate: moment().format(standardDatePattern),
  minDate: '1901-01-01',
  wrapperClass: '',
  label: '',
  labelClass: '',
  descending: false,
};

export default InputDate;