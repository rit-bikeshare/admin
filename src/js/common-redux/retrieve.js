import { createAction } from 'redux-actions';

export const retrieve = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const retrieveAction = createAction(`${prefix}_RETRIEVE`);
  const retrieveSuccessAction = createAction(`${prefix}_RETRIEVE_SUCCESS`);
  const retrieveFailureAction = createAction(`${prefix}_RETRIEVE_FAILURE`);

  function action({ id: maybeId, object }) {
    return (dispatch, getState, api) => {
      const id = maybeId || indexFn(object);
      dispatch(retrieveAction());
      return api
        .get(`${path}${id}`)
        .then(rawObject => {
          const object = new record(rawObject);
          dispatch(retrieveSuccessAction({ object }));
          return object;
        })
        .catch(error => {
          dispatch(retrieveFailureAction({ error }));
        });
    };
  }

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
