import { all } from 'common-redux/all';
import BikeshareUser from '../records/BikeshareUser';

export const name = 'users';
export const path = 'admin/users/';
export const record = BikeshareUser;
export const indexFn = user => user.get('id');

export const { actions, reducer } = all(
  { name, path, record, indexFn },
  actions => ({
    usersSearchAction: () => dispatch =>
      dispatch(actions.usersListAction({ query: 'isStaff=true' })),
  })
);

export const usersClearAction = actions.usersClearAction;
export const usersCreateAction = actions.usersCreateAction;
export const usersDestroyAction = actions.usersDestroyAction;
export const usersListAction = actions.usersListAction;
export const usersRetrieveAction = actions.usersRetrieveAction;
export const usersUpdateAction = actions.usersUpdateAction;

// Additional actions
export const usersSearchAction = actions.usersSearchAction;
