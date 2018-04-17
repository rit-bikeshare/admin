import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from 'auth/reducers/authReducer';
import bikeReducer from 'bikes/reducers/bikesReducer';
import bikeEditorReducer from 'bikes/reducers/bikeEditorReducer';
import bikeRacksReducer from 'bike-racks/reducers/bikeRacksReducer';

export default combineReducers({
  auth: authReducer,
  bikes: bikeReducer,
  bikeEditor: bikeEditorReducer,
  bikeRacks: bikeRacksReducer,
  routing: routerReducer,
});
