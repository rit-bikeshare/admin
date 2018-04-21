import { Record } from 'immutable';

export default Record(
  {
    id: null,
    lock: null,
    visible: true,
    currentRental: null,
    previousRental: null,
    lat: null,
    lon: null,
    previousRenterUsername: null,
    currentRenterUsername: null,
  },
  'Bike'
);
