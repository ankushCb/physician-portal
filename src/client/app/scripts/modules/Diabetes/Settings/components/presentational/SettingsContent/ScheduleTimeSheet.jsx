import React from 'react';
import Formsy, { addValidationRule } from 'formsy-react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import includes from 'lodash/includes';

import FormWithButton from '../../../../../Common/Presentational/FormWithButton.jsx';
import ScheduleTable from './ScheduleTable.jsx';

addValidationRule('notChoose', (values, value) => {
  return !includes(value, 'Choose');
});

const scheduleTableProps = [
  'diabetesSettings',
  'idInsulinMap',
  'premadeRegimenCriteria',
  'insulinRegimen',
  'onRemovePremadeRegimen',
  'idInsulinTypeMap',
  'insulinIdMap',
  'onChangeScheduleTime',
  'handleChangeRowCheck',
  'activeSelectedTw',
];

class ScheduleTimeSheet extends React.Component {
  render() {
    return (
      <FormWithButton
        onSubmit={() => {}}
        className="schedule-timesheet"
        buttonName="submit"
        ref="schedule"
        shouldDisplayButton={false}
        {...pick(this.props, ['passValidation'])}
      >
        <ScheduleTable
          options={this.props.scheduleTableData}
          onChangeFormInput={this.props.onChangeFormInput}
          {...pick(this.props, scheduleTableProps)}
        />
      </FormWithButton>
    );
  }
}


ScheduleTimeSheet.propTypes = {
  scheduleTableData: PropTypes.object.isRequired,
  onChangeFormInput: PropTypes.func.isRequired,
};

ScheduleTimeSheet.defaultProps = {

};

export default ScheduleTimeSheet;
