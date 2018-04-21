import { createAction } from 'redux-actions';
import {
  retrieve as retrieveBikeAction,
  update as updateBikeAction,
} from './bikesActions';
import { indexFn } from '../BikesRedux';

export const openBikeEditorAction = createAction('BIKE_EDITOR_OPEN');
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
      return dispatch(retrieveBikeAction({ id }))
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
  return dispatch => dispatch(updateBikeAction({ object }));
};
