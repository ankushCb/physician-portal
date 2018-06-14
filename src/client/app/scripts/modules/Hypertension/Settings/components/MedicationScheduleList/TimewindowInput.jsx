import React from 'react';
import { shape, arrayOf, string, func } from 'prop-types';
import classNames from 'classnames';

import map from 'lodash/map';
import some from 'lodash/some';

import styles from './styles.scss';

const isTrue = val => val === true;

const timeWindowSlots = [
  { display: 'AM', name: 'breakfast' },
  {},
  { display: 'PM', name: 'bedtime' },
];

const getOpp = val => (val === 0 ? 2 : 0);

const TimewindowInput = ({ input: { onChange, value: list } }) => {
  const handleChange = index => () => {
    let newList = list.set(index, !list.get(index));
    newList = (!some(newList.toArray(), isTrue) ? newList.set(getOpp(index), true) : newList);
    onChange(newList);
  };

    // eslint-disable-next-line react/prop-types
  const renderWindow = ({ name, display }, index) => name && (
    <div
      key={index}
      className={classNames('time-window', { active: list.get(index) }, { psuedo: list.get(0) && list.get(2) })}
      onClick={handleChange(index)}
    >
      {display}
    </div>
  );
  console.log('time window slots ', list);
  return (
    <div className={styles['timewindow-input']}>
      {map(timeWindowSlots, renderWindow)}
    </div>
  );
};

TimewindowInput.propTypes = {
  input: shape({
    onChange: func.isRequired,
    value: arrayOf(string).isRequired,
  }).isRequired,
};

TimewindowInput.defaultProps = {

};

export default TimewindowInput;
