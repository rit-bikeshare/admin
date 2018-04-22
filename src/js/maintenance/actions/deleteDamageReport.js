import Q from 'q';
import { createAction } from 'redux-actions';

export const deleteReportSuccess = createAction('DELETE_REPORT_SUCCESS');

export default function deleteDamageReport(bikeId) {
  return (dispatch, getState, api) => {
    const { reports } = getState().damageReports.get(bikeId);
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
