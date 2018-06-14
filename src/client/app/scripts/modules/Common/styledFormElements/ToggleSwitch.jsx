import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InputCheckBox from '../FormElements/Formsy/SimpleInputCheck';

import styles from './styles.scss';

/* Intentionally made as class comp instead of pure as it deals with ref passed from Formsy */
class ToggleSwitch extends React.Component {
  render() {
    return (
      <span disabled={this.props.disabled} className={classNames(styles['toggle-switch'], this.props.wrapperClass)}>
        <label htmlFor={this.props.name}>
          <span className={classNames('horizon-strip', { on: this.props.value })} />
          <span className={classNames('circular-switch', { 'special-off': this.props.specialOff },  { on: this.props.value })} />
        </label>
        <InputCheckBox {...this.props} wrapperClass="switch-check-box" />
      </span>
    );
  }
}

ToggleSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  wrapperClass: PropTypes.string,
  value: PropTypes.bool,
};

ToggleSwitch.defaultProps = {
  wrapperClass: '',
  value: false,
};

export default ToggleSwitch;
