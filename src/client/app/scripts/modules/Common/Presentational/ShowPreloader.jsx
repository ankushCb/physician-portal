import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const renderPreloader = wrapperClass => (
  <div className={classNames('pre-loader', wrapperClass)}>
    <ProgressBar type="circular" mode="indeterminate" />
  </div>
);

const ShowPreloader = ({ show, children, ...props }) => (
  <div className={styles['show-preloader']}>
    {show ? renderPreloader(props.wrapperClass) : children}
  </div>
);

ShowPreloader.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
  wrapperClass: PropTypes.string,
};

ShowPreloader.defaultProps = {
  show: false,
  children: null,
  wrapperClass: '',
};

export default ShowPreloader;
