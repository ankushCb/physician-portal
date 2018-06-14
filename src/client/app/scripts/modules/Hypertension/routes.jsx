/*
 * Routes for hypertension module
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Overview from './Overview/index.js';
import Settings from './Settings/index.js';

import RemindersEdit from './Reminders/Edit/index.js';
import RemindersView from './Reminders/View/index.js';

const HypertensionRoutes = (
  <Route>
    <Route path="hypertension" component={Overview} />
    <Route path="hypertension_settings" component={Settings} />
    <Route path="reminders" component={RemindersView} />
    <Route path="reminders_edit" component={RemindersEdit} />
  </Route>
);

export default HypertensionRoutes;
