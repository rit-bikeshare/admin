import { handleActions } from 'redux-actions';

const initialState = new UserData();

export default handleActions(
  {
    [ActionTypes.SET_USER_DATA](state, action) {
      return new UserData(action.payload);
    }
  },
  initialState
);
