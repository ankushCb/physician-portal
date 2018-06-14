import React from 'react';

import { reduxForm, Field } from 'redux-form/immutable';

import { Row, Col } from 'react-flexbox-grid';
import InputText from '../../../../Common/FinalDesignElements/ReduxForm/Toolbox/InputText';
import InputCheckBox from '../../../../Common/FinalDesignElements/ReduxForm/Toolbox/InputCheckBox';
import InputSelect from '../../../../Common/FinalDesignElements/ReduxForm/Toolbox/InputSelect';
import Card from '../../../../Common/Presentational/MaterialCard';

const options = [
  { value: 'EN-gb', label: 'England' },
  { value: 'ES-es', label: 'Spain'},
  { value: 'TH-th', label: 'Thailand' },
  { value: 'EN-en', label: 'USA'}
];

const TitleComponent = () => (
  <div>
    Title
  </div>
);

const Trial = () => (
  <div>
    <Card
      TitleComponent={TitleComponent}
    >
      <Row>
        <Col md={5} xs={5}>
          <Field
            name="text"
            component={InputText}
            input
            disabled
          />
        </Col>
      </Row>
      <Field
        name="check"
        component={InputCheckBox}
      />
      <Row>
        <Col md={5} xs={5}>
          <Field
            name="select"
            component={InputSelect}
            options={options}
          />
        </Col>
      </Row>
    </Card>
  </div>
);

export default reduxForm({
  form: 'trial',
})(Trial);
