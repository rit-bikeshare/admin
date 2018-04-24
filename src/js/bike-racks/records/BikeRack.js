import { Record } from 'immutable';

export default Record(
  {
    id: undefined,
    bikeCount: undefined,
    name: null,
    description: null,
    checkInArea: null,
    lat: null,
    lon: null,
  },
  'BikeRack'
);

const a = {
  id: 'gosnell-east',
  name: 'Gosnell East',
  description: 'Near gosnell on the east where the parklane is.',
  checkInArea: {
    coordinates: [
      [
        [-77.67708722501993, 43.08388473825382],
        [-77.67713014036417, 43.083422421186725],
        [-77.67656151205301, 43.08337540569632],
      ],
    ],
    type: 'Polygon',
  },
  lat: 43.08356346744145,
  lon: -77.67691556364298,
};
