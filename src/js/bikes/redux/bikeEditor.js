import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import {
  record as Bike,
  indexFn,
  bikesRetrieveAction,
  bikesUpdateAction,
  bikesCreateAction,
} from './bikes';

const openBikeEditorAction = createAction('BIKE_EDITOR_OPEN');
export const closeBikeEditor = createAction('BIKE_EDITOR_CLOSE');

export const openBikeEditor = ({ id: maybeId, object }) => {
  return (dispatch, getState) => {
    const id = maybeId || indexFn(object);

    if (!id) {
      dispatch(openBikeEditorAction({ bike: object }));
      return true;
    }

    const bike = getState().bikes.getIn(['data', id]);
    if (!bike) {
      return dispatch(bikesRetrieveAction({ id }))
        .then(bike => {
          dispatch(openBikeEditorAction({ bike }));
          return true;
        })
        .catch(() => {
          return false;
        });
    }

    dispatch(openBikeEditorAction({ bike }));
    return true;
  };
};

export const saveBikeEditor = ({ object }) => {
  const id = indexFn(object);
  const fn = id ? bikesUpdateAction : bikesCreateAction;
  return dispatch => {
    return dispatch(fn({ object }));
  };
};

const initialState = Map({ active: false, bike: new Bike() });

export const reducer = handleActions(
  {
    [openBikeEditorAction](state, action) {
      const { bike } = action.payload;
      return Map({ active: true, bike: new Bike(bike) });
    },
    [closeBikeEditor]() {
      return initialState;
    },
  },
  initialState
);
