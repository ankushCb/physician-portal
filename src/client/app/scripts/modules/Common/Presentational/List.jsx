import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import styles from './styles.scss';

const renderNoItemMessage = noItemMessage => (
  <div className="no-items">{noItemMessage}</div>
);

const List = ({ itemList, children, ...props }) => (
  <div className={`${styles.list} ${props.showBorder ? 'withBorder' : ''}`}>
    {isEmpty(itemList) ? renderNoItemMessage(props.noItemMessage) : children}
  </div>
);

List.propTypes = {
  itemList: PropTypes.any,
  children: PropTypes.node,
  noItemMessage: PropTypes.string,
};

List.defaultProps = {
  itemList: [],
  children: null,
  noItemMessage: 'No Items Found',
};

export default List;
