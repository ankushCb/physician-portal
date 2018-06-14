import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Iterable } from 'immutable';
import { reduxForm, Field, formValueSelector, change } from 'redux-form/immutable';

import map from 'lodash/map';
import reject from 'lodash/reject';
import findIndex from 'lodash/findIndex';
import first from 'lodash/first';
import isUndefined from 'lodash/isUndefined';

import { baseUrl } from 'scripts/helpers/api.js';

import InputSelect from '../../../Common/FormElements/ReduxForm/Toolbox/InputSelect';
import Button from '../../../Common/FormElements/ReduxForm/Toolbox/Button';
import isRequired from '../../../../helpers/validations/isRequired.js';

import styles from './styles.scss';

const validate = (values) => {
  const error = {};
  console.log('values ', values)
  if (isUndefined(values.get('medicationClass')) || Iterable.isIterable(values.get('medicationClass')) || values.get('medicationClass') === '') {
    error.medicationClass = 'Select a medication class';
  }
  console.log('error ', error);
  return error;
};

const submitValues = (value, dispatch, { medicationClasses, onClose, scheduleList, mealIdMap, medicationUrlToNameMap, medicationNameToFrequencyMap, handleSelectRegimenChange }) => {
  const medicationClass = fromJS(medicationClasses[value.get('medicationClass')]);
  const currentMedicationSelected = value.get('medicationName');
  const medicationClassesIndex = findIndex(medicationClasses, { name: medicationClass.get('name') });
  const scheduleIndex = findIndex(scheduleList, { hyperTensionMedClass: medicationClass.get('name') });

  const getTimeWindowUrls = [
    `${baseUrl}/api/time-windows/${mealIdMap.breakfast}/`,
    `${baseUrl}/api/time-windows/${mealIdMap.lunch}/`,
    `${baseUrl}/api/time-windows/${mealIdMap.bedtime}/`,
  ];
  const firstMedication = medicationClass.getIn(['medications', 0]);
  let doseDetails;
  if (firstMedication.get('frequency') !== 'qd') {
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

  const schedulePriority = fromJS(scheduleList)
    .toSeq()
    .reduce((accumulator, schedule) => {
      const value = schedule.get('isInSchedule') ? 1 : 0;
      return accumulator + value;
    }, 0);
  const newSchdedule = {
    ...scheduleList[scheduleIndex],
    doseDetails,
    isInSchedule: true,
    isActive: false,
    hyperTensionMedName: medicationUrlToNameMap.get(currentMedicationSelected),
    hyperTensionMedFrequency: medicationNameToFrequencyMap.get(medicationUrlToNameMap.get(currentMedicationSelected)),
    hyperTensionMedUrl: currentMedicationSelected,
    schedulePriority,
    dose: '0',
  };

  dispatch(change(
    'hypertensionSettingsForm',
    `scheduleList[${scheduleIndex}]`,
    fromJS(newSchdedule),
  ));
  dispatch(change(
    'hypertensionSettingsForm',
    `medicationClasses[${medicationClassesIndex}]`,
    medicationClass.set('required', true).set('selectedMedicationId', currentMedicationSelected),
  ));
  handleSelectRegimenChange('', false);
  onClose();
};

class AddClassForm extends React.Component {
  constructor({ initialValues, medicationClasses }) {
    super();
    this.state = {
      activeClassIndex: findIndex(medicationClasses, {
        name: initialValues
                .get('medicationClass')
                .get('name'),
      }) || 0,
    };

    this.onChangeClass = this.onChangeClass.bind(this);
  }

  onChangeClass(a, b) {
    this.setState({ activeClassIndex: Number(b) });
  }

  render() {
    const {
      handleSubmit,
      medicationClasses,
      valid,
      medicationClass,
      onClose,
      mealIdMap,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(submitValues)}>
        <div className={styles['add-class-form']}>
          <div className="form-title">Add Class</div>
          <div className="each-field">
            <Field
              name="medicationClass"
              component={InputSelect}
              options={reject(map(medicationClasses, ({ name: label, required }, value) => ({ label, required, value })), 'required')}
              onChange={this.onChangeClass}
              label="Class"
              floating
              // validate={isRequired()}
            />
          </div>
          <div className="each-field">
            {
              this.state.activeClassIndex !== -1 && (
                <Field
                  name="medicationName"
                  component={InputSelect}
                  options={map(medicationClasses[this.state.activeClassIndex].medications, ({ medication, url }) => ({ label: medication, value: url }))}
                  // validate={isRequired()}
                  overrideBlur
                  label="Medication"
                  floating
                />
              )
            }
          </div>
          <div className="buttons">
            <Button
              onClick={onClose}
              value="Cancel"
              className="form-btn"
            />
            <Button
              disabled={!valid || this.state.activeClassIndex === -1}
              value="Next"
              type="submit"
              className="form-btn"
            />
          </div>
        </div>
      </form>
    );
  }
}

AddClassForm = reduxForm({ 
  form: 'addClassesForm',
  validate,

})(AddClassForm);

const selector = formValueSelector('addClassesForm');
const htStngsSelector = formValueSelector('hypertensionSettingsForm');

AddClassForm = connect((state) => {
  const medicationClasses = htStngsSelector(state, 'medicationClasses').toJS();
  return {
    medicationClasses,
    initialValues: { medicationClass: first(reject(medicationClasses, 'required')), medicationName: '' },
    medicationClass: selector(state, 'medicationClass'),
    scheduleList: htStngsSelector(state, 'scheduleList').toJS(),
    mealIdMap: state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']).toJS(),
    medicationUrlToNameMap: state.getIn(['derivedData', 'mappingFromApiData', 'medicationUrlToNameMap']),
    medicationNameToFrequencyMap: state.getIn(['derivedData', 'mappingFromApiData', 'medicationNameToFrequencyMap']),
  };
})(AddClassForm);

export default AddClassForm;
