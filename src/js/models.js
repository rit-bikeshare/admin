import { Record } from 'immutable';

export const BikeRack = Record(
  {
    id: null,
    bikeCount: null,
    name: null,
    description: null,
    checkInArea: null,
    lat: null,
    lon: null,
  },
  'BikeRack'
);

export const BikeLock = Record(
  {
    mac: null,
  },
  'BikeLock'
);

export const Bike = Record(
  {
    id: null,
    lock: null,
    visible: true,
    currentRental: null,
    previousRental: null,
    lat: null,
    lon: null,
  },
  'Bike'
);

export const Rental = Record(
  {
    id: null,
    rentedAt: null,
    returnedAt: null,
    renter: null,
    bike: null,
  },
  'Rental'
);

export const MaintenanceReport = Record(
  {
    id: null,
    rentedAt: null,
    returnedAt: null,
    renter: null,
    bike: null,
  },
  'MaintenanceReport'
);

export const DamageType = Record(
  {
    id: null,
    rentedAt: null,
    returnedAt: null,
    renter: null,
    bike: null,
  },
  'DamageType'
);

export const DamageReport = Record(
  {
    id: null,
    rentedAt: null,
    returnedAt: null,
    renter: null,
    bike: null,
  },
  'DamageReport'
);

export const BikeshareUser = Record(
  {
    id: null,
    lastLogin: null,
    username: null,
    firstName: null,
    lastName: null,
    isActive: null,
    isStaff: null,
    groups: null,
  },
  'BikeshareUser'
);
