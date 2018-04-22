import { createAction } from 'redux-actions';

export const ackSuccess = createAction('ACK_REPORT_SUCCESS');

export default function ackDamageReport(bikeId) {
  return (dispatch, getState, api) => {
    api
      .post(`maint/ack${bikeId}`)
      .then(
        response => dispatch(ackSuccess(response)),
        //eslint-disable-next-line
        error => console.error(error)
      )
      .done();
  };
}
