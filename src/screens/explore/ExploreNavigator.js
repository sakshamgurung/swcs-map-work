import React, { Component } from 'react'
import { Text, View } from 'react-native'

import {createStackNavigator} from '@react-navigation/stack'
//screen
import ExploreScreen from './ExploreScreen'

const ExploreStack = createStackNavigator();

class ExploreNavigator extends Component {
  render() {
    return (
      <ExploreStack.Navigator>
        <ExploreStack.Screen name="Explore" component={ExploreScreen} 
          options={{
            headerTransparent:{
              position:'absolute',
              backgroundColor: 'transparent',
              zIndex:100,
              top:0,
              left:0,
              right:0
            },
            headerTitle:()=> (null)
          }}
        />
      </ExploreStack.Navigator>
    )
  }
}

export default ExploreNavigator
