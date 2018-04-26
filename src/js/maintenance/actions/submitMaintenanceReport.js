import { createAction } from 'redux-actions';
import fetchDamageReports from './fetchDamageReports';

const maintenanceReportCreateSuccess = createAction(
  'MAINTENANCE_REPORT_CREATED'
);

export default function submitMaintenanceReport(data) {
  return (dispatch, getState, api) => {
    api.post(`admin/maintenance-reports`, data).then(response => {
      dispatch(fetchDamageReports());
      dispatch(maintenanceReportCreateSuccess(response));
    });
  };
}
