import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import CustomerScreen from './CustomerScreen'

const CustomerStack = createStackNavigator();

const CustomerNavigator = () => {
  return (
    <CustomerStack.Navigator>
      <CustomerStack.Screen name="Customer" component={CustomerScreen}/>
      
    </CustomerStack.Navigator>
  )
}

export default CustomerNavigator
