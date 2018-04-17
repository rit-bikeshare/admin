import { createAction } from 'redux-actions';
import bikeActions from './bikeActions';
import { indexFn } from '../constants/bikeReduxConfig';
import {
  BIKE_EDITOR_OPEN,
  BIKE_EDITOR_CLOSE,
} from '../constants/BikeActionTypes';

/* Not used directly */
const openBikeEditorAction = createAction(BIKE_EDITOR_OPEN);
//eslint-disable-next-line
const closeBikeEditorAction = createAction(BIKE_EDITOR_CLOSE);

export default function openBikeEditor({ id: maybeId, object }) {
  return (dispatch, getState) => {
    const id = maybeId || indexFn(object);

    if (!id) {
      dispatch(openBikeEditorAction({ bike: object }));
      return;
    }

    if (!getState().bikes.hasIn(['data', id])) {
      bikeActions.retrieve({ id });
    }
  };
}
