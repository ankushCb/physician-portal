import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  personalInformationPostActionCreator,
  dailySchedulePostActionCreator,
  reinitializeData,
  checkEmail,
  checkPhone,
  updateCareRow,
  submitCareData,
} from '../../actionCreators/index.js';

import {
  onBoardingSuccessData,
  getFetchStatus,
  getClinicData,
  getClinicDoctorRelation,
  currentPractitionerId,
  getValidations,
} from '../../selectors/index.js';

import NewPatient from './presentational';

const mapStateToProps = state => ({
  fetchStatus: getFetchStatus(state), // This is infact post status but maintaining the name for consistency
  newUserData: onBoardingSuccessData(state),
  clinicData: getClinicData(state),
  clinicDoctorData: getClinicDoctorRelation(state),
  currentPractitionerId: currentPractitionerId(state),
  careFormValidation: getValidations(state),
});

const dispatchActionToProps = dispatch => ({
  postPersonalInformation: bindActionCreators(personalInformationPostActionCreator, dispatch),
  postDailySchedule: bindActionCreators(dailySchedulePostActionCreator, dispatch),
  reinitializeData: bindActionCreators(reinitializeData, dispatch),
  checkEmail: bindActionCreators(checkEmail, dispatch),
  checkPhone: bindActionCreators(checkPhone, dispatch),
  updateCareRow: bindActionCreators(updateCareRow, dispatch),
  submitCareData: bindActionCreators(submitCareData, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(NewPatient);
