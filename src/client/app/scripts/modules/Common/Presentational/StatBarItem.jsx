import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const StatBarItem = ({ highlight, boldNote, note }) => (
  <div className={styles['stats-bar-item']}>
    <span><div className="round">{highlight}</div></span>
    {boldNote && <div className="note"><strong>{boldNote}</strong></div>}
    {note && <div className="note">{note}</div>}
  </div>
);

StatBarItem.propTypes = {
  highlight: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  boldNote: PropTypes.string,
  note: PropTypes.string,
};

StatBarItem.defaultProps = {
  boldNote: '',
  note: '',
};

export default StatBarItem;
