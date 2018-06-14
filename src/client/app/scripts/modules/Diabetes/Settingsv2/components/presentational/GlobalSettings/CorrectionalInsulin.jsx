import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import min from 'lodash/min';

import Card from '../../../../../Common/Presentational/MaterialCard';
import toJS from '../../../../../Common/Presentational/toJS';
import InputNumber from '../../../../../Common/FormElements/ReduxForm/InputNumber';
import ToggleSwitch from '../../../../../Common/FormElements/ReduxForm/Toolbox/ToggleSwitch';

import styles from './styles.scss';

class CorrectionalInsulin extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleCorrectional = this.handleToggleCorrectional.bind(this);
    this.handleToggleNegativeCorrectional = this.handleToggleNegativeCorrectional.bind(this);
  }

  handleToggleCorrectional() {
    // If, negative correctional is enabled, turn it off first
    const { correctionalDetails, scheduleData, changeScheduleTableRow } = this.props;
    if (correctionalDetails.negativeCorrectionalOn) {
      this.props.toggleNegativeCorrectional(!correctionalDetails.negativeCorrectionalOn);
    }
    this.props.toggleCorrectional(!correctionalDetails.correctionalOn);

    // If turning on correctional, turn on correctional for all the visible
    // meals in the schedule table
    // Else, turn it off, for all the rows
    const correctionOn = !correctionalDetails.correctionalOn;
    scheduleData.forEach((row, index) => row.isDisplayed &&
    changeScheduleTableRow(index, fromJS({
      ...row,
      correctionalInsulinOn: correctionOn,
      bgCheck: correctionOn ? true : scheduleData[index].bgCheck,
    })));
  }

  handleToggleNegativeCorrectional() {
    this.props.toggleNegativeCorrectional(!this.props.correctionalDetails.negativeCorrectionalOn);
  }

  renderCorrectionalFields() {
    const {
      correctionalOn,
      allowNegativeCorrectional,
    } = this.props.correctionalDetails;
    const {
      hypoglycemiaGlucoseThresholdMild,
      hyperglycemiaThresholdEmergency
    } = this.props.diabetesThresholds;

    const maxFactor = min([hyperglycemiaThresholdEmergency - hypoglycemiaGlucoseThresholdMild, 99]);

    return (
      <React.Fragment>
        {
          allowNegativeCorrectional && correctionalOn &&
          <div className="negative-correcional-wrapper">
            <label className="sub-heading" htmlFor="negativeCorrectionalOn">
              Negative ?
            </label>
            <Field
              name="correctionalDetails.negativeCorrectionalOn"
              component={ToggleSwitch}
              wrapperClass="toggle-switch"
              onClick={this.handleToggleNegativeCorrectional}
            />
            <hr className="card-seperator" />
          </div>
        }
        <div className="glucose-settings-input">
          <Field
            name="correctionalDetails.correctionTarget"
            component={InputNumber}
            min={hypoglycemiaGlucoseThresholdMild + 1}
            max={220}
            inputClass="input-threshold"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            label="Target "
            disable={!correctionalOn}
          />
        </div>
        <div className="glucose-settings-input">
          <hr className="card-seperator" />
          <Field
            name="correctionalDetails.correctionFactor"
            component={InputNumber}
            min={1}
            max={maxFactor}
            inputClass="input-threshold"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            label="Factor "
            disable={!correctionalOn}
          />
        </div>
        <div className="glucose-settings-input">
          <hr className="card-seperator" />
          <Field
            name="correctionalDetails.correctionIncrement"
            component={InputNumber}
            min={1}
            max={5}
            inputClass="input-threshold"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            label="To "
            disable={!correctionalOn}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { correctionalDetails } = this.props;
    return (
      <div>
        {
          correctionalDetails.displayCorrectionalCard &&
          (
            <Card additionalClass="global-card" >
              <div className={styles['correctional-insulin']}>
                <label className="sub-heading" htmlFor="correctionalOn">
                  Correctional ?
                </label>
                <Field
                  name="correctionalDetails.correctionalOn"
                  component={ToggleSwitch}
                  wrapperClass="toggle-switch"
                  onClick={this.handleToggleCorrectional}
                />
                {this.renderCorrectionalFields()}
              </div>
            </Card>
          )
        }
      </div>
    );
  }
}

CorrectionalInsulin.propTypes = {
  correctionalDetails: PropTypes.shape({
    displayCorrectionalCard: PropTypes.bool,
    correctionalOn: PropTypes.bool,
    negativeCorrectionalOn: PropTypes.bool,
    allowNegativeCorrectional: PropTypes.bool,
  }),
  toggleCorrectional: PropTypes.func.isRequired,
  toggleNegativeCorrectional: PropTypes.func.isRequired,
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
  diabetesThresholds: PropTypes.shape({
    hypoglycemiaGlucoseThresholdMild: PropTypes.number,
  }),
};

CorrectionalInsulin.defaultProps = {
  correctionalDetails: PropTypes.shape({
    displayCorrectionalCard: false,
    correctionalOn: false,
    hypoglycemiaGlucoseThresholdMild: 0,
    negativeCorrectionalOn: false,
    allowNegativeCorrectional: false,
  }),
  diabetesThresholds: {
    hypoglycemiaGlucoseThresholdMild: 0,
  },
};

const mapDispatchToProps = {
  toggleCorrectional: value => change('diabetesSettingsForm', 'correctionalDetails.correctionalOn', value),
  toggleNegativeCorrectional: value => change('diabetesSettingsForm', 'correctionalDetails.negativeCorrectionalOn', value),
};

export default connect(null, mapDispatchToProps)(toJS(CorrectionalInsulin));
