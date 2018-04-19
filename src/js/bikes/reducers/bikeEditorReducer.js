import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import Bike from '../records/Bike';
import { openBikeEditorAction } from '../actions/bikeEditorActions';

export default handleActions(
  {
    [openBikeEditorAction](state, action) {
      const { bike } = action.payload;
      return Map({ active: true, bike: new Bike(bike) });
    },
  },
  Map({ active: false, bike: new Bike() })
);
