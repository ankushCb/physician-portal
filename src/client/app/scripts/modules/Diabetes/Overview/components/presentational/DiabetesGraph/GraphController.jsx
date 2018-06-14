import React from 'react';

import isEqual from 'lodash/isEqual';

import diabetesOverviewGraph from "../../../../../Common/Graphs/diabetesOverviewGraph/index.js";

class GraphController extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

    this.hypo = 70;
    this.hyper = 200;
  }
  componentWillReceiveProps(nextProps) {
    if ((this.props.fetchStatus.isFetching && nextProps.fetchStatus.isFetched) || this.props.active !== nextProps.active) {
      const graphData = nextProps.active === 'Week' ? nextProps.graphData.slice(0,7) : nextProps.graphData;
      const {
        diabetesSettings: {
          hyperglycemiaTitrationThresholdSmall: hypo,
          hyperglycemiaTitrationThresholdLarge: hyper,
          hyperglycemiaThresholdEmergency: extreme,
        }
      } = this.props;
      if (this.graphInstance) {
        this.graphInstance.removeAllPlot();
      }
      this.graphInstance = new diabetesOverviewGraph(this.refs.diabetesGraph);
      this.graphInstance.plot(graphData, nextProps.active, hypo, hyper, extreme);
    }
  }

  render() {
    return (
      <div
        ref="diabetesGraph"
      />
    )
  }
}

export default GraphController;
