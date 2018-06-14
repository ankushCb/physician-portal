import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';

import { List } from 'immutable';

import { InputText, InputCheck } from '../../../../Common/FormElements/Formsy';
import Button from '../../../../Common/FormElements/ReduxForm/Toolbox/Button';
import AddReminderForm from './AddReminderForm.jsx';

import styles from './styles.scss';

const meals = ['morning', 'breakfast', 'lunch', 'evening', 'dinner', 'bedtime'];

class AddReminder extends React.Component {
  constructor() {
    super();
    this.handleOnAddClick = this.handleOnAddClick.bind(this);
  }

  handleOnAddClick(value) {
    console.log('value ', value);
    const name = value.get('medication');
    const dose = value.get('dose');
    const timeWindows = value.get('timewindows');

    // console.log('timeWindows ', timeWindows);
    const activeTimeWindows = timeWindows
      .toSeq()
      .reduce((accumulator, active, twName) => {
        if (active) {
          accumulator = accumulator.push(twName);
        }
        return accumulator;
      }, List())
      .toJS();
    
    // console.log('activeTimeWindows ', activeTimeWindows);
    const newTw = map(activeTimeWindows, tw => this.props.twNameToUrl[tw]);
    // console.log('newTw ', this.props.twNameToUrl, newTw)
    this.props.onSubmit({ name, dose, activeTimeWindows: newTw });
    this.props.onCancel();
  }

  // eslint-disable-next-line class-methods-use-this
  renderMealOptions() {
    return 
  }

  render() {
    return (
      <div className={styles['add-reminder-form']}>
        <AddReminderForm
          onSubmit={this.handleOnAddClick}
          onCancel={this.props.onCancel}
          meals={meals}
        />
      </div>
    );
  }
}

AddReminder.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddReminder;
