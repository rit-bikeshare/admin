import { createAction } from 'redux-actions';
import { retrieve as retrieveBikeAction } from './bikesActions';
import { indexFn } from '../BikesRedux';

export const openBikeEditorAction = createAction('BIKE_EDITOR_OPEN');
export const closeBikeEditorAction = createAction('BIKE_EDITOR_CLOSE');

export const openBikeEditor = ({ id: maybeId, object }) => {
  return (dispatch, getState) => {
    const id = maybeId || indexFn(object);

    if (!id) {
      dispatch(openBikeEditorAction({ bike: object }));
      return;
    }

    if (!getState().bikes.hasIn(['data', id])) {
      retrieveBikeAction({ id });
    }
  };
};
