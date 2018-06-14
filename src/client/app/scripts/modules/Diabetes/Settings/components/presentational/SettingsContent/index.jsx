import React from 'react';

import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import List from 'scripts/modules/Common/Presentational/List.jsx';

import ScheduleTimeSheet from './ScheduleTimeSheet.jsx';
import MealChangeOption from './MealChangeOption.jsx';
import FeatureCardWithHeader from '../../../../../Common/Presentational/FeatureCardWithHeader';
import { isCarbCounting } from 'scripts/helpers/timeWindowHelpers.js';

const scheduleTimeSheetProps = [
  'diabetesSettings',
  'idInsulinMap',
  'premadeRegimenCriteria',
  'insulinRegimen',
  'onRemovePremadeRegimen',
  'passValidation',
  'idInsulinTypeMap',
  'insulinIdMap',
  'onChangeScheduleTime',
];

const addNewMealProps = [
  'diabetesSettings',
  'idInsulinMap',
  'onChangeInDiabetesSettings',
  'onRemovePremadeRegimen',
  'idInsulinTypeMap',
  'insulinIdMap',
  'insulinIdMap',
  'insulinTypeMap',
];

class SettingsContent extends React.Component {
  render() {
    const props = this.props;
    return !props.carbModalOpen && (
      <FeatureCardWithHeader
        header="Schedule"
        wrapperClass="settings-item"
        showPreLoader={props.shouldLoadSpinnerInsteadOfTable}
      >
        <List
          itemList={props.scheduleTableData}
          noItemMessage="No Schedule Data"
          showBorder="true"
        >
          <ScheduleTimeSheet
            ref="scheduleTimeSheet"
            scheduleTableData={props.scheduleTableData}
            onChangeFormInput={props.onChangeFormInput}
            {...pick(props, scheduleTimeSheetProps)}
            handleChangeRowCheck={this.props.handleChangeRowCheck}
            activeSelectedTw={this.props.activeSelectedTw}
          />
        </List>
        <MealChangeOption
          onAddNewMeal={props.onAddNewMeal}
          onDeleteSelectedMeal={props.onDeleteSelectedMeal}
          isCarbCounting={isCarbCounting(props.diabetesSettings.insulinRegimen)}
          insulinRegimen={props.diabetesSettings.insulinRegimen}
          addNewMealDisplayData={props.addNewMealDisplayData}
          onCancel={props.onCancel}
          premadeRegimenUpdatePartialActionCreator={this.props.premadeRegimenUpdatePartialActionCreator}
          timeWindowDisplayUpdateActionCreator={this.props.timeWindowDisplayUpdateActionCreator}
          onRemovePremadeRegimen={this.props.onRemovePremadeRegimen}
          activeSelectedTw={this.props.activeSelectedTw}
          {...pick(props, addNewMealProps)}
        />
      </FeatureCardWithHeader>
    );
  }
}

SettingsContent.propTypes = {
  scheduleTableData: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAddNewMeal: PropTypes.func.isRequired,
  onDeleteSelectedMeal: PropTypes.func.isRequired,
  isAddNewMealWindowOpen: PropTypes.bool.isRequired,
  addNewMealDisplayData: PropTypes.object,
  onChangeFormInput: PropTypes.func.isRequired,
  diabetesSettings: PropTypes.object,
  shouldLoadSpinnerInsteadOfTable: PropTypes.bool,
};

SettingsContent.defaultProps = {
  diabetesSettings: {},
  shouldLoadSpinnerInsteadOfTable: false,
  saveChangesIsValid: true,
  addNewMealDisplayData: {},
};

export default SettingsContent;
