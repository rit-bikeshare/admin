import { actions } from '../AdminsRedux';

export const create = actions.create;
export const destroy = actions.destroy;
export const list = actions.list;
export const retrieve = actions.retrieve;
export const update = actions.update;

/**
 * TODO, implement query filtering
 */
export const listAdmins = () => dispatch =>
  dispatch(
    list({
      query: 'isStaff=true',
      merge: false,
      filter: user => user.get('isStaff'),
    })
  );
