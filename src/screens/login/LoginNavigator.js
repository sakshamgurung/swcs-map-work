import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import LoginScreen from './LoginScreen'

const LoginStack = createStackNavigator();

const LoginNavigator = () => {

  return (
    <LoginStack.Navigator>
      <LoginStack.Screen name="Login" component={LoginScreen}/>
    </LoginStack.Navigator>
  )
}

export default LoginNavigator
