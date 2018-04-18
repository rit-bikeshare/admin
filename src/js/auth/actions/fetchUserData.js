import { createAction } from 'redux-actions';

import {
  SET_USER_DATA,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILED,
  USER_FETCH,
  CLEAR_USER_DATA,
} from '../constants/AuthActionTypes';

export const setUserData = createAction(SET_USER_DATA);
const fetchDataSuccess = createAction(USER_FETCH_SUCCESS);
const fetchDataFailed = createAction(USER_FETCH_FAILED);
const fetchData = createAction(USER_FETCH);

export default function fetchUserData() {
  return (dispatch, getState, api) => {
    dispatch(fetchData());
    api
      .get('user/info')
      .then(
        userData => dispatch(fetchDataSuccess(userData)),
        error => dispatch(fetchDataFailed(error))
      );
  };
}

export const clearUserData = createAction(CLEAR_USER_DATA);
