import { Map, fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import { fetchBikesAction, fetchRentalsAction } from './actions';

export default handleActions(
  {
    [fetchBikesAction](state, action) {
      const { status, bikes = null, error = null } = action.payload;
      return state.set('bikes', fromJS({ status, bikes, error }));
    },
    [fetchRentalsAction](state, action) {
      const { status, rentals = null, error = null } = action.payload;
      return state.set('rentals', fromJS({ status, rentals, error }));
    }
  },
  Map({
    bikes: Map({
      request: 'UNINITIALIZED',
      bikes: null,
      error: null
    }),
    rentals: Map({
      request: 'UNINITIALIZED',
      rentals: null,
      error: null
    }),
    editor: Map({
      bike: null, // null will create new bike
      error: null
    })
  })
);
