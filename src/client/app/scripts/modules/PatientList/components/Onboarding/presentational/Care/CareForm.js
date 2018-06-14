import React from 'react';
import PropTypes from 'prop-types';

import CareMedicationForm from './CareMedicationList/CareMedicationForm.js';

const CareForm = ({
  validations,
  submitCareData,
  navigateToSettings,
  fetchStatus,
  switchToCancelForm,
}) => (
  <CareMedicationForm
    validations={validations}
    onSubmit={submitCareData}
    navigateToSettings={navigateToSettings}
    careStatus={fetchStatus.careStatus}
    switchToCancelForm={switchToCancelForm}
  />
);

CareForm.propTypes = {
  validations: PropTypes.func.isRequired,
  submitCareData: PropTypes.func.isRequired,
  navigateToSettings: PropTypes.func.isRequired,
  fetchStatus: PropTypes.object.isRequired,
  switchToCancelForm: PropTypes.func.isRequired,
};

export default CareForm;
