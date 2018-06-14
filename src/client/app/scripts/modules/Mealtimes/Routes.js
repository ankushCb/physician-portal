import React from 'react';
import { Route } from 'react-router';

import MealTimes from './index.js';

const HypertensionRoutes = (
  <Route>
    <Route path="mealtimes" component={MealTimes} />
  </Route>
);

export default HypertensionRoutes;
