import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_LOADING,
  RESET
} from 'actions/types';

const INITIAL_STATE = {
  email:'',
  password:'',
  loading:false,
  loginMsg:'',
  loggedIn:false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case EMAIL_CHANGED:
      return {...state, email:action.payload};
    case PASSWORD_CHANGED:
      return {...state, password:action.payload};
    case LOGIN_LOADING:
      return {...state, loading:true};
    case LOGIN_SUCCESS:
      return {...state, loading:false, loginMsg:'', loggedIn:true};
    case LOGIN_FAIL:
      return {...state, loading:false, loginMsg:'Login fail'};
    case LOGOUT:
      return {...state, loggedIn:false};
    case RESET:
      return {...state, email:'', password:''};
    default:
      return state;
  }
};