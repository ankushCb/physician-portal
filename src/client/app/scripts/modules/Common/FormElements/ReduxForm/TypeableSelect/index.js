import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import axios from 'axios';


import filter from 'lodash/filter';
import toUpper from 'lodash/toUpper';
import map from 'lodash/map';
import DropDownContent from './DropDownContent.jsx';

import styles from './index.scss';

/* Typeable select component */
class TypeableSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropDownActive: false, // If true brings the dropdown
      currentText: '',         // Whatever is the current text in the input
      isAsyncFetching: false, // Is fetching for any async inputs
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.processSuggestionData = this.processSuggestionData.bind(this);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.alterDropDownStyle = this.alterDropDownStyle.bind(this);
  }

  // onFocus makes the dropdown active
  handleFocus() {
    if (!this.state.stackVertical) {
      this.setState({
        isDropDownActive: true,
      });
    }
  }

  // onBlur with a timeout removes the dropDown
  handleBlur() {
    setTimeout(() => {
      this.setState(() => {
        return {
          isDropDownActive: false,
        };
      });
    }, 150);
  }
  
  // Takes the response from the suggestion API and returns a processed dropdown
  processSuggestionData(data) { 
    const {
      data: {
        suggestionGroup: {
          name,
          suggestionList: {
            suggestion = '',
          },
        },
      },
    } = data;

    // Filters the options as per the name
    const filteredOptions = filter(suggestion, (eachSuggestion) => (toUpper(eachSuggestion.substring(0, name.length)) === toUpper(name)));
    // Creates the drop down
    const dropDownOptions = [map(filteredOptions, (option) => ({
      label: option,
      value: option,
    }))];
    this.setState({
      dropDownOptions,
      isAsyncFetching: false,
    });
  }

  // Debounces after every 1000 ms and creates dropdown option
  handleInputChange(e) {
    this.handleFocus();
    const currentTimer = 1000;
    this.setState({
      isDropDownActive: true,
    })
    // If new handleChange happens cancel the current fetch cycle
    if (this.props.isAsync) {
      if (this.currentAsyncCycle) {
        clearTimeout(this.currentAsyncCycle);
      }
      const currentValue = e.currentTarget.value;
      this.setState({
        isAsyncFetching: true,
      });

      this.currentAsyncCycle = setTimeout(() => {
        if (currentValue !== '') {
          // Fetching starts  
          axios(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${currentValue}`)
          .then((res) => {
            // Process the data for select box
            this.processSuggestionData(res);
          })
          .catch((e) => {
            console.log(e);
          });
        } else {
          this.setState({
            dropDownOptions: [],
            isAsyncFetching: false,
          });
        }
        
      }, currentTimer);
    }
    this.props.input.onChange(e.currentTarget.value);
  }

  alterDropDownStyle() {
    const {
      stackVertical
    } = this.props;

    return stackVertical ? {
      ...this.props.dropDownStyle,
      width: '100%',
    } : this.props.dropDownStyle;
  }

  /* Renders the dropdown */
  renderDropDown(dropDownOptions) {

    // Change any dropdown style conditionally here
    const dropDownStyle = this.alterDropDownStyle();

    // If dropdown active and not disabled
    if (this.state.isDropDownActive && !this.props.disabled) {
      // IF fetching show a spinner
      if (this.state.isAsyncFetching) {
        return (
          <div className="spinner-container">
            <DropDownContent
              dropDownStyle={dropDownStyle}
              showSpinner
              isAsync={this.props.isAsync}
            />
          </div>
        );
      } else if (!this.state.isAsyncFetching) {
        const currentTypedValue = this.props.input.value;
        // If not return the content
        return (
          <DropDownContent
            dropDownOptions={dropDownOptions}
            onButtonClick={this.props.input.onChange}
            handleBlur={this.handleBlur}
            currentTextValue={this.props.input.value}
            dropDownStyle={dropDownStyle}
            stackVertical={this.props.stackVertical}
            name={this.props.input.name}
            isAsync={this.props.isAsync}
            currentTypedValue={currentTypedValue}
          />
        );
      }
    }
    // Test code for default rendering
    // else {
    //   return (
    //     <DropDownContent
    //       dropDownOptions={dropDownOptions}
    //       onButtonClick={this.props.input.onChange}
    //       handleBlur={this.handleBlur}
    //       currentTextValue={this.props.input.value}
    //       dropDownStyle={dropDownStyle}
    //       stackVertical={this.props.stackVertical}
    //       name={this.props.input.name}
    //     />
    //   )
    // }
  }
  renderInput() {
    const { 
      input,
      placeholder,
      disabled,
      inputStyle,
      inputClass,
      ...props,
    } = this.props;
    return !props.disabled ? (
      <input
        type="text"
        // onFocus={this.handleFocus}
        onChange={this.handleInputChange}
        onBlur={this.handleBlur}
        value={input.value}
        disabled={disabled}
        placeholder={placeholder}
        style={inputStyle}
      />
    ) : (
      <div className="display-only">
        {input.value}
      </div>
    )  
  }

  render() {
    const { 
      wrapperClass,
      isAsync,
      ...props,
    } = this.props;
    // If static refer the props option
    const dropDownOptions = isAsync ? this.state.dropDownOptions : props.dropDownOptions;
    return (
      <div
        className={classNames(
          'clearfix',
          styles['typeable-select'],
          styles['redux-input'],
          wrapperClass,
        )}
      >
        {/* wrapper for input text */}
        <div className="text-field">
          {this.renderInput()}
        </div>
        <div className="dropdown-wrapper">
          {this.renderDropDown(dropDownOptions)}
        </div>
      </div>
    )
  }
}

TypeableSelect.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    touched: PropTypes.bool.isRequired,
  }).isRequired,
  wrapperClass: PropTypes.string,
  label: PropTypes.string,
};

TypeableSelect.defaultProps = {
  wrapperClass: '',
  label: '',
};

export default TypeableSelect;
