import React from 'react';

import GraphController from './GraphController.jsx';
import GraphCardWithHeader from '../../../../../Common/Presentational/GraphCardWithHeader.jsx';

const Graph = props => (
  <GraphCardWithHeader
    header="Diabetes Overview"
    wrapperClass="diabetes-display-item graph"
    showPreLoader={props.showPreLoader}
    forGraph
  >
    <GraphController
      graphData={props.graphData}
      fetchStatus={props.fetchStatus}
      diabetesSettings={props.diabetesSettings}
    />
  </GraphCardWithHeader>
);

export default Graph;