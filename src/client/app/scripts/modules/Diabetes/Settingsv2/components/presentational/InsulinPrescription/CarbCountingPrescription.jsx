import React from 'react';
import PropTypes from 'prop-types';

import CarbCountingDoseTable from './CarbCountingDoseTable.jsx';

import styles from './styles.scss';

const CarbCountingPrescription = (props) => {
  return (
    <div
      className={styles['carb-counting-prescription']}
      style={props.style || {}}
    >
      <div className="body">
        <div className="heading">
          Carb Counting
          <div
            className="close-btn"
            onClick={props.toggleDisplayCC}
          >
            Back to settings
          </div>
        </div>
        {
          props.logTable.map(meal => (
            <CarbCountingDoseTable
              data={meal}
              key={meal.name}
              insulinRegimen={props.insulinRegimen}
              correctionalDetails={props.correctionalDetails}
              diabetesThresholds={props.diabetesThresholds}
            />
          ))
        }
      </div>
    </div>
  );
};

CarbCountingPrescription.propTypes = {
  logTable: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleDisplayCC: PropTypes.func.isRequired,
};

CarbCountingPrescription.defaultProps = {
  insulinRegimen: 'custom',
};

export default CarbCountingPrescription;
