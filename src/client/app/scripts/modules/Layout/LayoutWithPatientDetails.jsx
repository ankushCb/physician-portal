import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import last from 'lodash/last';

import LayoutWrapper from './LayoutWrapper.jsx';
import PatientDetails from './PatientDetails/index.jsx';

import NavigationBar from './NavigationBars/PatientScreensNavigationBar.jsx';

import {
  addHyperTensionSettings,
} from './actions.jsx';

// Layout
const LayoutWithPatientDetails = ({ routeParams, routes, ...props }) => (
  <div>
    <PatientDetails patientId={routeParams.patientId} />
    <NavigationBar
      patientId={routeParams.patientId}
      currentRoute={last(routes).path}
      isHavingHypertension={props.isHavingHypertension}
      onAddHyperTension={props.addHyperTensionSettings}
      isFetching={props.isFetching}
    />
    <LayoutWrapper>
      {props.children}
    </LayoutWrapper>
  </div>
);

LayoutWithPatientDetails.propTypes = {
  children: PropTypes.node.isRequired,
  routeParams: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  isHavingHypertension: state.getIn(['apiData', 'patientCommonData', 'isHavingHypertension']),
  isFetching: state.getIn(['fetchStatus', 'physicianRelatedData', 'isFetching'])
    || state.getIn(['fetchStatus', 'patientRelatedRelatedData', 'isFetching'])
});

const dispatchActionToProps = dispatch => ({
  addHyperTensionSettings: bindActionCreators(addHyperTensionSettings, dispatch),
});

export default connect(mapStateToProps, dispatchActionToProps)(LayoutWithPatientDetails);
