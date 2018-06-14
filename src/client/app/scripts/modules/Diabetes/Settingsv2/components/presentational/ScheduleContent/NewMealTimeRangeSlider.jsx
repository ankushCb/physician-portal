import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import map from 'lodash/map';
import toUpper from 'lodash/toUpper';
import range from 'lodash/range';

import styles from './styles.scss';

const isLess = a => b => a < b;
const isGreater = a => b => a > b;
const and = (f, g) => x => f(x) && g(x);
const or = (f, g,) => x => f(x) || g(x);

const either = (a, b, c) => {
  const right = and(isLess(a), isGreater(b));
  const left = or(isLess(a), isGreater(b));
  return a <= b ? right(c) : left(c);
};

class NewMealTimeRangeSlider extends React.Component {
  constructor({ startTime, endTime }) {
    super();
    this.state = {
      startTime,
      endTime,
    };

    this.handleClick = this.handleClick.bind(this);
    this.lastClick = 0;
  }

  componentWillReceiveProps({ startTime, endTime }) {
    this.setState({ startTime, endTime });
  }

  handleClick(hourIn24) {
    return () => {
      this.setState({
        [this.lastClick ? 'endTime' : 'startTime']: hourIn24,
      }, () => {
        this.lastClick = Number(!this.lastClick);
        this.props.onChange({ ...this.state });
      });
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderTimeWindows(...timeWindows) {
    return map(timeWindows, timeWindow => (
      <div className="time-window-cell" key={timeWindow}>{toUpper(timeWindow)}</div>
    ));
  }

  /* eslint-disable no-useless-computed-key */
  renderHours(meridian = 0) {
    const { startTime, endTime } = this.state;
    return map(range(1, 12 + 1), (hour) => {
      const hourIn24 = (hour + (12 * meridian)) % 24;
      return (
        <div
          className={classNames(
            'hour-cell',
            { ['start-time']: startTime === hourIn24 },
            { ['end-time']: endTime === hourIn24 },
            /* needs refactoring  */
            { ['in-range']: either(startTime, endTime, hourIn24) },
          )}
          onClick={this.handleClick(hourIn24)}
          key={hourIn24}
        >
          {hour}
        </div>
      );
    });
  }
  /* eslint-enable */

  render() {
    return (
      <div className={classNames(styles['meal-time-input-select'], this.props.wrapperClass)}>
        <div className="time-window-row">
          {this.renderTimeWindows('night', 'sunrise', 'mid-day')}
        </div>
        <div className="hours-row">
          {this.renderHours()}
        </div>
        <div className="time-window-row">
          {this.renderTimeWindows('afternoon', 'sunset', 'night')}
        </div>
        <div className="hours-row">
          {this.renderHours(1)}
        </div>
      </div>
    );
  }
}

NewMealTimeRangeSlider.propTypes = {
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  onChange: PropTypes.func,
  wrapperClass: PropTypes.string,
};

NewMealTimeRangeSlider.defaultProps = {
  startTime: null,
  endTime: null,
  onChange: () => {},
  wrapperClass: '',
};

export default NewMealTimeRangeSlider;
