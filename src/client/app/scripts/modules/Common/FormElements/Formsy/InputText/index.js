/**
 * Input Text Box ( <input type = "text>")
 * Both formsy value and display value will change by changing the state value
 */
import React from 'react';
import classNames from 'classnames';
import { pickHTMLProps } from 'pick-react-known-prop';
import PropTypes from 'prop-types';
import Input from 'react-toolbox/lib/input';

import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import styles from './styles.scss';

class InputTextBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      manualChangeKey: false,
    };

    this.onChangeInput = this.onChangeInput.bind(this);
  }

  // Setting the default value
  componentDidMount() {
    this.props.setValue(this.props.value.substr(0, this.props.lengthLimit));
  }

  // When new value is recieved forecefully update the state
  componentWillReceiveProps(nextProps) {
    if (this.props.value && !nextProps.value) {
      this.setState({
        value: '',
      });
    } else if (this.props.type === 'number' && this.props.value !== nextProps.value) {
      if (nextProps.value >= this.props.limitMin && nextProps.value <= this.props.limitMax) {
        this.setState({
          value: nextProps.value,
        });
      } else if (nextProps.value < this.props.limitMin) {
        this.setState({
          value: this.props.limitMin,
        });
      } else if (nextProps.value > this.props.limitMax) {
        this.setState({
          value: this.props.limitMax,
        });
      }
    } else if ((nextProps.value !== this.props.value || nextProps.isValuePristine) && nextProps.shouldUpdateOnValueChange) { // eslint-disable-line
      this.setState({
        value: nextProps.value.substr(0, this.props.lengthLimit),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.value !== nextState.value) || !isEqual(omit(nextProps, ['value']), omit(this.props, ['value']));
  }

  // only when there is state change, change formsy and display value to be changed
  componentDidUpdate(prevProps, prevState) { // eslint-disable-line
    if (this.state.value !== prevState.value) {
      this.props.setValue(this.state.value);
      if (this.state.manualChangeKey !== prevState.manualChangeKey) {
        this.props.onChangeInput(this.props.name, this.state.value);
      }
    }
  }

  // On typing, change the state
  onChangeInput(value) {
    const newChangeKey = !this.state.manualChangeKey;
    let newValue = value;
    if (this.props.type === 'number') {
      newValue = parseInt(newValue, 10);
      if (newValue >= this.props.limitMin && newValue <= this.props.limitMax) {
        this.setState({
          value: newValue,
          manualChangeKey: newChangeKey,
        });
      } else if (newValue < this.props.limitMin) {
        this.setState({
          value: this.props.limitMin,
          manualChangeKey: newChangeKey,
        });
      } else if (newValue > this.props.limitMax) {
        this.setState({
          value: this.props.limitMax,
          manualChangeKey: newChangeKey,
        });
      }
    } else {
      this.setState({
        value: newValue.substr(0, this.props.lengthLimit),
        manualChangeKey: newChangeKey,
      });
    }
  }

  render() {
    // inline or block based on the props
    const errorMessageStyle = this.props.inline ? { display: 'inline-block' } : null;
    return (
      <div
        className={classNames(styles['input-text-box'], this.props.wrapperClass)}
        style={this.props.wrapperStyle}
      >
        <label
          htmlFor={this.props.name}
          className={this.props.labelClass}
        >
          {this.props.label}
        </label>
        <Input
          type="text"
          value={this.state.value}
          onChange={this.onChangeInput}
          {...this.props}
        />
        <div style={{ clear: 'both' }} />
        <div className={this.props.errorClass} style={errorMessageStyle}>
          { this.props.getErrorMessage() }
        </div>
      </div>
    );
  }
}

InputTextBox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  wrapperClass: PropTypes.string,
  fieldClass: PropTypes.string,
  errorClass: PropTypes.string,
  onChangeInput: PropTypes.func,
  required: PropTypes.bool,
  setValue: PropTypes.func,
  wrapperStyle: PropTypes.object,
  fieldStyle: PropTypes.object,
  inline: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  ref: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  shouldUpdateOnValueChange: PropTypes.bool, // eslint-disable-line
  type: PropTypes.string,
  limitMin: PropTypes.number,
  limitMax: PropTypes.number,
  callBackAlways: PropTypes.bool, // eslint-disable-line
};

InputTextBox.defaultProps = {
  value: '',
  wrapperClass: undefined,
  fieldClass: undefined,
  onChangeInput: () => {},
  validations: undefined,
  required: undefined,
  wrapperStyle: undefined,
  fieldStyle: undefined,
  inline: undefined,
  validationError: undefined,
  ref: '',
  errorClass: undefined,
  label: undefined,
  labelClass: undefined,
  setValue: () => {},
  getErrorMessage: () => {},
  shouldUpdateOnValueChange: true, // eslint-disable-line
  type: 'text',
  limitMin: 1,
  limitMax: 1000,
  callBackAlways: false, //eslint-disable-line
  lengthLimit: 1000,
};

export default InputTextBox;
