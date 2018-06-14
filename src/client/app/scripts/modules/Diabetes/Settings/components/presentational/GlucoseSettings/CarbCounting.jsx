import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';

import Form from '../../../../../Common/Presentational/FormWithButton.jsx';
import Card from '../../../../../Common/Presentational/MaterialCard';
import { InputNumber } from '../../../../../Common/FormElements/Formsy';

class CarbCounting extends Component {
  constructor() {
    super();
    this.state = {
      gCarbs: 15,
      insulinUnits: 1,
    };

    this.handleGCarbsChange = this.handleGCarbsChange.bind(this);
  }

  componentDidMount() {
    // console.log('carb counting time windows ', this.props.carbCountingTimeWindows);
    // const carbCountingRatios = reduce(this.props.carbCountingTimeWindows, (ratios, window) => ({
    //   ...ratios,
    //   [`${window}.carbCountingRatio`]: this.state.gCarbs,
    // }), {});
    // this.props.onChangeFormInput(carbCountingRatios);
  }

  handleGCarbsChange(name, value) {
    this.setState({
      gCarbs: Number(value),
    }, () => {
      const carbCountingRatios = reduce(this.props.carbCountingTimeWindows, (ratios, window) => ({
        ...ratios,
        [`${window}.carbCountingRatio`]: Number(value),
      }), {});
      this.props.onChangeFormInput(carbCountingRatios);
    });
  }

  render() {
    return (
      <Card
        additionalClass="global-card"
        shouldDisableCard={this.props.shouldDisableCard}
      >
        <div className="carb-counting">
          <div className="sub-heading">
            Carb Count
          </div>
          <div className="glucose-settings-input carb-top">
            <div className="carb-label">Bolus:</div>
            <div className="bolus-value">{ this.props.bolusInsulin || 'Choose Bolus'}</div>
            <div style={{ clear: 'both' }} />
          </div>
          <hr className="card-seperator" />
          <div className="glucose-settings-input carb-mid">
            <Form className="carb-counting" shouldDisplayButton={false}>
              <InputNumber
                name="gCarbs"
                onChangeInput={this.handleGCarbsChange}
                label="Carbs"
                type="number"
                minValue={0}
                maxValue={100}
                wrapperClass="text-box"
                labelClass="main-label"
                disabled={this.props.isFieldDisabled}
              />
            </Form>
          </div>
          <hr className="card-seperator" />
          <div className="glucose-settings-input carb-bottom">
            <div className="carb-label">Units:&nbsp;</div>
            <div className="bolus-value">{this.state.insulinUnits} Unit</div>
            <div style={{ clear: 'both' }} />
          </div>
          <p className="note">
            {this.state.insulinUnits} unit of insulin is given for each
            &nbsp;{this.state.gCarbs}g of carbohydrate
          </p>
        </div>
      </Card>
    );
  }
}

CarbCounting.propTypes = {
  bolusInsulin: PropTypes.string,
  onChangeFormInput: PropTypes.func.isRequired,
  carbCountingTimeWindows: PropTypes.array,
};

CarbCounting.defaultProps = {
  bolusInsulin: '',
  carbCountingTimeWindows: [],
};

export default CarbCounting;
