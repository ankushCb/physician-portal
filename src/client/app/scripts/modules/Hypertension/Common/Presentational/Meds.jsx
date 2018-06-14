import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import map from 'lodash/map';
import range from 'lodash/range';

import styles from './styles.scss';

const Meds = ({ doseTaken, totalDose }) => (
  <div className={styles.meds}>
    {map(range(totalDose), (dose, index) => <span className={classNames('med', { active: index < doseTaken })} />)}
  </div>
);

Meds.propTypes = {
  doseTaken: PropTypes.number,
  totalDose: PropTypes.number,
};

Meds.defaultProps = {
  doseTaken: 0,
  totalDose: 5,
};

export default Meds;
