import React from 'react';
import PropTypes from 'prop-types';

import GraphController from './GraphController.js';
import GraphCardWithHeader from '../../../Common/Presentational/GraphCardWithHeader.jsx';

const OverviewGraph = props => (
  <GraphCardWithHeader
    header="Hyper Overview"
    wrapperClass="overview-screen-element graph"
    showPreLoader={props.fetchStatus.isFetching}
  >
    <GraphController
      graphData={props.graphData}
      fetchStatus={props.fetchStatus}
      hypertensionSettings={props.hypertensionSettings}
    />
  </GraphCardWithHeader>
);

OverviewGraph.propTypes = {
  graphData: PropTypes.arrayOf(PropTypes.array),
  fetchStatus: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
  hypertensionSettings: PropTypes.object.isRequired,
};

OverviewGraph.defaultProps = {
  graphData: [],
};

export default OverviewGraph;
