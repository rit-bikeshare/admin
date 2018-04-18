import { all } from '../common-redux/all';
import Bike from './records/Bike';

export const name = 'bikes';
export const path = 'bikes/';
export const record = Bike;
export const indexFn = bike => bike.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
