import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import reduce from 'lodash/reduce';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import head from 'lodash/head';
import compact from 'lodash/compact';
import isUndefined from 'lodash/isUndefined';
import { Map } from 'immutable';

import { deepSnakeCase } from 'scripts/helpers/deepCaseConvert.js';

import { generateLogBookData } from 'scripts/helpers/generateLogBookData.js';
import { generateCorrectionalTable } from 'scripts/helpers/generateCorrectionalTable.js';

import {
  mapNameToObject,
  isCarbCounting,
} from 'scripts/helpers/timeWindowHelpers.js';
import DisplayRefreshButton from 'scripts/modules/Common/Presentational/DisplayRefreshButton.jsx';
import toJS from 'scripts/modules/Common/Presentational/toJS.js';
import WarningModal from '../../../../Common/Presentational/WarningModal.jsx';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';

import {
  timeWindowFetchActionCreator,
  timeWindowDisplayModifyValuesActionCreator,
  deleteFromTimeWindowDisplayActionCreator,
  fetchInsulins,
  fetchDiabetesSettings,
  restoreScheduleTableToDefault,
  updateDiabetesSettingsDataItemActionCreator,
  timeWindowPatchActionCreator,
  diabetesSettingsPatchActionCreator,
  diabetesSettingsRestoreActionCreator,
  premadeRegimenFetchActionCreator,
  premadeRegimenUpdateCompleteActionCreator,
  initialFetch,
  setAllTrue,
  patientInitialFetchActionCreator,
  updateModalTime,
  premadeRegimenUpdatePartialActionCreator,
  timeWindowDisplayUpdateActionCreator,
} from '../../actionCreators/index.js';

import {
  getApiData,
  getTimeSheetDisplayData,
  getNewMealDisplayData,
  getInsulins,
  getDiabetesSettings,
  getPatchStatus,
  getIdInsulinMap,
  getInsulinIdMap,
  getCurrentCriteriaFromStore,
  getCurrentCriteriaFromApi,
  getIdInsulinTypeMap,
  getTimeSheetFetchStatus,
  getDiabetesFetchStatus,
  isFetchingError,
  getDiabetesId,
  getFetchStatus,
  isValidCarbCounting,
  getGlucoseRowsLimit,
  getIfNegativeCorrectionalAllowed,
} from '../../selectors/index.js';

import SettingsContent from '../presentational/SettingsContent/index.jsx';
import InsulinPrescription from '../presentational/InsulinPrescription/index.jsx';
import ChangeDecisionButtonGroup from '../presentational/InsulinPrescription/ChangeDecisionButtonGroup.jsx';
import GlucoseSettings from '../presentational/GlucoseSettings/index.jsx';

import { getIdFromUrl } from '../../helpers/getInsulin.js';

import styles from '../../styles/index.scss';

const glucoseSettingsDiabSettingsProps = [
  'hypoglycemiaGlucoseThresholdMild',
  'hyperglycemiaThresholdEmergency',
  'hyperglycemiaTitrationThresholdSmall',
  'correctionTarget',
  'correctionFactor',
  'correctionIncrement',
  'insulinRegimen',
  'correctionalOn',
  'basalInsulin',
  'bolusInsulin',
  'mixedInsulin',
  'negativeCorrectionalOn',
];

const insulinPrescriptionProps = [
  'hypoglycemiaGlucoseThresholdMild',
  'hyperglycemiaThresholdEmergency',
  'correctionTarget',
  'correctionFactor',
  'correctionIncrement',
  'correctionalOn',
  'insulinRegimen',
];

const settingsContentProps = [
  'addNewMealDisplayData',
  'diabetesSettings',
  'idInsulinMap',
  'insulinIdMap',
  'idInsulinTypeMap',
  'premadeRegimenCriteria',
];

const general = [
  'handleCCClick',
  'handleCcModalClose',
];

/**
 * React Component (Container) - Top Level Container for settings Component
 */
