import React from 'react';
import PropTypes from 'prop-types';
import InputNumber from '../../../../../Common/FormElements/Formsy/InputNumber';
import Card from '../../../../../Common/Presentational/MaterialCard';

const CardTitle = () => (
  <div className="card-header">
    Thresholds
  </div>
)

const LimitsEdit = (props) => {
  const handleSettingsChange = (name, value) => {
    props.onChangeInDiabetesSettings(name, Number(value));
  };

  return (
    <div className="thresholds">
      <Card
        TitleComponent={CardTitle}
        additionalClass="global-card"
      >
        <div className="glucose-settings-input hyper">
          <InputNumber
            wrapperClass="text-box"
            name="hyperglycemiaThresholdEmergency"
            value={props.hyperglycemiaThresholdEmergency}
            onChangeInput={handleSettingsChange}
            type="number"
            maxValue={800}
            minValue={props.hyperglycemiaTitrationThresholdSmall + 1}
            label="Hyper"
            labelClass="glucose-settings-label"
          />
        </div>
        <hr className="card-seperator" />
        <div className="glucose-settings-input hyper">
          <InputNumber
            wrapperClass="text-box"
            name="hyperglycemiaTitrationThresholdSmall"
            value={props.hyperglycemiaTitrationThresholdSmall}
            onChangeInput={handleSettingsChange}
            type="number"
            maxValue={props.hyperglycemiaThresholdEmergency - 1}
            minValue={props.hypoglycemiaGlucoseThresholdMild + 1}
            label="Goal"
            labelClass="glucose-settings-label"
          />
        </div>
        <hr className="card-seperator" />
        <div className="glucose-settings-input hyper">
          <InputNumber
            wrapperClass="text-box"
            name="hypoglycemiaGlucoseThresholdMild"
            value={props.hypoglycemiaGlucoseThresholdMild}
            onChangeInput={handleSettingsChange}
            type="number"
            maxValue={props.hyperglycemiaTitrationThresholdSmall - 1}
            minValue={40}
            label="Hypo"
            labelClass="glucose-settings-label"
          />
        </div>
      </Card>
    </div>
  );
};

LimitsEdit.propTypes = {
  hyperglycemiaThresholdEmergency: PropTypes.number,
  hyperglycemiaTitrationThresholdSmall: PropTypes.number,
  hypoglycemiaGlucoseThresholdMild: PropTypes.number,
  onChangeInDiabetesSettings: PropTypes.func.isRequired,
};

LimitsEdit.defaultProps = {
  hyperglycemiaThresholdEmergency: 42,
  hyperglycemiaTitrationThresholdSmall: 41,
  hypoglycemiaGlucoseThresholdMild: 40,
};

export default LimitsEdit;
