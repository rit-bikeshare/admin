import { all } from '../common-redux/all';
import BikeLock from './records/BikeLock';

export const name = 'bikeracks';
export const path = 'admin/bike-racks/';
export const record = BikeLock;
export const indexFn = bikelock => bikelock.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
