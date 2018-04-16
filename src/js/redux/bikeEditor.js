import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { indexFn, actions as bikeActions } from './bikes';
import { Bike } from '../models';

/* Not used directly */
const openBikeEditorAction = createAction('BIKE_EDITOR_OPEN');
//eslint-disable-next-line
const closeBikeEditorAction = createAction('BIKE_EDITOR_CLOSE');

const openBikeEditor = ({ id: maybeId, object }) => (dispatch, getState) => {
  const id = maybeId || indexFn(object);

  if (!id) {
    dispatch(openBikeEditorAction({ bike: object }));
    return;
  }

  if (!getState().bikes.hasIn(['data', id])) {
    bikeActions.retrieve({ id });
  }
};

export const actions = {
  openBikeEditor,
};

export const reducer = handleActions(
  {
    [openBikeEditorAction](state, action) {
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
