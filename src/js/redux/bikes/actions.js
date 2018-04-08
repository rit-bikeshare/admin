import { createAction } from 'redux-actions';

import { get, post } from '../../request';

export const fetchBikesAction = createAction('FETCH_BIKES');

export const fetchBikes = () => dispatch => {
  dispatch(fetchBikesAction({ status: 'PENDING' }));
  get('bikes/')
    .then(bikes => {
      dispatch(fetchBikesAction({ status: 'SUCCEEDED', bikes }));
    })
    .catch(e => {
      dispatch(fetchBikesAction({ status: 'FAILED', error: e }));
    });
};

export const fetchRentalsAction = createAction('FETCH_RENTALS');

export const fetchRentals = () => dispatch => {
  dispatch(fetchRentalsAction({ status: 'PENDING' }));
  get('user/rentals/')
    .then(rentals => {
      dispatch(fetchRentalsAction({ status: 'SUCCEEDED', rentals }));
    })
    .catch(e => {
      dispatch(fetchRentalsAction({ status: 'FAILED', error: e }));
    });
};

export const editorAction = createAction('EDITOR');

export const editBikeAction = createAction('EDIT_BIKE');

export const editBike = bike => dispatch => {
  dispatch(editBikeAction({ status: 'PENDING' }));
  const fn = bike.id ? () => null : post;
  debugger;
  fn('bikes/', bike.toJS())
    .then(response => {
      dispatch(editBikeAction({ status: 'SUCCEEDED', response }));
      dispatch(fetchBikes());
    })
    .catch(e => {
      dispatch(editBikeAction({ status: 'FAILED', error: e }));
    });
};
