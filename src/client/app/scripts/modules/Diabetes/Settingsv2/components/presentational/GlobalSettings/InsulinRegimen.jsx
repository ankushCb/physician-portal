import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Iterable, fromJS } from 'immutable';
import { Field, change } from 'redux-form/immutable';
import map from 'lodash/map';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import findIndex from 'lodash/findIndex';
import capitalize from 'lodash/capitalize';
import includes from 'lodash/includes';

import Toolbox from '../../../../../Common/FormElements/ReduxForm/Toolbox';
import Card from '../../../../../Common/Presentational/MaterialCard';
import styles from './styles.scss';

const { ToggleSwitch, InputSelect } = Toolbox;

const insulinRegimens = {
  basal_bolus_am: 'Basal Bolus AM',
  basal_bolus_pm: 'Basal Bolus PM',
  basal_bolus_bid: 'Basal Bolus BiD',
  bid_mixed: 'Mixed BiD',
  tid_mixed: 'Mixed TiD',
  carb_counting_basal_bolus_am: 'Carb Count AM Basal',
  carb_counting_basal_bolus_pm: 'Carb Count PM Basal',
  carb_counting_basal_bolus_bid: 'Carb Count BiD Basal',
};

export const sortInsulins = (insulins) => {
  return sortBy(insulins, insulin => insulin.name);
};

const insulinRegimenOptions = map(insulinRegimens, (label, value) => ({ label, value }));


