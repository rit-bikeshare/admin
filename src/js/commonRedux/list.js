import { createAction } from 'redux-actions';
import { get } from 'api/request';

export const list = ({ name, path, record, indexFn }) => {
  const prefix = name.toUpperCase();
  const listAction = createAction(`${prefix}_LIST`);
  const listSuccessAction = createAction(`${prefix}_LIST_SUCCESS`);
  const listFailureAction = createAction(`${prefix}_LIST_FAILURE`);

  const action = () => dispatch => {
    dispatch(listAction());
    get(path)
      .then(objects => {
        dispatch(
          listSuccessAction({
            data: objects
              .toMap()
              .map(obj => new record(obj))
              .mapKeys((_, obj) => indexFn(obj))
              .sort((a, b) => a.get('id') - b.get('id')),
          })
        );
      })
      .catch(error => {
        dispatch(listFailureAction({ error }));
      });
  };

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
