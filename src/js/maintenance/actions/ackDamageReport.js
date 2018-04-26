import Q from 'q';
import { createAction } from 'redux-actions';
import getUnAckedDamageReports from '../selectors/getUnAckedDamageReports';

export const updateDamageReport = createAction('UPDATE_DAMAGE_REPORT');

export default function ackDamageReport(bikeId) {
  return (dispatch, getState, api) => {
    const damageReportsToAck = getUnAckedDamageReports(getState())
      .getIn([bikeId, 'reports'])
      .map(report => report.set('acknowledged', true))
      .toJS();

    const promises = damageReportsToAck.map(report =>
      api.put(`admin/damage-reports/${report.id}`, report)
    );

    Q.all(promises).then(responses => {
      responses.map(response => {
        if (!response.code) {
          dispatch(updateDamageReport(response));
        }
      });
    });
  };
}
