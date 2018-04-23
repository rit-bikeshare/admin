import { Record, List } from 'immutable';
import Bike from 'bikes/records/Bike';

export default Record(
  {
    reports: List(),
    bike: new Bike(),
    acknowleged: false,
  },
  'DamagedBike'
);
