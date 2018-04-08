import { Record } from 'immutable';

export const Bike = Record(
  {
    id: undefined,
    lat: 0,
    lon: 0,
    lock: null,
    visible: true
  },
  'Bike'
);
