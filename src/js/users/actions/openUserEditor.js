import { createAction } from 'redux-actions';
import { retrieve as retrieveBikeAction } from './userActions';
import { indexFn } from '../usersRedux';
import {
  USER_EDITOR_OPEN,
  USER_EDITOR_CLOSE,
} from '../constants/UsersActionTypes';

/* Not used directly */
const openUserEditorAction = createAction(USER_EDITOR_OPEN);
//eslint-disable-next-line
const closeUserEditorAction = createAction(USER_EDITOR_CLOSE);

export default function openUserEditor({ id: maybeId, object }) {
  return (dispatch, getState) => {
    const id = maybeId || indexFn(object);

    if (!id) {
      dispatch(openUserEditorAction({ user: object }));
      return;
    }

    if (!getState().bikes.hasIn(['data', id])) {
      retrieveBikeAction({ id });
    }
  };
}
