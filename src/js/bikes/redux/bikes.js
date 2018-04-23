import { all } from 'common-redux/all';
import Bike from '../records/Bike';

export const name = 'bikes';
export const path = 'admin/bikes/';
export const record = Bike;
export const indexFn = bike => bike.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });

export const bikesClearAction = actions.bikesClearAction;
export const bikesCreateAction = actions.bikesCreateAction;
export const bikesDestroyAction = actions.bikesDestroyAction;
export const bikesListAction = actions.bikesListAction;
export const bikesRetrieveAction = actions.bikesRetrieveAction;
export const bikesUpdateAction = actions.bikesUpdateAction;
