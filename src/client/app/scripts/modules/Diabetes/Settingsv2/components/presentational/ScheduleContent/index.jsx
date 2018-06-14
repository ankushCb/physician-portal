import React from 'react';
import PropTypes from 'prop-types';
import { Iterable } from 'immutable';
import { connect } from 'react-redux';
import { change } from 'redux-form/immutable';

import ScheduleTimeSheet from './ScheduleTimeSheet.jsx';
import MealChangeOption from './MealChangeOption.jsx';
import List from '../../../../../Common/Presentational/List.jsx';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';

const ScheduleContent = (props) => {
  const scheduleTableData = Iterable.isIterable(props.scheduleData) ? props.scheduleData.toJS() : props.scheduleData;
  const regimenData = Iterable.isIterable(props.regimenData) ? props.regimenData.toJS() : props.regimenData;

  return (
    <FeatureCardWithHeader
      header="Schedule"
      wrapperClass="settings-item"
      style={{
        display: (props.showCCTable ? 'none' : 'initial'),
      }}
    >
      <List
        itemList={scheduleTableData && scheduleTableData.filter(row => row.isDisplayed)}
        noItemMessage="No Schedule Data"
        showBorder="true"
      >
        <ScheduleTimeSheet
          scheduleTableData={scheduleTableData}
          insulinList={props.insulinList}
          selectedInsulins={props.selectedInsulins}
          regimenData={props.regimenData}
          correctionalDetails={props.correctionalDetails}
          turnOffPremadeRegimen={props.turnOffPremadeRegimen}
          changeScheduleTableRow={props.changeScheduleTableRow}
        />
      </List>
      <MealChangeOption
        scheduleTableData={scheduleTableData}
        regimenData={regimenData}
        turnOffPremadeRegimen={props.turnOffPremadeRegimen}
        changeScheduleTableRow={props.changeScheduleTableRow}
      />
    </FeatureCardWithHeader>
  );
};

ScheduleContent.propTypes = {
  scheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  insulinList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInsulins: PropTypes.shape({
    basal: PropTypes.string,
    bolus: PropTypes.string,
    mixed: PropTypes.string,
  }),
  showCCTable: PropTypes.bool,
  regimenData: PropTypes.object.isRequired,
  changeScheduleTableRow: PropTypes.func.isRequired,
  correctionalDetails: PropTypes.object.isRequired,
  turnOffPremadeRegimen: PropTypes.func.isRequired,
};

ScheduleContent.defaultProps = {
  selectedInsulins: {
    basal: '',
    bolus: '',
    mixed: '',
  },
  showCCTable: false,
};

const mapDispatchToProps = {
  turnOffPremadeRegimen: regimenData => change('diabetesSettingsForm', 'regimenData', regimenData),
};

export default connect(null, mapDispatchToProps)(ScheduleContent);
