import { Map, List } from 'immutable';
import { handleActions } from 'redux-actions';

import { fetchBikesAction } from './actions';

export default handleActions(
  {
    [fetchBikesAction](state, action) {
      debugger;
      return state.set('status', action.payload);
    }
  },
  Map({
    request: 'UNINITIALIZED',
    bikes: List()
  })
);
