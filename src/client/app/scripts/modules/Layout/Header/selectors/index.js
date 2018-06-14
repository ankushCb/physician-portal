import { createSelector } from 'reselect';

export const getPractitionerObject = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerData']);

export const getPractitionerDetails = createSelector([getPractitionerObject], (state) => {
  const user = state.getIn(['user']);
  let name = '';
  if (user) {
    name = `${user.get('firstName')} ${user.get('lastName')}`;
  }
  return { name };
});

export const getFetchingData = createSelector([getPractitionerObject], (state) => {
  const fetchInitiated = state.get('fetchInitiated');
  const fetchSuccess = state.get('fetchSuccess');

  return false;
});
