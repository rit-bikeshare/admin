import { createAction } from 'redux-actions';

export const destroy = ({ name, path, indexFn }) => {
  const prefix = name.toUpperCase();
  const destroyAction = createAction(`${prefix}_DESTROY`);
  const destroySuccessAction = createAction(`${prefix}_DESTROY_SUCCESS`);
  const destroyFailureAction = createAction(`${prefix}_DESTROY_FAILURE`);

  function action({ id: maybeId, object }) {
    return (dispatch, getState, api) => {
      const id = maybeId || indexFn(object);
      dispatch(destroyAction());
      return api
        .del(`${path}${id}`)
        .then(() => {
          dispatch(destroySuccessAction({ id }));
        })
        .catch(error => {
          dispatch(destroyFailureAction({ error }));
        });
    };
  }

  const reducers = {
    [destroyAction]: state => state.set('status', 'PENDING'),
    [destroySuccessAction]: (state, { payload: { id } }) =>
      state.set('status', 'SUCCESS').update('data', data => data.remove(id)),
    [destroyFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  };

  return { action, reducers };
};
