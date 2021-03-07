import {combineReducers} from 'redux';
import {default as ExploreReducer} from '../../ducks/explore';

export default combineReducers({
  explore: ExploreReducer,
});