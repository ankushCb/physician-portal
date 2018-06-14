import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import each from 'lodash/each';
import includes from 'lodash/includes';
import head from 'lodash/head';
import capitalize from 'lodash/capitalize';
import camelCase from 'lodash/camelCase';
import values from 'lodash/values';

import GlobalTimeEditor from './GlobalTimeEditor.jsx';
import Modal from '../../../../../Common/Presentational/Modal/index.jsx';

import getSortedTimeSlots from '../../../helpers/getSortedTimeWindows.js';
import { CheckWithIcon } from '../../../../../Common/styledFormElements/index.js';

import {
  isCarbCounting,
  isValidCarbCountMeal,
  mapNameToObject,
  insulinTypeChooseOptions,
  canHaveInsulinTypesGen,
  canHaveInsulinTypesModifier,
  generateInsulinTypeOptions,
  getInsulinOfType,
} from 'scripts/helpers/timeWindowHelpers.js';

import {
  InputSelect,
  InputNumber,
  InputCheck,
  InputCarbRatio,
  InputText,
} from '../../../../../Common/FormElements/Formsy';

import {
  timeWindowDisplayModifyValuesActionCreator,
  premadeRegimenUpdatePartialActionCreator,
  premadeRegimenUpdateCompleteActionCreator,
} from '../../../actionCreators/index.js';

import styles from './styles.scss';


const renderDisplayTime = (time) => {
  const momentTime = moment(time, 'HH:mm:ss');
  return (
    <div className="display-time">
      <div className="time">{momentTime.format('h:mm')}</div>
      <div className="meridian">{(momentTime.format('A'))}</div>
    </div>
  );
};

class ScheduleTable extends React.Component {
  constructor(props) {
    super(props);

    this.insulinTypeOptions = insulinTypeChooseOptions();
    this.canHaveInsulinTypes = canHaveInsulinTypesGen();

    this.state = {
      insulinType: {},
      insulinTypeOptions: this.insulinTypeOptions,
      canHaveInsulinTypes: this.canHaveInsulinTypes,
      globalTimeEditor: {
        show: false,
        selectedWindow: null,
      },
    };

    this.onChangeInsulinType = this.onChangeInsulinType.bind(this);
    this.onChangeInsulinType = this.onChangeInsulinType.bind(this);
    this.handleChangeInBaseDose = this.handleChangeInBaseDose.bind(this);
    this.renderHeaders = this.renderHeaders.bind(this);
    this.handleBgCheckClick = this.handleBgCheckClick.bind(this);
    this.handleCorrectionalClick = this.handleCorrectionalClick.bind(this);
    this.toggleShowGlobalTimeEditor = this.toggleShowGlobalTimeEditor.bind(this);
  }

