import { OrderedMap, Map } from 'immutable';

export default OrderedMap({
  HOME: Map({
    key: 'HOME',
    label: '-',
    route: '/admin',
  }),
  BIKES: Map({
    key: 'BIKES',
    label: 'Bikes',
    route: '/admin/bikes',
  }),
  LOCKS: Map({
    key: 'LOCKS',
    label: 'Locks',
    route: '/admin/locks',
  }),
  BIKE_RACKS: Map({
    key: 'BIKE_RACKS',
    label: 'Bike Racks',
    route: '/admin/bike-racks',
  }),
  USERS: Map({
    key: 'USERS',
    label: 'Users',
    route: '/admin/users',
  }),
  MAINTENANCE: Map({
    key: 'MAINTENANCE',
    label: 'Maintenance',
    route: '/admin/maintenance',
  }),
  SETTINGS: Map({
    key: 'SETTINGS',
    label: 'Settings',
    route: '/admin/settings',
  }),
});
