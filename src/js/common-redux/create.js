import { createAction } from 'redux-actions';

export const create = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const createObjAction = createAction(`${prefix}_CREATE`);
  const createSuccessAction = createAction(`${prefix}_CREATE_SUCCESS`);
  const createFailureAction = createAction(`${prefix}_CREATE_FAILURE`);

  function action({ object }) {
    return (dispatch, getState, api) => {
      dispatch(createObjAction());
      return api
        .post(path, object)
        .then(rawObject => {
          const object = new record(rawObject);
          dispatch(createSuccessAction({ object }));
          return object;
        })
        .catch(error => {
          dispatch(createFailureAction({ error }));
          throw error;
        });
    };
  }

  const reducers = {
    [createObjAction]: state => state.set('status', 'PENDING'),
    [createSuccessAction]: (state, { payload: { object } }) =>
      state
        .set('status', 'SUCCESS')
        .update('data', data => data.set(indexFn(object), object)),
    [createFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  };

  return { action, reducers };
};
