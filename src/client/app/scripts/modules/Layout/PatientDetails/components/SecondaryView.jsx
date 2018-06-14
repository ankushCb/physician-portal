import React from 'react';
import upperFirst from 'lodash/upperFirst';
import { Row, Col } from 'react-flexbox-grid';
import map from 'lodash/map';

import styles from './styles.scss';

const firstColumn = [ 
  {
    name: 'gender',
    label: 'Gender',
  },
  {
    name: 'birthdate',
    label: 'DOB'
  },
  {
    name: 'age',
    label: 'Age',
  },
  {
    name: 'clinic',
    label: 'Clinics'
  },
];

const secondColumn = [
  {
    name: 'dosedr',
    label: 'DoseDr',
  },
  {
    name: 'mobileTelecom',
    label: 'Phone',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'pcp',
    label: 'PCP',
  }
];

const SecondaryColumn = ({ patientData, keyMap }) => {
  return map(keyMap, ({ name, label }) => (
    <Row>
      <Col xs={2} className="secondary-name">
        {label}
      </Col>
      <Col xs={5} className="patient-value">
        {patientData[name] || '-'}
      </Col>
    </Row>
  ));
};

const SecondaryView = ({ patientData, ...props }) => (
  <div className="secondary-view">
    <Row>
      <Col className="secondary-container" xs={4}>
        <SecondaryColumn
          patientData={patientData}
          keyMap={firstColumn}
        />
      </Col>
      <Col xs={4}>
        <SecondaryColumn
          patientData={patientData}
          keyMap={secondColumn}
        />
      </Col>
    </Row>
  </div>
);

export default SecondaryView;