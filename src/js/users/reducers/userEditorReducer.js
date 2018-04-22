import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import BikeshareUser from '../records/BikeshareUser';
import {
  openUserEditorAction,
  closeUserEditor,
} from '../actions/userEditorActions';

const closedState = Map({ active: false, user: new BikeshareUser() });

export default handleActions(
  {
    [openUserEditorAction](state, action) {
      const { user } = action.payload;
      return Map({ active: true, user: new BikeshareUser(user) });
    },
    [closeUserEditor]() {
      return closedState;
    },
  },
  closedState
);