class InsulinRegimen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCheckCount: 0,
    };
    this.handleTogglePremadeRegimen = this.handleTogglePremadeRegimen.bind(this);
    this.handleInsulinChange = this.handleInsulinChange.bind(this);
    this.handlePremadeRegimenChange = this.handlePremadeRegimenChange.bind(this);
  }

  shouldDisplay(type) {
    const { regimenList, insulinRegimen } = this.props.regimenData;
    const premadeRegimenDetails = (regimenList && regimenList[insulinRegimen]) || {};
    return findIndex(values(premadeRegimenDetails), value => value === type) !== -1;
  }

  handleTogglePremadeRegimen() {
    // Change insulin regimen
    let insulinRegimen = this.props.regimenData.insulinRegimen;
    if (this.props.regimenData.isPremadeRegimen) {
      insulinRegimen = 'custom';
    }

    this.props.togglePremadeRegimen(fromJS({
      ...this.props.regimenData,
      isPremadeRegimen: !this.props.regimenData.isPremadeRegimen,
      insulinRegimen,
    }));
    return this.handlePremadeRegimenChange(event, insulinRegimen);
  }

  handleInsulinChange(type) {
    return (event, newValue, previousValue) => {
      let scheduleData = this.props.scheduleData;
      let insulinList = this.props.insulinList;
      scheduleData = Iterable.isIterable(scheduleData) ? scheduleData.toJS() : scheduleData;
      insulinList = Iterable.isIterable(insulinList) ? insulinList.toJS() : insulinList;

      // For every row in schedule table, if the insulin is of the type specified,
      // change it to the new value
      scheduleData.forEach((row, index) => {
        if (
            ((row.insulin && row.insulin.id) === previousValue) ||
            ((row.insulin && row.insulin.id) === `choose_${type}`)
          ) {
          const insulin = insulinList.filter(i => i.id === newValue)[0];
          this.props.changeScheduleTableRow(index, fromJS({ ...row, insulin }));
        }
      });
    };
  }


  handlePremadeRegimenChange(_, value) {
    let { scheduleData, insulinList, selectedInsulins } = this.props;
    const { regimenList } = this.props.regimenData;
    scheduleData = Iterable.isIterable(scheduleData) ? scheduleData.toJS() : scheduleData;
    insulinList = Iterable.isIterable(insulinList) ? insulinList.toJS() : insulinList;
    selectedInsulins = Iterable.isIterable(selectedInsulins) ? selectedInsulins.toJS() : selectedInsulins;
    if (value !== 'custom') {
      // Turn on correctional if carb counting regimen is chosen
      const isCarbCounting = includes(value, 'carb_counting');
      if (isCarbCounting) {
        this.props.turnOnCorrectional();
      }
      // When turned on, change the schedule table data to contain only rows which
      // the premade regimen specifies
      // Also, turn ON correctional for every visible row. Correctional can be on only for
      // rows where bgCheck is on. So, turn ON bgCheck for every row
      const mealsInPremadeRegimen = regimenList && Object.keys(regimenList[value]);
      scheduleData.forEach((r, index) => {
        const row = { ...r };
        // Change isDisplayed flag
        row.isDisplayed = Boolean(mealsInPremadeRegimen.indexOf(row.name.toLowerCase()) >= 0);
        // Change the insulin
        const type = regimenList[value][row.name.toLowerCase()];
        const selectedInsulin = selectedInsulins[type];
        row.insulin = selectedInsulin ? insulinList.filter(i => i.id === selectedInsulin)[0] : {
          label: type === 'bg' ? 'bg' : `Choose ${capitalize(type)}`,
          id: type === 'bg' ? 'bg' : `choose_${type}`,
          type: type === 'bg' ? 'bg' : `${type}`,
        };
        row.base_dose = 1;
        row.carbCountingRatio = isCarbCounting ? (row.carbCountingRatio || 15) : null;
        row.correctionalInsulinOn = (row.isDisplayed && isCarbCounting) ?
          true : row.correctionalInsulinOn;
        row.bgCheck = row.isDisplayed;
        // If premade regimen removes some schedule table rows, remove all the
        // fields which may set the PATCH response to have isDisplayed true.
        if (!row.isDisplayed) {
          row.correctionalInsulinOn = false;
          row.bgCheck = false;
          row.carbCountingRatio = null;
          row.insulin = null;
        }
        this.props.changeScheduleTableRow(index, fromJS(row));
      });
    }
  }

  renderBasalBolusInsulins() {
    const basalInsulinJSX = this.renderBasalInsulins();
    const bolusInsulinJSX = this.renderBolusInsulins();

    return ([
      basalInsulinJSX,
      <hr className="card-seperator" />,
      bolusInsulinJSX,
    ]);
  }

  renderRegimenOptions() {
    return (
      <React.Fragment>
        <div className="glucose-settings-input">
          <label
            className="regimen-dropdown-label"
            htmlFor="regimenOptions"
          >Regimen</label>
          <Field
            name="regimenData.insulinRegimen"
            component={InputSelect}
            options={insulinRegimenOptions}
            onChange={this.handlePremadeRegimenChange}
            className="insulin-options"
            wrapperClass="dropdown"
            labelClass="premade-regimen-label"
            placeholder="Select a regimen"
            error={this.props.regimenValidationSelector.isPremadeRequired && 'Required'}
          />
        </div>
        {
          !(this.shouldDisplay('basal') || this.shouldDisplay('bolus')) ? null : (
            <hr className="card-seperator" />
          )
        }
      </React.Fragment>
    );
  }

  renderBolusInsulins() {
    if (!Iterable.isIterable(this.props.insulinList)) { return null; }
    const insulinList = this.props.insulinList.toJS();
    return (
      <div className="glucose-settings-input">
        <label
          className="regimen-dropdown-label"
          htmlFor="bolusInsulin"
        >Bolus</label>
        <Field
          name="selectedInsulins.bolus"
          component={InputSelect}
          options={filter(sortInsulins(insulinList), { type: 'bolus' }).map(i => ({
            label: i.name,
            value: i.id,
          }))}
          onChange={this.handleInsulinChange('bolus')}
          className="insulin-options"
          wrapperClass="dropdown"
          labelClass="premade-regimen-label"
          error={this.props.regimenValidationSelector.isBolusRequired && 'Required'}
          placeholder="Select Insulin"
        />
      </div>
    );
  }

  renderBasalInsulins() {
    if (!Iterable.isIterable(this.props.insulinList)) { return null; }
    const insulinList = this.props.insulinList.toJS();
    return (
      <div className="glucose-settings-input">
        <label
          className="regimen-dropdown-label"
          htmlFor="basalInsulin"
        >Basal</label>
        <Field
          name="selectedInsulins.basal"
          component={InputSelect}
          options={filter(sortInsulins(insulinList), { type: 'basal' }).map(i => ({
            label: i.name,
            value: i.id,
          }))}
          onChange={this.handleInsulinChange('basal')}
          className="insulin-options"
          wrapperClass="dropdown"
          labelClass="premade-regimen-label"
          error={this.props.regimenValidationSelector.isBasalRequired && 'Required'}
          placeholder="Select Insulin"
        />
      </div>
    );
  }

  renderMixedInsulins() {
    if (!Iterable.isIterable(this.props.insulinList)) { return null; }
    const insulinList = this.props.insulinList.toJS();
    return (
      <React.Fragment>
        <hr className="card-seperator" />
        <div className="glucose-settings-input">
          <label
            className="regimen-dropdown-label"
            htmlFor="basalInsulin"
          >
            Mixed
          </label>
          <Field
            name="selectedInsulins.mixed"
            component={InputSelect}
            options={filter(sortInsulins(insulinList), { type: 'mixed' }).map(i => ({
              label: i.name,
              value: i.id,
            }))}
            onChange={this.handleInsulinChange('mixed')}
            className="insulin-options"
            wrapperClass="dropdown"
            labelClass="premade-regimen-label"
            error={this.props.regimenValidationSelector.isMixedRequired && 'Required'}
            placeholder="Select Insulin"
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { regimenData, insulinList } = this.props;
    return (
      <Card additionalClass="global-card">
        <div className={styles['insulin-regimen']}>
          <label className="sub-heading" htmlFor="insulinRequired">
            Premade Regimen
          </label>
          <Field
            name="regimenData.isPremadeRegimen"
            component={ToggleSwitch}
            wrapperClass="toggle-switch"
            onClick={this.handleTogglePremadeRegimen}
          />
          <div className="glucose-settings-input">
            { regimenData.isPremadeRegimen ? this.renderRegimenOptions() : null }
            { regimenData.isPremadeRegimen &&
              (this.shouldDisplay('basal') ||
                (this.shouldDisplay('bolus') && (regimenData.insulinRegimen !== ''))
              ) ? this.renderBasalBolusInsulins() : null
            }
            { (
                regimenData.isPremadeRegimen &&
                Boolean(regimenData.insulinRegimen.match(/custom|mixed/g)) &&
                this.shouldDisplay('mixed')
              ) ? this.renderMixedInsulins(insulinList) : null}
            { !regimenData.isPremadeRegimen &&
              <React.Fragment>
                {this.renderBasalBolusInsulins()}
                {this.renderMixedInsulins()}
              </React.Fragment>
            }
          </div>
        </div>
      </Card>
    );
  }
}

InsulinRegimen.propTypes = {
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  regimenData: PropTypes.shape({
    isPremadeRegimen: PropTypes.bool,
    insulinRegimen: PropTypes.string.isRequired,
    premadeRegimenDetails: PropTypes.object.isRequired,
    regimenList: PropTypes.object,
  }),
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  togglePremadeRegimen: PropTypes.func.isRequired,
  selectedInsulins: PropTypes.object.isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
  turnOnCorrectional: PropTypes.func.isRequired,
};

InsulinRegimen.defaultProps = {
  regimenData: {
    isPremadeRegimen: false,
    insulinRegimen: '',
    regimenList: {},
  },
};

const mapDispatchToProps = {
  togglePremadeRegimen: value => change('diabetesSettingsForm', 'regimenData', value),
  turnOnCorrectional: () => change('diabetesSettingsForm', 'correctionalDetails.correctionalOn', true),
};

export default connect(null, mapDispatchToProps)(InsulinRegimen);
