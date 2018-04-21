import { createAction } from 'redux-actions';

export const list = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const listAction = createAction(`${prefix}_LIST`);
  const listSuccessAction = createAction(`${prefix}_LIST_SUCCESS`);
  const listFailureAction = createAction(`${prefix}_LIST_FAILURE`);

  function action() {
    return (dispatch, getState, api) => {
      dispatch(listAction());
      api
        .get(path)
        .then(objects => {
          const data = objects
            .toMap()
            .map(obj => new record(obj))
            .mapKeys((_, obj) => indexFn(obj))
            .sort((a, b) => a.get('id') - b.get('id'));
          dispatch(listSuccessAction({ data }));
          return data;
        })
        .catch(error => {
          dispatch(listFailureAction({ error }));
        });
    };
  }

  const reducers = {
    [listAction]: state => state.set('status', 'PENDING'),
    [listSuccessAction]: (state, { payload: { data } }) =>
      state
        .set('status', 'SUCCESS')
        .update('data', prevData => prevData.merge(data)),
    [listFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  };

  return { action, reducers };
};
