import { Map, fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { Bike } from '../../models';

import { fetchRentalsAction, editorAction, editBikeAction } from './actions';

export default handleActions(
  {
    [fetchRentalsAction](state, action) {
      const { status, error = null, data: rentals = null } = action.payload;
      return state.set('rentals', fromJS({ status, rentals, error }));
    },
    [editorAction](state, action) {
      const {
        status = 'UNINITIALIZED',
        error = null,
        active = false,
        bike = new Bike()
      } = action.payload;

      return state.set(
        'editor',
        Map({
          status,
          error,
          active,
          bike: new Bike(bike)
        })
      );
    },
    [editBikeAction](state, action) {
      const { status, error = null } = action.payload;
      return state.update('editor', editor =>
        editor.set('status', status).set('error', error)
      );
    }
  },
  Map({
    bikes: Map({
      status: 'UNINITIALIZED',
      error: null,
      bikes: null
    }),
    rentals: Map({
      status: 'UNINITIALIZED',
      error: null,
      rentals: null
    }),
    editor: Map({
      status: 'UNINITIALIZED',
      error: null,
      active: false,
      bike: new Bike()
    })
  })
);
