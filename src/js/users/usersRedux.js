import { all } from '../common-redux/all';
import User from './records/User';

export const name = 'users';
export const path = 'admin/users/';
export const record = User;
export const indexFn = user => user.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
