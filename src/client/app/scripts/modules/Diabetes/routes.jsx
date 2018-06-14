/*
 * Routes for single source news module
 */
import React from 'react';
import { Route } from 'react-router';
import RootDiabetesDisplay from './Overview/RootDiabetesDisplay.jsx';
import SettingsRoot from './Settings/SettingsRoot.jsx';
import SettingsRootV2 from './Settingsv2';


const SettingsModuleRoutes = (
  <React.Fragment>
    <Route path="diabetes" component={RootDiabetesDisplay} />
    <Route path="settings" component={SettingsRootV2} />
  </React.Fragment>
);

export default SettingsModuleRoutes;
