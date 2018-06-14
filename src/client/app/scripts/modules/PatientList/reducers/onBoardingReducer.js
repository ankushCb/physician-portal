import { Map, List, fromJS } from 'immutable';
import createReducer from '../../../helpers/createReducer.js';

const initialState = Map({
  postInitiated: false,
  postSuccess: false,
  personalData: List(),
  checkEmail: {
    initiated: false,
    status: null,
  },
  checkPhone: {
    initiated: false,
    status: null,
  },
  errorData: fromJS({
    isError: false,
    message: 'No Error',
  }),
});

// helpers for reducers
const setInitiatedAndSuccess = (state, initiated, success) => {
  let newState = state;
  newState = newState.set('postInitiated', initiated);
  newState = newState.set('postSuccess', success);
  return newState;
};

const onReinitializeData = () => {
  return fromJS({
    postInitiated: false,
    postSuccess: false,
    personalData: List(),
    checkEmail: {
      initiated: false,
      status: null,
    },
    checkPhone: {
      initiated: false,
      status: null,
    },
    errorData: fromJS({
      isError: false,
      message: 'No Error',
    }),
  });
};

const onPersonalInformationInitiated = (state) => {
  let newState = state;
  newState = setInitiatedAndSuccess(state, true, false);
  return newState;
};

const onPersonalInformationSuccess = (state, { payload }) => {
  let newState = setInitiatedAndSuccess(state, false, true);
  newState = newState.set('personalData', payload.personalData);
  return newState;
};

const onPersonalInformationFailure = (state, { payload }) => {
  let newState = state;
  newState = newState.setIn(['errorData', 'isError'], true);
  newState = newState.setIn(['errorData', 'message'], payload.errorMessage);
  return newState;
};

const onDailySchedulePost = (state) => {
  let newState = state;
  newState = setInitiatedAndSuccess(state, true, false);
  return newState;
};

const onDailySchedulePostFailure = (state, { payload }) => {
  let newState = setInitiatedAndSuccess(state, false, false);
  newState = newState.setIn(['errorData', 'isError'], true);
  newState = newState.setIn(['errorData', 'message'], payload.errorMessage);
  return newState;
};

const onOnBoardingSuccess = (state) => {
  const newState = setInitiatedAndSuccess(state, false, true);
  return newState;
};

const onDailySchedulePostSuccess = (state, { payload }) => {
  return state.set('newUserData', payload.onBoardData);
};

const onCheckEmailInitiated = (state) => {
  return state.setIn(['checkEmail', 'initiated'], true);
};

const onCheckEmailSuccess = (state) => {
  state = state.setIn(['checkEmail', 'initiated'], false); // eslint-disable-line
  return state.setIn(['checkEmail', 'status'], true);
};

const onCheckEmailFailure = (state) => {
  state = state.setIn(['checkEmail', 'initiated'], false); // eslint-disable-line
  return state.setIn(['checkEmail', 'status'], false);
};

const onCheckPhoneSuccess = (state) => {
  state = state.setIn(['checkPhone', 'initiated'], false); // eslint-disable-line
  return state.setIn(['checkPhone', 'status'], true);
};

const onCheckPhoneFailure = (state) => {
  state = state.setIn(['checkPhone', 'initiated'], false); // eslint-disable-line
  return state.setIn(['checkPhone', 'status'], false);
};

export default createReducer(initialState, {
  REINITIALIZE_DATA: onReinitializeData,
  PERSONAL_INFORMATION_CHECK: onPersonalInformationInitiated,
  PERSONAL_INFORMATION_SUCCESS: onPersonalInformationSuccess,
  PERSONAL_INFORMATION_CHECK_FAILURE: onPersonalInformationFailure,
  CHECK_EMAIL: onCheckEmailInitiated,
  CHECK_EMAIL_SUCCESS: onCheckEmailSuccess,
  CHECK_EMAIL_REPEATED: onCheckEmailFailure,
  CHECK_PHONE_SUCCESS: onCheckPhoneSuccess,
  CHECK_PHONE_REPEATED: onCheckPhoneFailure,
  DAILY_SCHEDULE_POST: onDailySchedulePost,
  DAILY_SCHEDULE_POST_FAILURE: onDailySchedulePostFailure,
  DAILY_SCHEDULE_POST_SUCCESS: onDailySchedulePostSuccess,
  ONBOARDING_SUCCESS: onOnBoardingSuccess,
});
