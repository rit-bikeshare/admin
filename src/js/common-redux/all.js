import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { create } from './create';
import { destroy } from './destroy';
import { list } from './list';
import { retrieve } from './retrieve';
import { update } from './update';

const providers = Map({ create, destroy, list, retrieve, update });

/**
 * Provides actions:
 * list()
 * create(obj)
 * retrieve(id) or retrieve(obj)
 * update(obj)
 * destroy(id) or destroy(obj)
 */
export const all = objectDefinition => {
  const result = providers.map(provider => provider(objectDefinition));
  const actions = result.map(({ action }) => action).toJS();
  const reducers = result.reduce(
    (allReducers, { reducers }) => ({ ...allReducers, ...reducers }),
    {}
  );

  return {
    actions,
    reducer: handleActions(
      reducers,
      Map({ status: 'UNINITIALIZED', data: Map(), error: null })
    ),
    indexFn: objectDefinition.indexFn,
  };
};
