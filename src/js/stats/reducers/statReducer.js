import { handleActions } from 'redux-actions';
import { List } from 'immutable';
import { fetchStatsSuccess } from '../actions/fetchStats';
import Stat from '../records/Stat';

export default handleActions(
  {
    [fetchStatsSuccess](state, action) {
      return action.payload.map(stat => new Stat(stat));
    },
  },
  List()
);
