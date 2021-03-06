import React from 'react';

import { reduce } from 'lodash';

import { Iterable } from 'immutable';

const ToJS = (WrappedComponent) => {
  return class ImmutableWrapper extends React.Component {

    constructor(props) {
      super(props);

      this.updateNewProps = this.updateNewProps.bind(this);
      this.newProps = this.updateNewProps(this.props);
    }

    updateNewProps(currentProps) { // eslint-disable-line
      const objecEntries = Object.entries(currentProps);
      return reduce(objecEntries, (newProps, entry) => {
        newProps[entry[0]] = Iterable.isIterable(entry[1]) ? entry[1].toJS() : entry[1]; // eslint-disable-line
        return newProps;
      }, {});
    }

    componentWillReceiveProps(nextProps) {
      this.newProps = this.updateNewProps(nextProps);
    }

    render() {
      return (
        <WrappedComponent
          {...this.newProps}
        />
      );
    }
  };
};


export default ToJS;
