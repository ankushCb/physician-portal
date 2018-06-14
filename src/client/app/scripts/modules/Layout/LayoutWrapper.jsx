import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles/index.scss';

const LayoutWrapper = props => (
  <div className={styles['layout-wrapper']}>
    {props.children}
  </div>
);

LayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutWrapper;
