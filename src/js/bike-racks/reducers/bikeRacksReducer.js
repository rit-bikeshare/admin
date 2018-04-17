import BikeRack from '../records/BikeRack';
import { name, path, indexFn } from '../constants/bikeRacksReduxConfig';
import { all } from 'commonRedux/all';

const { reducer } = all({ name, path, record: BikeRack, indexFn });

export default reducer;
