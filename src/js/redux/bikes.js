import { Bike } from '../models';
import { all } from './common/all';

export const name = 'bikes';
export const path = 'admin/bikes/';
export const record = Bike;
export const indexFn = bike => bike.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
