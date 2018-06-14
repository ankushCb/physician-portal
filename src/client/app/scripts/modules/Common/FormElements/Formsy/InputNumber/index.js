import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import isNaN from 'lodash/isNaN';

import styles from './styles.scss';

class InputNumber extends React.Component {

  constructor(props) {
    super(props);

    let value = this.props.value;
    if (!(this.props.value >= this.props.minValue && this.props.value <= this.props.maxValue)) {
      if (this.props.value >= this.props.minValue) {
        value = this.props.maxValue;
      } else if (this.props.value <= this.props.maxValue) {
        value = this.props.minValue;
      }
    }

    this.state = {
      value,
      manualChangeKey: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickUp = this.onClickUp.bind(this);
    this.onClickDown = this.onClickDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.value !== nextState.value) {
      this.props.setValue(nextState.value);
      this.props.onChangeInput(this.props.name, nextState.value);
    }
  }

  // OnFocus
  onFocus() {
    this.isOnFocus = true;
    this.beforeFocusValue = this.state.value;
  }

  // OnBlurInput
  onBlur() {
    this.isOnFocus = true;
    if (isNaN(Number(this.state.value))) {
      this.setState({
        value: this.props.minValue,
      });
    } else if (!(this.state.value >= this.props.minValue && this.state.value <= this.props.maxValue)) {
      if (this.state.value >= this.props.minValue) {
        this.setState({
          value: this.props.maxValue,
        });
      } else if (this.state.value <= this.props.maxValue) {
        this.setState({
          value: this.props.minValue,
        });
      }
    }
  }

  // On typing, change the state
  onChange(event) {
    if (this.isOnFocus && !isNaN(Number(event.target.value))) {
      this.setState({
        value: Number(event.target.value),
      });
    }
  }

  onClickUp() {
    if (this.state.value + 1 <= this.props.maxValue) {
      this.setState({
        value: this.state.value + 1,
      });
    }
  }

  onClickDown() {
    if (this.state.value - 1 >= this.props.minValue) {
      this.setState({
        value: this.state.value - 1,
      });
    }
  }

  onKeyUp(e) {
    if (!this.props.disabled) {
      if (e.keyCode === 38) {
        this.onClickUp();
      } else if (e.keyCode === 40) {
        this.onClickDown();
      } else if (e.keyCode === 13) {
        this.refs.input.blur();
      }
    }
  }

  getValue() {
    return this.state.value;
  }

  render() {
    return (
      <div 
        className={classNames(styles['input-number'], this.props.wrapperClass)}
        style={this.props.wrapperStyle}
      >
        <label
          htmlFor={this.props.name}
          className={this.props.labelClass}
          style={this.props.labelStyle}
        >
          {this.props.label}
        </label>
        <div className="input-container" style={this.props.inputWrapperStyle}>
          <input
            ref="input"
            name={this.props.name}
            type="text"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyUp={this.onKeyUp}
            value={(this.props.isPrefixRequired && this.state.value / 10 < 1) ? `0${this.state.value}` : this.state.value}
            onChange={this.onChange}
            style={this.props.style}
            className={this.props.inputClass}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    );
  }
}

InputNumber.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  setValue: PropTypes.func,
  onChangeInput: PropTypes.func,
  wrapperClass: PropTypes.string,
  labelClass: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  inputClass: PropTypes.string,
};

InputNumber.defaultProps = {
  value: 0,
  minValue: -1,
  maxValue: 1000,
  setValue: () => {},
  onChangeInput: () => {},
  wrapperClass: '',
  labelClass: '',
  label: '',
  style: {},
  disabled: false,
  inputClass: '',
};

export default InputNumber;
