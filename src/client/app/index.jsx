/**
 * Index page of the app.
 * Routes handles the app's routing.
 */
/* global Raven */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import store from 'scripts/store/index.jsx';
import Routes from 'scripts/routes.jsx';
import theme from '../../toolbox/theme.js';
/*
 * Setting up raven js (only for production)
 */
if (process.env.NODE_ENV === 'production') {
  Raven
  .config('https://a948b4710af149d8bdc793eb6bf1bd05@sentry.io/289189', {
    release: '1.5',
  })
  .install();
}

/*
 * Import the styles
 */
require('styles/rootStyle.scss');

/*
 * Renders the app with the target containers
 */
render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app'));
