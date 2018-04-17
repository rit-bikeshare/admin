import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import Bike from '../records/Bike';
import { BIKE_EDITOR_OPEN } from '../constants/BikeActionTypes';

export default handleActions(
  {
    [BIKE_EDITOR_OPEN](state, action) {
      const { bike } = action.payload;
      return Map({
        active: true,
        bike: new Bike(bike),
      });
    },
  },
  Map({
    active: false,
    bike: new Bike(),
  })
);
