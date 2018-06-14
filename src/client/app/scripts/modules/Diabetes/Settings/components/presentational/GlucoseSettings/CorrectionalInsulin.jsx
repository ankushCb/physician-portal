import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isBoolean from 'lodash/isBoolean';

import InputNumber from '../../../../../Common/FormElements/Formsy/InputNumber';
import ToggleSwitch from '../../../../../Common/styledFormElements/ToggleSwitch.jsx';
import Card from '../../../../../Common/Presentational/MaterialCard';

class CorrectionalInsulin extends Component {
  constructor(props) {
    super(props);
    this.handleDiabetesSettingsChange = this.handleDiabetesSettingsChange.bind(this);
  }

  handleDiabetesSettingsChange(field, value) {
    let refinedValue = value;
    if (!isBoolean(value)) {
      refinedValue = Number(value);
    }
    if (field === 'correctionalOn' && !refinedValue) {
      this.props.onChangeInDiabetesSettings('negativeCorrectionalOn', false);
    }
    this.props.onChangeInDiabetesSettings(field, refinedValue);
  }

  renderCorrectionalFields() {
    return (
      <React.Fragment>
        {
          this.props.correctionalOn && this.props.allowNegativeCorrectional &&
          <div className="glucose-settings-input">
            <label className="sub-heading" htmlFor="negativeCorrectionalOn">
              Negative ?
            </label>
            <ToggleSwitch
              value={this.props.negativeCorrectionalOn}
              name="negativeCorrectionalOn"
              onChangeInput={this.handleDiabetesSettingsChange}
              labelClass="sub-heading"
              wrapperClass="toggle-switch"
            />
            <hr className="card-seperator" />
          </div>
        }
        <div className="glucose-settings-input">
          <InputNumber
            name="correctionTarget"
            value={this.props.correctionTarget}
            onChangeInput={this.handleDiabetesSettingsChange}
            type="number"
            minValue={this.props.hypoglycemiaGlucoseThresholdMild + 1}
            maxValue={220}
            label="Target:"
            wrapperClass="text-box"
            labelClass="correctional-insulin-regimen"
            disabled={this.props.isFieldDisabled}
          />
        </div>
        <div className="glucose-settings-input">
          <hr className="card-seperator" />
          <InputNumber
            name="correctionFactor"
            value={this.props.correctionFactor}
            onChangeInput={this.handleDiabetesSettingsChange}
            type="number"
            minValue={1}
            maxValue={99}
            label="Factor:"
            wrapperClass="text-box"
            labelClass="correctional-insulin-regimen"
            disabled={this.props.isFieldDisabled}
          />
        </div>
        <div className="glucose-settings-input">
          <hr className="card-seperator" />
          <InputNumber
            name="correctionIncrement"
            value={this.props.correctionIncrement}
            onChangeInput={this.handleDiabetesSettingsChange}
            type="number"
            minValue={1}
            maxValue={5}
            label="To:"
            wrapperClass="text-box"
            labelClass="correctional-insulin-regimen"
            disabled={this.props.isFieldDisabled}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.insulinRegimen !== '' ? (
            <Card
              additionalClass="global-card"
              shouldDisableCard={this.props.shouldDisableCard}
            >
              <div className="correctional-insulin">
                <label className="sub-heading" htmlFor="correctionalOn">
                  Correctional ?
                </label>
                <ToggleSwitch
                  value={this.props.correctionalOn}
                  name="correctionalOn"
                  onChangeInput={this.handleDiabetesSettingsChange}
                  labelClass="sub-heading"
                  wrapperClass="toggle-switch"
                  specialOff
                />
                {this.renderCorrectionalFields()}
              </div>
            </Card>
          ) : null
        }
      </div>
    );
  }
}

CorrectionalInsulin.propTypes = {
  correctionTarget: PropTypes.number,
  correctionFactor: PropTypes.number,
  correctionIncrement: PropTypes.number,
  correctionalOn: PropTypes.bool,
  hypoglycemiaGlucoseThresholdMild: PropTypes.number,
  onChangeInDiabetesSettings: PropTypes.func,
  allowNegativeCorrectional: PropTypes.bool,
  negativeCorrectionalOn: PropTypes.bool,
  isFieldDisabled: PropTypes.bool,
  insulinRegimen: PropTypes.string,
  shouldDisableCard: PropTypes.bool,
};

CorrectionalInsulin.defaultProps = {
  correctionTarget: 41,
  correctionFactor: 1,
  correctionIncrement: 0,
  correctionalOn: false,
  onChangeInDiabetesSettings: () => {},
  hypoglycemiaGlucoseThresholdMild: 0,
  allowNegativeCorrectional: false,
  negativeCorrectionalOn: false,
  isFieldDisabled: false,
  insulinRegimen: '',
  shouldDisableCard: false,
};

export default CorrectionalInsulin;
