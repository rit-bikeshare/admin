import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { indexFn, record as BikeshareUser, usersUpdateAction } from './users';

const openUserEditorAction = createAction('USER_EDITOR_OPEN');
export const closeUserEditor = createAction('USER_EDITOR_CLOSE');

export const openUserEditor = ({ object }) => {
  return dispatch => {
    const user = new BikeshareUser(object);
    const id = indexFn(user);
    if (!id) {
      return false;
    }

    dispatch(openUserEditorAction({ user }));
    return true;
  };
};

export const saveUserEditor = ({ object }) => dispatch =>
  dispatch(usersUpdateAction({ object }));

const initialState = Map({ active: false, user: new BikeshareUser() });

export const reducer = handleActions(
  {
    [openUserEditorAction](state, action) {
      const { user } = action.payload;
      return Map({ active: true, user: new BikeshareUser(user) });
    },
    [closeUserEditor]() {
      return initialState;
    },
  },
  initialState
);
