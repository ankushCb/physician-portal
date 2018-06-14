/*
 * Define routes for the project.
 */
import React from 'react';
import { Router, Route, useRouterHistory, IndexRoute } from 'react-router';
import { createHistory, useBasename } from 'history';

/* layout modules */
import LayoutWithHeader from './modules/layout/LayoutWithHeader.jsx';
import LayoutWithPatientDetails from './modules/Layout/LayoutWithPatientDetails.jsx';
import LayoutWithPractitionerDetails from './modules/Layout/LayoutWithPractitionerDetails.jsx';

/* Patient list */
import PatientListRoutes from './modules/PatientList/routes.jsx';

/* Diabetes Routes */
import DiabetesRoutes from './modules/Diabetes/routes.jsx';

/* hypertension module */
import HypertensionRoutes from './modules/Hypertension/routes.jsx';

// /* Mealtime routes */
import MealtimeRoutes from './modules/Mealtimes/Routes';

/* Check User Scope */
import CheckUserScope from './modules/CheckUserScope/index.js';

/* errors */
import ErrorContainer from './modules/Common/Presentational/Errors/ErrorContainer.jsx';


/* settings up base url for react router */
const browserHistory = useRouterHistory(createHistory)({
  // basename: process.env.NODE_ENV !== 'local' && '/portal/physician-portal',
});
const PageNotFoundContainer = () => (
  <ErrorContainer
    errorMessage={'page-not-found'}
  />
);

const Routes = () => (
  <Router history={useBasename(() => browserHistory)({ basename: '/physician' })}>
    <Route path="/" component={CheckUserScope}>
      <Route component={LayoutWithHeader}>
        {/* routes having practioner details in header */}
        <Route component={LayoutWithPractitionerDetails}>
          {PatientListRoutes}
          {/*OnBoardingModuleRoutes*/}
        </Route>

        {/* routes having patient details in header */}
        <Route path="patients/:patientId" component={LayoutWithPatientDetails}>
          <IndexRoute component={PageNotFoundContainer} />
            {DiabetesRoutes}
            {HypertensionRoutes}
            {MealtimeRoutes}
          <Route path="*" component={PageNotFoundContainer} />
        </Route>
      </Route>
    </Route>
    {/* 404 */}
    <Route path="*" component={PageNotFoundContainer} />
  </Router>
);

export default Routes;
