import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import Header from './Header/index.jsx';
import GlobalPreloader from '../Common/Presentational/GlobalPreloader';
import ErrorContainer from '../Common/Presentational/Errors/ErrorContainer.jsx';

const preLoaderMap = {
  diabetes: ['diabetesDisplayData', 'patientRelatedData', 'physicianRelatedData'],
  settings: ['settingsData', 'patientRelatedData', 'physicianRelatedData'],
  hypertension: ['hyperTensionData', 'patientRelatedData', 'physicianRelatedData'],
  hypertension_settings: ['hyperTensionData', 'patientRelatedData', 'physicianRelatedData'],
  patientList: ['', 'patientRelatedData', 'physicianRelatedData'],
  mealtimes: ['', 'patientRelatedData', 'physicianRelatedData'],
  reminders: ['', 'patientRelatedData', 'physicianRelatedData'],
  reminders_edit: ['', 'patientRelatedData', 'physicianRelatedData'],
};

const getPreloaderStatus = (fetchStatus, currentPath) => {
  const [emptyContent, patients, id, currentRoute] = currentPath.split('/');

  let updatedPath;
  if (!currentRoute) {
    updatedPath = 'patientList';
  } else {
    updatedPath = currentRoute;
  }
  const firstFetch = fetchStatus.getIn([preLoaderMap[updatedPath][0], 'isFetching']);
  const secondFetch = fetchStatus.getIn([preLoaderMap[updatedPath][1], 'isFetching']);
  const thirdFetch = fetchStatus.getIn([preLoaderMap[updatedPath][2], 'isFetching']);

  return (firstFetch || secondFetch || thirdFetch);
};
const shouldHideContent = (shouldLoadPreloader) => (
  shouldLoadPreloader ? ({
    visibility: 'hidden',
  }) : ({})
);

class LayoutWithHeader extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidCatch(error, errorInfo) {
    console.log('error', error, JSON.stringify(error));
    console.log(errorInfo);
    this.props.pushToGlobalError(error.message);
  }

  render() {
    const shouldLoadPreloader = getPreloaderStatus(
      this.props.fetchStatus,
      this.props.location.pathname
    );
    const {
      errorStatus,
      ...props
    } = this.props;
    if (props.location.hash) {
      props.router.push(props.location.hash.substring(2))
    }

    return (
      <div>
        {
          errorStatus.isError ? <ErrorContainer errorMessage={errorStatus.errorMessage} /> : (
            <React.Fragment>
              {shouldLoadPreloader ? <GlobalPreloader /> : null}
              <div className="layout-with-header" style={shouldHideContent(shouldLoadPreloader)}>
                <Header />
                {props.children}
              </div>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

LayoutWithHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  errorStatus: state.getIn(['errorStatus']).toObject(),
  fetchStatus: state.getIn(['fetchStatus'])
});

const dispatchActionToProps = (dispatch) => ({
  pushToGlobalError: bindActionCreators((errorMessage) => ({
    type: 'ERROR_OCCURED',
    payload: {
      errorMessage: JSON.stringify(errorMessage),
    }
  }), dispatch)
})
export default connect(mapStateToProps, dispatchActionToProps)(LayoutWithHeader);
