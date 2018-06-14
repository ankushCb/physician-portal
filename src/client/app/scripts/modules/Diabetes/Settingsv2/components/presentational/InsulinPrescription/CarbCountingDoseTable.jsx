import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import capitalize from 'lodash/capitalize';
import times from 'lodash/times';

import { isCarbCountingMeal } from '../../../../../../helpers/timeWindowHelpers';
import { getTimeInSimpleFormat } from '../../../../../../helpers/time.js';

import styles from './styles.scss';

const noOfCarbRanges = 10;

const getCarbRanges = (ratio, units) => {
  const ranges = [];
  let max = ratio;
  let min = 0;

  while (max <= ratio * noOfCarbRanges) {
    ranges.push({ min, max });
    min = max + units;
    max += ratio;
  }
  return ranges;
};

const renderDosage = (dose, range, index) => {
  if (dose < 0) { dose = 0; }
  if (dose > 200) { dose = 200; }
  return (<td key={`${range}-${index}`}>{ dose }</td>);
};

const renderDoses = (data, emergency) => {
  const doseTable = data.doseTable;
  const glucoseRanges = doseTable.map((row, i) => {
    return (i === (doseTable.length - 1)) ? `${row.bg_reading} - ${emergency}` :
      `${row.bg_reading} - ${doseTable[i + 1].bg_reading}`;
  });

  // For each range, render the corresponding insulin value in the meal
  return glucoseRanges.map((range, index) => (
    <tr key={(`${range}`)}>
      <td className="glucose-range">{range}</td>
      { doseTable[index].carb_table.map((cTable, i) =>
          renderDosage(cTable.doses[0].insulin_dose, range, i)) }
    </tr>
  ));
};

const renderExtremes = (condition, props) => {
  const { diabetesThresholds, correctionalDetails } = props;
  const {
    hypoglycemiaGlucoseThresholdMild,
    hyperglycemiaThresholdEmergency,
  } = diabetesThresholds;
  const { negativeCorrectionalOn } = correctionalDetails;

  let value = `${hyperglycemiaThresholdEmergency}+`;
  if (condition === 'hypo' && negativeCorrectionalOn) {
    value = '< 30';
  } else if (condition === 'hypo') {
    value = `< ${hypoglycemiaGlucoseThresholdMild}`;
  }

  return (
    <tr>
      <td className="extremes glucose-range"> {value} </td>
      {
        times(10, (a, index) => <td key={index} className={condition}>{condition}</td>)
      }
    </tr>
  );
};

const renderCarbRangesRow = (ratio, units = 0) => (
  <tr className="carb-range-row">
    <td className="carb-ranges">
      <div className="">Glucose</div>
    </td>
    {
      getCarbRanges(ratio, units).map(range => (
        <td key={`${range.min}${range.max}`} className="carb-ranges">
          <div className="">Carbs</div>
          <div className="range">{range.min} - {range.max}</div>
        </td>
      ))
    }
  </tr>
);

const CarbCountingDoseTable = props => props.data.isDisplayed &&
isCarbCountingMeal(props.insulinRegimen, props.data.name) &&
(
  <div className={styles['carb-counting-dose-table']}>
    <div className="details">
      <Row>
        <Col xs={5}>
          {capitalize(props.data.name)}
          &nbsp;&nbsp;
          {getTimeInSimpleFormat(props.data.timings[0])}
          -
          {getTimeInSimpleFormat(props.data.timings[1])}
        </Col>
        <Col xs={3}>Insulin: {props.data.insulin.name}</Col>
      </Row>
    </div>
    <table className="dose-table">
      <tbody>
        { renderCarbRangesRow(props.data.carbCountingRatio || 15) }
        { renderExtremes('hypo', props) }
        { renderDoses(props.data, props.diabetesThresholds.hyperglycemiaThresholdEmergency) }
        { renderExtremes('hyper', props) }
      </tbody>
    </table>
  </div>
);

CarbCountingDoseTable.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CarbCountingDoseTable;
