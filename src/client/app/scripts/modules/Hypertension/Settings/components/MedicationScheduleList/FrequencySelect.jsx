import React from 'react';
import { List, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Dropdown from 'react-toolbox/lib/dropdown';


const FrequencySelect = ({ options, input, meta, scheduleList, idSorted, ...props }) => {

  const handleChange = (value) => {
    let timeWindow = [true, false, true];
    if (value === 'PM') {
      timeWindow = [false, false, true];
    } else if (value === 'AM') {
      timeWindow = [true, false, false];
    };
    const concernedScheduleItem = scheduleList.setIn([idSorted, 'doseDetails', 'isHavingMedication'], List(timeWindow));
    meta.dispatch(change(
      'hypertensionSettingsForm',
      `scheduleList[${idSorted}]`,
      concernedScheduleItem.get(idSorted),
    ))
  }
  return (
    <Dropdown      
      source={options}
      auto
      placeholder="Select"
      {...input}
      {...props}
      onBlur={() => {}} // Necessary to safeguard values in on blur
      onChange={handleChange}
    />
  );
}

const mapStateToProps = state => ({
  scheduleList: state.getIn(['form', 'hypertensionSettingsForm', 'values', 'scheduleList']),
});

export default connect(mapStateToProps, () => ({}))(FrequencySelect);

