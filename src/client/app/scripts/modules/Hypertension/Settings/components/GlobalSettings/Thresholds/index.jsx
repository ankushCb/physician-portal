import React from 'react';
import PropTypes from 'prop-types';

import ThresholdElement from './ThresholdElement.jsx';

import Card from '../../../../../Common/Presentational/MaterialCard';
import styles from './styles.scss';

const Thresholds = props => (
  <div className={styles.thresholds}>
    <Card
      Title="Thresholds"
      additionalClass="threshold-wrapper"
    >
      <ThresholdElement
        title="Hyper"
        systolicName="hypertensionSystolicThreshold"
        systolicMax={300}
        systolicMin={Math.max(1, props.thresholdSevere + 1)}
        diastolicName="hypertensionDiastolicThreshold"
        diastolicMax={150}
        diastolicMin={Math.max(1, props.thresholdMild + 1)}
      />
      <div className="line-seperator" />
      <ThresholdElement
        title="Goal BP"
        systolicName="hypertensionThresholdMild"
        systolicMax={props.hyperSystolic - 1}
        systolicMin={props.hypoSystolic + 1}
        diastolicName="hypotensionThreshold"
        diastolicMax={props.hyperDiastolic - 1}
        diastolicMin={props.hypoDiastolic + 1}
      />
      <div className="line-seperator" />
      <ThresholdElement
        title="Hypo"
        systolicName="hypotensionSystolicThreshold"
        systolicMax={Math.min(100, props.thresholdSevere - 1)}
        systolicMin={1}
        diastolicName="hypotensionDiastolicThreshold"
        diastolicMax={Math.min(100, props.thresholdMild - 1)}
        diastolicMin={1}
      />
    </Card>
  </div>
);

Thresholds.propTypes = {
  hyperSystolic: PropTypes.number.isRequired,
  hyperDiastolic: PropTypes.number.isRequired,
  hypoSystolic: PropTypes.number.isRequired,
  hypoDiastolic: PropTypes.number.isRequired,
  thresholdSevere: PropTypes.number.isRequired,
  thresholdMild: PropTypes.number.isRequired,
};

export default Thresholds;
