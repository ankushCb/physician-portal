import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form/immutable';
import { connect } from 'react-redux';

import InputDecimal from '../../../../Common/FormElements/ReduxForm/InputDecimal';
import FrequencySelect from './FrequencySelect.jsx';

import EachCardSummary from './EachCardSummary.jsx';

const frequencyOptions = [
  {
    label: 'AM',
    value: 'AM',
  },
  {
    label: 'PM',
    value: 'PM'
  },
  {
    label: 'bid',
    value: 'bid',
  },
];
const handleQdFormatting = (values, name) => {
  if (values.get(0) && values.get(2)) {
    return 'bid';
  } else if (values.get(0)) {
    return 'AM';
  } else {
    return 'PM';
  }
}
const EachScheduleCard = ({
  freq,
  itemName,
  isHavingMedication,
  dose,
  hyperTensionMedName,
  isPsuedoBid,
  idSorted,
  ...props,
}) => {
  const renderFrequency = (type) => {
    switch(type) {
      case 'bid':
        return (
          <div className="static">
            BiD
          </div>
        );
      case 'tid':
        return (
          <div className="static">
            TiD
          </div>
        );
      
      case 'qd':
        return (
          <div>
            <Field
              name={`${itemName}.doseDetails.isHavingMedication`}
              component={FrequencySelect}
              options={frequencyOptions}
              idSorted={idSorted}
              format={handleQdFormatting}
            />
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div>
    <Row className="dose">
      <Col xs={6} className="name">
          Daily Dose
        </Col>
        <Col xs={6} className="ht-value">
          <Field
            component={InputDecimal}
            name={`${itemName}.dose`}
            min={1}
          />
        </Col>
      </Row>
      <Row className="freq">
        <Col xs={6} className="name">
          Frequency
        </Col>
        <Col xs={6} className="ht-value">
          {renderFrequency(freq)}
        </Col>
      </Row>
      <div className="summary">
        <EachCardSummary
          freq={freq}
          dose={dose}
          isHavingMedication={isHavingMedication}
        />
      </div>
    </div>
  )
}


export default EachScheduleCard;
