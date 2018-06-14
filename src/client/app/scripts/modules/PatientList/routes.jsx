/*
 * Routes for Patient List
 */
import React from 'react';
import { IndexRoute } from 'react-router';
import RootPatientList from './components/PatientListDisplay';

const SettingsModuleRoutes = (
  <IndexRoute component={RootPatientList} />
);

export default SettingsModuleRoutes;
