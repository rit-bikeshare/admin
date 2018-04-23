import { Map } from 'immutable';
import { createAction } from 'redux-actions';

export const clear = ({ name }) => {
  const prefix = name.toUpperCase();
  const action = createAction(`${prefix}_CLEAR`);
  const reducers = {
    [action]: state => state.set('data', Map()),
  };

  return { action, reducers };
};
