import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-flexbox-grid';
import Button from '../FormElements/ReduxForm/Toolbox/Button';
import ShowPreloader from './ShowPreloader.jsx';
import InputSelect from '../FormElements/Formsy/InputSelect';
import styles from './styles.scss';

const options = [
  {
    label: 'Last 7 days',
    value: 'Last 7 days',
  },
  {
    label: 'Last 30 days',
    value: 'Last 30 days',
  }
]

/* eslint-disable react/prop-types */
const renderSideElement = (props) => {
  switch (props.sideElementType) {
    case 'linkButton':
      return (
        <Link to={props.linkTo}>
          <Button
            className="link-btn btn"
            value={props.buttonValue}
          />
        </Link>
      );
    case 'button':
      return (
        <Button
          className="btn"
          value={props.buttonValue}
          onClick={props.buttonOnClick}
        />
      );
    case 'other':
      return props.sideElement;
    default:
      return null;
  }
};
/* eslint-enable react/prop-types */
class GraphCardWithHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'Last 7 days',
    }
    this.handleDurationChange = this.handleDurationChange.bind(this);
  }

  handleDurationChange(active) {
    this.setState({
      active,
    });
  }

  render() {
    const { wrapperClass, children } = this.props;
    const childrenWithProps = React.Children.map(children,
     (child) => React.cloneElement(child, {
       active: this.state.active === 'Last 7 days' ? 'Week' : 'Month',
     })
    );
    return (
      <div className={classNames(styles['graph-card-with-header'], wrapperClass)}>
        <ShowPreloader show={this.props.showPreLoader} wrapperClass="card-pre-loader">
          <div className="header">
            {this.props.header || 'Diabetes Settings'}
          </div>
          <div className="side-element">
            <InputSelect
              source={options}
              value={this.state.active}
              onChange={this.handleDurationChange}
            />
          </div>
          <div className="clearfix" />
          <div className="content">
            {childrenWithProps}
          </div>
          
        </ShowPreloader>
      </div>
    );
  }
}


GraphCardWithHeader.propTypes = {
  children: PropTypes.any.isRequired,
  header: PropTypes.string.isRequired,
  wrapperClass: PropTypes.string,
  sideElementType: PropTypes.oneOf([
    'linkButton',
    'button',
    'other',
  ]),
  buttonValue: PropTypes.string,
  sideElement: PropTypes.any,
  buttonOnClick: PropTypes.func,
  linkTo: PropTypes.string,
  showPreLoader: PropTypes.bool,
};

GraphCardWithHeader.defaultProps = {
  wrapperClass: '',
  sideElementType: undefined,
  buttonValue: '',
  sideElement: null,
  buttonOnClick: () => {},
  linkTo: '',
  showPreLoader: false,
};

export default GraphCardWithHeader;
