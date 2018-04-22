import { all } from '../common-redux/all';
import BikeLock from './records/BikeLock';

export const name = 'bikelocks';
export const path = 'admin/locks/';
export const record = BikeLock;
export const indexFn = bikelock => bikelock.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
