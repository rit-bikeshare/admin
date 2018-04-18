import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import User from '../records/User';
import { USER_EDITOR_OPEN } from '../constants/UsersActionTypes';

export default handleActions(
  {
    [USER_EDITOR_OPEN](state, action) {
      const { user } = action.payload;
      return Map({
        active: true,
        user: new User(user),
      });
    },
  },
  Map({
    active: false,
    user: new User(),
  })
);
