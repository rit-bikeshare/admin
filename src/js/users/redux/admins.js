import { all } from 'common-redux/all';
import BikeshareUser from '../records/BikeshareUser';

export const name = 'admins';
export const path = 'admin/users/';
export const record = BikeshareUser;
export const indexFn = user => user.get('id');

export const { actions, reducer } = all(
  { name, path, record, indexFn },
  actions => ({
    adminsListAction: () => dispatch =>
      dispatch(
        actions.adminsListAction({
          query: { isStaff: true, firstName: 'tris' },
          merge: false,
        })
      ),
  })
);

export const adminsClearAction = actions.adminsClearAction;
export const adminsCreateAction = actions.adminsCreateAction;
export const adminsDestroyAction = actions.adminsDestroyAction;
export const adminsListAction = actions.adminsListAction;
export const adminsRetrieveAction = actions.adminsRetrieveAction;
export const adminsUpdateAction = actions.adminsUpdateAction;
