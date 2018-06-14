import { Map } from 'immutable';

import createReducer from '../../../../helpers/createReducer.js';

const initialState = Map({

});

// const onRegimenDetailFetchSuccess = (state, { payload }) => {
//   let newState = state;
//   newState = newState.set('regimenData', payload.regimenData);
//   return newState;
// };

const onRegimenUpdatePartial = (state, { payload }) => {
  let newState = state;
  const shouldMakeACopy = !newState.get('regimenDisplay');
  const regimenDisplay = Object.assign({}, newState.get('regimenDisplay'));
  regimenDisplay[payload.updateData.mealName] = payload.updateData.value;
  newState = newState.set('regimenDisplay', regimenDisplay);
  if (shouldMakeACopy) {
    newState = newState.set('defaultRegimen', regimenDisplay);
  }
  return newState;
};

const onRegimenUpdateComplete = (state, { payload }) => {
  let newState = state;
  newState = newState.set('regimenDisplay', payload.updateData);
  return newState;
};

export default createReducer(initialState, {
  // PREMADE_REGIMEN_FETCH_SUCCESS: onRegimenDetailFetchSuccess,
  PREMADE_REGIMEN_UPDATE_PARTIAL_INITIATED: onRegimenUpdatePartial,
  PREMADE_REGIMEN_UPDATE_COMPLETE_INITIATED: onRegimenUpdateComplete,
});
