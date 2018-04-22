import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from 'auth/reducers/authReducer';
import bikeReducer from 'bikes/reducers/bikesReducer';
import bikeEditorReducer from 'bikes/reducers/bikeEditorReducer';
import bikeRacksReducer from 'bike-racks/reducers/bikeRacksReducer';
import adminsReducer from 'users/reducers/adminsReducer';
import usersReducer from 'users/reducers/usersReducer';
// import userEditorReducer from 'users/reducers/userEditorReducer';
import damageReportReducer from 'maintenance/reducer/damageReportReducer';

export default combineReducers({
  userData: authReducer,
  admins: adminsReducer,
  users: usersReducer,
  //userEditor: userEditorReducer,
  bikes: bikeReducer,
  bikeEditor: bikeEditorReducer,
  bikeRacks: bikeRacksReducer,
  routing: routerReducer,
  damageReports: damageReportReducer,
});
