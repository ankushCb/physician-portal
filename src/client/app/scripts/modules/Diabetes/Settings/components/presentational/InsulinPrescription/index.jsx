import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';
import pick from 'lodash/pick';

import List from 'scripts/modules/Common/Presentational/List.jsx';

import CarbCountingPrescription from './CarbCountingPrescription.jsx';
import getGlucoseRanges from '../../../helpers/getGlucoseRanges.js';
import getSortedTimeSlots from '../../../helpers/getSortedTimeWindows.js';
import getCorrectionFactor from '../../../helpers/getCorrectionFactor.js';
import { getTimeInSimpleFormat } from '../../../../../../helpers/time.js';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';

import styles from './styles.scss';

const correctionTargetParams = [
  'correctionTarget',
  'hyperglycemiaThresholdEmergency',
  'correctionFactor',
];

class InsulinPrescription extends Component {

  constructor() {
    super();

    this.renderTimeWindowDose = this.renderTimeWindowDose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.correctionalOn !== this.props.correctionalOn) {
      const actionPayload = reduce(this.props.timeWindows, (payload, timeWindow) => {
        return {
          ...payload,
          [`${timeWindow.name}.correctionalInsulinOn`]: nextProps.correctionalOn,
          [`${timeWindow.name}.bgCheckPrescribed`]: nextProps.correctionalOn ? true : timeWindow.bgCheckPrescribed,
        };
      }, {});
      this.props.onChangeFormInput(actionPayload);
    }
  }

  getCorrectionFactor(correctionalOn) {
    const {
      correctionFactor,
      hyperglycemiaThresholdEmergency,
      correctionTarget,
    } = this.props;
    return correctionalOn ? correctionFactor : hyperglycemiaThresholdEmergency - correctionTarget;
  }

  renderCarbCountingModal(includesCarbCounting, carbModalOpen) {
    return includesCarbCounting && carbModalOpen && (
      <CarbCountingPrescription
        timeWindows={filter(this.props.timeWindows, { insulinTypePreloaded: 'bolus' })}
        hypoglycemiaGlucoseThresholdMild={this.props.hypoglycemiaGlucoseThresholdMild}
        hyperglycemiaThresholdEmergency={this.props.hyperglycemiaThresholdEmergency}
        correctionTarget={this.props.correctionTarget}
        correctionFactor={this.props.correctionFactor}
        correctionTargetParams={correctionTargetParams}
        onClose={this.props.handleCcModalClose}
        glucoseRowsLimit={this.props.glucoseRowsLimit}
        {...pick(this.props, ['timeWindowData', 'basalInsulin',
          'bolusInsulin', 'mixedInsulin', 'idInsulinMap', 'negativeCorrectionalOn'])}
        hidden={!(includesCarbCounting && carbModalOpen)}
      />
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderBgCheck(timeWindows) {
    return (
      <tr className="bg-check-tr" key={'bg-check-tr'}>
        <td className="non-dose heading" key={'non-dose-heading-bg-check'}>bG Check?</td>
        {
          map(timeWindows, timeWindow => (
            <td key={`${timeWindow.id}`}>
              { timeWindow.bgCheckPrescribed ? <div className="check-mark" /> : null }
            </td>
          ))
        }
      </tr>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderCorrectionalOn(timeWindows) {
    return (
      <tr className="correctional-tr" key={'CorrectionalOn-tr'}>
        <td className="non-dose heading" key={'non-dose-heading-CorrectionalOn'}>Correction</td>
        {
          map(timeWindows, timeWindow => (
            <td key={`${timeWindow.name}`}>
              {
                timeWindow.correctionalInsulinOn ? (
                  <div className="plus-mark"> + </div>
              ) : null}
            </td>
          ))
        }
      </tr>
    );
  }

  renderTimeWindowDose(multiplier, rowSpanForCCTd, minMultiplier = 0) {
    return (timeWindow) => {
      const {
        id,
        insulinTypePreloaded,
        baseDose,
        correctionalInsulinOn,
      } = timeWindow;
      if (this.props.insulinRegimen.includes('carb_counting') && insulinTypePreloaded === 'bolus') {
        return multiplier !== minMultiplier ? null : (
          <td
            key={(`twd-with-carb-counting - ${id}`)}
            rowSpan={rowSpanForCCTd}
          >
            <div onClick={this.props.handleCCClick} style={{ cursor: 'pointer' }}>CC</div>
          </td>
        );
      }

      let dose;
      // If it is a bolus insulin
      if (insulinTypePreloaded === 'bolus' || baseDose === 0) {
        // Calculate the factor for correction increment
        dose = baseDose + (correctionalInsulinOn ? multiplier * this.props.correctionIncrement : 0);
        dose = dose <= 0 ? 0 : dose;
      } else {
        let calculatedCorrectionalValue = correctionalInsulinOn ? multiplier * this.props.correctionIncrement : 0;
        calculatedCorrectionalValue = (calculatedCorrectionalValue <= 0) ? 0 : calculatedCorrectionalValue;
        const actualValue = baseDose + calculatedCorrectionalValue;
        const bolusForBasalCorrector = Math.abs(multiplier * this.props.correctionIncrement);
        const symbol = multiplier > 0 ? `+ ${bolusForBasalCorrector}` : '';
        dose = `${baseDose}${(correctionalInsulinOn && multiplier !== 0) ? ` ${symbol}` : ''}`;
        if (actualValue <= 0) { dose = 0; }
      }
      return (
        <td className="dose" key={(`twd-dose-info - ${id}`)}>
          {dose}
        </td>
      );
    };
  }

  /**
  * Renders the doses in the insulin prescription table
  * For every bg range,
  *   If correctional is not turned on, display the dose count from the prescription table as is (base value)
  *   If correctional is turned on and negative is turned off
  *     Range starts from hypoThresholdMin. Adds 'to' value of correctional dose
  *     to base value (Basal or Bolus) with every range increase
  *   If correctional is turned on and negative is turned on
  *     Range starts from 30 and from hypoThresholdMin till 30, decrease 'to' value
  *     of correctional dose (if Bolus) with every range decrease. Values cannot be negative
  *     From hypoThresholdMin to correctional Target, apply no corrections. Just display the base value
  *     From correctionalTarget to hyperThresholdExtreme, add 'to' value of correctional dose
  *     to base value (Basal or Bolus) with every range increase
  * Note: Values cannot be negative. Min possible value is 0.
  *       Correctional values are always Bolus. Hence, only Bolus can cancel only Bolus
  */
  renderDoses(timeWindows) {
    const {
      correctionTarget,
      hyperglycemiaThresholdEmergency,
      hypoglycemiaGlucoseThresholdMild,
      correctionalOn,
      glucoseRowsLimit,
      negativeCorrectionalOn,
    } = this.props;
    const correctionFactor = getCorrectionFactor(correctionalOn, pick(this.props, correctionTargetParams));

    const cTarget = negativeCorrectionalOn ? 30 : correctionTarget;
    const minBgForTables = negativeCorrectionalOn ? 30 : hypoglycemiaGlucoseThresholdMild;
    const glucoseRanges = getGlucoseRanges(
      cTarget,
      correctionFactor,
      hyperglycemiaThresholdEmergency,
      glucoseRowsLimit
    );
    // Calculate the number of rows before Hypo (for negative corrections)
    let factorMultiplier = 0;
    if (negativeCorrectionalOn) {
      factorMultiplier = glucoseRanges.reduce((acc, range) => acc - (range.min < hypoglycemiaGlucoseThresholdMild), 0);
    }
    const minFactorMultiplier = factorMultiplier;
    // Return the doses
    return map(glucoseRanges, (dose) => {
      const doseObject = (
        <tr key={(`dose-element - ${dose.min}`)}>
          <td className="dose" key="non-dose-heading-renderDoses">
            {factorMultiplier !== minFactorMultiplier ? dose.min : minBgForTables} - {dose.max}
          </td>
          {map(timeWindows, this.renderTimeWindowDose(
            factorMultiplier,
            glucoseRanges.length,
            minFactorMultiplier,
          ))}
        </tr>
      );
      if (dose.min < hypoglycemiaGlucoseThresholdMild || dose.min >= (correctionTarget - correctionFactor)) {
        factorMultiplier += 1;
      }
      return doseObject;
    });
  }

  renderExtremes(timeWindows, condition) {
    const {
      hypoglycemiaGlucoseThresholdMild,
      hyperglycemiaThresholdEmergency,
      negativeCorrectionalOn,
    } = this.props;

    let extremeText = `${hyperglycemiaThresholdEmergency}+`;
    if (condition === 'hypo' && negativeCorrectionalOn) {
      extremeText = '< 30';
    } else if (condition === 'hypo') {
      extremeText = `< ${hypoglycemiaGlucoseThresholdMild}`;
    }

    return (
      <tr key={`extremes-tr-${condition}`}>
        <td className={condition} key="non-dose-heading-renderExtremes">
          {extremeText}
        </td>
        {
          map(timeWindows, (timeWindow, index) => (
            <td key={(`${condition}-extreme - ${index}`)} className={condition}>{condition}</td>
          ))
        }
      </tr>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderMeals(timeWindows) {
    return (
      <React.Fragment>
        <tr className="meal-time-heading" key="meals-tr">
          <td className="non-dose heading" key="non-dose-heading-renderMeals">Mealtime</td>
          {
            map(timeWindows, (timeWindow, index) => (
              <td key={(`meal-element - ${index}`)}>
                <div className="heading">
                  {capitalize(timeWindow.name)}
                </div>
                <div>
                  {getTimeInSimpleFormat(timeWindow.startTime)}-
                  {getTimeInSimpleFormat(timeWindow.stopTime)}
                </div>
              </td>
            ))
          }
        </tr>
      </React.Fragment>
    );
  }

  render() {
    const timeWindows = getSortedTimeSlots(this.props.timeWindows);

    return (
      <div>
        {
          !this.props.carbModalOpen &&
          <FeatureCardWithHeader
            header="Insulin Prescription"
            showPreLoader={this.props.shouldLoadSpinner}
          >
            <List
              itemList={timeWindows}
              noItemMessage="No Prescription Data"
              showBorder="true"
            >
              <div className={classNames(styles['insulin-prescription'], 'clearfix')}>
                <span>
                  <div className="content">
                    <table className="insulin-prescription-table">
                      <tbody>
                        {this.renderMeals(timeWindows)}
                        {this.renderBgCheck(timeWindows)}
                        {this.props.correctionalOn ? this.renderCorrectionalOn(timeWindows) : null}
                        {this.renderExtremes(timeWindows, 'hypo')}
                        {this.renderDoses(timeWindows)}
                        {this.renderExtremes(timeWindows, 'hyper')}
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
            </List>
          </FeatureCardWithHeader>
        }
        { this.renderCarbCountingModal(this.props.insulinRegimen.includes('carb_counting'), this.props.carbModalOpen) }
      </div>
    );
  }
}

InsulinPrescription.propTypes = {
  timeWindows: PropTypes.object,
  hypoglycemiaGlucoseThresholdMild: PropTypes.number,
  hyperglycemiaThresholdEmergency: PropTypes.number,
  correctionTarget: PropTypes.number,
  correctionFactor: PropTypes.number,
  correctionIncrement: PropTypes.number,
  correctionalOn: PropTypes.bool,
  onChangeFormInput: PropTypes.func.isRequired,
  insulinRegimen: PropTypes.string,
  shouldLoadSpinner: PropTypes.bool,
  glucoseRowsLimit: PropTypes.number,
  negativeCorrectionalOn: PropTypes.bool,
};

InsulinPrescription.defaultProps = {
  timeWindows: {},
  hyperglycemiaThresholdEmergency: 0,
  hypoglycemiaGlucoseThresholdMild: 0,
  correctionFactor: 1,
  correctionTarget: 0,
  correctionIncrement: 0,
  correctionalOn: false,
  insulinRegimen: '',
  saveChangesIsValid: false,
  shouldLoadSpinner: false,
  glucoseRowsLimit: 5,
  negativeCorrectionalOn: false,
};

export default InsulinPrescription;
