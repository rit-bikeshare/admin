import { createAction } from 'redux-actions';
import { put } from '../../request';

export const update = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const updateAction = createAction(`${prefix}_UPDATE`);
  const updateSuccessAction = createAction(`${prefix}_UPDATE_SUCCESS`);
  const updateFailureAction = createAction(`${prefix}_UPDATE_FAILURE`);

  /* oldId only required if changing ID */
  const action = ({ id: oldId, object }) => dispatch => {
    const id = oldId || indexFn(object);
    dispatch(updateAction());
    put(`${path}${id}`, object)
      .then(object => {
        dispatch(updateSuccessAction({ object: new record(object), oldId }));
      })
      .catch(error => {
        dispatch(updateFailureAction({ error }));
      });
  };

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