export class SettingsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAddNewMealWindowOpen: false,
      showSaveConfirmModal: false,
      saveChangesIsValid: false,
      disableSubmit: false,
      activeSettingsSelection: 'icon2',
      modalIsOn: false,
      lastSavedDefaultCriteria: props.premadeRegimenCriteria,
      activeSelectedTw: {},
      carbModalOpen: false,
    };
    this.isComponentLoaded = false;
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDiscard = this.onClickDiscard.bind(this);
    this.onAddNewMeal = this.onAddNewMeal.bind(this);
    this.onDeleteSelectedMeal = this.onDeleteSelectedMeal.bind(this);
    this.onChangeFormInput = this.onChangeFormInput.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeInDiabetesSettings = this.onChangeInDiabetesSettings.bind(this);
    this.onRemovePremadeRegimen = this.onRemovePremadeRegimen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onConfirmSave = this.onConfirmSave.bind(this);
    this.onCancelConfirmSave = this.onCancelConfirmSave.bind(this);
    this.passValidation = this.passValidation.bind(this);
    this.onChangeSettingsSelection = this.onChangeSettingsSelection.bind(this);
    this.onChangeScheduleTime = this.onChangeScheduleTime.bind(this);
    this.handleChangeRowCheck = this.handleChangeRowCheck.bind(this);
    this.handleCcModalClose = this.handleCcModalClose.bind(this);
    this.handleCCClick = this.handleCCClick.bind(this);
  }

  componentDidMount() {
    const patientId = this.props.params.patientId;
    this.props.initialFetch({
      patientId,
    });
    if (!isEmpty(this.props.premadeRegimenCriteriaFromApi)) {
      this.props.premadeRegimenUpdateCompleteActionCreator(this.props.premadeRegimenCriteriaFromApi);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.fetchStatus.firstTimeFetchCompleted.isFetching &&
        nextProps.fetchStatus.firstTimeFetchCompleted.isFetched
      ) ||
     (this.props.fetchStatus.firstTimeFetchCompleted.isPatching &&
       !nextProps.fetchStatus.firstTimeFetchCompleted.isPatching)
     ) {
      this.setState({
        lastSavedDefaultCriteria: nextProps.premadeRegimenCriteria,
      });
    }

    // Patch and fetch condition. Close and fetch the new data.
    if (this.props.timeSheetFetchStatus.timeWindowIsPatchingAndLoading && !nextProps.timeSheetFetchStatus.timeWindowIsPatchingAndLoading) {
      this.setState({
        showSaveConfirmModal: false,
        disableSubmit: false,
      });
    }

    if (!isEqual(this.props.premadeRegimenCriteriaFromApi, nextProps.premadeRegimenCriteriaFromApi)) {
      if (!isEmpty(values(nextProps.premadeRegimenCriteriaFromApi))) {
        this.props.premadeRegimenUpdateCompleteActionCreator(nextProps.premadeRegimenCriteriaFromApi);
      }
    }
    if (isEmpty(this.props.premadeRegimenCriteria) && !isEqual(this.props.premadeRegimenCriteria, nextProps.premadeRegimenCriteria)) {
      this.props.premadeRegimenUpdateCompleteActionCreator(nextProps.premadeRegimenCriteria);
    }

    // Do this till initial fetch is still going.
    if (!isEmpty(nextProps.premadeRegimenCriteria)) {
      this.defaultRegimen = nextProps.premadeRegimenCriteria;
    }

    if (this.props.diabetesSettings.premadeRegimen !== nextProps.diabetesSettings.premadeRegimen
      || this.props.diabetesSettings.basalInsulin !== nextProps.diabetesSettings.basalInsulin
      || this.props.diabetesSettings.bolusInsulin !== nextProps.diabetesSettings.bolusInsulin
      || this.props.diabetesSettings.mixedInsulin !== nextProps.diabetesSettings.mixedInsulin) {
      this.setState({
        isAddNewMealWindowOpen: false,
      });
    }

    if (this.props.diabetesSettings.insulinRegimen === 'custom' && nextProps.diabetesSettings.insulinRegimen !== 'custom') {
      if (isCarbCounting(nextProps.diabetesSettings.insulinRegimen)) {
        this.onChangeInDiabetesSettings(['correctionalOn', true]);
      }
    }

    if (this.props.diabetesSettings.insulinRegimen === '' && (nextProps.diabetesSettings.insulinRegimen !== 'custom' || nextProps.diabetesSettings.insulinRegimen !== '')) {
      this.props.setAllTrue({
        params: 'bgCheckPrescribed',
      });
    }
  }

  onRemovePremadeRegimen() {
    this.onChangeInDiabetesSettings('insulinRegimen', 'custom');
  }

  onChangeFormInput(...args) {
    if (isObject(head(args))) {
      const props = map(head(args), (value, name) => mapNameToObject(name, value, true));
      if (!isEmpty(head(args))) {
        this.props.timeWindowDisplayModifyValuesActionCreator(props);
      }
    } else {
      this.props.timeWindowDisplayModifyValuesActionCreator(mapNameToObject(...args, true));
    }
  }

  onChangeScheduleTime(props) {
    const { startTime, endTime, mealName } = props;
    const result = [];
    if (startTime) {
      result.push({
        mealName,
        parameter: 'start_time',
        value: startTime,
      });
    }
    if (endTime) {
      result.push({
        mealName,
        parameter: 'stop_time',
        value: endTime,
      });
    }
    this.props.timeWindowDisplayModifyValuesActionCreator(result);
  }

  onChangeInDiabetesSettings(...args) {
    if (isEqual(args, ['correctionalOn', true])) {
      this.props.setAllTrue({
        params: 'correctional',
      });
    }
    if (isObject(head(args))) {
      if (head(args) && head(args).insulinRegimen !== '' && head(args).insulinRegimen !== 'custom') {
        this.props.setAllTrue({
          params: 'bgCheckRequired',
        });
      }
      this.props.updateDiabetesSettingsDataItemActionCreator(...args);
    } else {
      this.props.updateDiabetesSettingsDataItemActionCreator({
        [args[0]]: args[1],
      });
    }
  }

  onConfirmSave() {
    const glucoseRowsLimit = this.props.glucoseRowsLimit;
    const logTableData = generateLogBookData({
      ...this.state.logData,
      idInsulinMap: this.props.idInsulinMap,
      correctionalInsulin: getIdFromUrl(this.props.diabetesSettings.bolusInsulin),
      negativeCorrectionOn: this.props.diabetesSettings.negativeCorrectionalOn,
      allowNegativeCorrectional: this.props.allowNegativeCorrectional,
      glucoseRowsLimit,
    });
    const correctionalTable = generateCorrectionalTable({
      ...this.state.logData,
      glucoseRowsLimit,
      negativeCorrectionOn: this.props.diabetesSettings.negativeCorrectionalOn,
      allowNegativeCorrectional: this.props.allowNegativeCorrectional,
    });

    this.setState({
      disableSubmit: true,
    });
    const timeWindowFormData = this.refs.settingsContent && 
      this.refs.settingsContent.refs.scheduleTimeSheet &&
      this.refs.settingsContent.refs.scheduleTimeSheet &&
      this.refs.settingsContent.refs.scheduleTimeSheet.refs.schedule.refs.form &&
      this.refs.settingsContent.refs.scheduleTimeSheet.refs.schedule.refs.form.getModel();
    console.log('timeWindowFormData ', timeWindowFormData);
    if (!timeWindowFormData) {
      this.props.timeWindowPatchActionCreator({
        id: this.props.params.patientId,
        timeWindowFormData: {
          check: {},  
        },
        logTableData: Map(),
      })
    }
    this.props.timeWindowPatchActionCreator({
      id: this.props.params.patientId,
      timeWindowFormData,
      logTableData,
    });

    const actualDiabetesSettings = deepSnakeCase(this.props.diabetesSettings);
    actualDiabetesSettings.correctional_table = correctionalTable;

    this.props.diabetesSettingsPatchActionCreator(this.props.diabetesId, actualDiabetesSettings);
  }

  onClickSave(data) {
    this.setState({
      showSaveConfirmModal: true,
      isAddNewMealWindowOpen: false,
      logData: data,
    });
  }

  onClose() {
    this.setState({
      showSaveConfirmModal: false,
    });
  }

  onCancelConfirmSave() {
    this.onClose();
  }

  onClickDiscard() {
    this.setState({
      isAddNewMealWindowOpen: false,
    });
    this.props.premadeRegimenUpdateCompleteActionCreator(this.state.lastSavedDefaultCriteria);
    this.props.restoreScheduleTableToDefault();
    this.props.diabetesSettingsRestoreActionCreator();
  }

  onAddNewMeal() {
    // Clear premade regimen selected.
    this.setState({
      isAddNewMealWindowOpen: true,
    });
  }

  onDeleteSelectedMeal() {
    const { check } = this.refs.settingsContent.refs.scheduleTimeSheet.refs.schedule.refs.form.getModel();
    this.props.deleteFromTimeWindowDisplayActionCreator(check);

    const activeSelectedTw = reduce(keys(check), (accumulator, key) => {
      if (check[key]) {
        accumulator[key] = false;
      }
      return accumulator;
    }, this.state.activeSelectedTw);
    this.setState({
      activeSelectedTw,
    });
    this.onRemovePremadeRegimen();
  }

  onCancel(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      isAddNewMealWindowOpen: false,
    });
  }

  onChangeSettingsSelection(activeSettingsSelection) {
    this.setState({
      activeSettingsSelection,
    });
  }

  handleCCClick() {
    this.setState({
      carbModalOpen: true,
    });
  }

  handleCcModalClose() {
    this.setState({
      carbModalOpen: false,
    });
  }

  handleChangeRowCheck(meal) {
    const mealValue= meal.split('.')[1];
    console.log(this.state.activeSelectedTw);
    const newActiveSelectedTw = this.state.activeSelectedTw;
    newActiveSelectedTw[mealValue] = !isUndefined(newActiveSelectedTw[mealValue]) ? !newActiveSelectedTw[mealValue] : true;
    this.setState({
      activeSelectedTw: newActiveSelectedTw,
    });
  }

  passValidation(saveChangesIsValid) {
    this.setState({
      saveChangesIsValid,
    });
  }

  render() {
    if (this.props.diabetesSettingsFetchStatus.diabetesSettingsFetchFailure) {
      return (
        <div>
          No Data found.
        </div>
      );
    }

    // If error display fetching error
    if (this.props.isFetchingError) {
      return (<DisplayRefreshButton />);
    }

    return (
      <div className={styles['settings-container-wrapper']}>
        <WarningModal
          showSaveConfirmModal={this.state.showSaveConfirmModal}
          onClose={this.onClose}
          disableSubmit={this.state.disableSubmit}
          onConfirmSave={this.onConfirmSave}
          onCancelConfirmSave={this.onCancelConfirmSave}
          modalHeader="Confirm Save"
        >
        Saving will overwrite the stored settings for this patient.
        By clicking Save Changes, you confirm that you have completely reviewed the dosage table(s).
        </WarningModal>
        {/* Settings User details */}
        <div className="insulin-tables">
          {
            !this.state.carbModalOpen &&
            <div className="clearfix">
              <div className="overview-holder">
                <Button
                  label="Back to overview"
                  className="bordered-button"
                  onClick={() => {
                    this.props.router.push(`/patients/${this.props.params.patientId}/diabetes`)
                  }}
                />
              </div>
            </div>
          }
          {/* Glucose settings */}
          <GlucoseSettings
            shouldLoadSpinner={this.props.fetchStatus.globalSettingsStatus.isFetching}
            carbCountingTimeWindows={
              compact(map(this.props.timeWindowDisplayData, (t, n) => (t.insulinTypePreloaded === 'bolus' ? n : null)))
            }
            onChangeInDiabetesSettings={this.onChangeInDiabetesSettings}
            onChangeFormInput={this.onChangeFormInput}
            {...pick(this.props, ['insulins', 'premadeRegimenCriteria'])}
            {...pick(this.props, ['allowNegativeCorrectional'])}
            {...pick(this.props.diabetesSettings, glucoseSettingsDiabSettingsProps)}
            {...pick(this, general)}
            {...this.state}
          />

          {/* Settings Content */}
          <SettingsContent
            ref="settingsContent"
            onClickSave={this.onClickSave}
            onClickDiscard={this.onClickDiscard}
            scheduleTableData={this.props.timeWindowDisplayData}
            onAddNewMeal={this.onAddNewMeal}
            onDeleteSelectedMeal={this.onDeleteSelectedMeal}
            onCancel={this.onCancel}
            onChangeFormInput={this.onChangeFormInput}
            onChangeInDiabetesSettings={this.onChangeInDiabetesSettings}
            onRemovePremadeRegimen={this.onRemovePremadeRegimen}
            shouldLoadSpinnerInsteadOfTable={this.props.fetchStatus.scheduleFetchStatus.isFetching}
            insulinTypeMap={this.props.insulinTypeMap}
            passValidation={this.passValidation}
            onChangeScheduleTime={this.onChangeScheduleTime}
            onUpdateTime={this.props.timeWindowDisplayModifyValuesActionCreator}
            timeWindowDisplayUpdateActionCreator={this.props.timeWindowDisplayUpdateActionCreator}
            updateModalTime={this.props.updateModalTime}
            mealTimeMap={this.props.mealToTimeMap}
            premadeRegimenUpdatePartialActionCreator={this.props.premadeRegimenUpdatePartialActionCreator}
            handleChangeRowCheck={this.handleChangeRowCheck}
            activeSelectedTw={this.state.activeSelectedTw}
            {...pick(this.props.diabetesSettings, ['insulinRegimen'])}
            {...pick(this.props, settingsContentProps)}
            {...pick(this, general)}
            {...this.state}
          />
          {/* Prescription table */}
          <InsulinPrescription
            shouldLoadSpinner={this.props.fetchStatus.insulinPrescriptionStatus.isFetching}
            timeWindows={this.props.timeWindowDisplayData}
            onChangeFormInput={this.onChangeFormInput}
            onClickSave={this.onClickSave}
            onClickDiscard={this.onClickDiscard}
            saveChangesIsValid={this.state.saveChangesIsValid && this.props.isValidCarbCount}
            timeWindowData={this.props.timeWindowDisplayData}
            {...pick(this.props, insulinPrescriptionProps)}
            {...this.props.diabetesSettings}
            basalInsulin={getIdFromUrl(this.props.diabetesSettings.basalInsulin)}
            bolusInsulin={getIdFromUrl(this.props.diabetesSettings.bolusInsulin)}
            mixedInsulin={getIdFromUrl(this.props.diabetesSettings.mixedInsulin)}
            idInsulinMap={this.props.idInsulinMap}
            insulinRegimen={this.props.diabetesSettings.insulinRegimen}
            glucoseRowsLimit={this.props.glucoseRowsLimit}
            {...pick(this.props.diabetesSettings, ['negativeCorrectionalOn'])}
            {...pick(this, general)}
            {...this.state}
          />
          <ChangeDecisionButtonGroup
            onClickSave={this.onClickSave}
            onClickDiscard={this.onClickDiscard}
            shouldDisableButton={this.props.fetchStatus.insulinPrescriptionStatus.isFetching}
            shouldDisableSaveButton={this.state.saveChangesIsValid && this.props.isValidCarbCount}
            regimenNotPresent={this.props.diabetesSettings.insulinRegimen === ''}
            shouldLoadSpinner={this.props.fetchStatus.insulinPrescriptionStatus.isFetching}
            timeWindows={this.props.timeWindowDisplayData}
            onChangeFormInput={this.onChangeFormInput}
            saveChangesIsValid={this.state.saveChangesIsValid && this.props.isValidCarbCount}
            timeWindowData={this.props.timeWindowDisplayData}
            {...pick(this.props, insulinPrescriptionProps)}
            {...this.props.diabetesSettings}
            basalInsulin={getIdFromUrl(this.props.diabetesSettings.basalInsulin)}
            bolusInsulin={getIdFromUrl(this.props.diabetesSettings.bolusInsulin)}
            mixedInsulin={getIdFromUrl(this.props.diabetesSettings.mixedInsulin)}
            idInsulinMap={this.props.idInsulinMap}
            insulinRegimen={this.props.diabetesSettings.insulinRegimen}
            {...pick(this, general)}
            {...this.state}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timeWindowApiData: getApiData(state), // eslint-disable-line
    timeWindowDisplayData: getTimeSheetDisplayData(state),
    addNewMealDisplayData: getNewMealDisplayData(state),
    insulins: getInsulins(state),
    diabetesSettings: getDiabetesSettings(state),
    timeWindowPatchRequestCount: getPatchStatus(state),
    idInsulinMap: getIdInsulinMap(state),
    insulinIdMap: getInsulinIdMap(state),
    idInsulinTypeMap: getIdInsulinTypeMap(state),
    premadeRegimenCriteria: getCurrentCriteriaFromStore(state),
    premadeRegimenCriteriaFromApi: getCurrentCriteriaFromApi(state),
    timeSheetFetchStatus: getTimeSheetFetchStatus(state),
    diabetesSettingsFetchStatus: getDiabetesFetchStatus(state),
    isFetchingError: isFetchingError(state),
    diabetesId: getDiabetesId(state),
    fetchStatus: getFetchStatus(state),
    insulinTypeMap: state.getIn(['derivedData', 'mappingFromApiData', 'insulinTypeMap']),
    mealToTimeMap: state.getIn(['derivedData', 'mappingFromApiData', 'modalMealTimeMap']),
    isValidCarbCount: isValidCarbCounting(state),
    glucoseRowsLimit: getGlucoseRowsLimit(state),
    allowNegativeCorrectional: getIfNegativeCorrectionalAllowed(state),
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    timeWindowFetchActionCreator: bindActionCreators(timeWindowFetchActionCreator, dispatch),
    timeWindowDisplayModifyValuesActionCreator: bindActionCreators(timeWindowDisplayModifyValuesActionCreator, dispatch),
    deleteFromTimeWindowDisplayActionCreator: bindActionCreators(deleteFromTimeWindowDisplayActionCreator, dispatch),
    fetchInsulins: bindActionCreators(fetchInsulins, dispatch),
    fetchDiabetesSettings: bindActionCreators(fetchDiabetesSettings, dispatch),
    restoreScheduleTableToDefault: bindActionCreators(restoreScheduleTableToDefault, dispatch),
    updateDiabetesSettingsDataItemActionCreator: bindActionCreators(updateDiabetesSettingsDataItemActionCreator, dispatch),
    timeWindowPatchActionCreator: bindActionCreators(timeWindowPatchActionCreator, dispatch),
    diabetesSettingsPatchActionCreator: bindActionCreators(diabetesSettingsPatchActionCreator, dispatch),
    diabetesSettingsRestoreActionCreator: bindActionCreators(diabetesSettingsRestoreActionCreator, dispatch),
    premadeRegimenFetchActionCreator: bindActionCreators(premadeRegimenFetchActionCreator, dispatch),
    premadeRegimenUpdateCompleteActionCreator: bindActionCreators(premadeRegimenUpdateCompleteActionCreator, dispatch),
    premadeRegimenUpdatePartialActionCreator: bindActionCreators(premadeRegimenUpdatePartialActionCreator, dispatch),
    initialFetch: bindActionCreators(initialFetch, dispatch),
    setAllTrue: bindActionCreators(setAllTrue, dispatch),
    patientInitialFetch: bindActionCreators(patientInitialFetchActionCreator, dispatch),
    updateModalTime: bindActionCreators(updateModalTime, dispatch),
    timeWindowDisplayUpdateActionCreator: bindActionCreators(timeWindowDisplayUpdateActionCreator, dispatch),
  };
};

