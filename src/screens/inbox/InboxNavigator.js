import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import InboxScreen from './InboxScreen'

const InboxStack = createStackNavigator();

const InboxNavigator = () => {
  return (
    <InboxStack.Navigator>
      <InboxStack.Screen name="Inbox" component={InboxScreen}/>
      
    </InboxStack.Navigator>
  )
}

export default InboxNavigator
