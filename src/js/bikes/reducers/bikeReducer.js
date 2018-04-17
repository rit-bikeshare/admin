import Bike from '../records/Bike';
import { name, path, indexFn } from '../constants/bikeReduxConfig';
import { all } from 'common/all';

const { reducer } = all({ name, path, record: Bike, indexFn });

export default reducer;