SettingsContainer.propTypes = {
  // required props
  restoreScheduleTableToDefault: PropTypes.func.isRequired,
  diabetesSettingsPatchActionCreator: PropTypes.func.isRequired,
  diabetesSettingsRestoreActionCreator: PropTypes.func.isRequired,
  deleteFromTimeWindowDisplayActionCreator: PropTypes.func.isRequired,
  timeWindowDisplayModifyValuesActionCreator: PropTypes.func.isRequired,
  updateDiabetesSettingsDataItemActionCreator: PropTypes.func.isRequired,
  premadeRegimenUpdateCompleteActionCreator: PropTypes.func.isRequired,
  premadeRegimenCriteriaFromApi: PropTypes.object,
  params: PropTypes.object.isRequired,
  idInsulinMap: PropTypes.object,
  initialFetch: PropTypes.func.isRequired,
  timeWindowPatchActionCreator: PropTypes.func.isRequired,
  diabetesSettings: PropTypes.object,
  timeWindowDisplayData: PropTypes.object,
  premadeRegimenCriteria: PropTypes.object,
  timeSheetFetchStatus: PropTypes.object,
  diabetesSettingsFetchStatus: PropTypes.object,
  isFetchingError: PropTypes.bool,
  diabetesId: PropTypes.string,
  setAllTrue: PropTypes.func.isRequired,
  glucoseRowsLimit: PropTypes.number.isRequired,
  fetchStatus: PropTypes.shape({
    firstTimeFetchCompleted: PropTypes.object,
  }).isRequired,
};

SettingsContainer.defaultProps = {
  diabetesSettings: {},
  timeWindowDisplayData: {},
  premadeRegimenCriteria: {},
  timeWindowPatchRequestCount: 0,
  timeSheetFetchStatus: {},
  diabetesSettingsFetchStatus: {},
  isFetchingError: false,
  premadeRegimenCriteriaFromApi: undefined,
  diabetesId: '',
  idInsulinMap: {},
  initialFetchStatus: {},
};

export default connect(mapStateToProps, dispatchActionToProps)(toJS(SettingsContainer));
