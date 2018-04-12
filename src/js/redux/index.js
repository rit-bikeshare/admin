import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth/reducer';
import { reducer as bikes } from './bikes';
import { reducer as bikeRacks } from './bikeRacks';

export default combineReducers({
  auth,
  bikes,
  bikeRacks,
  routing: routerReducer
});
