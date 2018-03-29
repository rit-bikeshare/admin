import { OrderedMap, Map } from 'immutable';

export default OrderedMap({
  HOME: Map({
    label: '-',
    route: '/'
  }),
  BIKES: Map({
    label: 'Bikes',
    route: '/bikes'
  }),
  BIKE_RACKS: Map({
    label: 'Bike Racks',
    route: '/bike-racks'
  }),
  USERS: Map({
    label: 'Users',
    route: '/users'
  }),
  MAINTENANCE: Map({
    label: 'Maintenance',
    route: '/maintenance'
  }),
  SETTINGS: Map({
    label: 'Settings',
    route: '/settings'
  })
});
