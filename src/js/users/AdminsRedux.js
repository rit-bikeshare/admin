import { all } from '../common-redux/all';
import BikeshareUser from './records/BikeshareUser';

export const name = 'admins';
export const path = 'admin/users/';
export const record = BikeshareUser;
export const indexFn = user => user.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