  componentDidMount() {
    const canHaveInsulinTypes = canHaveInsulinTypesModifier(this.props.diabetesSettings.insulinRegimen);
    const insulinTypeOptions = generateInsulinTypeOptions(this.props.diabetesSettings, canHaveInsulinTypes, this.props.idInsulinMap);

    const insulinType = fromJS(this.props.premadeRegimenCriteria);

    const premadeRegimenInsulinType = insulinType
      .toSeq()
      .reduce((accumulator, value, key) => accumulator.set(key, value === 'none' ? 'bg' : value), Map())
      .toJS();
    this.insulinTypeOptions = insulinTypeOptions;
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      insulinType: premadeRegimenInsulinType,
      canHaveInsulinTypes,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.insulinRegimen !== nextProps.insulinRegimen || !isEqual(this.props.idInsulinMap, nextProps.idInsulinMap)) {
      const canHaveInsulinTypes = canHaveInsulinTypesModifier(nextProps.diabetesSettings.insulinRegimen);

      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        canHaveInsulinTypes,
      });
    }

    if (!isEqual(this.props.options, nextProps.options) && this.props.diabetesSettings.insulinRegimen === nextProps.diabetesSettings.insulinRegimen) {
      // this.tempOptions = this.props.options;
      const optionImmutable = fromJS(nextProps.options);

      const newRegimen = optionImmutable.toSeq()
        .reduce((accumulator, value, key) => {
          return accumulator.set(key, value.get('insulinTypePreloaded'));
        }, Map());
      this.props.premadeRegimenUpdateCompleteActionCreator(newRegimen.toJS());
    }

    // Add insulin types of required types
    if (!isEqual(this.props.premadeRegimenCriteria, nextProps.premadeRegimenCriteria)) {
      const insulinType = {};
      each(nextProps.premadeRegimenCriteria, (value, key) => {
        if (value === 'none') {
          insulinType[key] = 'bg';
        } else {
          insulinType[key] = value;
        }
      });
      this.setState({
        insulinType,
      });
    }
  }

  onChangeInsulinType(name, changedValue) {
    this.props.onRemovePremadeRegimen();
    this.props.onChangeFormInput(name, changedValue);
    const { mealName, value } = mapNameToObject(name, changedValue);
    let updatedValue;
    const allInsulinType = ['Basal', 'Bolus', 'Mixed', 'bg'];
    each(allInsulinType, (type) => {
      if (includes(value, type)) {
        updatedValue = camelCase(type);
      }
    });
    if (this.props.insulinIdMap[value]) {
      updatedValue = this.props.idInsulinTypeMap[this.props.insulinIdMap[value]];
    }
    this.props.premadeRegimenUpdatePartialActionCreator({
      mealName,
      value: updatedValue,
    });

    this.props.timeWindowDisplayModifyValuesActionCreator({
      mealName,
      parameter: 'base_dose',
      value: 1,
    });

    if (changedValue === 'bg') {
      const windowName = head(name.split('.'));
      this.props.onChangeFormInput({
        [`${windowName}.bg_check_prescribed`]: true,
        [`${windowName}.base_dose`]: 0,
      });
    }
  }

  toggleShowGlobalTimeEditor(selectedWindow) {
    return () => {
      this.setState({
        globalTimeEditor: {
          show: !this.state.globalTimeEditor.show,
          selectedWindow,
        },
      });
    };
  }

  handleChangeInBaseDose(name, value) {
    this.props.onChangeFormInput(name, Number(value));
  }

  handleBgCheckClick(name, value) {
    console.log('name, value ', name, value);
    const timeWindowProps = { [name]: value };
    if (value === false) {
      timeWindowProps[`${name.split('.')[0]}.correctional_insulin_on`] = value;
      timeWindowProps[`${name.split('.')[0]}.bg_check_required`] = value;
    }
    this.props.onChangeFormInput(timeWindowProps);
  }

  handleCorrectionalClick(name, value) {
    const timeWindowProps = { [name]: value };
    if (value === true) {
      timeWindowProps[`${name.split('.')[0]}.bg_check_prescribed`] = value;
    }
    this.props.onChangeFormInput(timeWindowProps);
  }

  renderHeaders() { // eslint-disable-line
    return (
      <thead>
        <tr>
          <th />
          <th>Meal</th>
          <th>Time</th>
          <th>Insulin Name</th>
          <th>Dose</th>
          <th className="center-align">bG Check?</th>
          {this.props.diabetesSettings.correctionalOn ? <th className="center-align">Correction</th> : <th style={{ opacity: 0 }}>Correction</th>}
        </tr>
      </thead>
    );
  }

  // TODO: Rewrite in a simpler way,
  render() {
    let setInsulin;
    const options = getSortedTimeSlots(this.props.options);
    let isCarbCountingMeal;
    let carbCountingRatio;
    let chooseOrBg;
    let insulinName;
    const isEverythingDisabled = this.props.diabetesSettings.insulinRegimen === '';

    const canHaveInsulinTypes = canHaveInsulinTypesModifier(this.props.diabetesSettings.insulinRegimen);
    const insulinTypeOptions = generateInsulinTypeOptions(this.props.diabetesSettings, canHaveInsulinTypes, this.props.idInsulinMap);
  
    return (
      <div className={styles['schedule-table']}>
        <table className="table">
          {this.renderHeaders()}
          <tbody>
            {
              map(options, (mealValues) => {
                setInsulin = getInsulinOfType(this.state.insulinType, this.props.diabetesSettings, mealValues);
                isCarbCountingMeal = isCarbCounting(this.props.insulinRegimen) && isValidCarbCountMeal(mealValues.name);
                carbCountingRatio = (mealValues.carbCountingRatio ? mealValues.carbCountingRatio : 15);
                chooseOrBg = ((setInsulin === 'bg' || setInsulin === 'none') && !isCarbCountingMeal) ? 'bg' : `Choose ${capitalize(this.state.insulinType[mealValues.name])}`;
                insulinName = this.props.idInsulinMap[setInsulin] ? this.props.idInsulinMap[setInsulin] : chooseOrBg;
                return (
                  <tr className="each-row" key={mealValues.name} id={`tw-meal-${mealValues.name}`}>
                    <td id="tw-check">
                      <InputCheck
                        name={`check.${mealValues.name}`}
                        disabled={isEverythingDisabled}
                        onChangeInput={this.props.handleChangeRowCheck}
                      />
                    </td>
                    <td className="mealname" id="tw-name">
                      {capitalize(mealValues.name)}
                    </td>

                    <td className="duration" id="tw-time" onClick={this.toggleShowGlobalTimeEditor(mealValues.name)}>
                      {renderDisplayTime(mealValues.startTime)}
                      <div className="separator">-</div>
                      {renderDisplayTime(mealValues.stopTime)}
                    </td>
                    <td id="tw-insulin">
                      <span>
                        {
                          (!isCarbCountingMeal) ? (
                            <InputSelect
                              name={`${mealValues.name}.insulin`}
                              options={insulinTypeOptions}
                              value={insulinName}
                              disabled={isCarbCounting(this.props.insulinRegimen) || isEverythingDisabled}
                              fieldClass="scheduletable-insulin"
                              validations={`notChoose:${mealValues.name}`}
                              validationError="Select a Type"
                              onChangeInput={this.onChangeInsulinType}
                              style={{ fontSize: '12px' }}
                              reRenderAlways
                            />
                          ) : (
                            <InputText
                              name={`${mealValues.name}.insulin`}
                              value={insulinName}
                              fieldClass="scheduletable-insulin"
                              disabled
                            />
                          )
                        }
                      </span>
                    </td>

                    <td className="dose" id="tw-dose">
                      <span>
                        {
                          (isCarbCountingMeal) ? (
                            <InputCarbRatio
                              fieldClass="scheduletable-basedose"
                              name={`${mealValues.name}.carbCountingRatio`}
                              type="number"
                              onChangeInput={this.handleChangeInBaseDose}
                              value={carbCountingRatio}
                              minValue={this.state.insulinType[mealValues.name] === 'bg' ? 0 : 1}
                              maxValue={200}
                              disabled={this.state.insulinType[mealValues.name] === 'bg' || isEverythingDisabled}
                            />
                        ) : (setInsulin !== 'bg') && (
                          <InputNumber
                            name={`${mealValues.name}.baseDose`}
                            fieldClass="scheduletable-basedose"
                            onChangeInput={this.handleChangeInBaseDose}
                            value={this.state.insulinType[mealValues.name] === 'bg' ? 0 : mealValues.baseDose}
                            minValue={this.state.insulinType[mealValues.name] === 'bg' ? 0 : 1}
                            maxValue={200}
                            disabled={this.state.insulinType[mealValues.name] === 'bg' || isEverythingDisabled}
                            style={this.state.insulinType[mealValues.name] === 'bg' ? { display: 'none' } : null}
                          />
                        )
                        }
                      </span>
                    </td>
                    <td className="center-align" id="tw-bg">
                      <CheckWithIcon
                        type="tag"
                        value={mealValues.bgCheckPrescribed}
                        disabled={this.state.insulinType[mealValues.name] === 'bg' || isEverythingDisabled}
                        name={`${mealValues.name}.bgCheckPrescribed`}
                        onChangeInput={this.handleBgCheckClick}
                        spanStyle={{ marginTop: '-15px' }}
                      />
                    </td>
                    {
                      this.props.diabetesSettings.correctionalOn ?
                        <td className="center-align" id="tw-correction">
                          <CheckWithIcon
                            type="plus"
                            name={`${mealValues.name}.correctionalInsulinOn`}
                            value={mealValues.correctionalInsulinOn}
                            onChangeInput={this.handleCorrectionalClick}
                            disabled={isEverythingDisabled}
                            spanStyle={{ marginTop: '-15px' }}
                          />
                        </td> :
                        <td style={{ opacity: 0 }}>
                          <CheckWithIcon
                            type="plus"
                            name={`${mealValues.name}.correctionalInsulinOn`}
                            value={mealValues.correctionalInsulinOn}
                            disabled={isEverythingDisabled}
                            spanStyle={{ marginTop: '-15px' }}
                          />
                        </td>
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <Modal
          open={this.state.globalTimeEditor.show}
          onClose={this.toggleShowGlobalTimeEditor(null)}
          bodyClass="global-time-editor-modal"
          height={500}
        >
          <GlobalTimeEditor
            onUpdateTime={this.props.onChangeScheduleTime}
            closeParentModal={this.toggleShowGlobalTimeEditor(null)}
            mealName={this.state.globalTimeEditor.selectedWindow}
            startTime={this.state.globalTimeEditor.selectedWindow && this.props.options[this.state.globalTimeEditor.selectedWindow].startTime}
            endTime={this.state.globalTimeEditor.selectedWindow && this.props.options[this.state.globalTimeEditor.selectedWindow].stopTime}
          />
        </Modal>
      </div>
    );
  }
}

ScheduleTable.propTypes = {
  options: PropTypes.object,
  onChangeFormInput: PropTypes.func.isRequired,
  diabetesSettings: PropTypes.object.isRequired,
  idInsulinMap: PropTypes.object,
  premadeRegimenCriteria: PropTypes.object,
  timeWindowDisplayModifyValuesActionCreator: PropTypes.func.isRequired,
  premadeRegimenUpdatePartialActionCreator: PropTypes.func.isRequired,
  onRemovePremadeRegimen: PropTypes.func.isRequired,
  insulinRegimen: PropTypes.string,
  insulinIdMap: PropTypes.object,
  idInsulinTypeMap: PropTypes.object,
  premadeRegimenUpdateCompleteActionCreator: PropTypes.func.isRequired,
};

ScheduleTable.defaultProps = {
  options: {
    morning: '',
  },
  idInsulinMap: {},
  premadeRegimenCriteria: {},
  insulinRegimen: 'custom',
  insulinIdMap: {},
  idInsulinTypeMap: {},
};

const mapStateToProps = () => {
  return {
  };
};

const dispatchActionToProps = (dispatch) => {
  return {
    timeWindowDisplayModifyValuesActionCreator: bindActionCreators(timeWindowDisplayModifyValuesActionCreator, dispatch),
    premadeRegimenUpdatePartialActionCreator: bindActionCreators(premadeRegimenUpdatePartialActionCreator, dispatch),
    premadeRegimenUpdateCompleteActionCreator: bindActionCreators(premadeRegimenUpdateCompleteActionCreator, dispatch),
  };
};

export default connect(mapStateToProps, dispatchActionToProps)(ScheduleTable);
