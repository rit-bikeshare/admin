import { Bike } from '../models';
import { all } from './common/all';

/**
 * Provides actions:
 * list()
 * create(obj)
 * retrieve(id) or retrieve(obj)
 * update(obj)
 * destroy(id) or destroy(obj)
 */
export const { actions, reducer } = all({
  name: 'bikes',
  path: 'admin/bikes/',
  record: Bike,
  indexFn: bike => bike.get('id')
});
