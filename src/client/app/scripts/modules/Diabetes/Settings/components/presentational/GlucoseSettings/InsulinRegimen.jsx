import React, { Component } from 'react';

import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import findIndex from 'lodash/findIndex';

import Form from '../../../../../Common/Presentational/FormWithButton.jsx';

import { ToggleSwitch } from '../../../../../Common/styledFormElements/index.js';
import { getIdFromUrl, getUrlFromId } from '../../../helpers/getInsulin.js';
import { InputSelect } from '../../../../../Common/FormElements/Formsy';
import Card from '../../../../../Common/Presentational/MaterialCard';

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

const insulinRegimenOptions = map(insulinRegimens, (name, value) => ({ name, value }));

const getPremadeRegimenStatus = insulinRegimen => insulinRegimen !== 'custom' && !isEmpty(insulinRegimen);


class InsulinRegimen extends Component {
  constructor({ insulinRegimen }) {
    super();
    this.state = {
      premadeRegimen: getPremadeRegimenStatus(insulinRegimen),
      errorCheckCount: 0,
    };
    this.handleInsulinChange = this.handleInsulinChange.bind(this);
    this.handleInsulinRegimenChange = this.handleInsulinRegimenChange.bind(this);
    this.handleInsulinRequiredChange = this.handleInsulinRequiredChange.bind(this);
    this.shouldDisplay = this.shouldDisplay.bind(this);
    this.renderBasalInsulins = this.renderBasalInsulins.bind(this);
    this.renderBolusInsulins = this.renderBolusInsulins.bind(this);
    this.renderBasalBolusInsulins = this.renderBasalBolusInsulins.bind(this);
  }

  componentWillReceiveProps({ insulinRegimen }) {
    if (this.state.premadeRegimen && isEmpty(insulinRegimen)) {
      this.setComponentState(this.state.errorCheckCount + 1, this.state.error, this.state.premadeRegimen, () => {
        if (this.state.errorCheckCount > 1) {
          this.setState({
            error: true,
          });
        }
      });
    } else if (insulinRegimen.includes('custom') && !this.props.insulinRegimen.includes('custom') && this.state.premadeRegimen) {
      this.setComponentState(0, false, false);
    } else {
      this.setComponentState(0, false, this.state.premadeRegimen);
    }
  }

  setComponentState(errorCheckCount, error, premadeRegimen, callback) {
    this.setState({
      errorCheckCount,
      error,
      premadeRegimen,
    }, callback);
  }

  handleInsulinRequiredChange(name, value) {
    this.setState({
      premadeRegimen: value,
    }, () => {
      if (!value) {
        this.props.onChangeInDiabetesSettings('insulinRegimen', 'custom');
      } else {
        this.props.onChangeInDiabetesSettings('insulinRegimen', '');
      }
    });
  }

  handleInsulinChange(name, value) {
    this.props.onChangeInDiabetesSettings(name, getUrlFromId(value));
  }

  handleInsulinRegimenChange(name, value) {
    const diabetesSettings = {
      [name]: value === '' ? 'custom' : value,
    };
    if (value.includes('carb_counting')) {
      diabetesSettings.correctionalOn = true;
    } else if (value.includes('mixed')) {
      diabetesSettings.correctionalOn = false;
    }
    this.props.onChangeInDiabetesSettings(diabetesSettings);
  }

  renderBasalInsulins() {
    return (
      <div className="each-regimen">
        <InputSelect
          options={filter(sortInsulins(this.props.insulins), { type: 'basal' })}
          name="basalInsulin"
          label="Basal"
          value={getIdFromUrl(this.props.basalInsulin)}
          onChangeInput={this.handleInsulinChange}
          wrapperClass="dropdown"
          labelClass="premade-regimen-label"
          style={{ fontSize: '12px' }}
          dontError={!this.shouldDisplay('basal')}
        />
      </div>
    );
  }

