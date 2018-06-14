import React from 'react';
import PropTypes from 'prop-types';

import MedicationResults from './MedicationResults.jsx';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import styles from './styles.scss';

const Results = ({ medicationData, mealTimings, ...props }) => (
  <div className={styles['result-container']}>
    <MedicationResults
      mealTimings={mealTimings}
      medicationData={medicationData}
    />
    <Button
      className="primary-button"
      onClick={props.buttonOnClick}
      disabled={props.disableButton}
      label="Submit prescription"
    />
  </div>
);

Results.propTypes = {
  scheduleList: PropTypes.object.isRequired,
};

Results.defaultProps = {

};

export default Results;
