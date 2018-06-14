export const initialFetch = (patientId) => ({
  type: 'MEALTIME_INITIAL_FETCH',
  payload: {
    patientId,
  },
});

export const updateMealTime = ({ mealName, startTime, stopTime, url, patientId }) => ({
  type: 'UPDATE_MEAL_TIME', 
  payload: {
    mealName,
    startTime,
    stopTime,
    url,
    patientId,
  },
});