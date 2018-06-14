import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form/immutable';

import toJS from 'scripts/modules/Common/Presentational/toJS.js';

import {
  personalInformationPostActionCreator,
  dailySchedulePostActionCreator,
  patientListFetchActionCreator,
  practitionerBgReadingsFetchActionCreator,
  practitionerInitialFetchActionCreator,
} from '../../actionCreators/index.js';

import {
  getPatientListData,
  getBgReadingIdMap,
  getFetchinStatus,
  getFetchStatus,
} from '../../selectors';

import PatientListDisplay from './presentational/PatientListDisplay';

const mapStateToProps = (state) => {
  return {
    patientListData: getPatientListData(state),
    bgDateMap: getBgReadingIdMap(state),
    fetchStatus: getFetchStatus(state),
    fetching: getFetchinStatus(state),
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    patientListFetch: bindActionCreators(patientListFetchActionCreator, dispatch),
    bgReadingsFetch: bindActionCreators(practitionerBgReadingsFetchActionCreator, dispatch),
    personalInformationPostActionCreator: bindActionCreators(personalInformationPostActionCreator, dispatch),
    dailySchedulePostActionCreator: bindActionCreators(dailySchedulePostActionCreator, dispatch),
    practitionerInitialFetch: bindActionCreators(practitionerInitialFetchActionCreator, dispatch),
    clearOnboardingForm: () => {
      dispatch(destroy('patientOnboardingForm'));
    },
  };
};

export default connect(mapStateToProps, dispatchActionToProps)(toJS(PatientListDisplay));
