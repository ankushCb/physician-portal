import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, change, formValueSelector } from 'redux-form/immutable';
import { Iterable, fromJS } from 'immutable';

import findIndex from 'lodash/findIndex';
import values from 'lodash/values';
import capitalize from 'lodash/capitalize';
import lowerCase from 'lodash/lowerCase';

import GlobalTimeEditor from './GlobalTimeEditor.jsx';
import Modal from '../../../../../Common/Presentational/Modal/index.jsx';
import ReduxFormElements from '../../../../../Common/FormElements/ReduxForm';
import { isCarbCounting, isValidCarbCountMeal } from '../../../../../../helpers/timeWindowHelpers';
import helpers from '../../../helpers';

import styles from './styles.scss';

const { InputCheckBox, TimingsText, InputSelect, CheckBoxWithIcon } = ReduxFormElements.Toolbox;
const { InputNumber } = ReduxFormElements;

const select = formValueSelector('diabetesSettingsForm');

const insulinFormatter = id => id || 'bg';

const addMissingTypes = (insulins) => {
  const withAddedTypes = [...insulins];
  const types = ['basal', 'bolus', 'mixed'];
  types.forEach((type) => {
    if (!insulins.filter(i => i.type === type).length) {
      withAddedTypes.push({ type, label: `Choose ${capitalize(type)}`, value: `choose_${type}` });
    }
  });
  return withAddedTypes;
};

class ScheduleTimeSheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      globalTimeEditor: {
        show: false,
        selectedWindow: null,
      },
    };

    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderScheduleRows = this.renderScheduleRows.bind(this);
    this.renderDoseField = this.renderDoseField.bind(this);
    this.onChangeScheduleTime = this.onChangeScheduleTime.bind(this);
    this.getStartTime = this.getStartTime.bind(this);
    this.getStopTime = this.getStopTime.bind(this);
    this.getRowIndex = this.getRowIndex.bind(this);
    this.onClickBgCheck = this.onClickBgCheck.bind(this);
    this.onClickCorrectionalCheck = this.onClickCorrectionalCheck.bind(this);
    this.onInsulinChange = this.onInsulinChange.bind(this);
    this.bgCheckFormatter = this.bgCheckFormatter.bind(this);
  }

  onChangeScheduleTime(newValues) {
    const rowIndex = this.getRowIndex(newValues.mealName);
    this.props.changeTime(rowIndex, [newValues.startTime, newValues.endTime]);
  }

  onClickBgCheck(index, isBgDisabled) {
  
    // Toggle bgCheck value
    // correctionalInsulinOn cannot be ON without bgCheck ON. Hence, turn OFF
    // correctionalInsulinOn if bgCheck is turned OFF
    const scheduleTableData = this.props.scheduleTableData;
    return () => {
      if (!isBgDisabled) {
        this.props.changeScheduleTableRow(index, fromJS({
          ...scheduleTableData[index],
          bgCheck: !scheduleTableData[index].bgCheck,
          correctionalInsulinOn: scheduleTableData[index].bgCheck ? false : scheduleTableData[index].correctionalInsulinOn,
        }))
      }
    };
  }

  onClickCorrectionalCheck(index) {
    // Toggle correctionalInsulinOn value
    // correctionalInsulinOn cannot be ON without bgCheck ON. Hence, turn ON
    // bgCheck if correctionalInsulinOn is turning ON
    const scheduleTableData = this.props.scheduleTableData;
    return () => this.props.changeScheduleTableRow(index, fromJS({
      ...scheduleTableData[index],
      correctionalInsulinOn: !scheduleTableData[index].correctionalInsulinOn,
      bgCheck: !scheduleTableData[index].bgCheck ? true : scheduleTableData[index].bgCheck,
    }));
  }

  onInsulinChange(index) {
    return (e, value) => {
      e.preventDefault();

      let newInsulin = {};
      if (!value || value === 'bg' || value.includes('choose_')) {
        newInsulin = fromJS({ type: value, id: value });
      } else {
        newInsulin = this.props.insulinList.filter(i => i.get('id') === value).first();
      }
      const scheduleTableData = this.props.scheduleTableData;

      this.props.changeScheduleTableRow(index, fromJS({
        ...scheduleTableData[index],
        base_dose: 1,
        bgCheck: (value === 'bg') ? true : scheduleTableData[index].bgCheck,
        insulin: newInsulin,
      }));

      const updatedRegimenData = this.props.regimenData.set('isPremadeRegimen', false)
        .set('insulinRegimen', 'custom');
      this.props.turnOffPremadeRegimen(updatedRegimenData);
    };
  }

  getRowIndex(mealName) {
    return findIndex(this.props.scheduleTableData, row => row.name === mealName);
  }

  getStartTime(name) {
    return this.props.scheduleTableData.filter(row => row.name === name)[0].timings[0];
  }

  getStopTime(name) {
    return this.props.scheduleTableData.filter(row => row.name === name)[0].timings[1];
  }


  bgCheckFormatter(i) {
    // If insulin is already 'bg', bgCheck should be ON
    // If insulin is null, insulin formatter displays BG CHECK ONLY. Hence, bgCheck should be ON
    return () => {
      if (!this.props.scheduleTableData[i].insulin ||
          (this.props.scheduleTableData[i].insulin && this.props.scheduleTableData[i].insulin.id === 'bg')) {
        return true;
      }
      return this.props.scheduleTableData[i].bgCheck;
    };
  }
  /**
  * Toggles the Time editor windos on clicking the duration cell
  */
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

  renderHeaders() {
    return (
      <thead>
        <tr>
          <th />
          <th>Meal</th>
          <th>Time</th>
          <th>Insulin Name</th>
          <th>Dose</th>
          <th className="center-align">bG Check?</th>
          {
            this.props.correctionalDetails.get('correctionalOn') ? <th className="center-align">Correction</th> :
            <th style={{ opacity: 0 }}>Correction</th>
          }
        </tr>
      </thead>
    );
  }

  renderScheduleRows() {
    const props = this.props;
    const selectedInsulins = Iterable.isIterable(props.selectedInsulins) ?
      props.selectedInsulins.toJS() : props.selectedInsulins;

    let insulinOptions = props.insulinList.toJS()
      .filter(i => values(selectedInsulins).includes(i.id))
      .map(i => ({ value: i.id, label: i.name, type: i.type }))
      .concat({ label: 'BG Check Only', value: 'bg', type: 'bg' });

    insulinOptions = addMissingTypes(insulinOptions);

    const rows = props.scheduleTableData.map((row, i) => {
      return row.isDisplayed ?
        (
          <tr className="each-row" key={row.name}>
            <td>
              <Field
                name={`scheduleData[${i}].checked`}
                component={InputCheckBox}
              />
            </td>
            <td className="mealName">{row.name}</td>
            <td className="duration" onClick={this.toggleShowGlobalTimeEditor(row.name)}>
              <Field
                name={`scheduleData[${i}].timings`}
                component={TimingsText}
                timings={row.timings}
              />
            </td>
            <td>
              <Field
                name={`scheduleData[${i}].insulin.id`}
                component={InputSelect}
                format={insulinFormatter}
                onChange={this.onInsulinChange(i)}
                options={helpers.sortInsulinsByType(insulinOptions)}
                disabled={helpers.isCarbCountingRegimen(this.props.regimenData)}
              />
            </td>
            <td className="dose">
              { this.renderDoseField(i) }
            </td>
            <td
              className="center-align"
              onClick={this.onClickBgCheck(i, !row.insulin || row.insulin.id === 'bg')}
            >
              <Field
                name={`scheduleData[${i}].bgCheck`}
                component={CheckBoxWithIcon}
                type="tag"
                format={this.bgCheckFormatter(i)}
                disabled={!row.insulin || row.insulin.id === 'bg'}
              />
            </td>
            {
              this.props.correctionalDetails.get('correctionalOn') &&
              <td
                className="center-align"
                onClick={this.onClickCorrectionalCheck(i)}
              >
                <Field
                  name={`scheduleData[${i}].correctionalInsulinOn`}
                  component={CheckBoxWithIcon}
                  type="plus"
                />
              </td>
            }
          </tr>
      ) : null;
    });

    return rows;
  }

  renderDoseField(i) {
    const { scheduleTableData, regimenData } = this.props;
    const insulinRegimen = regimenData.get('insulinRegimen');
    const isBgCheckOnly = !scheduleTableData[i].insulin || scheduleTableData[i].insulin.id === 'bg';
    let componentName = 'base_dose';
    if (isCarbCounting(insulinRegimen) && isValidCarbCountMeal(lowerCase(scheduleTableData[i].name))) {
      componentName = 'carbCountingRatio';
    }
    return isBgCheckOnly ? null : (
      <React.Fragment>
        <div className="schedule-dosage-wrapper">
          <Field
            name={`scheduleData[${i}].${componentName}`}
            className={`scheduletable-${componentName}`}
            component={InputNumber}
            min={1}
            max={200}
          />
        </div>
        <div className="carb-count-ratio-wrapper">
          {
            componentName === 'carbCountingRatio' &&
            <span className="carb-count-text">to 1</span>
          }
        </div>
      </React.Fragment>
    );
  }

  render() {
    const selectedWindow = this.state.globalTimeEditor.selectedWindow;
    return (
      <div className={styles['schedule-table']}>
        <table className="table">
          {this.renderHeaders()}
          <tbody>
            {this.renderScheduleRows()}
          </tbody>
        </table>
        <Modal
          open={this.state.globalTimeEditor.show}
          onClose={this.toggleShowGlobalTimeEditor(null)}
          bodyClass="global-time-editor-modal"
          height={500}
        >
          <GlobalTimeEditor
            onUpdateTime={this.onChangeScheduleTime}
            closeParentModal={this.toggleShowGlobalTimeEditor(null)}
            mealName={selectedWindow}
            startTime={selectedWindow && this.getStartTime(selectedWindow)}
            endTime={selectedWindow && this.getStopTime(selectedWindow)}
          />
        </Modal>
      </div>
    );
  }
}

ScheduleTimeSheet.propTypes = {
  scheduleTableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeTime: PropTypes.func.isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
  regimenData: PropTypes.object.isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  correctionalDetails: PropTypes.object.isRequired,
  turnOffPremadeRegimen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedInsulins: select(state, 'selectedInsulins'),
});

const mapDispatchToProps = {
  changeTime: (index, timings) => change('diabetesSettingsForm', `scheduleData[${index}].timings`, timings),
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleTimeSheet);
