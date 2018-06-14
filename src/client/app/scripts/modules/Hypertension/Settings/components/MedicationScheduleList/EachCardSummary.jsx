import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const EachCardSummary = ({ freq, dose, isHavingMedication, ...props }) => {
  switch(freq) {
    case 'tid':
      return (
        <React.Fragment>
          <Row className="each-row">
            <Col md={6} xs={6}>
              AM
            </Col>
            <Col md={6} xs={6}>
              {dose}
            </Col>
          </Row>
          <Row className="each-row">
            <Col md={6} xs={6}>
              Lunch
            </Col>
            <Col md={6} xs={6}>
              {dose}
            </Col>
          </Row>
          <Row className="each-row">
            <Col md={6} xs={6}>
              PM
            </Col>
            <Col md={6} xs={6}>
              {dose}
            </Col>
          </Row>
        </React.Fragment>
      );
    case 'bid':
      return (
        <React.Fragment>
          <Row className="each-row">
            <Col md={6} xs={6}>
              AM
            </Col>
            <Col md={6} xs={6}>
              {dose}
            </Col>
          </Row>
          <Row className="each-row">
            <Col md={6} xs={6}>
              PM
            </Col>
            <Col md={6} xs={6}>
              {dose}
            </Col>
          </Row>
        </React.Fragment>
      ); 
    case 'qd':
      return (
        <React.Fragment>
            {
              isHavingMedication[0] ? (
                <Row className="each-row">
                    <Col md={6} xs={6}>
                    AM
                  </Col>
                  <Col md={6} xs={6}>
                    {(isHavingMedication[0] && isHavingMedication[2]) ? dose/2 : dose}
                  </Col>
                </Row>
              ) : null
            }
            {
              isHavingMedication[2] ? (
                <Row className="each-row">
                    <Col md={6} xs={6}>
                    PM
                  </Col>
                  <Col md={6} xs={6}>
                  {(isHavingMedication[0] && isHavingMedication[2]) ? dose/2 : dose}
                  </Col>
                </Row>
              ) : null
            }
        </React.Fragment>
      );
  }
};

export default EachCardSummary;