import { createAction } from 'redux-actions';

export const fetchBikesAction = createAction('FETCH_BIKES');

export const fetchBikes = () => (dispatch, getState) => {
  dispatch(fetchBikesAction({ status: 'PENDING' }));
};
