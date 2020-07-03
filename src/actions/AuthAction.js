import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_LOADING,
  RESET
} from "./types";
import AsyncStorage from "@react-native-community/async-storage";

export const emailChanged = (text)=>{
  return({
    type: EMAIL_CHANGED,
    payload: text
  });
}
export const passwordChanged = (text)=>{
  return({
    type: PASSWORD_CHANGED,
    payload: text
  });
}
export const login = ({email, password})=>{
  return (dispatch)=>{
    dispatch({type:LOGIN_LOADING});
    const user = {email, password};
    const body = JSON.stringify(user);
    const config = {headers:{'Content-Type':'application/json'}};
    onLoginSuccess(dispatch, email);
  };
}
const onLoginSuccess = async(dispatch, email)=>{
  await AsyncStorage.setItem('email',email);
  dispatch({
    type: LOGIN_SUCCESS
  })
}
const onLoginFail = ({dispatch})=>{
  console.log("Login failed");
  dispatch({
    type: LOGIN_FAIL
  })
}

export const resetState = ()=> {
  return({
    type: RESET
  });
}

export const logout = ()=>{
  return ({
    type: LOGOUT
  })
}