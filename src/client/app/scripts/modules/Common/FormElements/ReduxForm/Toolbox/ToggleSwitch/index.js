import React from 'react';
import classNames from 'classnames';
import InputCheckBox from '../InputCheckBox';

import styles from './styles.scss';

class ToggleSwitch extends React.Component {
  render() {
    const { disabled, wrapperClass, name, input, onClick } = this.props;
    return (
      <span
        disabled={disabled}
        className={classNames(styles['toggle-switch'], wrapperClass)}
        onClick={onClick}
      >
        <label htmlFor={name}>
          <span className={classNames('horizon-strip', { on: input.value })} />
          <span
            className={classNames(
              'circular-switch',
              { on: input.value })}
          />
        </label>
        <InputCheckBox {...this.props} wrapperClass="switch-check-box" />
      </span>
    );
  }
}

export default ToggleSwitch;
