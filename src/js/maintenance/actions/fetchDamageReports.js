import { createAction } from 'redux-actions';
import { bikesListAction } from 'bikes/redux/bikes';

export const damageReportFetchSuccess = createAction('DAMANGE_REPORTS_FETCHED');

export default function fetchDamageReports() {
  return (dispatch, getState, api) => {
    api
      .get('admin/damage-reports/', {
        is_open: true,
      })
      .then(response => {
        dispatch(damageReportFetchSuccess(response));
        dispatch(bikesListAction());
      });
  };
}
