import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const renderDisplayTime = (time) => {
  if (!time) { return null; }
  const momentTime = moment(time, 'HH:mm:ss');
  return (
    <div className="display-time">
      <div className="time">{momentTime.format('h:mm')}</div>
      <div className="meridian">{(momentTime.format('A'))}</div>
    </div>
  );
};

const TimingsText = ({ timings, wrapperClass }) => (
  <div className={wrapperClass}>
    {renderDisplayTime(timings[0])}
    <div className="separator">-</div>
    {renderDisplayTime(timings[1])}
  </div>
);

TimingsText.propTypes = {
  timings: PropTypes.array,
  wrapperClass: PropTypes.string,
};

TimingsText.defaultProps = {
  timings: [],
  wrapperClass: '',
};

export default TimingsText;
