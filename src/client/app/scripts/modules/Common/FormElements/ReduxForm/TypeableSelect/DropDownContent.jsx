import React from 'react';
import map from 'lodash/map';
import toUpper from 'lodash/toUpper';
import isEqual from 'lodash/isEqual';
import times from 'lodash/times';
import filter from 'lodash/filter';
import max from 'lodash/max';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';

import PropTypes from 'prop-types';

import Spinner from 'react-toolbox/lib/progress_bar';
import { Row, Col } from 'react-flexbox-grid';
import styles from './index.scss';

import Button from '../Button/index.jsx';

const getWidth = (index, name) => {
  if (index === 5) {
    return '70px';
  } else if (name !== 'unitName') {
    return '60px';
  }
  return '0px';
};

const buttonStyles = (index, label, stackVertical, name) => ({
  border: !stackVertical ? '1px solid #9cb5d4' : 'none',
  display: stackVertical ? 'block' : 'inline-block',
  width: stackVertical ? '100%' : 'auto',
  textAlign: stackVertical ? 'left' : 'center',
  minWidth: getWidth(index, name),
  visibility: label === '' ? 'hidden' : '',
});

// Filters non async values
const filterNonAsync = (options, currentText) => {

  // Max Original length of each stack
  const maxOriginalLength = max(map(options, option => option.length));
  let cIndex = 0;

  // Reverse options based on the original options
  const reverseOptions = times(maxOriginalLength, () => {
    cIndex += 1;
    return map(options, option => option[cIndex - 1])
  });

  // Filters based on reverse stack to maintain column order
  const filteredReverseOption = map(reverseOptions, (row) => {
    const filteredRow = filter(row, (option) => {
      return option && 
        toUpper(option.label.substring(0, currentText.length)) === toUpper(currentText);
    })
    return filteredRow;
  });

  // Looks for max length of reversed options
  const maxReverseLength = max(map(filteredReverseOption, option => option.length));
  cIndex = 0;
  const originalFilteredOptions = times(maxReverseLength, () => {
    cIndex += 1;
    return map(filteredReverseOption, option => option[cIndex - 1]);
  });
  if (originalFilteredOptions.length === 1) {
    // Remove empty stacks
    return [filter(originalFilteredOptions[0], (option) => !isUndefined(option))];
  }
  return originalFilteredOptions;
}

const filterDropDownOptionsByText = (options, currentText, isAsync) => {
  if (isAsync) {
    const result = map(options, row => map(row, ({ label, value }) => (
      toUpper(label.substring(0, currentText.length)) === toUpper(currentText) ? {
        label,
        value,
      } : {
        label: '',
        value: '',
      }
    )))
    return result;
  }
  return filterNonAsync(options, currentText);
  
}

class DropDownContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropDownOptions: filterDropDownOptionsByText(props.dropDownOptions, props.currentTypedValue, props.isAsync),
    };
    this.handleOnClickButton = this.handleOnClickButton.bind(this);
    this.renderDropDownContent = this.renderDropDownContent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.currentTextValue !== this.props.currentTextValue) ||
      !isEqual(this.props.dropDownOptions, nextProps.dropDownOptions)
    ) {
      this.setState({
        dropDownOptions: filterDropDownOptionsByText(nextProps.dropDownOptions, nextProps.currentTextValue, this.props.isAsync),
      })
    }
  }

  handleOnClickButton(e) {
    this.props.onButtonClick(e.currentTarget.value);
    this.props.handleBlur();
  }

  renderDropDownContent() {
    const eachButtonStyle = this.props.stackVertical ? {
      float: 'none'
    } : {};
    // console.log('dropdown ', this.state.dropDownOptions);
    if (
      this.state.dropDownOptions &&
      (
        this.state.dropDownOptions.length < 1 ||
        (
          this.state.dropDownOptions.length === 1 &&
          isEmpty(this.state.dropDownOptions[0])
        )
      ) 
    ) {
      return (
        <div className="no-match">
          No match found.
        </div>  
      );
    }
    return map(this.state.dropDownOptions, (rowData, outerIndex) => {
      const fieldName = this.props.name.split('.')[1];
      return (
        <div className="each-row" key={outerIndex}>
          {
            map(rowData, (data, index) => {
              if (!data) {
                return (
                  <div className="each-button">
                    <Button
                      label={'invisible'}
                      wrapperClassName={'list-item-action-button'}
                      labelClassName={'label-class'}
                      wrapperStyle={{ visibility: 'hidden' }}
                    />
                  </div>
                );
              }
              return (
                <div className="each-button" key={index} style={eachButtonStyle}>
                  <Button
                    label={data.label}
                    wrapperClassName={'list-item-action-button'}
                    labelClassName={'label-class'}
                    value={data.label}
                    style={buttonStyles(index, data.label, this.props.stackVertical, fieldName)}
                    onClick={this.handleOnClickButton}
                    className="hoverable-btn"
                  />
                </div>
              )
            })
          }
          <div className="clearfix" />
        </div>
      )
    })
  }

  render() {
    return (
      <div
        className={styles['dropdown-container']}
        style={this.props.dropDownStyle}
      >
        <div className="content">
        {
          this.props.showSpinner ? (
            <span className="spinner-container">
              <Spinner
                type="circular" 
                mode="indeterminate" 
              />
            </span>
          ) : this.renderDropDownContent()
        }
        </div>
      </div>
    )
  }
}

DropDownContent.propTypes = {
  currentTypedValue: PropTypes.string,
};

DropDownContent.defaultProps = {
  currentTypedValue: '',
};

export default DropDownContent;
