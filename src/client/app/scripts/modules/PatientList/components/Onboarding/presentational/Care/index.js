import React from 'react';
import PropTypes from 'prop-types';
import CareForm from './CareForm.js';

import styles from './styles.scss';

const Care = ({
  updateCareRow,
  validations,
  submitCareData,
  fetchStatus,
  navigateToSettings,
  switchToCancelForm,
}) => (
  <div className={styles['care-medication-list']}>
    <div className="header">
      <div className="modal-info">Enter Patient Medication</div>
      <div className="modal-number">3 / 3</div>
      <div className="clearfix" />
    </div>
    <CareForm
      updateCareRow={updateCareRow}
      validations={validations}
      submitCareData={submitCareData}
      fetchStatus={fetchStatus}
      navigateToSettings={navigateToSettings}
      switchToCancelForm={switchToCancelForm}
    />
  </div>
);

Care.propTypes = {
  updateCareRow: PropTypes.func.isRequired,
  validations: PropTypes.func.isRequired,
  submitCareData: PropTypes.func.isRequired,
  fetchStatus: PropTypes.object.isRequired,
  navigateToSettings: PropTypes.func.isRequired,
  switchToCancelForm: PropTypes.func.isRequired,
};

export default Care;
