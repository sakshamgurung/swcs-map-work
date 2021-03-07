import React from 'react'

import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack'
//screens
import WorkScreen from './WorkScreen'
import WorkDescriptionScreen from './WorkDescriptionScreen'
import ToDoListScreen from './ToDoListScreen'
import WorkMemberScreen from './WorkMemberScreen'
import DateTimeScreen from './DateTimeScreen'

const DashboardStack = createStackNavigator();
const WorkStack = createStackNavigator();

const WorkNavigator = () => {
  return(
    <WorkStack.Navigator screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
      
      <WorkStack.Screen name="Work" component={WorkScreen}
        options={{
          headerLeft:null,
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

      <WorkStack.Screen name="Work.WorkMember" component={WorkMemberScreen}
        options={{
          headerLeft:null,
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

      <WorkStack.Screen name="Work.WorkDescription" component={WorkDescriptionScreen}
        options={{
          headerLeft:null,
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

      <WorkStack.Screen name="Work.ToDoList" component={ToDoListScreen}
        options={{
          headerLeft:null,
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

      <WorkStack.Screen name="Work.DateTime" component={DateTimeScreen}
        options={{
          headerLeft:null,
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
      
    </WorkStack.Navigator>
  )
}

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator headerMode={"none"}>
      <DashboardStack.Screen name="Work" component={WorkNavigator}/>
    </DashboardStack.Navigator>
  )
}

export default DashboardNavigator
