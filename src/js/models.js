import { Record } from 'immutable';

export const BikeLock = Record(
  {
    mac: null,
  },
  'BikeLock'
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
