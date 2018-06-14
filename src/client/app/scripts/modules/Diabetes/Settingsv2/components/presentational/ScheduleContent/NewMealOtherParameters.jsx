import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import reduce from 'lodash/reduce';

import InputSelect from '../../../../common/FormElements/InputSelect.js';
import InputNumber from '../../../../common/FormElements/InputNumber.js';
import InputCheck from '../../../../common/FormElements/InputCheckBox.js';

const params = [
  'insulin',
  'dose',
  'correctionalOn',
  'bgCheck',
];

const style = {
  labelStyle: {
    color: '#8D8D8D',
    fontWeight: 'bold',
  },
  wrapperStyle: {
    marginTop: '15px',
  },
  rowContainerStyle: {
    marginBottom: '15px',
  },
};

class NewMealOtherParameters extends React.Component {

  constructor() {
    super();
    this.assignRef = this.assignRef.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    return reduce(params, (values, ref) => ({
      ...values,
      [ref]: this[ref].getValue(),
    }), {});
  }

  assignRef(ref) {
    return (element) => {
      this[ref] = element;
    };
  }

  render() {
    return (
      <div className="new-meal other-parameters">
        <div style={style.rowContainerStyle}>
          <div 
            style={style.labelStyle}
          >Insulin</div>
          <InputSelect
            name="addNewMeal.insulin"
            options={this.props.insulinTypeOptions}
            value="bg"
            ref={this.assignRef('insulin')}
            wrapperStyle={style.wrapperStyle}
            style={{ fontSize: '12px' }}
          />
        </div>
        <div
          style={style.rowContainerStyle}
        >
          <div 
            style={style.labelStyle}
          >Dose</div>
            <InputNumber
              name="addNewMeal.dose"
              minValue={1}
              maxValue={99}
              value={this.props.dose}
              ref={this.assignRef('dose')}
              wrapperStyle={{ ...style.wrapperStyle, border: '1px solid #696969' }}
            />
        </div>
        <div className="parameter">
          
          <InputCheck
            name="addNewMeal.correction"
            value={this.props.correctionalOn}
            ref={this.assignRef('correctionalOn')}
            label="Correction"
            labelStyle={style.labelStyle}
            spanStyle={style.spanStyle}
          />
        </div>
        <div className="parameter">
          <InputCheck
            name="addNewMeal.bgCheck"
            value={this.props.bgCheck}
            ref={this.assignRef('bgCheck')}
            label="BG Check"
            labelStyle={style.labelStyle}
            spanStyle={style.spanStyle}
          />
        </div>
      </div>
    );
  }
}

NewMealOtherParameters.propTypes = {
  insulinTypeOptions: PropTypes.array,
};

NewMealOtherParameters.defaultProps = {
  insulinTypeOptions: [],
};

export default NewMealOtherParameters;
