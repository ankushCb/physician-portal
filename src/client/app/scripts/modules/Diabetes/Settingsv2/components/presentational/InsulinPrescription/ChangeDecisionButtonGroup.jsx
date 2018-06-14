import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset } from 'redux-form/immutable';
import { bindActionCreators } from 'redux';

import { getCorrectionalTable } from './helpers';
import { getPatientId, getDiabetesPatchUrl, getIsPatchingSettings } from '../../../selectors';
import Button from '../../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import WarningModal from '../../../../../Common/Presentational/WarningModal.jsx';
import {
  timeWindowPatchActionCreator,
  diabetesSettingsPatchActionCreator,
 } from '../../../actionCreators';

import styles from './styles.scss';

class ChangeDecisionButtonGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSaveConfirmModal: false,
    };

    this.onClickSave = this.onClickSave.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onConfirmSave = this.onConfirmSave.bind(this);
  }

  onClickCancel() {
    this.setState({
      showSaveConfirmModal: false,
    });
  }

  onClickSave(event) {
    event.preventDefault();
    this.setState({
      showSaveConfirmModal: true,
    });
  }

  onConfirmSave() {
    const scheduleData = this.props.scheduleData.toJS();
    const selectedInsulins = this.props.selectedInsulins.toJS();
    const regimenData = this.props.regimenData.toJS();
    const insulinList = this.props.insulinList.toJS();
    const diabetesThresholds = this.props.diabetesThresholds.toJS();
    const correctionalDetails = this.props.correctionalDetails.toJS();

    this.props.changeInitialValueManually();

    this.props.timeWindowPatchActionCreator({
      scheduleData,
      selectedInsulins,
      regimenData,
      insulinList,
      patientId: this.props.patientId,
    });

    const correctionalTable = getCorrectionalTable(
      diabetesThresholds,
      correctionalDetails,
      scheduleData,
      this.props.glucoseRowsLimit,
    );

    this.props.diabetesSettingsPatchActionCreator({
      diabetesSettingsUrl: this.props.diabetesSettingsUrl,
      diabetesThresholds,
      regimenData,
      correctionalDetails,
      selectedInsulins,
      insulinList,
      correctionalTable,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isPatchingSettings && !nextProps.isPatchingSettings) {
      this.setState({
        showSaveConfirmModal: false,
      });
    }
  }

  render() {
    const {
      isBasalRequired,
      isBolusRequired,
      isMixedRequired,
      isPremadeRequired,
    } = this.props.regimenValidationSelector;

    const shouldSaveDisabled = (isBasalRequired || isBolusRequired || isMixedRequired || isPremadeRequired);

    return (
      <div
        className={styles['change-decision-btn-group']}
        style={{
          display: (this.props.showCCTable ? 'none' : 'initial'),
        }}
      >
        <WarningModal
          showSaveConfirmModal={this.state.showSaveConfirmModal}
          modalHeader="Confirm Save"
          onClose={this.onClickCancel}
          onConfirmSave={this.onConfirmSave}
          disableSubmit={this.props.isPatchingSettings}
        >
          Saving will overwrite the stored settings for this patient.
          By clicking Save Changes, you confirm that you have completely reviewed the dosage table(s).
        </WarningModal>
        <Button
          className="primary-button"
          label="Discard Changes"
          onClick={() => this.props.resetForm()}
          disabled={this.props.disableDiscardButton}
        />
        <Button
          className="primary-button"
          label="Save Changes"
          onClick={this.onClickSave}
          disabled={shouldSaveDisabled}
        />
      </div>
    );
  }
}

ChangeDecisionButtonGroup.propTypes = {
  resetForm: PropTypes.func.isRequired,
  timeWindowPatchActionCreator: PropTypes.func.isRequired,
  diabetesSettingsPatchActionCreator: PropTypes.func.isRequired,
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInsulins: PropTypes.object.isRequired,
  regimenData: PropTypes.object.isRequired,
  patientId: PropTypes.string.isRequired,
  diabetesSettingsUrl: PropTypes.string.isRequired,
  diabetesThresholds: PropTypes.object.isRequired,
  correctionalDetails: PropTypes.object.isRequired,
  glucoseRowsLimit: PropTypes.number.isRequired,
  isPatchingSettings: PropTypes.bool.isRequired,
  regimenValidationSelector: PropTypes.object,
  changeInitialValueManually: PropTypes.func.isRequired,
  disableDiscardButton: PropTypes.bool,
  showCCTable: PropTypes.bool,
};

ChangeDecisionButtonGroup.defaultProps = {
  regimenValidationSelector: {},
  disableDiscardButton: true,
  showCCTable: false,
};

const mapStateToProps = state => ({
  patientId: getPatientId(state),
  diabetesSettingsUrl: getDiabetesPatchUrl(state),
  isPatchingSettings: getIsPatchingSettings(state),
});

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(reset('diabetesSettingsForm')),
  timeWindowPatchActionCreator: bindActionCreators(timeWindowPatchActionCreator, dispatch),
  diabetesSettingsPatchActionCreator: bindActionCreators(diabetesSettingsPatchActionCreator, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeDecisionButtonGroup);
