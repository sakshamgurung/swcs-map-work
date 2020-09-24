import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import DashboardReducer from './DashboardReducer';
import {default as ExploreReducer} from '../../ducks/explore';
export default combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  explore: ExploreReducer,
  profile: ProfileReducer
});