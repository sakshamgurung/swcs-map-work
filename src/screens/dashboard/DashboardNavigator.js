import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import DashboardScreen from './DashboardScreen'

const DashboardStack = createStackNavigator();

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen}/>
      
    </DashboardStack.Navigator>
  )
}

export default DashboardNavigator
