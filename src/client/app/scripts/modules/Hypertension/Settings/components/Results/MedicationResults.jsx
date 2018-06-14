import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import map from 'lodash/map';
import pullAt from 'lodash/pullAt';
import findIndex from 'lodash/findIndex';

import EachMealResult from './EachMealResult.jsx';

import styles from './styles.scss';

const MedicationResults = ({ medicationData, mealTimings, ...props }) => {
  
  const renderMedications = () => {
    const processedData = map(medicationData, ({
      hyperTensionMedName: medName,
      dose,
      ...medication
    }) => {
      if (medication.frequency === 'qd' && medication.isPsuedoBid) {
        return [
          { medName, dose: dose / 2 },
          {},
          { medName, dose: dose / 2 }
        ];
      } else if (medication.frequency === 'qd' && !medication.isPsuedoBid) {
        return [
          medication.qdWindow[0] === 'AM' ? { medName, dose } : {},
          {},
          medication.qdWindow[0] === 'PM' ? { medName, dose } : {},
        ];
     } else if (medication.frequency === 'bid') {
       return [
         { medName, dose },
         {},
         { medName, dose },
       ];
     } else if (medication.frequency === 'tid') {
       return [
         { medName, dose },
         { medName, dose },
         { medName, dose },
       ];
     }
    });

    const firstCardData = map(processedData, data => data ? data[0] : '-');
    const secondCardData = map(processedData, data => data ? data[1] : '-');
    const thirdCardData = map(processedData, data => data ? data[2] : '-');

    return (
      <React.Fragment>
        <Col md={4} xs={10}>
          <EachMealResult
            meal="am"
            data={firstCardData}
            mealTimings={mealTimings}
          />
        </Col>
        <Col md={4} xs={10}>
          <EachMealResult
            meal="lunch"
            data={secondCardData}
            mealTimings={mealTimings}
          />
        </Col>
        <Col md={4} xs={10}>
          <EachMealResult
            meal="pm"
            data={thirdCardData}
            mealTimings={mealTimings}
          />
        </Col>
      </React.Fragment>
    );
  };

  return (
    <Row className={styles['medication-results']}>
      <Col md={10} xs={10}>
        <Row>
          {renderMedications()}
        </Row>
      </Col>
    </Row>
  );
};

MedicationResults.propTypes = {

};

MedicationResults.defaultProps = {

};

export default MedicationResults;
