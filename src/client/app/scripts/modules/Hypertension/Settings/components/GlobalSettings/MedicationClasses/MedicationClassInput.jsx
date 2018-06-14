import React from 'react';
import { shape, arrayOf, string } from 'prop-types';
import { Field, change } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { baseUrl } from 'scripts/helpers/api.js';
import { fromJS } from 'immutable';

import map from 'lodash/map';
import isNil from 'lodash/isNil';

import SimpleInputSelect from '../../../../../Common/FormElements/ReduxForm/Toolbox/InputSelect';
import Icon from '../../../../../Common/Icon/index.jsx';
import { getIndexFromName } from '../../../../Common/helpers.js';

import styles from './styles.scss';

const style = {
  inputStyle: {
    backgroundColor: '#f5f5f5',
    border: '0.5px solid #979797',
    color: '#4d4d4e',
    height: '2rem',
    flex: '5 5 100px',
  },
  spanStyle: {
    margin: '7px',
  },
  classNameStyle: {
    margin: '5px',
    fontSize: '18px',
  }
}

class MedicationClassInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleOnChangeMedication = this.handleOnChangeMedication.bind(this);
  }

  handleDelete() {
    const { input, meta, mdClassImmutable, selectRegimenChangeHandler, medicationNameToUrlMap, medicationUrlToNameMap, medicationNameToFrequencyMap, mealIdMap, scheduleList } = this.props;
    input.onChange(fromJS(mdClassImmutable).set('required', false));
    /* Select Regimen Value is handled inside component state
       Hence, by default, select regimen will be unchecked whenever a medication class is removed
       No matter when a medication class is custom or populated using `Select Regimen`
    */
    selectRegimenChangeHandler('selectRegimen', false);
    meta.dispatch(change(
      'hypertensionSettingsForm',
      `scheduleList[${getIndexFromName(input.name)}].isInSchedule`,
      false,
    ));
  }

  handleOnChangeMedication(e, newSelectedMedicationId) {
    const { input, meta, mdClassImmutable, selectRegimenChangeHandler, medicationNameToUrlMap, medicationUrlToNameMap, medicationNameToFrequencyMap, mealIdMap, scheduleList } = this.props;
    const medicationMap = medicationNameToUrlMap.toJS();
    const currentIndex = getIndexFromName(input.name);
    const frequencyMap = medicationNameToFrequencyMap.toJS();
    const mealMap = mealIdMap.toJS();
    const schedule = scheduleList.toJS();
    const urlToNameMap = medicationUrlToNameMap.toJS();

    const getTimeWindowUrls = [
      `${baseUrl}/api/time-windows/${mealMap.breakfast}/`,
      `${baseUrl}/api/time-windows/${mealMap.lunch}/`,
      `${baseUrl}/api/time-windows/${mealMap.bedtime}/`,
    ];

    let doseDetails;
    if (frequencyMap[urlToNameMap[newSelectedMedicationId]] !== 'qd') {
      doseDetails = {
        hyperTensionUrl: null,
        isHavingMedication: true,
        timeWindow: ['breakfast', 'lunch', 'bedtime'],
        timeWindowUrl: getTimeWindowUrls,
      };
    } else {
      doseDetails = {
        hyperTensionUrl: [null, null, null],
        isHavingMedication: [true, false, false],
        timeWindow: ['breakfast', 'lunch', 'bedtime'],
        timeWindowUrl: getTimeWindowUrls,
      };
    }
    schedule[currentIndex].hyperTensionMedName = urlToNameMap[newSelectedMedicationId];
    schedule[currentIndex].hyperTensionMedUrl = newSelectedMedicationId;
    schedule[currentIndex].hyperTensionMedFrequency = frequencyMap[urlToNameMap[newSelectedMedicationId]];
    schedule[currentIndex].doseDetails = doseDetails;
    meta.dispatch(change(
      'hypertensionSettingsForm',
      `scheduleList`,
      fromJS(schedule),
    ));
  }

  handleHover(activeDelete) {
    return () => {
      this.setState({
        activeDelete,
      });
    }
  }

  render() {
    const { input, meta, mdClassImmutable, selectRegimenChangeHandler, medicationNameToUrlMap, medicationUrlToNameMap, medicationNameToFrequencyMap, mealIdMap, scheduleList } = this.props;
    const { selectedMedicationId, ...mdClass } = mdClassImmutable;
    const options = map(mdClass.medications, ({ medication: label, url: value }) => ({ label, value }));
    const inputStyle = isNil(selectedMedicationId) ? { ...style.inputStyle, borderColor: 'red'} : style.inputStyle;

    return (
      <div className={classNames(styles['medication-class-input'], 'clearfix')}>
        <Row
          className="each-row"
          onMouseEnter={this.props.handleHover(input.name)}
          onMouseLeave={this.props.removeHover}
        >
          <Col md={2} xs={2}>
            <div
              className="name"
              style={style.classNameStyle}
            >
              {mdClass.name}
            </div>
          </Col>
          <Col md={6} xs={6}>
            <Field
              name={`${input.name}.selectedMedicationId`}
              component={SimpleInputSelect}
              onChange={this.handleOnChangeMedication}
              options={options}
              className="medicine-name"
            />
          </Col>
          <Col md={4} xs={4}>
            <span
              onClick={this.handleDelete}
              className={`delete ${input.name === this.props.activeDelete ? 'active' : ''}`}
            >
              Delete
            </span>
          </Col>
        </Row>
      </div>
    )
  }
}

MedicationClassInput.propTypes = {
  input: shape({
    value: shape({
      name: string.isRequired,
      medications: arrayOf(shape({
        name: string.isRequired,
        id: string.isRequired,
      })).isRequired,
    }).isRequired,
    selectedMedicationId: string,
  }).isRequired,
};

const mapStateToProps = state => ({
  medicationNameToUrlMap: state.getIn(['derivedData', 'mappingFromApiData', 'medicationNameToUrlMap']),
  medicationNameToFrequencyMap: state.getIn(['derivedData', 'mappingFromApiData', 'medicationNameToFrequencyMap']),
  medicationUrlToNameMap: state.getIn(['derivedData', 'mappingFromApiData', 'medicationUrlToNameMap']),
  mealIdMap: state.getIn(['derivedData', 'mappingFromApiData', 'mealIdMap']),
  scheduleList: state.getIn(['form', 'hypertensionSettingsForm', 'values', 'scheduleList']),
});

export default connect(mapStateToProps, () => ({}))(MedicationClassInput);
