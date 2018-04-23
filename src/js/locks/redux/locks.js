import { all } from 'common-redux/all';
import Lock from '../records/Lock';

export const name = 'locks';
export const path = 'admin/locks/';
export const record = Lock;
export const indexFn = lock => lock.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });

export const locksClearAction = actions.locksClearAction;
export const locksCreateAction = actions.locksCreateAction;
export const locksDestroyAction = actions.locksDestroyAction;
export const locksListAction = actions.locksListAction;
export const locksRetrieveAction = actions.locksRetrieveAction;
export const locksUpdateAction = actions.locksUpdateAction;
