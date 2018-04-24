import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import {
  record as BikeRack,
  indexFn,
  bikeRacksRetrieveAction,
  bikeRacksUpdateAction,
  bikeRacksCreateAction,
} from './bikeRacks';

const openBikeRackEditorAction = createAction('BIKERACK_EDITOR_OPEN');
export const closeBikeRackEditor = createAction('BIKERACK_EDITOR_CLOSE');

export const openBikeRackEditor = ({
  id: maybeId,
  object,
  creating = false,
}) => {
  return (dispatch, getState) => {
    const id = maybeId || indexFn(object);

    if (!id) {
      dispatch(openBikeRackEditorAction({ bikeRack: object, creating }));
      return true;
    }

    const bikeRack = getState().bikeRacks.getIn(['data', id]);
    if (!bikeRack) {
      return dispatch(bikeRacksRetrieveAction({ id }))
        .then(bikeRack => {
          dispatch(openBikeRackEditorAction({ bikeRack, creating }));
          return true;
        })
        .catch(() => false);
    }

    dispatch(openBikeRackEditorAction({ bikeRack, creating }));
    return true;
  };
};

export const saveBikeRackEditor = ({ object }) => {
  return (dispatch, getState) => {
    const state = getState();
    const creating = state.bikeRackEditor.get('creating', false);
    const fn = creating ? bikeRacksCreateAction : bikeRacksUpdateAction;
    return dispatch(fn({ object: object.set('bikeCount', undefined) }));
  };
};

const initialState = Map({
  active: false,
  creating: false,
  bikeRack: new BikeRack(),
});

export const reducer = handleActions(
  {
    [openBikeRackEditorAction](state, action) {
      const { bikeRack, creating = false } = action.payload;
      return Map({ active: true, creating, bikeRack: new BikeRack(bikeRack) });
    },
    [closeBikeRackEditor]() {
      return initialState;
    },
  },
  initialState
);
