import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getPractitionerDetails,
  getFetchingData,
  getFetchStatus,
} from '../selectors/index.js';

import PractitionerDetailsView from './PractitionerDetailsView.jsx';

const practitionerDetailFetchActionCreator = () => ({
  type: 'PRACTITIONER_DETAIL_FETCH_REQUEST',
});

const mapStateToProps = (state) => {
  return {
    practitionerDetails: getPractitionerDetails(state),
    fetching: getFetchingData(state),
    fetchStatus: getFetchStatus(state),
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    fetchPractitionerDetails: bindActionCreators(practitionerDetailFetchActionCreator, dispatch),
  };
};

export default connect(mapStateToProps, dispatchActionToProps)(PractitionerDetailsView);
