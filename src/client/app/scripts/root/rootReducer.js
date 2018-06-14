/*
 *  Root Reducer - Include reducers of all modules here
 */
import { combineReducers } from 'redux-immutable';
import { reducer as reduxFormReducer } from 'redux-form/immutable';

import onBoardingReducer from '../modules/patientList/reducers/onBoardingReducer.js';
import derivedDataReducer from '../modules/Common/Reducer/derivedDataReducer/index.js';
import settingsReducers from '../modules/Diabetes/Settings/reducers/index.js';
// /* New reducer structuring */
import apiDataReducer from '../modules/Common/Reducer/apiDataReducer/index.js';
import fetchStatusReducer from '../modules/Common/Reducer/fetchStatusReducer/index.js';
import errorStatusReducer from '../modules/Common/Reducer/errorReducer/index.js';
import redirectReducer from '../modules/Common/Reducer/redirectReducer/index.js';

export default combineReducers({
  form: reduxFormReducer.plugin({
    careMedicationForm: (state, action) => {
      if (action.type === 'redux-form/UNREGISTER_FIELD') {
        return state.deleteIn(['values', action.payload.name])
      }
      return state
    }
  }),
  apiData: apiDataReducer,
  fetchStatus: fetchStatusReducer,
  redirectStatus: redirectReducer,
  errorStatus: errorStatusReducer,
  onBoardingDetails: onBoardingReducer,
  settings: settingsReducers,
  derivedData: derivedDataReducer,
});
