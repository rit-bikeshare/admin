import { Map } from 'immutable';
import { createAction } from 'redux-actions';
import { all } from '../common-redux/all';
import BikeshareUser from './records/BikeshareUser';

export const name = 'users';
export const path = 'admin/users/';
export const record = BikeshareUser;
export const indexFn = user => user.get('id');

const clearUsersAction = createAction('USERS_CLEAR_DATA');
const additionalActions = { clearUsersAction };
const additionalReducers = {
  [clearUsersAction]: state => state.set('data', Map()),
};

export const { actions, reducer } = all(
  { name, path, record, indexFn },
  { additionalActions, additionalReducers }
);
