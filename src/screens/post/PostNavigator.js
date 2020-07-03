import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import PostScreen from './PostScreen'

const PostStack = createStackNavigator();

const PostNavigator = () => {
  return (
    <PostStack.Navigator>
      <PostStack.Screen name="Post" component={PostScreen}/>
      
    </PostStack.Navigator>
  )
}

export default PostNavigator
