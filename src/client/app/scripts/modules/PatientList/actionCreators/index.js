export const patientListFetchActionCreator = () => {
  return {
    type: 'PRACTITIONER_PATIENTLIST_FETCH_REQUEST',
  };
};


export const practitionerInitialFetchActionCreator = () => ({
  type: 'PRACTITIONER_INITIAL_FETCH_REQUEST',
});


export const practitionerBgReadingsFetchActionCreator = (id) => {
  return {
    type: 'PRACTITIONER_BGREADINGS_FETCH_REQUEST',
    payload: {
      id,
    },
  };
};

export const personalInformationPostActionCreator = data => ({
  type: 'PERSONAL_INFORMATION_CHECK',
  payload: {
    data,
  },
});

export const dailySchedulePostActionCreator = data => ({
  type: 'DAILY_SCHEDULE_POST',
  payload: {
    data,
  },
});

export const reinitializeData = () => ({
  type: 'REINITIALIZE_DATA',
});

export const checkEmail = data => ({
  type: 'CHECK_EMAIL',
  payload: {
    data,
  },
});

export const checkPhone = data => ({
  type: 'CHECK_PHONE',
  payload: {
    data,
  },
});

export const updateCareRow = index => ({
  type: 'UPDATE_CARE_ROW',
  payload: {
    index,
  },
});

export const submitCareData = (data, patientId) => ({
  type: 'SUBMIT_CARE_DATA',
  payload: {
    data,
    patientId,
  },
});
