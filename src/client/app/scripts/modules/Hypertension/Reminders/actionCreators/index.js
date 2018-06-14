export const fetchInitial = (patientId) => ({
  type: 'REMINDERS_FETCH_INITIAL',
  payload: {
    patientId,
  },
});

export const addReminder = ({ name, dose, activeTimeWindows }) => ({
  type: 'ADD_REMINDER',
  payload: {
    name,
    dose,
    activeTimeWindows,
  },
});

export const deleteReminder = ({ index }) => ({
  type: 'DELETE_REMINDER',
  payload: {
    index,
  },
});

export const editReminder = ({ index, name, dose, activeTimeWindows }) => {
  // console.log('!! index, name, dose, activeTimeWindows', index, name, dose, activeTimeWindows);
  return {
    type: 'EDIT_REMINDER',
    payload: {
      index,
      name,
      dose,
      activeTimeWindows,
    },
  }
};

export const editReminderContent = ({ index, field, value }) => ({
  type: 'EDIT_REMINDER_CONTENT',
  payload: {
    index,
    field,
    value,
  },
});

export const remindersPatchAndFetch = () => ({
  type: 'REMINDERS_PATCH_AND_FETCH',
});
