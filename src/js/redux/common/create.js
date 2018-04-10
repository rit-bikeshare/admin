import { createAction } from 'redux-actions';
import { post } from '../../request';

export const create = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const createObjAction = createAction(`${prefix}_CREATE`);
  const createSuccessAction = createAction(`${prefix}_CREATE_SUCCESS`);
  const createFailureAction = createAction(`${prefix}_CREATE_FAILURE`);

  const action = ({ object }) => dispatch => {
    dispatch(createObjAction());
    post(path, object)
      .then(object => {
        dispatch(createSuccessAction({ object: new record(object) }));
      })
      .catch(error => {
        dispatch(createFailureAction({ error }));
      });
  };

  const reducers = {
    [createObjAction]: state => state.set('status', 'PENDING'),
    [createSuccessAction]: (state, { payload: { object } }) =>
      state
        .set('status', 'SUCCESS')
        .update('data', data => data.set(indexFn(object), object)),
    [createFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error)
  };

  return { action, reducers };
};
