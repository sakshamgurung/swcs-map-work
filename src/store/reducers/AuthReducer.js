import {AUTH} from 'store/actions/types';

const INITIAL_STATE = {
  email:'',
  password:'',
  loading:false,
  loginMsg:'',
  loggedIn:false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case AUTH.EMAIL_CHANGED:
      return {...state, email:action.payload};
    case AUTH.PASSWORD_CHANGED:
      return {...state, password:action.payload};
    case AUTH.LOGIN_LOADING:
      return {...state, loading:true};
    case AUTH.LOGIN_SUCCESS:
      return {...state, loading:false, loginMsg:'', loggedIn:true};
    case AUTH.LOGIN_FAIL:
      return {...state, loading:false, loginMsg:'Login fail'};
    case AUTH.LOGOUT:
      return {...state, loggedIn:false};
    case AUTH.RESET:
      return {...state, email:'', password:''};
    default:
      return state;
  }
};