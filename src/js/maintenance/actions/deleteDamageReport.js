import Q from 'q';
import { createAction } from 'redux-actions';
import getUnAckedDamageReports from '../selectors/getUnAckedDamageReports';

export const deleteReportSuccess = createAction('DELETE_REPORT_SUCCESS');

export default function deleteDamageReport(bikeId) {
  return (dispatch, getState, api) => {
    const reports = getUnAckedDamageReports(getState()).getIn([
      bikeId,
      'reports',
    ]);

    Q.all(
      reports
        .map(report => {
          return api.del(`admin/damage-reports/${report.id}`);
        })
        .toJS()
    )
      .then(() => dispatch(deleteReportSuccess(bikeId)))
      .done();
  };
}
