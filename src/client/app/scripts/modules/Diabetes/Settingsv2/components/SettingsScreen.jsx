import React from 'react';
import PropTypes from 'prop-types';

import DiabetesSettingsForm from './DiabetesSettingsForm.jsx';
import Toolbox from '../../../Common/FormElements/ReduxForm/Toolbox';
import styles from '../styles/index.scss';

const { Button } = Toolbox;

/**
* React component for entire diabetes settings screen
*/
class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCCTable: false,
    };

    this.renderBackToOverview = this.renderBackToOverview.bind(this);
    this.toggleDisplayCC = this.toggleDisplayCC.bind(this);
    this.changeInitialValueManually = this.changeInitialValueManually.bind(this);
    this.onFormValueChange = this.onFormValueChange.bind(this);
  }

  componentDidMount() {
    const patientId = this.props.params.patientId;
    this.props.initialFetch({ patientId });
  }

  onFormValueChange() {
    this.setState({
      disableDiscardButton: false,
    });
  }

  toggleDisplayCC() {
    this.setState({
      showCCTable: !this.state.showCCTable,
    });
  }

  changeInitialValueManually(modifiedInitialData) {
    // Fired when Submit button is clicked to modify the current form data as initial data
    this.setState({
      modifiedInitialData,
      disableDiscardButton: true,
    });
  }

  renderBackToOverview() {
    return (
      <div
        className="clearfix"
        style={{
          display: (this.state.showCCTable ? 'none' : 'initial'),
        }}
      >
        <div className="overview-holder">
          <Button
            label="Back to overview"
            className="bordered-button"
            onClick={() => this.props.router.push(`/patients/${this.props.params.patientId}/diabetes`)}
          />
        </div>
      </div>
    );
  }

  render() {
    // If any previous initialValue modifications exist, pass that as the new initialValue
    const initialValues = this.state.modifiedInitialData || {
      insulinList: this.props.insulinList,
      selectedInsulins: this.props.selectedInsulins,
      diabetesThresholds: this.props.diabetesThresholds,
      regimenData: this.props.regimenData,
      correctionalDetails: this.props.correctionalDetails,
      carbCountingDetails: this.props.carbCountingDetails,
      scheduleData: this.props.scheduleData,
    };

    return (
      <div className={styles['settings-container-wrapper']}>
        <div className="insulin-tables">
          {this.renderBackToOverview()}
          <DiabetesSettingsForm
            initialValues={initialValues}
            showCCTable={this.state.showCCTable}
            toggleDisplayCC={this.toggleDisplayCC}
            changeInitialValueManually={this.changeInitialValueManually}
            disableDiscardButton={this.state.disableDiscardButton}
            onChange={this.onFormValueChange}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

SettingsScreen.propTypes = {
  initialFetch: PropTypes.func.isRequired,
  params: PropTypes.shape({
    patientId: PropTypes.string.isRequired,
  }).isRequired,
  diabetesThresholds: PropTypes.object.isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInsulins: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  regimenData: PropTypes.object.isRequired,
  correctionalDetails: PropTypes.object.isRequired,
  carbCountingDetails: PropTypes.object.isRequired,
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SettingsScreen;
