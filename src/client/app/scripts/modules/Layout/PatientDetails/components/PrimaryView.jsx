import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import upperFirst from 'lodash/upperFirst';
import SecondaryView from './SecondaryView.jsx';
import ShowPreLoader from '../../../Common/Presentational/ShowPreloader.jsx';

const PrimaryView = ({ 
  patientData,
  onClickMore,
  showSecondaryView,
  ...props 
}) => (
  <div className={`patient-details-header ${showSecondaryView ? 'expand' : ''}`}>
    <ShowPreLoader show={props.isFetching}>
      <Row className="patient-details-row">
        <Col xs={4} className="name">
          {upperFirst(patientData.name)}
        </Col>
        <Col xsOffset={1} xs={4} className="patient-detail-col">
          <span className="patient-value no-margin-left">
            {upperFirst(patientData.gender)} •
          </span>
          <span className="patient-value">
            {patientData.age}  •  {patientData.birthdate}  •  {patientData.mobileTelecom}
          </span>
        </Col>
        <Col xs={1} className="patient-detail-col">
          <span 
            onClick={onClickMore}
            className="toggle">
            {showSecondaryView ? 'Less' : 'More'}
          </span>
        </Col>
      </Row>
      {
        showSecondaryView && (
          <SecondaryView
            patientData={patientData}
          />
        )
      }
    </ShowPreLoader>
  </div>
);

export default PrimaryView;