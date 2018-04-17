import Bike from '../records/Bike';
import { name, path, indexFn } from '../constants/bikeReduxConfig';
import { all } from 'common/all';

const { actions } = all({ name, path, record: Bike, indexFn });

export default actions;
