import { createAction } from 'redux-actions';
import { get } from '../../request';

export const retrieve = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const retrieveAction = createAction(`${prefix}_RETRIEVE`);
  const retrieveSuccessAction = createAction(`${prefix}_RETRIEVE_SUCCESS`);
  const retrieveFailureAction = createAction(`${prefix}_RETRIEVE_FAILURE`);

  const action = ({ id: maybeId, object }) => dispatch => {
    const id = maybeId || indexFn(object);
    dispatch(retrieveAction());
    get(`${path}${id}`)
      .then(object => {
        dispatch(retrieveSuccessAction({ object: new record(object) }));
      })
      .catch(error => {
        dispatch(retrieveFailureAction({ error }));
      });
  };

  const reducers = {
    [retrieveAction]: state => state.set('status', 'PENDING'),
    [retrieveSuccessAction]: (state, { payload: { object } }) =>
      state
        .set('status', 'SUCCESS')
        .update('data', data => data.set(indexFn(object), object)),
    [retrieveFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  };

  return { action, reducers };
};
