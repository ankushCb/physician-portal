import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import request from 'axios';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import {
  baseUrl,
  practitionerApi,
  insulinApi,
  premadeRegimenApi,
  hyperTension,
  getClinics,
  getAllPractitioners,
} from 'scripts/helpers/api.js';

import { timeoutDuration } from 'scripts/helpers/appConfig.js';
import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

const getConfigForGet = (url, headers) => ({
  method: 'get',
  timeout: timeoutDuration,
  url,
  headers,
});

const practitionerCachedIdSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'practitionerId']);
const practitionerCachedDetailsSelector = state => state.getIn(['apiData', 'practitionerCommonData', 'currentPractitionerDetails']);
const currentInsulinRegimen = state => state.getIn(['apiData', 'physicianData', 'patientCommonData', 'diabetesSettingsData', 'insulinRegimen']);

function* practitionerDetailsFetch(action) {
  const cachedPractitionerId = yield select(practitionerCachedIdSelector);
  if (!cachedPractitionerId || (action.payload && action.payload.forced)) {
    try {
      const headers = {
        Authorization: localStorage.getItem('token'),
      };

      const allPractitioners = yield call(request, getConfigForGet(getAllPractitioners(), headers));
      const clinicData = yield call(request, getConfigForGet(getClinics(), headers));
      let processedPractitioner;
      let processedClinicData;
      // If it returns empty map to current practitioner
      if (allPractitioners.data.count === 0) {
        // Assign only one doctor
        let currentPractitionerDetails = yield select(practitionerCachedDetailsSelector);
        currentPractitionerDetails = currentPractitionerDetails.toJS();
        processedPractitioner = {
          [currentPractitionerDetails.practitioner]: {
            ...currentPractitionerDetails,
            url: currentPractitionerDetails.practitioner,
          }
        }

        // assign only one clinic

        processedClinicData = reduce(
          deepCamelCase(
            clinicData
              .data
              .results,
          ), (accumulator, data) => {
          const obj = {};

          const index = findIndex(data.practitioners, (practitionerUrl) => {
            return practitionerUrl === currentPractitionerDetails.practitioner;
          });
          if (index !== -1) {
            accumulator.url = data.url;
            accumulator.name = data.name;
          }
          return accumulator;
        }, {});

        processedClinicData.url = processedClinicData.url || `https://api.dosedr.com/api/locations/122c9232-68c7-407e-9305-e847fb419441/`;
        processedClinicData.name = processedClinicData.name || `Diabetes Care Center of Ruston`;
        processedClinicData.practitioners = [currentPractitionerDetails];
        processedClinicData = [processedClinicData];
      } else {
        processedPractitioner = reduce(
          deepCamelCase(
            allPractitioners
              .data
              .results,
          ), (accumulator, data) => {
          accumulator[data.url] = data.user;
          return accumulator;
        }, {});
        const clinicData = yield call(request, getConfigForGet(getClinics(), headers));
        processedClinicData = reduce(
          deepCamelCase(
            clinicData
              .data
              .results,
          ), (accumulator, data) => {
          const obj = {};
          obj.url = data.url;
          obj.name = data.name;
          obj.practitioners = map(data.practitioners, (practitionerUrl) => {
            let result = processedPractitioner[practitionerUrl];
            if (result) {
              result.url = practitionerUrl;
            }
            return result;
          });
          accumulator.push(obj);
          return accumulator;
        }, []);
        
      }
      const locationData = processedClinicData;

      const { patientList, insulinData, insulinRegimen, medicationData, premadeRegimenData, practitionerData } = yield all({
        patientList: call(request, getConfigForGet(practitionerApi.getPatientList(), headers)),
        insulinData: call(request, getConfigForGet(insulinApi.getInsulins, headers)),
        insulinRegimen: call(request, getConfigForGet(premadeRegimenApi.getPremadeRegimen())),
        medicationData: call(request, getConfigForGet(hyperTension.getMedications(), headers)),
        premadeRegimenData: call(request, getConfigForGet(premadeRegimenApi.getPremadeRegimen(), headers)),
        practitionerData: call(request, getConfigForGet(practitionerApi.getPractitionerId(), headers)),
      });

      yield put({
        type: 'PRACTITIONER_INITIAL_FETCH_REQUEST_SUCCESS',
        payload: {
          patientList: deepCamelCase(patientList.data.results),
          practitionerData: deepCamelCase(practitionerData.data),
          insulinData: deepCamelCase(insulinData.data.results),
          insulinRegimen: deepCamelCase(insulinRegimen.data),
          medicationData: deepCamelCase(medicationData.data.results),
          premadeRegimenData: premadeRegimenData.data,
          practitionerId: practitionerData.data.id,
          locationData,
        },
      });

    } catch (e) {
      if (e.message === 'Request failed with status code 404' || e.message === 'Request failed with status code 403') {
        yield put({
          type: 'IS_NONE'
        });
      } else {
        yield put({
          type: 'PRACTITIONER_INITIAL_FETCH_REQUEST_FAILURE',
        });
        yield put({
          type: 'ERROR_OCCURED',
          payload: {
            errorMessage: e.message || 'Network timed out',
          }
        });
      }
    }
  } else {
    yield put({
      type: 'CACHED_PRACTITIONER_INITIAL_FETCH_REQUEST',
    });
  }
}

function* practitionerDetailsFetchSaga() {
  yield takeEvery('PRACTITIONER_INITIAL_FETCH_REQUEST', practitionerDetailsFetch);
}

export default practitionerDetailsFetchSaga;
