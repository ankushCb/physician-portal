import React from 'react';
import PropTypes from 'prop-types';

import HyperTensionOverviewGraph from '../../../Common/Graphs/hypertensionOverviewGraph/index.js';

class GraphController extends React.Component {
  componentDidMount() {
    const graphData = this.props.active === 'Week' ? this.props.graphData.slice(0, 7) : this.props.graphData;
    if (this.graphInstance) {
      this.graphInstance.removeAllPlot();
    }
    this.graphInstance = new HyperTensionOverviewGraph(this.refs.hypertensionGraph);
    this.graphInstance.plot(graphData, this.props.active, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      const graphData = nextProps.active === 'Week' ? nextProps.graphData.slice(0, 7) : nextProps.graphData;
      if (this.graphInstance) {
        this.graphInstance.removeAllPlot();
      }
      this.graphInstance = new HyperTensionOverviewGraph(this.refs.hypertensionGraph);
      // eslint-disable-next-line
      this.graphInstance.plot(graphData, nextProps.active, nextProps.hypertensionSettings, 0);
    }
  }

  render() {
    return (
      <div
        ref="hypertensionGraph"
        style={{ height: '500px' }}
      />
    );
  }
}

GraphController.propTypes = {
  active: PropTypes.string.isRequired,
  graphData: PropTypes.array,
};

GraphController.defaultProps = {
  active: 'Week',
  graphData: [],
};

export default GraphController;
