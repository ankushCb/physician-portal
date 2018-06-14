import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, change } from 'redux-form/immutable';

import InsulinNotSelectedValidation from '../../../../helpers/insulinNotSelectedValidation';
import GlobalSettings from './presentational/GlobalSettings/index.jsx';
import ScheduleContent from './presentational/ScheduleContent/index.jsx';
import InsulinPrescription from './presentational/InsulinPrescription/index.jsx';
import ChangeDecisionButtonGroup from './presentational/InsulinPrescription/ChangeDecisionButtonGroup.jsx';

const select = formValueSelector('diabetesSettingsForm');

/**
* Renders the entire diabetes settings form
* Entire diabetes settings page is wrapped using redux-form
* for easy state management from differnt parts of the page
*/
function DiabetesSettingsForm(props) {
  const regimenValidationSelector = InsulinNotSelectedValidation(props.scheduleData, props.selectedInsulins, props.regimenData) || {};
  // Pass up the latest form data before submitting
  const changeInitialValueManually = () => {
    props.changeInitialValueManually({
      insulinList: props.insulinList,
      selectedInsulins: props.selectedInsulins,
      diabetesThresholds: props.diabetesThresholds,
      regimenData: props.regimenData,
      correctionalDetails: props.correctionalDetails,
      carbCountingDetails: props.carbCountingDetails,
      scheduleData: props.scheduleData,
    });
  };

  return (
    <form>
      <GlobalSettings
        diabetesThresholds={props.diabetesThresholds}
        regimenData={props.regimenData}
        insulinList={props.insulinList}
        selectedInsulins={props.selectedInsulins}
        correctionalDetails={props.correctionalDetails}
        carbCountingDetails={props.carbCountingDetails}
        scheduleData={props.scheduleData}
        showCCTable={props.showCCTable}
        regimenValidationSelector={regimenValidationSelector}
        changeScheduleTableRow={props.changeScheduleTableRow}
      />
      <ScheduleContent {...props} />
      <InsulinPrescription
        diabetesThresholds={props.diabetesThresholds}
        regimenData={props.regimenData}
        insulinList={props.insulinList}
        selectedInsulins={props.selectedInsulins}
        correctionalDetails={props.correctionalDetails}
        carbCountingDetails={props.carbCountingDetails}
        scheduleData={props.scheduleData}
        showCCTable={props.showCCTable}
        toggleDisplayCC={props.toggleDisplayCC}
      />
      <ChangeDecisionButtonGroup
        diabetesThresholds={props.diabetesThresholds}
        regimenData={props.regimenData}
        correctionalDetails={props.correctionalDetails}
        carbCountingDetails={props.carbCountingDetails}
        scheduleData={props.scheduleData}
        selectedInsulins={props.selectedInsulins}
        insulinList={props.insulinList}
        glucoseRowsLimit={props.glucoseRowsLimit}
        regimenValidationSelector={regimenValidationSelector}
        changeInitialValueManually={changeInitialValueManually}
        disableDiscardButton={props.disableDiscardButton || props.pristine}
        showCCTable={props.showCCTable}
        // Pristine because onChange in parent fires when there is re initialize so that this never gets disabled
      />
    </form>
  );
}

DiabetesSettingsForm.propTypes = {
  diabetesThresholds: PropTypes.object.isRequired,
  regimenData: PropTypes.object.isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  correctionalDetails: PropTypes.object.isRequired,
  carbCountingDetails: PropTypes.object.isRequired,
  selectedInsulins: PropTypes.object.isRequired,
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCCTable: PropTypes.bool.isRequired,
  toggleDisplayCC: PropTypes.func.isRequired,
  glucoseRowsLimit: PropTypes.number.isRequired,
  disableDiscardButton: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  changeInitialValueManually: PropTypes.func.isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  scheduleData: select(state, 'scheduleData'),
  diabetesThresholds: select(state, 'diabetesThresholds'),
  regimenData: select(state, 'regimenData'),
  insulinList: select(state, 'insulinList'),
  selectedInsulins: select(state, 'selectedInsulins'),
  correctionalDetails: select(state, 'correctionalDetails'),
  carbCountingDetails: select(state, 'carbCountingDetails'),
});

const mapDispatchToProps = {
  changeScheduleTableRow: (index, value) => change('diabetesSettingsForm', `scheduleData[${index}]`, value),
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'diabetesSettingsForm',
  enableReinitialize: true })(DiabetesSettingsForm));
