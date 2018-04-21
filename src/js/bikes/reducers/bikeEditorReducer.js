import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import Bike from '../records/Bike';
import {
  openBikeEditorAction,
  closeBikeEditor,
} from '../actions/bikeEditorActions';

const closedState = Map({ active: false, bike: new Bike() });

export default handleActions(
  {
    [openBikeEditorAction](state, action) {
      const { bike } = action.payload;
      return Map({ active: true, bike: new Bike(bike) });
    },
    [closeBikeEditor]() {
      return closedState;
    },
  },
  closedState
);
