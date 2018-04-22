import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import Bike from 'bikes/records/Bike';
import {
  damageReportFetchSuccess,
  fetchBikeDataSuccess,
} from '../actions/fetchDamageReports';

export default handleActions(
  {
    [damageReportFetchSuccess](state, action) {
      return action.payload;
    },
    [fetchBikeDataSuccess](state, action) {
      const { id, data } = action.payload;
      return state.setIn([id, 'bike'], new Bike(data));
    },
  },
  Map()
);
