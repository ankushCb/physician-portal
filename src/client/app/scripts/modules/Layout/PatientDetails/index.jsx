import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getUserData,
  getFetchingStatus,
  getFetchStatus,
} from './selector.js';

import {
  patientDetailFetchActionCreator,
} from './actionCreator.js';

import PatientDetailsView from './components/PatientDetailsView.jsx';

const mapStateToProps = (state) => {
  return {
    patientData: getUserData(state),
    fetching: getFetchingStatus(state),
    fetchStatus: getFetchStatus(state),
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    fetchPatientDetails: bindActionCreators(patientDetailFetchActionCreator, dispatch),
  };
};

export default connect(mapStateToProps, dispatchActionToProps)(PatientDetailsView);
