/*
 * Creates a store with root Reducer( extracted from combine reducer)
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'scripts/root/rootSaga.js';
import rootReducer from 'scripts/root/rootReducer.js';
import { Map } from 'immutable';

// Logger for redux actions and actioncreators on console
const reduxLogger = createLogger({
  stateTransformer: state => JSON.parse(JSON.stringify(state)),
});
// sagamiddleware to include in the store
const sagaMiddleware = createSagaMiddleware();

/*
 * Single store for the entire app
 * Middleware chain thunk -> reduxLoggers.
 */

const middlewares = [
  sagaMiddleware,
  thunk,
];

if (process.env.NODE_ENV === 'local') {
  middlewares.push(reduxLogger);
}

const store = createStore(rootReducer, Map(), applyMiddleware(...middlewares));

// start running saga, to watch all actions
sagaMiddleware.run(rootSaga);

export default store;
