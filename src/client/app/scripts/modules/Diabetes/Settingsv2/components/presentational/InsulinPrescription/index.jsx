import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { change } from 'redux-form/immutable';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import isEqual from 'lodash/isEqual';

import toJS from '../../../../../Common/Presentational/toJS';
import List from '../../../../../Common/Presentational/List.jsx';
import { isCarbCountingMeal } from '../../../../../../helpers/timeWindowHelpers';
import { generateLogTable, limitDose } from './helpers';

import CarbCountingPrescription from './CarbCountingPrescription.jsx';
import { getTimeInSimpleFormat } from '../../../../../../helpers/time.js';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';

import styles from './styles.scss';

class InsulinPrescription extends React.Component {
  constructor() {
    super();

    this.generateLogTable = generateLogTable.bind(this);
    this.renderDoseRow = this.renderDoseRow.bind(this);
    this.renderCC = this.renderCC.bind(this);
  }

  renderCC(rowIndex, dosesLength, mealId) {
    return (
      <td
        className="dose"
        key={(`twd-with-carb-counting - ${mealId}`)}
        onClick={this.props.toggleDisplayCC}
        style={{ cursor: 'pointer' }}
      >
        {
          (rowIndex === Math.ceil(dosesLength / 2)) ? 'CC' : null
        }
      </td>
    );
  }

  renderBgCheck() {
    const { scheduleData } = this.props;
    return (
      <tr className="bg-check-tr" key={'bg-check-tr'}>
        <td className="non-dose heading" key={'non-dose-heading-bg-check'}>bG Check?</td>
        {
          map(scheduleData, row => row.isDisplayed && (
            <td key={`${row.patchUrl.split('/')[5]}`}>
              { row.bgCheck && <div className="check-mark" /> }
            </td>
          ))
        }
      </tr>
    );
  }

  renderCorrectionalOn() {
    const { scheduleData } = this.props;
    return (
      <tr className="bg-check-tr" key={'correction-tr'}>
        <td className="non-dose heading" key={'non-dose-heading-bg-check'}>Correction</td>
        {
          map(scheduleData, row => row.isDisplayed && (
            <td key={`${row.name}`}>
              { row.correctionalInsulinOn && <div className="plus-mark"> + </div> }
            </td>
          ))
        }
      </tr>
    );
  }

