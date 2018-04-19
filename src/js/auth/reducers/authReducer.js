import { handleActions } from 'redux-actions';
import UserData from '../records/UserData';
import {
  fetchDataSuccess,
  setUserToken,
  clearUserData,
} from '../actions/authActions';

const initialState = new UserData();

function mergeUserData(oldVal, newVal) {
  if (newVal === null && oldVal !== null) return oldVal;
  return newVal;
}

export default handleActions(
  {
    [fetchDataSuccess](state, action) {
      const newUserData = new UserData(action.payload);
      return state.mergeWith(mergeUserData, newUserData);
    },
    [setUserToken](state, action) {
      return state.set('authToken', action.payload);
    },
    [clearUserData]() {
      return new UserData();
    },
  },
  initialState
);
