/**
 * Input Select Box ( <select></select>")
 * Both formsy value and display value will change by changing the state value
 */
import React from 'react';
import classNames from 'classnames';
import { pickHTMLProps } from 'pick-react-known-prop';
import PropTypes from 'prop-types';
import Dropdown from 'react-toolbox/lib/dropdown';

import map from 'lodash/map';
import isEqual from 'lodash/isEqual';

import styles from './styles.scss';

class InputSelectBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      manualChangeKey: false,
    };

    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.getProcessedOptions = this.getProcessedOptions.bind(this);
  }

  // Setting the default value
  componentDidMount() {
    this.props.setValue(this.props.value);
  }

  // When new value is recieved forecefully update the state
  componentWillReceiveProps(nextProps) {
    if ((nextProps.value !== this.props.value || nextProps.isValuePristine) && nextProps.shouldUpdateOnValueChange) { // eslint-disable-line
      this.setState({
        value: nextProps.value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.reRenderAlways || this.state.value !== nextState.value || nextProps.disabled !== this.props.disabled || !isEqual(this.props.options, nextProps.options) || (this.props.dontError !== nextProps.dontError));
  }

  // only when there is state change, change formsy and display value to be changed
  componentDidUpdate(prevProps, prevState) { // eslint-disable-line
    if (this.state.value !== prevState.value && this.state.manualChangeKey !== prevState.manualChangeKey) {
      this.props.setValue(this.state.value);
      this.props.onChangeInput(this.props.name, this.state.value);
    }
  }

  // On changing sleect, change the state
  onChangeSelect(value) {
    this.setState({
      value,
      manualChangeKey: !this.state.manualChangeKey,
    });
  }

  getValue() {
    return this.state.value;
  }

  getProcessedOptions(options) {
    const processedOptions = map(options, ({ name: label, value }) => ({ label, value }));
    // const selectOption = [{ name: 'Select Option', value: '' }];

    return processedOptions;
    // return selectOption.concat(processedOptions);

  }

  render() {
    // inline or block based on the props
    const errorMessageStyle = this.props.inline ? { display: 'inline-block' } : null;
    const selectClass = this.state.value === '' ? `${this.props.selectClass} select-error` : this.props.selectClass;
    const options = this.getProcessedOptions(this.props.options);
    return (
      <div
        className={classNames(styles['input-select'], this.props.wrapperClass)}
        style={this.props.wrapperStyle}
      >
        <label
          htmlFor={this.props.name}
          className={this.props.labelClass}
          style={this.props.labelStyle}
        >
          {this.props.label}
        </label>
        <Dropdown
          source={options}
          auto
          placeholder="Select"
          theme={styles}
          onChange={this.onChangeSelect}
          required={this.props.required}
          {...this.props}
          value={this.state.value}
          label=""
          error={(!this.props.dontError && this.state.value === '') ? 'Required' : undefined}
        />

        <div style={{ clear: 'both' }} />
        {
          this.props.displayErrorMessage ? (
            <div className={this.props.errorClass} style={errorMessageStyle}>
              { this.props.getErrorMessage() }
            </div>
          ) : null
        }
      </div>
    );
  }
}

InputSelectBox.propTypes = {
  options: PropTypes.array.isRequired,
  wrapperClass: PropTypes.string,
  errorClass: PropTypes.string,
  wrapperStyle: PropTypes.object,
  getErrorMessage: PropTypes.func,
  value: PropTypes.any,
  setValue: PropTypes.func,
  onChangeInput: PropTypes.func,
  inline: PropTypes.bool,
  ref: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  disableDefaultTextOnSelect: PropTypes.bool,
  defaultText: PropTypes.string,
  selectClass: PropTypes.string,
  optionClass: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  shouldUpdateOnValueChange: PropTypes.bool, // eslint-disable-line
  disabled: PropTypes.bool,
  reRenderAlways: PropTypes.bool,
  displayErrorMessage: PropTypes.bool,
};

InputSelectBox.defaultProps = {
  wrapperClass: undefined,
  wrapperStyle: undefined,
  errorClass: undefined,
  value: '',
  onChangeInput: () => {},
  getErrorMessage: () => {},
  setValue: () => {},
  inline: undefined,
  ref: undefined,
  disableDefaultTextOnSelect: true,
  required: undefined,
  defaultText: 'Select An Option',
  selectClass: undefined,
  optionClass: undefined,
  labelClass: undefined,
  label: undefined,
  shouldUpdateOnValueChange: true, // eslint-disable-line
  disabled: false,
  reRenderAlways: false,
  displayErrorMessage: false,
};

export default InputSelectBox;
