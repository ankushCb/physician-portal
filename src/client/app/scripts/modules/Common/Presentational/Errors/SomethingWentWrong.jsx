import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles/index.scss';

const SomethingWentWrong = ({ errorMessage }) => (
  <div className={styles['something-went-wrong']}>
    {errorMessage || 'Something went wrong'}. Please Refresh!
  </div>
);

SomethingWentWrong.propTypes = {
  errorMessage: PropTypes.string,
};

SomethingWentWrong.defaultProps = {
  errorMessage: '',
};

export default SomethingWentWrong;
