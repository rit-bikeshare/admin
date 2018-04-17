import { handleActions } from 'redux-actions';
import UserData from '../records/UserData';

const initialState = new UserData();

export default handleActions({}, initialState);