  renderBolusInsulins() {
    return (
      <div className="each-regimen">
        <InputSelect
          options={filter(sortInsulins(this.props.insulins), { type: 'bolus' })}
          name="bolusInsulin"
          label="Bolus"
          value={getIdFromUrl(this.props.bolusInsulin)}
          onChangeInput={this.handleInsulinChange}
          wrapperClass="dropdown"
          labelClass="premade-regimen-label"
          style={{ fontSize: '12px' }}
          dontError={!this.shouldDisplay('bolus')}
        />
      </div>
    );
  }

  renderBasalBolusInsulins() {
    const basalInsulinJSX = this.renderBasalInsulins();
    const bolusInsulinJSX = this.renderBolusInsulins();

    return (
      [
        basalInsulinJSX,
        <hr className="card-seperator" />,
        bolusInsulinJSX,
      ]
    )
  }
  
  renderMixedInsulins() {
    return (
      <React.Fragment>
        <hr className="card-seperator" />
        <div className="each-regimen">
          <InputSelect
            options={filter(sortInsulins(this.props.insulins), { type: 'mixed' })}
            name="mixedInsulin"
            label="Mixed"
            value={getIdFromUrl(this.props.mixedInsulin)}
            onChangeInput={this.handleInsulinChange}
            wrapperClass="dropdown"
            labelClass="premade-regimen-label"
            style={{ fontSize: '12px' }}
            dontError={!this.shouldDisplay('mixed')}
          />
        </div>
      </React.Fragment>
    );
  }

  renderRegimenOptions() {
    return (
      <React.Fragment>
        <div className="each-regimen">
          <InputSelect
            options={insulinRegimenOptions}
            className="insulin-options"
            value={this.props.insulinRegimen === 'custom' ? '' : this.props.insulinRegimen}
            name="insulinRegimen"
            onChangeInput={this.handleInsulinRegimenChange}
            label="Regimen"
            wrapperClass="dropdown"
            labelClass="premade-regimen-label"
            style={{ fontSize: '12px' }}
            required
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

  shouldDisplay(type) {
    return findIndex(values(this.props.premadeRegimenCriteria), value => value === type) !== -1;
  }

  render() {
    return (
      <Form
        className="premade-regimen"
        buttonName="submit"
        shouldDisplayButton={false}
      >
        <Card
          additionalClass="global-card"
        >
          <label
            className="sub-heading"
            htmlFor="insulinRequired"
          >
            Premade Regimen
          </label>
          <ToggleSwitch
            value={this.state.premadeRegimen}
            name="insulinRequired"
            wrapperClass="toggle-switch"
            onChangeInput={this.handleInsulinRequiredChange}
            shouldUpdateAlways
          />
          <div className="glucose-settings-input">
            {this.state.premadeRegimen ? this.renderRegimenOptions() : null}
            {  
              // Premade with basal bolus
              (this.state.premadeRegimen && (this.shouldDisplay('basal') || this.shouldDisplay('bolus') && (this.props.insulinRegimen !== ''))) ? this.renderBasalBolusInsulins() : null
            }
            {
              (this.state.premadeRegimen && this.shouldDisplay('mixed')) ? this.renderMixedInsulins() : null
            }
            {
              !this.state.premadeRegimen ? (
                <React.Fragment>
                  {this.renderBasalBolusInsulins()}
                  {this.renderMixedInsulins()}
                </React.Fragment>
              ) : null
            }
          </div>
        </Card>
      </Form>
    );
  }
}

InsulinRegimen.propTypes = {
  insulinRegimen: PropTypes.string,
  insulins: PropTypes.array,
  bolusInsulin: PropTypes.string,
  basalInsulin: PropTypes.string,
  mixedInsulin: PropTypes.string,
  onChangeInDiabetesSettings: PropTypes.func.isRequired,

};

InsulinRegimen.defaultProps = {
  insulinRegimen: '',
  insulins: [],
  bolusInsulin: '',
  basalInsulin: '',
  mixedInsulin: '',
};

export default InsulinRegimen;