  renderDoseRow(logTable, glucoseIndex, dLength) {
    const row = logTable.map((meal) => {
      const doseTable = meal.doseTable;
      const mealId = meal.patchUrl.split('/')[5];

      // If meal is carbCountitng meal, show CC
      if (isCarbCountingMeal(this.props.regimenData.insulinRegimen, meal.name)) {
        const dosesLength = dLength || meal.doseTable.length;
        return this.renderCC(glucoseIndex, dosesLength, mealId);
      }

      const doses = doseTable[glucoseIndex].carb_table.doses;
      let doseToDisplay = `${limitDose(doses[0].insulin_dose)}`;
      // First value of the array is base dose and second is correctional.
      // When correctional values appear, show them as separate number in the format
      // baseDose + correctional or baseDose - correctional
      if (doses && doses[1]) {
        const corrValue = doses[1].insulin_dose;
        if (corrValue > 0) {
          doseToDisplay += ` + ${limitDose(doses[1].insulin_dose)}`;
        }
      }
      return meal.isDisplayed && <td className="dose" key={(`twd-dose-info - ${mealId}`)}>{doseToDisplay}</td>;
    });

    return row;
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
  renderDoses(logTable) {
    if (!logTable || !logTable.length) {
      return null;
    }

    const doseTable = logTable[0].doseTable;
    const glucoseRanges = logTable && doseTable.map((row, i) => {
      const hyperglycemiaThresholdEmergency = this.props.diabetesThresholds.hyperglycemiaThresholdEmergency;
      return (i === (doseTable.length - 1)) ? `${row.bg_reading} - ${hyperglycemiaThresholdEmergency}` :
        `${row.bg_reading} - ${doseTable[i + 1].bg_reading}`;
    });

    // For each range, render the corresponding insulin value in the meal
    return glucoseRanges.map((range, index) => (
      <tr key={(`dose-element - ${range}`)}>
        <td className="dose">{range}</td>
        { this.renderDoseRow(logTable, index, glucoseRanges.length) }
      </tr>
    ));
  }

  renderExtremes(condition) {
    const { scheduleData, diabetesThresholds, correctionalDetails } = this.props;
    const {
      hypoglycemiaGlucoseThresholdMild,
      hyperglycemiaThresholdEmergency,
    } = diabetesThresholds;
    const { negativeCorrectionalOn } = correctionalDetails;

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
          map(scheduleData, (row, index) => row.isDisplayed &&
          (
            <td key={(`${condition}-extreme - ${index}`)} className={condition}>{condition}</td>
          ))
        }
      </tr>
    );
  }

  renderMeals() {
    const { scheduleData } = this.props;
    return (
      <React.Fragment>
        <tr className="meal-time-heading" key="meals-tr">
          <td className="non-dose heading" key="non-dose-heading-renderMeals">Mealtime</td>
          {
            map(scheduleData, (row, index) => {
              return row.isDisplayed &&
              (
                <td key={(`meal-element - ${index}`)}>
                  <div className="heading">
                    {capitalize(row.name)}
                  </div>
                  <div>
                    {getTimeInSimpleFormat(row.timings[0])}-
                    {getTimeInSimpleFormat(row.timings[1])}
                  </div>
                </td>
              );
            },
          )
          }
        </tr>
      </React.Fragment>
    );
  }

  render() {
    const { correctionalDetails, saveLogTableInSchedule, scheduleData } = this.props;
    const logTable = this.generateLogTable(this.props);

    // Save the generated Log Table in the schedule table data for saving
    logTable.forEach((meal, index) => {
      if (!isEqual(meal.doseTable, scheduleData[index].doseTable)) {
        saveLogTableInSchedule(index, fromJS(meal.doseTable));
      }
    });

    return (
      <div>
        {
          <FeatureCardWithHeader header="Insulin Prescription">
            <List
              itemList={logTable.filter(log => log.isDisplayed)}
              noItemMessage="No Prescription Data"
              showBorder="true"
            >
              {
                (
                  <div
                    className={classNames(styles['insulin-prescription'], 'clearfix')}
                    style={{
                      display: (this.props.showCCTable ? 'none' : 'initial'),
                    }}
                  >
                    <span>
                      <div className="content">
                        <table className="insulin-prescription-table">
                          <tbody>
                            {this.renderMeals()}
                            {this.renderBgCheck()}
                            {correctionalDetails.correctionalOn && this.renderCorrectionalOn()}
                            {this.renderExtremes('hypo')}
                            {this.renderDoses(logTable)}
                            {this.renderExtremes('hyper')}
                          </tbody>
                        </table>
                      </div>
                    </span>
                  </div>
                )
              }
              {
                (
                  <CarbCountingPrescription
                    logTable={logTable}
                    correctionalDetails={this.props.correctionalDetails}
                    diabetesThresholds={this.props.diabetesThresholds}
                    insulinRegimen={this.props.regimenData.insulinRegimen}
                    toggleDisplayCC={this.props.toggleDisplayCC}
                    style={{ display: (this.props.showCCTable ? 'initial' : 'none') }}
                  />
                )
              }
            </List>
          </FeatureCardWithHeader>
        }
      </div>
    );
  }
}

InsulinPrescription.propTypes = {
  scheduleData: PropTypes.arrayOf(PropTypes.object),
  diabetesThresholds: PropTypes.shape({
    hyperglycemiaThresholdEmergency: PropTypes.number,
  }),
  correctionalDetails: PropTypes.shape({
    correctionalOn: PropTypes.bool,
    correctionFactor: PropTypes.number,
  }),
  toggleDisplayCC: PropTypes.func.isRequired,
  regimenData: PropTypes.shape({
    insulinRegimen: PropTypes.string.isRequired,
  }),
};

InsulinPrescription.defaultProps = {
  scheduleData: [],
  diabetesThresholds: {
    hyperglycemiaThresholdEmergency: 500,
  },
  correctionalDetails: {
    correctionalOn: false,
    correctionFactor: 1,
  },
  selectedInsulins: {},
  insulinList: [],
  regimenData: {
    insulinRegimen: 'custom',
  },
  saveLogTableInSchedule: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  saveLogTableInSchedule: (index, value) => change('diabetesSettingsForm', `scheduleData[${index}].doseTable`, value),
};

export default connect(null, mapDispatchToProps)(toJS(InsulinPrescription));
