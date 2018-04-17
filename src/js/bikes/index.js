import { all } from '../common/all';
import Bike from './records/Bike';

export const name = 'bikes';
export const path = 'admin/bikes/';
export const record = Bike;
export const indexFn = bike => bike.get('id');

/**
 * Provides actions:
 * list()
 * create(obj)
 * retrieve(id) or retrieve(obj)
 * update(obj)
 * destroy(id) or destroy(obj)
 */
export const { actions, reducer } = all({ name, path, record, indexFn });
