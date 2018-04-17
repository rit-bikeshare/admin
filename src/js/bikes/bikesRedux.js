import { all } from '../commonRedux/all';
import Bike from './records/Bike';

export const name = 'bikes';
export const path = 'admin/bikes/';
export const record = Bike;
export const indexFn = bike => bike.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
