import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth/reducer';
import { reducer as bikes } from './bikes';

export default combineReducers({
  auth,
  bikes,
  routing: routerReducer
});
