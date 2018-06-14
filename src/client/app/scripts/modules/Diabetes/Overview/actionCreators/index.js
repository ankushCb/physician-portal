export const practitionerTimeWindowFetchActionCreator = (id) => {
  return {
    type: 'PRACTITIONER_TIMEWINDOWS_FETCH_REQUEST',
    payload: {
      id,
    },
  };
};

export const practitionerBgReadingsFetchActionCreator = (id, currentDate, previousCount, limit) => {
  return {
    type: 'PRACTITIONER_BGREADINGS_FETCH_REQUEST',
    payload: {
      id,
      currentDate,
      previousCount,
      limit,
    },
  };
};

export const practitionerInsulinDosesFetchActionCreator = (id, currentDate, previousCount, limit) => {
  return {
    type: 'PRACTITIONER_INSULINDOSES_FETCH_REQUEST',
    payload: {
      id,
      currentDate,
      previousCount,
      limit,
    },
  };
};

export const fetchInsulins = () => ({
  type: 'FETCH_INSULINS',
});

export const diabetesDisplayInitialFetch = (patientId) => {
  return {
    type: 'DIABETES_DISPLAY_INITIAL_FETCH_REQUEST',
    payload: {
      patientId,
    },
  };
};

export const diabetesSpecificFetch = (id, currentDate, previousCount, limit) => {
  return {
    type: 'DIABETES_DISPLAY_SPECIFIC_FETCH_REQUEST',
    payload: {
      id,
      currentDate,
      previousCount,
      limit,
    },
  };
}
