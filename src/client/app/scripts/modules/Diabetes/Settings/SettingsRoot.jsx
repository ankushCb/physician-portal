import React from 'react';
import PropTypes from 'prop-types';
import SettingsContainer from './components/container/SettingsContainer.jsx';

import './styles/index.scss';

const SettingsRoot = props => (
  <div>
    {props.children}
    <SettingsContainer
      {...props}
    />
  </div>
);

SettingsRoot.propTypes = {
  children: PropTypes.node,
};

SettingsRoot.defaultProps = {
  children: null,
};

export default SettingsRoot;
