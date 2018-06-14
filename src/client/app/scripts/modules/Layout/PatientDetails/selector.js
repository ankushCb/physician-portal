import { createSelector } from 'reselect';
import moment from 'moment';
import { Iterable } from 'immutable';

import isEmpty from 'lodash/isEmpty';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

export const getSettings = state => (state.get('settings'));

// root.settings.patientDetails
export const getPatientReducer = state => state.getIn(['apiData', 'patientCommonData', 'patientData']);

// root.settings.patientDetails.patientData
export const getUserData = createSelector([getPatientReducer], (patientData) => {
  // const patientData = reducer.getIn(['apiData', 'patientCommonData', 'patientData']);
  if (Iterable.isIterable(patientData) && !patientData.isEmpty()) {
    const {
      user: { firstName, lastName, state, email },
      diabetesSettings: {
        dosedr,
        primaryPractitioner: {
          user: { firstName: pcpFirstName, lastName: pcpLastName },
        },
      },
      locations,
    } = patientData.toJS();
    const { gender, birthdate, mobileTelecom } = patientData.toJS();
    return deepCamelCase(
      {
        name: `${firstName} ${lastName}`, // eslint-disable-line camelcase
        pcp: `${pcpFirstName} ${pcpLastName}`,
        age: moment().diff(moment(birthdate), 'years'),
        state,
        email,
        gender,
        birthdate,
        mobileTelecom,
        dosedr,
        clinic: (locations && locations[0]) ? locations[0].name : '-',
      },
    );
  }
  return {};
});

// fetching
const getFetchInitiated = state => (state.getIn(['settings', 'patientDetails', 'patientDetailFetchInitiated']));

const getFetchSuccess = state => (state.getIn(['settings', 'patientDetails', 'patientDetailFetchSuccess']));

export const getFetchingStatus = createSelector([getFetchInitiated, getFetchSuccess], (fetchInitiated, fetchSuccess) => (fetchInitiated || !fetchSuccess));

export const getFetchStatus = state => {
  return {
    patientStatus: {
      isFetching: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'patientRelatedData', 'isFetched']),
    },
    navbarStatus: {
      isFetching: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'patientRelatedRelatedData', 'isFetching'])
        || state.getIn(['fetchStatus', 'hyperTensionData', 'isFetching']),
    }
  };
};
