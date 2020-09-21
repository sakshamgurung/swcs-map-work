import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import DashboardReducer from './DashboardReducer';

export default combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  profile: ProfileReducer
});