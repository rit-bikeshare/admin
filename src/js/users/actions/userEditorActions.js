import { createAction } from 'redux-actions';
import { update as updateUserAction } from './usersActions';
import { indexFn, record as BikeshareUser } from '../UsersRedux';

export const openUserEditorAction = createAction('USER_EDITOR_OPEN');
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

export const saveUserEditor = ({ object }) => {
  return dispatch => dispatch(updateUserAction({ object }));
};
