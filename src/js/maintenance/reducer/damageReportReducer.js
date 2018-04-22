import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import Bike from 'bikes/records/Bike';
import {
  damageReportFetchSuccess,
  fetchBikeDataSuccess,
} from '../actions/fetchDamageReports';
import { deleteReportSuccess } from '../actions/deleteDamageReport';

export default handleActions(
  {
    [damageReportFetchSuccess](state, action) {
      return action.payload;
    },
    [fetchBikeDataSuccess](state, action) {
      const { id, data } = action.payload;
      return state.setIn([id, 'bike'], new Bike(data));
    },
    [deleteReportSuccess](state, action) {
      const id = action.payload;
      return state.remove(id);
    },
  },
  Map()
);
