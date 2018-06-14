import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import { formValueSelector, change } from 'redux-form/immutable';
import { baseUrl } from 'scripts/helpers/api.js';

import map from 'lodash/map';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import reduce from 'lodash/reduce';
import { List, fromJS } from 'immutable';

import Thresholds from './Thresholds/index.jsx';
import MedicationClasses from './MedicationClasses/index.jsx';
import SelectRegimen from './SelectRegimen.jsx';

import Card from '../../../../Common/Presentational/MaterialCard';

import styles from './styles.scss';

const selector = formValueSelector('hypertensionSettingsForm');

class GlobalSettings extends React.Component {
  constructor(props) {
    super(props);

    this.handleRegimenChange = this.handleRegimenChange.bind(this);
    this.renderRegimen = this.renderRegimen.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  handleRegimenChange({ medications }) {

    let {
      thresholds,
      medicationClasses,
      scheduleList,
      mealIdMap,
      ...props
    } = this.props;
    const mdClassNames = map(medications, 'class');
    const dispatch = this.props.dispatch;
    const validClasses = reduce(medications, (accumulator, medication) => {
      accumulator[medication.class] = true;
      return accumulator;
    }, {});
    let schedulePriority = 0;

    // Entire logic for medication loading
    fromJS(medicationClasses)
      .toSeq()
      .reduce((accumulator, data, index) => {
        const required = includes(mdClassNames, data.get('name'));
        if (required || data.get('required')) {
          data = data.set('required', required);
          if (required) {
            const index = findIndex(mdClassNames, data.get('name'));
            data = data.set('selectedMedicationId', fromJS(medications).getIn([index, 'medicationUrl']))
          }
          dispatch(change(
            'hypertensionSettingsForm',
            `medicationClasses[${index}]`,
            data,
          ))
        }
        return accumulator;
      }, List())

    // Entire logic for time sheet loading
    const getTimeWindowUrls = [
      `${baseUrl}/api/time-windows/${mealIdMap.breakfast}/`,
      `${baseUrl}/api/time-windows/${mealIdMap.lunch}/`,
      `${baseUrl}/api/time-windows/${mealIdMap.bedtime}/`,
    ];

    let doseDetails;

    let newScheduleList = scheduleList
      .toSeq()
      .reduce((accumulator, medication, index) => {
        if (medication.get('isInSchedule')) {
          medication = medication.delete('schedulePriority');
          medication = medication.set('isInSchedule', false);
          dispatch(change(
            'hypertensionSettingsForm',
            `scheduleList[${index}]`,
            medication,
          ));
        }
        return accumulator.push(medication);
      }, List());
    fromJS(medications)
      .toSeq()
      .reduce((accumulator, medication, index) => {
        if (medication.get('frequency') !== 'qd') {
          doseDetails = {
            hyperTensionUrl: null,
            isHavingMedication: true,
            timeWindowUrl: getTimeWindowUrls,
          };
        } else {
          doseDetails = {
            hyperTensionUrl: null,
            isHavingMedication: [true, false, false],
            timeWindow: ['breakfast', 'lunch', 'bedtime'],
            timeWindowUrl: getTimeWindowUrls,
          };
        }

      const scheduleIndexToBeChanged = newScheduleList.findIndex((data) => (data.get('hyperTensionMedClass') === medication.get('class')));
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'hyperTensionMedFrequency'], medication.get('frequency'));
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'hyperTensionMedName'], medication.get('medicationName'));
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'hyperTensionMedUrl'], medication.get('medicationUrl'));
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'isInSchedule'], true);
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'schedulePriority'], index);
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'doseDetails'], fromJS(doseDetails));
      accumulator = accumulator.setIn([scheduleIndexToBeChanged, 'dose'], 0);
      const scheduleDataToBeChanged = accumulator.get(scheduleIndexToBeChanged);

      dispatch(change(
        'hypertensionSettingsForm',
        `scheduleList[${scheduleIndexToBeChanged}]`,
        scheduleDataToBeChanged,
      ));

      return accumulator;
    }, newScheduleList)
  }

  renderRegimen() {
    return(
      <SelectRegimen
        selectRegimen={this.props.selectRegimen}
        handleSelectRegimenChange={this.props.handleSelectRegimenChange}
        onRegimenChange={this.handleRegimenChange}
        onAddClassClick={this.props.onAddClassClick}
        addClassData={this.props.addClassData}
      />
    )
  }

  render() {
    const {
      thresholds,
      medicationClasses,
      scheduleList,
      mealIdMap,
      ...props
    } = this.props;

    return (
      <div className={styles['global-settings']}>
        <Row>
          <Col sm={3} xs={12} className="settings-col">
            <Thresholds
              hyperSystolic={Number(thresholds.get('hypertensionSystolicThreshold'))}
              hyperDiastolic={Number(thresholds.get('hypertensionDiastolicThreshold'))}
              hypoSystolic={Number(thresholds.get('hypotensionSystolicThreshold'))}
              hypoDiastolic={Number(thresholds.get('hypotensionDiastolicThreshold'))}
              thresholdSevere={Number(thresholds.get('hypertensionThresholdSevere'))}
              thresholdMild={Number(thresholds.get('hypertensionThresholdMild'))}
            />
          </Col>
          <Col sm={8} xs={12} className="settings-col">
            <Card
              TitleComponent={this.renderRegimen}
              additionalClass="regimen-card"
            >
              <MedicationClasses
                medicationClasses={this.props.medicationClasses}
                handleSelectRegimenChange={this.props.handleSelectRegimenChange}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

GlobalSettings.propTypes = {
  thresholds: PropTypes.object.isRequired,
  medicationClasses: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
  thresholds: selector(state, 'thresholds'),
  medicationClasses: selector(state, 'medicationClasses'),
  scheduleList: selector(state, 'scheduleList'),
  mealIdMap: state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']).toJS(),
}))(GlobalSettings);
