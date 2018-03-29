import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth/reducer';
import bikes from './bikes/reducer';

export default combineReducers({
  auth,
  bikes,
  routing: routerReducer
});
