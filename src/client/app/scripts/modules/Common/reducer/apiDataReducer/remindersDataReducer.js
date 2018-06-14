import { Map, List, fromJS } from 'immutable';

import reduce from 'lodash/reduce';
import createReducer from 'scripts/helpers/createReducer.js';

import { deepCamelCase } from 'scripts/helpers/deepCaseConvert.js';

const initialState = Map({
  data: List(),
});

const onRemindersFetch = (state, { payload }) => {
  let newState = state;
  const reminders = deepCamelCase(payload.reminderData);
  const reminderData = fromJS(reminders).toList();
  newState = newState.setIn(['data'], reminderData);
  // This is to compare and patch accordingly
  newState = newState.setIn(['initialData'], reminderData);
  newState = newState.setIn(['nextId'], reminderData.size);
  newState = newState.setIn(['patientId'], payload.patientId);
  return newState;
};

const onAddReminder = (state, { payload }) => {
  let newState = state;
  let remindersData = state.get('data');
  let newReminder = fromJS({
    medication: payload.name,
    dose: payload.dose,
    index: state.get('nextId'),
    timeWindows: List(payload.activeTimeWindows),
  });
  remindersData = remindersData.set(state.get('nextId'), newReminder);
  newState = newState.setIn(['data'], remindersData);
  newState = newState.setIn(['nextId'], state.get('nextId') + 1);
  return newState;
};

const onDeleteReminder = (state, { payload }) => {
  let newState = state;
  let remindersData = state.get('data');
  remindersData = remindersData.delete(payload.index);
  newState = newState.set('data', remindersData);
  newState = newState.set('nextId', state.get('nextId') - 1);
  return newState;
}

const onEditReminder = (state, { payload }) => {
  let newState = state;
  let reminders = state.get('data');
  let remindersData = reminders.get(payload.index);
  remindersData = payload.name ? remindersData.set('medication', payload.name) : remindersData;
  remindersData = payload.dose ? remindersData.set('dose', payload.dose) : remindersData;
  remindersData = payload.activeTimeWindows ? remindersData.set('timeWindows', fromJS(payload.activeTimeWindows)) : remindersData;
  newState = newState.set('data', reminders.set(payload.index, remindersData));
  newState = newState.set('nextId', state.get('nextId'));
  return newState;
};

const onEditReminderContent = (state, { payload }) => {
  let newState = state;
  let remindersData = state.get('data');
  remindersData = remindersData
    .toSeq()
    .map((data) => {
      if (payload.index === data.get('index')) {
        const field = payload.field === 'name' ? 'medication' : payload.field;
        data = data.set(field, payload.value)
      }
      return data;
    })
    .toList();
  newState = newState.set('data', remindersData);
  return newState;
}

export default createReducer(initialState, {
  REMINDERS_FETCH_SUCCESS: onRemindersFetch,
  ADD_REMINDER: onAddReminder,
  DELETE_REMINDER: onDeleteReminder,
  EDIT_REMINDER: onEditReminder,
  EDIT_REMINDER_CONTENT: onEditReminderContent,
});
