import { createSelector } from 'reselect';
import { Iterable, List, Map, fromJS } from 'immutable';
import moment from 'moment';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import toUpper from 'lodash/toUpper';

import { baseUrl } from 'scripts/helpers/api.js';
import { frequencies } from '../components/Onboarding/presentational/Care/mockData';
import { getIdFromUrl } from '../../Hypertension/Common/helpers';

export const getBgReadings = state => (state.getIn(['diabetesDisplay', 'practitionerBgReadings', 'bgReadings']));

export const getPatientList = state => (state.getIn(['apiData', 'practitionerCommonData', 'patientList']));

export const getBgReadingIdMap = createSelector([getBgReadings], (patientList) => {
  if (Iterable.isIterable(patientList)) {
    return patientList
      .toSeq()
      .reduce((accumulator, data) => {
        accumulator = accumulator.set(data.get('url'), moment(data.get('logDatetime'), 'YYYY-MM-DD').format('DD/MM/YYYY')); //eslint-disable-line
        return accumulator;
      }, Map())
      .toMap();
  }
  return List();
});

export const getPatientListData = createSelector([getPatientList, getBgReadingIdMap], (patientList, mapping) => {
  if (Iterable.isIterable(patientList)) {
    return patientList
      .toSeq()
      .map((data) => {
        return {
          id: data.get('id'),
          birthdate: moment(data.get('birthdate'), 'YYYY-MM-DD').format('DD/MM/YYYY'),
          firstName: data.getIn(['user', 'firstName']),
          lastName: data.getIn(['user', 'lastName']),
          email: data.getIn(['user', 'email']),
          created: moment(data.get('created'), 'YYYY-MM-DD').format('DD/MM/YYYY'),
          lastSevenDayBgReadingsAverage: data.get('lastSevenDayBgReadingsAverage'),
          clinic: data.getIn(['locations', '0', 'name']),
          average: 6.5,
          lastBgCheck: mapping.get(data.get('lastBgReading')),
        };
      })
      .toList();
  }
  return List();
});

export const getFetchInitiated = state => (state.getIn(['patientList', 'practitionerPatientList', 'fetchInitiated']));

export const getFetchSuccess = state => (state.getIn(['patientList', 'practitionerPatientList', 'fetchSucess']));

const getIdFromPractitionersUrl = (url, base) => {
  const apiUrl = `${base}/api/practitioners/`;
  const resultUrl = url.replace(apiUrl, '');
  return resultUrl.substring(0, resultUrl.length - 1);
};

export const getFetchinStatus = createSelector([getFetchInitiated, getFetchSuccess], (fetchInitiated, fetchSucess) => (fetchInitiated || !fetchSucess));

export const errorData = state => state.getIn(['onBoardingDetails', 'errorData']);

export const onBoardingSuccessData = state => state.getIn(['onBoardingDetails', 'newUserData']);

export const getClinicApiData = state => state.getIn(['apiData', 'practitionerCommonData', 'locationData']);

export const getClinicData = createSelector([getClinicApiData], (apiData) => {
  const result = apiData
    .toSeq()
    .filter((data) => {
      const practitioners = data.get('practitioners');
      const isInvalid = practitioners
        .toSeq()
        .reduce((accumulator, practitioner) => {
          accumulator = accumulator || ((isNull(practitioner) || isUndefined(practitioner))); //eslint-disable-line
          return accumulator;
        }, false);

      // console.log('each data ', practitioners, isInvalid);
      return (!(practitioners.isEmpty() || isInvalid));
    });
  return result
    .map((data) => {
      return {
        label: data.get('name'),
        value: getIdFromUrl(data.get('url'), baseUrl, '/api/locations/'),
      };
    })
    .toJS();
});

export const currentPractitionerId = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);

export const getClinicDoctorRelation = createSelector([getClinicApiData], (clinicData) => {
  if (clinicData && Iterable.isIterable(clinicData)) {
    const result = clinicData
      .toSeq()
      .reduce((accumulator, data) => {
        const practitionerData = data
          .get('practitioners')
          .toSeq()
          .map((pData) => {
            if (pData) {
              return {
                label: `${pData.get('firstName')} ${pData.get('lastName')}`,
                value: getIdFromPractitionersUrl(pData.get('url'), baseUrl),
              };
            }
            return { // eslint disable-line
              label: 'mock',
              value: 'mock',
            };
          })
          .toJS();
        return accumulator.set(getIdFromUrl(data.get('url'), baseUrl), practitionerData);
      }, Map())
      .toJS();
    return result;
  }
  return Map();
});

export const getCareMedicationForm = state => state.getIn(['form', 'careMedicationForm', 'values']);

export const getValidations = createSelector([getCareMedicationForm], (formData) => {
  if (Iterable.isIterable(formData)) {
    const row = formData.get('row');
    const result = row
      .toSeq()
      .map((data, index) => {
        const isValid = data ? (
          !isUndefined(data.get('medicationName'))
          && !isUndefined(data.get('medicationDose'))
          && !isUndefined(data.get('unitName'))
          && !isUndefined(data.get('frequencyName'))
          && !isEmpty(data.get('medicationName'))
          && data.get('medicationDose') !== 0
          && data.get('medicationDose') !== ''
          && !isEmpty(data.get('unitName'))
          && !isEmpty(data.get('frequencyName'))
          && frequencies.includes(toUpper(data.get('frequencyName')))
        ) : false;
        return fromJS({
          index,
          isValid,
        });
      })
      .toList();

    return result;
  }
  return Map();
});

export const getFetchStatus = (state) => {
  return {
    postInitiated: state.getIn(['onBoardingDetails', 'postInitiated']),
    postSuccess: state.getIn(['onBoardingDetails', 'postSuccess']),
    errorData: {
      isError: state.getIn(['onBoardingDetails', 'errorData', 'isError']),
      message: state.getIn(['onBoardingDetails', 'errorData', 'message']),
    },
    checkEmail: {
      initiated: state.getIn(['onBoardingDetails', 'checkEmail', 'initiated']),
      status: state.getIn(['onBoardingDetails', 'checkEmail', 'status']),
    },
    checkPhone: {
      initiated: state.getIn(['onBoardingDetails', 'checkPhone', 'initiated']),
      status: state.getIn(['onBoardingDetails', 'checkPhone', 'status']),
    },
    patientListStatus: {
      isFetching: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching']),
      isFetched: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetched']),
    },
    careStatus: {
      isPosting: state.getIn(['fetchStatus', 'careData', 'isPosting']),
      isPosted: state.getIn(['fetchStatus', 'careData', 'isPosted']),
    },
  };
};
