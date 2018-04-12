import { BikeRack } from '../models';
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
  name: 'bikeracks',
  path: 'admin/bike-racks/',
  record: BikeRack,
  indexFn: bikerack => bikerack.get('id')
});
