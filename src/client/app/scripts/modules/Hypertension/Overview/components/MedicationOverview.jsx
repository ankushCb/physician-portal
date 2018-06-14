import React from 'react';
import { arrayOf, String, shape, object } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import map from 'lodash/map';

import CardWithHeader from '../../../Common/Presentational/MaterialCard';

import styles from './styles.scss';

const renderMedication = (heading, medications, mealTime = {}) => (
  <Col xs={3}>
    <CardWithHeader
      additionalClass="medication-overview-card"
    >
      <div className="medication">
        <div className="heading">{heading}</div>
        {
          !isEmpty(mealTime) ? <div className="timer">{moment(mealTime.startTime, 'HH:mm').format('hh:mm A')} - {moment(mealTime.stopTime, 'HH:mm').format('hh:mm A')}</div> : null
        }
        <div className="line-saperator" />
        {
          (medications && medications.length) ?
          map(medications, (drug) => {
            return (
              <Row className="drug" key={drug.hypertensionMedName}>
                <Col xs={8}> <div className="left">{drug.hypertensionMedName} </div></Col>
                <Col xs={4}> <div className="right">{drug.dose} mg </div></Col>
              </Row>
            );
          }) :
          map([1, 2, 3, 4], i => <Row className="drug" key={i}> - </Row>)
        }
      </div>
    </CardWithHeader>
  </Col>
);

const MedicationOverview = ({ overview: { am, lunch, pm }, mealTimeData = {} }) => (
  <div className={styles['medication-overview']}>
    <Row center="xs">
      {renderMedication('AM', am, mealTimeData.breakfast)}
      {renderMedication('Lunch', lunch, mealTimeData.lunch)}
      {renderMedication('PM', pm, mealTimeData.bedtime)}
      {renderMedication('Comorbids', [])}
    </Row>
  </div>
);

MedicationOverview.propTypes = {
  overview: shape({
    am: arrayOf(String),
    lunch: arrayOf(String),
    pm: arrayOf(String),
  }).isRequired,
  mealTimeData: object,
};

export default MedicationOverview;
