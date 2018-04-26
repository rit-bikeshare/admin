import { createAction } from 'redux-actions';

export const fetchStatsSuccess = createAction('STATS_FETCH_SUCCESS');

export default function fetchStatus() {
  return (dispatch, getState, api) => {
    api
      .get('admin/stats')
      .then(response => dispatch(fetchStatsSuccess(response)));
  };
}
