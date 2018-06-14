import React from 'react';

import styles from './styles.scss';

const ColoredBg = ({ value, type }) => {
  switch (type) {
    case 'lt-hypo':
      return (
        <span className="lt-hypo-bg">
          {value}
        </span>
      );
    case 'gt-goal':
      return (
        <span className="gt-goal-bg">
          {value}
        </span>
      );
    case 'gt-hyper':
      return (
        <span className="gt-hyper-bg">
          {value}
        </span>
      );
    default:
      return (
        <span className="normal-bg">
          {value}
        </span>
      );
  }
};

export default ColoredBg;
