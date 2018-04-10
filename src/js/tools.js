import { Set, Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { get, post, put, del } from './request';
import { Bike } from './models';

const TIMEOUT = 5000;
const NOTIFY = Set(['update', 'create', 'destroy']);

const notifyAction = createAction('ADD_NOTIFICATION');
const popAction = createAction('POP_NOTIFICATION');

export const bikesSimple = (() => {
  const bikeDefinition = {
    name: 'bikes',
    path: 'bikes/',
    record: Bike,
    indexFn: bike => bike.get('id')
  };

  const { action: listAction, reducers: listReducers } = createList(
    bikeDefinition
  );

  const { action: retrieveAction, reducers: retrieveReducers } = createRetrieve(
    bikeDefinition
  );

  return {
    actions: { list: listAction, retrieve: retrieveAction },
    reducer: handleActions(
      { ...listReducers, ...retrieveReducers },
      Map({ status: 'UNINITIALIZED', data: Map(), error: null })
    )
  };
})();

//ref

const REQUESTS = Map({
  list: ({ path }) => get(path),
  retrieve: ({ path, id }) => get(`${path}${id}`),
  update: ({ path, id, obj }) => put(`${path}${id}`, obj),
  create: ({ path, obj }) => post(path, obj),
  destroy: ({ path, id }) => del(`${path}${id}`)
});

const setData = ({ state, obj, record, identityFunc }) =>
  state.merge(
    obj
      .toMap()
      .map(o => new record(o))
      .mapKeys((_, obj) => identityFunc(obj))
  );

const setObject = ({ state, id, obj, record, identityFunc }) =>
  state.remove(id).set(identityFunc(obj), new record(obj));

const removeObject = ({ state, id }) => state.remove(id);

const REDUCERS = Map({
  list: setData,
  retrieve: setObject,
  update: setObject,
  create: setObject,
  destroy: removeObject
});

/* Can add paging here */
export const getReducerAndActions = ({
  modelName,
  path,
  record,
  identityFunc = obj => obj.get('id')
}) => {
  const getActionName = key => `${key.toUpperCase()}_${modelName}`;

  const actions = REQUESTS.map((requestFunction, key) => {
    const action = createAction(getActionName(key));

    return ({ id, obj, notificationTimeout = TIMEOUT } = {}) => dispatch => {
      obj = new record(obj);
      id = !id && obj ? identityFunc(obj) : id;

      const notify = ({ status, id }) => {
        if (NOTIFY.contains(key)) {
          dispatch(notifyAction({ type: action.type, status, id }));
          setTimeout(() => {
            dispatch(popAction({}));
          }, notificationTimeout);
        }
      };

      dispatch(action({ id, status: 'PENDING' }));
      requestFunction({ path, id, obj })
        .then(data => {
          const status = 'SUCCEEDED';
          const resolvedId = key === 'create' ? identityFunc(data) : id;
          dispatch(action({ id: resolvedId, status: 'SUCCEEDED', data }));
          notify({ status, id: resolvedId });
        })
        .catch(error => {
          const status = 'FAILED';
          dispatch(action({ id, status, error }));
          notify({ status, id });
        });
    };
  });

  const reducer = handleActions(
    REDUCERS.mapKeys(key => getActionName(key))
      .map(
        reducer => (state, { payload: { id, status, data, error = null } }) => {
          return state
            .set('status', status)
            .set('error', error)
            .update(
              'data',
              prevData =>
                data
                  ? reducer({
                      id,
                      record,
                      state: prevData,
                      obj: data,
                      identityFunc
                    })
                  : prevData
            );
        }
      )
      .toJS(),
    Map({
      status: 'UNINITIALIZED',
      data: Map(),
      error: null
    })
  );

  return { actions: actions.toJS(), reducer };
};
