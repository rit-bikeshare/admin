import { createAction } from 'redux-actions';

export const update = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const updateAction = createAction(`${prefix}_UPDATE`);
  const updateSuccessAction = createAction(`${prefix}_UPDATE_SUCCESS`);
  const updateFailureAction = createAction(`${prefix}_UPDATE_FAILURE`);

  /* oldId only required if changing ID */
  function action({ id: oldId, object }) {
    return (dispatch, getState, api) => {
      const id = oldId || indexFn(object);
      dispatch(updateAction());
      return api
        .put(`${path}${id}`, object)
        .then(rawObject => {
          const object = new record(rawObject);
          dispatch(updateSuccessAction({ object, oldId }));
          return object;
        })
        .catch(error => {
          dispatch(updateFailureAction({ error }));
          throw error;
        });
    };
  }

  const reducers = {
    [updateAction]: state => state.set('status', 'PENDING'),
    [updateSuccessAction]: (state, { payload: { object, oldId } }) =>
      state
        .set('status', 'SUCCESS')
        .update('data', data =>
          data.remove(oldId).set(indexFn(object), object)
        ),
    [updateFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  };

  return { action, reducers };
};
