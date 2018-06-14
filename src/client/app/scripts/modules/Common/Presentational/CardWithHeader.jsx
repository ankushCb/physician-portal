import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';

import Button from '../FormElements/ReduxForm/Toolbox/Button';
import ShowPreloader from './ShowPreloader.jsx';

import styles from './styles.scss';

/* eslint-disable react/prop-types */
const renderSideElement = (props) => {
  switch (props.sideElementType) {
    case 'linkButton':
      return (
        <Link to={props.linkTo}>
          <Button
            className="link-btn btn"
            value={props.buttonValue}
            disabled={props.disableButton}
          />
        </Link>
      );
    case 'button':
      return (
        <Button
          className="btn"
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
/* eslint-enable react/prop-types */

const CardWithHeader = ({ wrapperClass, children, header, ...props }) => (
  <div className={classNames(styles['card-with-header'], wrapperClass)}>
    <ShowPreloader show={props.showPreLoader} wrapperClass="card-pre-loader">
      <div className="header">
        {header}
        <div className="side-element">
          {renderSideElement(props)}
        </div>
      </div>
      <div className="content">
        {children}
      </div>
    </ShowPreloader>
  </div>
);

CardWithHeader.propTypes = {
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
};

CardWithHeader.defaultProps = {
  wrapperClass: '',
  sideElementType: undefined,
  buttonValue: '',
  sideElement: null,
  buttonOnClick: () => {},
  linkTo: '',
  showPreLoader: false,
  disableButton: false,
};

export default CardWithHeader;
