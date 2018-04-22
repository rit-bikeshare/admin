import { createAction } from 'redux-actions';

export const maintenanceReportCreated = createAction('CREATE_REPORT_SUCCESS');

export default function createMaintenanceReport(bikeId) {
  return (dispatch, getState, api) => {
    api.post(`maint/report/${bikeId}`).then();
  };
}
