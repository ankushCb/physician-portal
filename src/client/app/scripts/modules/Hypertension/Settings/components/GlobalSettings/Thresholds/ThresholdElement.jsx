import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import SimpleInputNumber from '../../../../../Common/FormElements/ReduxForm/InputNumber';

import styles from './styles.scss';

const ThresholdElement = ({ title, systolicName, diastolicName, ...props }) => (
  <div className={styles['threshold-element']}>
    <div className="thresholds-title">{title}</div>
    <div className="threshold-inputs">
      <Field
        name={`thresholds.${systolicName}`}
        type="number"
        component={SimpleInputNumber}
        max={props.systolicMax}
        min={props.systolicMin}
      />
      <div className="threshold-divider">
        /
      </div>
      <Field
        name={`thresholds.${diastolicName}`}
        type="number"
        component={SimpleInputNumber}
        max={props.diastolicMax}
        min={props.diastolicMin}
      />
    </div>
  </div>
);

ThresholdElement.propTypes = {
  title: PropTypes.string.isRequired,
  systolicName: PropTypes.string.isRequired,
  diastolicName: PropTypes.string.isRequired,
  systolicMax: PropTypes.number,
  systolicMin: PropTypes.number,
  diastolicMax: PropTypes.number,
  diastolicMin: PropTypes.number,
};

ThresholdElement.defaultProps = {
  systolicMax: undefined,
  systolicMin: undefined,
  diastolicMax: undefined,
  diastolicMin: undefined,
};

export default ThresholdElement;
