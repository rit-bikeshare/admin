import { actions } from '../UsersRedux';

export const create = actions.create;
export const destroy = actions.destroy;
export const list = actions.list;
export const retrieve = actions.retrieve;
export const update = actions.update;

// additional action
export const clearUsersAction = actions.clearUsersAction;

/**
 * TODO, implement query filter
 */
export const searchUsers = () => dispatch =>
  dispatch(list({ query: 'isStaff=true' }));
