/**
 * Input Text Box ( <input type = "text>")
 * Both formsy value and display value will change by changing the state value
 */
import React from 'react';
import classNames from 'classnames';
import { pickHTMLProps } from 'pick-react-known-prop';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import styles from './styles.scss';

class InputCheckBox extends React.Component {

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
    this.props.setValue(this.props.value);
  }

  // When new value is recieved forecefully update the state
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value || nextProps.isValuePristine) { // eslint-disable-line
      this.setState({
        value: nextProps.value,
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
      if (this.state.manualChangeKey !== prevState.manualChangeKey || this.props.shouldUpdateAlways) {
        this.props.onChangeInput(this.props.name, this.state.value);
      }
    }
  }

  // On typing, change the state
  onChangeInput() {
    this.setState({
      value: !this.state.value,
      manualChangeKey: !this.state.manualChangeKey,
    });
  }

  getValue() {
    return this.state.value;
  }

  render() {
    // inline or block based on the props
    const errorMessageStyle = this.props.inline ? { display: 'inline-block' } : null;
    return (
      <div
        className={classNames(styles['input-check'], this.props.wrapperClass, 'clearfix')}
      >
        <input
          {...pickHTMLProps(this.props)}
          type="checkbox"
          ref={this.props.ref}
          className={this.props.fieldClass}
          name={this.props.name}
          checked={this.state.value}
          onChange={this.onChangeInput}
          required={this.props.required}
          style={this.props.fieldStyle}
          id={this.props.name}
          disabled={this.props.disabled}
        />
        <label
          htmlFor={this.props.name}
          className={this.props.labelClass}
          style={this.props.labelStyle}
        >
          {this.props.label}
          <span className="box" />
        </label>
        <div className={this.props.errorClass} style={errorMessageStyle}>
          { this.props.getErrorMessage() }
        </div>
      </div>
    );
  }
}

InputCheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  wrapperClass: PropTypes.string,
  fieldClass: PropTypes.string,
  onChangeInput: PropTypes.func,
  required: PropTypes.bool,
  setValue: PropTypes.func,
  wrapperStyle: PropTypes.object,
  fieldStyle: PropTypes.object,
  inline: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  ref: PropTypes.string,
  errorClass: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  shouldUpdateOnValueChange: PropTypes.bool, // eslint-disable-line
  shouldUpdateAlways: PropTypes.bool,
};

InputCheckBox.defaultProps = {
  value: false,
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
  getErrorMessage: () => {},
  setValue: () => {},
  shouldUpdateOnValueChange: true, // eslint-disable-line
  shouldUpdateAlways: false,
};

export default InputCheckBox;