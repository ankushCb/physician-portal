import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form/immutable';
import { Iterable } from 'immutable';
import lowerCase from 'lodash/lowerCase';

import Card from '../../../../../Common/Presentational/MaterialCard';
import InputNumber from '../../../../../Common/FormElements/ReduxForm/InputNumber';
import { isValidCarbCountMeal } from '../../../../../../helpers/timeWindowHelpers';

const getInsulinName = (insulinList, insulin) => {
  const filtered = insulinList.filter(i => i.id === insulin.bolus);
  return filtered.length ? filtered[0].name : null;
};

class CarbCounting extends React.Component {
  constructor(props) {
    super(props);

    this.handleCarbCountRatioChange = this.handleCarbCountRatioChange.bind(this);
  }

  handleCarbCountRatioChange(event, value) {
    const { scheduleData, changeCarbCountingRatioInScheduleTable } = this.props;
    scheduleData.toSeq().forEach((row, i) => {
      if (isValidCarbCountMeal(lowerCase(row.get('name')))) {
        changeCarbCountingRatioInScheduleTable(value, i);
      }
    });
  }

  render() {
    let { insulinList, carbCountingDetails, selectedInsulins } = this.props;
    insulinList = Iterable.isIterable(insulinList) ? insulinList.toJS() : insulinList;
    carbCountingDetails = Iterable.isIterable(carbCountingDetails) ? carbCountingDetails.toJS() : carbCountingDetails;
    selectedInsulins = Iterable.isIterable(selectedInsulins) ? selectedInsulins.toJS() : selectedInsulins;

    return (
      <Card additionalClass="global-card">
        <div className="carb-counting">
          <div className="sub-heading">
            Carb Count
          </div>
          <div className="glucose-settings-input" style={{ marginBottom: '0' }}>
            <div className="carb-label">Bolus:</div>
            <div className="carb-value">
              { getInsulinName(insulinList, selectedInsulins) || 'Choose Bolus' }
            </div>
            <div style={{ clear: 'both' }} />
          </div>
          <hr className="card-seperator" />
          <div className="glucose-settings-input">
            <Field
              component={InputNumber}
              name="carbCountingDetails.carbCountingRatio"
              label="Carbs"
              min={0}
              max={100}
              inputClass="input-threshold"
              labelClass="glucose-settings-label"
              wrapperClass="text-box"
              onChange={this.handleCarbCountRatioChange}
            />
          </div>
          <hr className="card-seperator" />
          <div className="glucose-settings-input">
            <div className="carb-label">Units:&nbsp;</div>
            <div className="carb-value">{carbCountingDetails.insulinUnits} Unit</div>
            <div style={{ clear: 'both' }} />
          </div>
          <p className="note">
            {carbCountingDetails.insulinUnits} unit of insulin is given for each
            &nbsp;{carbCountingDetails.carbCountingRatio}g of carbohydrate
          </p>
        </div>
      </Card>
    );
  }
}

CarbCounting.propTypes = {
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeCarbCountingRatioInScheduleTable: PropTypes.func.isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  carbCountingDetails: PropTypes.object.isRequired,
  selectedInsulins: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  changeCarbCountingRatioInScheduleTable: (value, index) =>
    change('diabetesSettingsForm', `scheduleData[${index}].carbCountingRatio`, value),
};

export default connect(null, mapDispatchToProps)(CarbCounting);
