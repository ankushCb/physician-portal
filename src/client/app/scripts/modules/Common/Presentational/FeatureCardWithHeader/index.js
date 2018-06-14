import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';

import Button from '../../FormElements/ReduxForm/Toolbox/Button';
import ShowPreloader from '../ShowPreloader.jsx';
import styles from './styles.scss';

const renderSideElement = (props) => {
  switch (props.sideElementType) {
    case 'linkButton':
      return (
        <Link to={props.linkTo}>
          <Button
            label={props.label}
            className="primary-button"
            label={props.buttonValue}
            disabled={props.disableButton}
          />
        </Link>
      );
    case 'button':
      return (
        <Button
          className="primary-button"
          value={props.buttonValue}
          onClick={props.buttonOnClick}
          disabled={props.disableButton}
        />
      );
    case 'other':
      return props.sideElement;
    default:
      return null;
  }
};

class FeatureCardWithHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'week',
    };
  }

  render() {
    const { wrapperClass, children, header, subHeader, forGraph, ...props } = this.props;
    let childrenWithProps = children;
    if (forGraph) {
      childrenWithProps = React.Children.map(children,
        child => React.cloneElement(child, { active: this.state.active }),
      );
    }

    return (
      <div
        className={classNames(styles['feature-card-with-header'], wrapperClass)}
        style={this.props.style || {}}
      >
        <ShowPreloader show={props.showPreLoader} wrapperClass="card-pre-loader">
          <div className="header">
            {header}
          </div>
          <span className="sub-header-card">{subHeader}</span>
          <div className="side-element">
            {renderSideElement(props)}
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

FeatureCardWithHeader.propTypes = {
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
  disableButton: PropTypes.bool,
  subHeader: PropTypes.string,
};

FeatureCardWithHeader.defaultProps = {
  wrapperClass: '',
  sideElementType: undefined,
  buttonValue: '',
  sideElement: null,
  buttonOnClick: () => {},
  linkTo: '',
  showPreLoader: false,
  disableButton: false,
  subHeader: '',
};

export default FeatureCardWithHeader;
