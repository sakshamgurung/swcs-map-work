import {AUTH} from './types';
import AsyncStorage from "@react-native-community/async-storage";

export const emailChanged = (text)=>{
  return({
    type: AUTH.EMAIL_CHANGED,
    payload: text
  });
}
export const passwordChanged = (text)=>{
  return({
    type: AUTH.PASSWORD_CHANGED,
    payload: text
  });
}
export const login = ({email, password})=>{
  return (dispatch)=>{
    dispatch({type:AUTH.LOGIN_LOADING});
    const user = {email, password};
    const body = JSON.stringify(user);
    const config = {headers:{'Content-Type':'application/json'}};
    onLoginSuccess(dispatch, email);
  };
}
const onLoginSuccess = async(dispatch, email)=>{
  await AsyncStorage.setItem('email',email);
  dispatch({
    type: AUTH.LOGIN_SUCCESS
  })
}
const onLoginFail = ({dispatch})=>{
  console.log("Login failed");
  dispatch({
    type: AUTH.LOGIN_FAIL
  })
}

export const resetState = ()=> {
  return({
    type: AUTH.RESET
  });
}

export const logout = ()=>{
  return ({
    type: AUTH.LOGOUT
  })
}