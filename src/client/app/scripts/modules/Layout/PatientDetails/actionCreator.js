export const patientDetailFetchActionCreator = (id) => {
  return {
    type: 'PATIENT_DETAIL_FETCH_REQUEST',
    payload: {
      id,
    },
  };
};
