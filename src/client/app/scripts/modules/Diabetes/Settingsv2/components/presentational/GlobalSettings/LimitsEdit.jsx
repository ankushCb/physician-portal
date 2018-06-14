import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import min from 'lodash/min';

import ReduxFormElements from '../../../../../Common/FormElements/ReduxForm';
import Card from '../../../../../Common/Presentational/MaterialCard';

const { InputNumber } = ReduxFormElements;

const CardTitle = () => <div className="card-header"> Thresholds </div>;

const LimitsEdit = ({ limits, correctionalDetails }) => {
  const {
    correctionalOn,
    correctionTarget,
  } = correctionalDetails;
  return (
    <div className="thresholds">
      <Card
        TitleComponent={CardTitle}
        additionalClass="global-card"
      >
        <div className="glucose-settings-input">
          <Field
            name="diabetesThresholds.hyperglycemiaThresholdEmergency"
            component={InputNumber}
            inputClass="input-threshold"
            label="Hyper"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            max={800}
            min={limits.hyperglycemiaTitrationThresholdSmall + 1}
          />
        </div>
        <hr className="card-seperator" />
        <div className="glucose-settings-input">
          <Field
            name="diabetesThresholds.hyperglycemiaTitrationThresholdSmall"
            component={InputNumber}
            inputClass="input-threshold"
            label="Goal"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            max={limits.hyperglycemiaThresholdEmergency - 1}
            min={limits.hypoglycemiaGlucoseThresholdMild + 1}
          />
        </div>
        <hr className="card-seperator" />
        <div className="glucose-settings-input">
          <Field
            name="diabetesThresholds.hypoglycemiaGlucoseThresholdMild"
            component={InputNumber}
            inputClass="input-threshold"
            label="Hypo"
            labelClass="glucose-settings-label"
            wrapperClass="text-box"
            max={min([
              limits.hyperglycemiaTitrationThresholdSmall,
              correctionalOn ? correctionTarget : 1000000,
            ]) - 1}
            min={40}
          />
        </div>
      </Card>
    </div>
  );
};

LimitsEdit.propTypes = {
  limits: PropTypes.shape({
    hyperglycemiaThresholdEmergency: PropTypes.number,
    hypoglycemiaGlucoseThresholdMild: PropTypes.number,
    hyperglycemiaTitrationThresholdSmall: PropTypes.number,
  }),
  correctionalDetails: PropTypes.shape({
    correctionalOn: PropTypes.bool,
    correctionTarget: PropTypes.number,
  }),
};

export default LimitsEdit;
