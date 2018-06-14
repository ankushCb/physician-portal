import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import size from 'lodash/size';
import { Link } from 'react-router';

import HypertensionSettingsForm from './HypertensionSettingsForm.jsx';
import AddClassForm from './AddClassForm.jsx';
import Modal from '../../../Common/Presentational/Modal/index.jsx';

import Results from './Results/index.jsx';
import FeatureCardWithHeader from '../../../Common/Presentational/FeatureCardWithHeader';
import Button from '../../../Common/FormElements/ReduxForm/Toolbox/Button';
import styles from './styles.scss';
import ShowPreloader from '../../../Common/Presentational/ShowPreloader.jsx';
import WarningModal from '../../../Common/Presentational/WarningModal.jsx';

class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddClassesForm: false,
      selectRegimen: false,
      showConfirmSaveModal: false,
    };

    this.handleAddClassClick = this.handleAddClassClick.bind(this);
    this.hideAddClassesForm = this.hideAddClassesForm.bind(this);
    this.handleSelectRegimenChange = this.handleSelectRegimenChange.bind(this);
    this.isMedicationProvided = this.isMedicationProvided.bind(this);
    this.toggleConfirmSaveModal = this.toggleConfirmSaveModal.bind(this);
    this.handleConfirmSave = this.handleConfirmSave.bind(this);
    this.scheduleList = [];
  }


  componentDidMount() {
    this.props.initialFetchRequest(this.props.params.patientId);
  }

  handleSelectRegimenChange(name, selectRegimen) {
    this.setState({ selectRegimen });
  }

  handleConfirmSave() {
    this.props.patchAndFetchHyperSettings();
    this.toggleConfirmSaveModal();
  }

  handleAddClassClick() {
    this.setState({
      showAddClassesForm: true,
    });
  }

  hideAddClassesForm() {
    this.setState({
      showAddClassesForm: false,
    });
  }

  /* medicationData wil be array of objects */
  isMedicationProvided(medicationData = []) {
    if (size(medicationData) === 0) {
      return false;
    }

    const objectsWithMedNames = filter(medicationData, medObject => (
      medObject.hyperTensionMedName !== undefined && medObject.hyperTensionMedName !== null && medObject.hyperTensionMedName !== ''
    ));
    /* Not using every() since it will always return true for empty objects */
    return (size(objectsWithMedNames) === size(medicationData));
  }

  toggleConfirmSaveModal() {
    this.setState({
      showConfirmSaveModal: !this.state.showConfirmSaveModal,
    });
  }


  render() {
    const {
      thresholdData: thresholds,
      classDetails: medicationClasses,
      medicationDoses: scheduleList,
      mealTimings: data,
      mealTimingsReadOnly: resultsMealTimings,
    } = this.props;

    const initialValues = { thresholds, medicationClasses, scheduleList, data };
    console.log('initialValues ', initialValues);
    return (
      <div className={styles['settings-screen']}>
        
        <ShowPreloader show={this.props.fetchStatus.isFetching || !this.props.fetchStatus.isFetched}>
          <div className="clearfix" />
          <div className="overview-placer">
            <Button
              label="Back to overview"
              className="bordered-button"
              onClick={() => {
                this.props.router.push(`/patients/${this.props.params.patientId}/hypertension`)
              }}
            />
          </div>
          <WarningModal
            showSaveConfirmModal={this.state.showConfirmSaveModal}
            onConfirmSave={this.handleConfirmSave}
            onClose={this.toggleConfirmSaveModal}
          >
              Submitting Hypertension Settings will update your prescription. Are you sure you want to submit ?
          </WarningModal>
          {
            (!isEmpty(thresholds) && !isEmpty(medicationClasses) && !isEmpty(scheduleList)) && (
              <div>
                <HypertensionSettingsForm
                  selectRegimen={this.state.selectRegimen}
                  handleSelectRegimenChange={this.handleSelectRegimenChange}
                  initialValues={initialValues}
                  onAddClassClick={this.handleAddClassClick}
                  showAddClassesForm={this.state.showAddClassesForm}
                />
                <FeatureCardWithHeader
                  header="Dose Card"
                  wrapperClass="hyp-settings-item"
                >
                  <Results
                    medicationData={this.props.resultData}
                    mealTimings={resultsMealTimings}
                    // buttonOnClick={this.props.patchAndFetchHyperSettings}
                    buttonOnClick={this.toggleConfirmSaveModal}
                    disableButton={!(this.isMedicationProvided(this.props.resultData))}
                  />
                </FeatureCardWithHeader>
                <Modal
                  open={this.state.showAddClassesForm}
                  bodyClass="add-class-form-modal"
                  onClose={this.hideAddClassesForm}
                  width={300}
                  height={240}
                >
                  <AddClassForm
                    onClose={this.hideAddClassesForm} 
                    handleSelectRegimenChange={this.handleSelectRegimenChange}
                  />
                </Modal>
                <Modal
                  open={!this.props.scheduleIsValid}
                  bodyClass="invalid-form-modal"
                >
                  Some of the items in schedule seems to have no medication Name / Url set. Please delete those from Database and Refresh
                </Modal>
              </div>
            )
          }
        </ShowPreloader>
      </div>
    );
  }
}

SettingsScreen.propTypes = {
  initialFetchRequest: PropTypes.func.isRequired,
  params: PropTypes.shape({
    patientId: PropTypes.string.isRequired,
  }).isRequired,
  thresholdData: PropTypes.object.isRequired,
  classDetails: PropTypes.array.isRequired,
};

export default SettingsScreen;
