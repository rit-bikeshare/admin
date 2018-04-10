import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { Bike } from '../../models';
import { all } from '../common/all';

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
  path: 'bikes/',
  record: Bike,
  indexFn: bike => bike.get('id')
});
