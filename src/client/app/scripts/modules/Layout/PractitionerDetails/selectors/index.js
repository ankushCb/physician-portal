import { createSelector } from 'reselect';

import { Iterable, Map } from 'immutable';

export const getPractitionerObject = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerData']);

export const getPractitionerDetails = createSelector([getPractitionerObject], (object) => {
  if (Iterable.isIterable(object)) {
    return {
      firstName: object.getIn(['user', 'firstName']),
      lastName: object.getIn(['user', 'lastName']),
      email: object.getIn(['user', 'email']),
      phone: object.get('officeTelecom'),
      clinic: object.get('clinic'),
    };
  }
  return Map();
});

// fetching
const getFetchInitiated = state => state.getIn(['practitionerDetails', 'fetchInitiated']);

const getFetchSuccess = state => state.getIn(['practitionerDetails', 'fetchSuccess']);

export const getFetchingData = createSelector([getFetchInitiated, getFetchSuccess], (fetchInitiated, fetchSuccess) => fetchInitiated || !fetchSuccess);

export const getFetchStatus = state => {
  return {
    practitionerStatus: {
      isFetching: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
  };
};
