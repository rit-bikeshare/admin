import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { clear } from './clear';
import { create } from './create';
import { destroy } from './destroy';
import { list } from './list';
import { retrieve } from './retrieve';
import { update } from './update';

const providers = Map({
  Clear: clear,
  Create: create,
  Destroy: destroy,
  List: list,
  Retrieve: retrieve,
  Update: update,
});

/**
 * common-redux provides basic rest operations provided by django.
 * This provides basic crud operations for most of our models.
 */
export const all = (objectDefinition, getAdditionalActions = () => {}) => {
  const { name } = objectDefinition;
  const result = providers
    .map(provider => provider(objectDefinition))
    .mapKeys(key => `${name}${key}Action`);

  const actions = result.map(({ action }) => action).toJS();
  const reducers = result.reduce(
    (allReducers, { reducers }) => ({ ...reducers, ...allReducers }),
    {}
  );

  return {
    actions: { ...actions, ...getAdditionalActions(actions) },
    reducer: handleActions(
      reducers,
      Map({ status: 'UNINITIALIZED', data: Map(), error: null })
    ),
  };
};
