import { handleActions } from 'redux-actions';
import UserData from '../../data/records/UserData';

const initialState = new UserData();

export default handleActions({}, initialState);
