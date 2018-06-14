import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const practitionerDetailFetchActionCreator = () => ({
  type: 'PRACTITIONER_DETAIL_FETCH_REQUEST',
});

import {
  getPractitionerDetails,
  getFetchingData,
} from './selectors/index.js';

import HeaderDisplay from './components/HeaderDisplay.jsx';

const mapStateToProps = state => ({
  practitionerDetails: getPractitionerDetails(state),
  fetchingData: getFetchingData(state),
  redirectData: state.getIn(['redirectStatus']).toJS(),
});

const dispatchActionToProps = dispatch => ({
  fetchPractitionerDetails: bindActionCreators(practitionerDetailFetchActionCreator, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(HeaderDisplay);
