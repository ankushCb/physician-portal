import React from 'react';
import PropTypes from 'prop-types'
import { pickHTMLProps } from 'pick-react-known-prop';
import classNames from 'classnames';

import omit from 'lodash/omit';

import styles from './styles.scss';

const skipKnownProps = [
  'className',
];

const style = {
  wrapperDivStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '15px',
  },
  valueStyle: {
    flex: '3 3 0px'
  }
};

/* Button component */
/* pass styles prop to alter the styling */
const Button = props => (
  <button
    type="button"
    className={classNames(styles.button, props.className)}
    {...pickHTMLProps(omit(props, skipKnownProps))}
  >
    <div style={style.wrapperDivStyle}>
      <div style={style.valueStyle}>
        {props.value}
      </div>
    </div>
  </button>
);

Button.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
};

Button.defaultProps = {
  value: 'Submit',
  className: '',
};

export default Button;
