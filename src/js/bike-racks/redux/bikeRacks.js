import { all } from 'common-redux/all';
import BikeRack from '../records/BikeRack';

export const name = 'bikeRacks';
export const path = 'admin/bike-racks/';
export const record = BikeRack;
export const indexFn = bikerack => bikerack.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });

export const bikeRacksClearAction = actions.bikeRacksClearAction;
export const bikeRacksCreateAction = actions.bikeRacksCreateAction;
export const bikeRacksDestroyAction = actions.bikeRacksDestroyAction;
export const bikeRacksListAction = actions.bikeRacksListAction;
export const bikeRacksRetrieveAction = actions.bikeRacksRetrieveAction;
export const bikeRacksUpdateAction = actions.bikeRacksUpdateAction;
