import Q from 'q';
import { Map, List } from 'immutable';
import { createAction } from 'redux-actions';
import DamagedBike from '../records/DamagedBike';
import DamageReport from '../records/DamageReport';

export const damageReportFetchSuccess = createAction('DAMANGE_REPORTS_FETCHED');

export const fetchBikeDataSuccess = createAction('FETCHED_BIKE_DATA');

function fetchBikeData(bikeId) {
  return (dispatch, getState, api) => {
    return api.get(`admin/bikes/${bikeId}`).then(
      response =>
        dispatch(fetchBikeDataSuccess({ id: bikeId, data: response })),
      // eslint-disable-next-line
      error => console.error(error)
    );
  };
}

function fetchExtraData(response) {
  return dispatch => {
    return response.map((value, key) => dispatch(fetchBikeData(key)));
  };
}

function parseData(response) {
  return response.reduce((acc, report) => {
    const bikeId = report.get('bike');
    const damageReport = new DamageReport(report);
    if (acc.has(bikeId)) {
      return acc.updateIn([bikeId, 'reports'], reports =>
        reports.push(damageReport)
      );
    }
    return acc.set(
      bikeId,
      new DamagedBike({
        reports: List([damageReport]),
        acknowledged: report.get('acknowledged'),
      })
    );
  }, Map());
}

export default function fetchDamageReports() {
  return (dispatch, getState, api) => {
    api
      .get('admin/damage-reports/', {
        resolved_by: '',
      })
      .then(
        parseData,
        // eslint-disable-next-line
        error => console.error(error)
      )
      .then(response => {
        dispatch(damageReportFetchSuccess(response));
        return Q.all(dispatch(fetchExtraData(response)));
      });
  };
}
