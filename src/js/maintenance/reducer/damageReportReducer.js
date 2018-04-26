import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import { damageReportFetchSuccess } from '../actions/fetchDamageReports';
import { deleteReportSuccess } from '../actions/deleteDamageReport';
import { updateDamageReport } from '../actions/ackDamageReport';

import DamageReport from '../records/DamageReport';

export default handleActions(
  {
    [damageReportFetchSuccess](state, action) {
      const data = Map(
        action.payload.map(report => [
          report.get('id'),
          new DamageReport(report),
        ])
      );
      return data;
    },
    [deleteReportSuccess](state, action) {
      const id = action.payload;
      return state.filter(report => report.bike !== id);
    },
    [updateDamageReport](state, action) {
      const report = new DamageReport(action.payload);
      return state.set(report.id, report);
    },
  },
  Map()
);
