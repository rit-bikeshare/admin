import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const path = 'admin/settings/';
const retrieveAction = createAction('SETTINGS_RETRIEVE');
const retrieveSuccessAction = createAction('SETTINGS_RETRIEVE_SUCCESS');
const retrieveFailureAction = createAction('SETTINGS_RETRIEVE_FAILURE');

export const getSettings = () => (dispatch, getState, api) => {
  dispatch(retrieveAction());
  return api
    .get(path)
    .then(response => dispatch(retrieveSuccessAction({ response })))
    .catch(error => dispatch(retrieveFailureAction({ error })));
};

export const saveSettings = settings => (dispatch, getState, api) => {
  dispatch(retrieveAction());
  return api
    .post(path, settings)
    .then(response => dispatch(retrieveSuccessAction({ response })))
    .catch(error => {
      dispatch(retrieveFailureAction({ error }));
      throw error;
    });
};

//const transform = response => {};

export const reducer = handleActions(
  {
    [retrieveAction]: state => state.set('status', 'PENDING'),
    [retrieveSuccessAction]: (state, { payload: { response } }) =>
      state.set('status', 'SUCCESS').set('data', response),
    [retrieveFailureAction]: (state, { payload: { error } }) =>
      state.set('status', 'FAILURE').set('error', error),
  },
  Map({ status: 'UNINITIALIZED', data: Map(), error: null })
);
