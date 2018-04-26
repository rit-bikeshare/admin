import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from 'auth/reducers/authReducer';

/* Bikes */
import { reducer as bikeReducer } from 'bikes/redux/bikes';
import { reducer as bikeEditorReducer } from 'bikes/redux/bikeEditor';

/* Locks */
import { reducer as locksReducer } from 'locks/redux/locks';

/* Bike Racks */
import { reducer as bikeRacksReducer } from 'bike-racks/redux/bikeRacks';
import { reducer as bikeRackEditorReducer } from 'bike-racks/redux/bikeRackEditor';

/* Users */
import { reducer as usersReducer } from 'users/redux/users';
import { reducer as adminsReducer } from 'users/redux/admins';
import { reducer as userEditorReducer } from 'users/redux/userEditor';
import statReducer from 'stats/reducers/statReducer';
/* Maintenance */
import damageReportReducer from 'maintenance/reducer/damageReportReducer';

export default combineReducers({
  userData: authReducer,
  admins: adminsReducer,
  users: usersReducer,
  userEditor: userEditorReducer,
  bikes: bikeReducer,
  bikeEditor: bikeEditorReducer,
  locks: locksReducer,
  bikeRacks: bikeRacksReducer,
  bikeRackEditor: bikeRackEditorReducer,
  routing: routerReducer,
  damageReports: damageReportReducer,
  stats: statReducer,
});
