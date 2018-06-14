import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  checkUserScope,
} from './actionCreators/index.js';


import toJS from '../Common/Presentational/toJS';
import CheckUserScope from './components/CheckUserScope.jsx';

const mapStateToProps = state => ({
  redirectionStatus: state.get('redirectStatus'),
});

const dispatchActionToProps = dispatch => ({
  checkUserScope: bindActionCreators(checkUserScope, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(toJS(CheckUserScope));
