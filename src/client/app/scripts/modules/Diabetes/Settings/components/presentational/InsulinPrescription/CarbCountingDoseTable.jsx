import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import map from 'lodash/map';
import rangeFunc from 'lodash/range';
import capitalize from 'lodash/capitalize';

import getGlucoseRanges from '../../../helpers/getGlucoseRanges.js';
import { getTimeInSimpleFormat } from '../../../../../../helpers/time.js';

import styles from './styles.scss';

const noOfCarbRanges = 10;

const getCarbRanges = (ratio, units) => {
  const ranges = [];
  let max = ratio;
  let min = 0;

  while (max <= ratio * noOfCarbRanges) {
    // console.log('max ', max, ratio, noOfCarbRanges, ratio * noOfCarbRanges)
    ranges.push({ min, max });
    min = max + units;
    max += ratio;
  }
  return ranges;
};

const renderDosage = baseDose => (index) => {
  const addedValues = baseDose + index;
  let dose = addedValues;
  if (dose < 0) { dose = 0; }
  if (dose > 200) { dose = 200; }
  return (<td key={index}>{ dose }</td>);
};

const renderDoses = (options) => {
  const {
    correctionFactor,
    hypoglycemiaGlucoseThresholdMild,
    hyperglycemiaThresholdEmergency,
    glucoseRowsLimit,
    negativeCorrectionalOn,
    correctionTarget,
    unitsInsulin,
  } = options;

  const cTarget = negativeCorrectionalOn ? 30 : correctionTarget;
  const minBgForTables = negativeCorrectionalOn ? 30 : hypoglycemiaGlucoseThresholdMild;

  const glucoseRanges = getGlucoseRanges(
    cTarget,
    correctionFactor,
    hyperglycemiaThresholdEmergency,
    glucoseRowsLimit);

  // Calculate the number of rows before Hypo (for negative corrections)
  let factorMultiplier = 0;
  if (negativeCorrectionalOn) {
    factorMultiplier = glucoseRanges.reduce((acc, range) => acc - (range.min < hypoglycemiaGlucoseThresholdMild), 0);
  }
  const minFactorMultiplier = factorMultiplier;

  return map(glucoseRanges, (glucose) => {
    const returnRange = (
      <tr key={factorMultiplier}>
        <td className="glucose-range">
          { factorMultiplier !== minFactorMultiplier ? glucose.min : minBgForTables }
          &nbsp;-&nbsp;
          {glucose.max}
        </td>
        {map(rangeFunc(noOfCarbRanges), renderDosage(unitsInsulin * (factorMultiplier + 1)))}
      </tr>
    );
    if (glucose.min < hypoglycemiaGlucoseThresholdMild || glucose.min >= (correctionTarget - correctionFactor)) {
      factorMultiplier += 1;
    }
    return returnRange;
  });
};

const renderExtremes = (condition, value, negativeCorrectionalOn) => {
  let computedValue = `${value}+`;
  if (condition === 'hypo' && negativeCorrectionalOn) {
    computedValue = '< 30';
  } else if (condition === 'hypo') {
    computedValue = `${value}`;
  }
  return (
    <tr>
      <td className="extremes glucose-range"> {computedValue} </td>
      {map(rangeFunc(noOfCarbRanges), (a, index) => <td key={index} className={condition}>{condition}</td>)}
    </tr>
  );
};

const renderCarbRangesRow = (ratio, units = 1) => (
  <tr className="carb-range-row">
    <td className="carb-ranges">
      <div className="">Glucose</div>
    </td>
    {
      map(getCarbRanges(ratio, units), (range, index) => (
        <td key={index} className="carb-ranges">
          <div className="">Carbs</div>
          <div className="range">{range.min} - {range.max}</div>
        </td>
      ))
    }
  </tr>
);

const renderPrescriptionTable = (options) => {

  return (
    <table className="dose-table">
      <tbody>
        {renderCarbRangesRow((options.carbCountingRatio || 15), options.unitsInsulin)}
        {renderExtremes('hypo', options.hypoglycemiaGlucoseThresholdMild, options.negativeCorrectionalOn)}
        {renderDoses(options)}
        {renderExtremes('hyper', options.hyperglycemiaThresholdEmergency, options.negativeCorrectionalOn)}
      </tbody>
    </table>
  );
};

const CarbCountingDoseTable = props => (
  <div className={styles['carb-counting-dose-table']}>
    <div className="details">
      <Row>
        <Col xs={5}>
          {capitalize(props.timeWindow.name)}
          &nbsp;&nbsp;
          {getTimeInSimpleFormat(props.timeWindow.startTime)}
          -
          {getTimeInSimpleFormat(props.timeWindow.stopTime)}
        </Col>
        <Col xs={3}>Insulin: {props.idInsulinMap[props.bolusInsulin]}</Col>
      </Row>
    </div>
    {
      renderPrescriptionTable({
        carbCountingRatio: props.timeWindow.carbCountingRatio,
        unitsInsulin: props.timeWindow.unitsInsulin,
        hypoglycemiaGlucoseThresholdMild: props.hypoglycemiaGlucoseThresholdMild,
        hyperglycemiaThresholdEmergency: props.hyperglycemiaThresholdEmergency,
        correctionTarget: props.correctionTarget,
        correctionFactor: props.correctionFactor,
        glucoseRowsLimit: props.glucoseRowsLimit,
        negativeCorrectionalOn: props.negativeCorrectionalOn,
      })
    }
  </div>
);

CarbCountingDoseTable.propTypes = {
  timeWindow: PropTypes.object,
  hypoglycemiaGlucoseThresholdMild: PropTypes.number,
  hyperglycemiaThresholdEmergency: PropTypes.number,
  correctionTarget: PropTypes.number,
  correctionFactor: PropTypes.number,
  glucoseRowsLimit: PropTypes.number,
  idInsulinMap: PropTypes.object,
  bolusInsulin: PropTypes.string,
  negativeCorrectionalOn: PropTypes.bool.isRequired,
};

CarbCountingDoseTable.defaultProps = {
  timeWindow: {},
  insulin: '',
};

export default CarbCountingDoseTable;
