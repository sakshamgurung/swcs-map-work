import React from 'react'

import {createStackNavigator} from '@react-navigation/stack'
//screens
import AccountScreen from './AccountScreen'
import ProfileScreen from './ProfileScreen'

const AccountStack = createStackNavigator();

const AccountNavigator = () => {
// const CreateProfileStack = () => (
//   <ProfileStack.Navigator>
//     <ProfileStack.Screen name="Profile" component={ProfileScreen}/>
//     {/* <ProfileStack.Screen name="LoginInfo" component={LoginInfoScreen}
//     options={{
//       headerTitle:"Login Detail",
//       headerLeft:() => (<BackToButton destinationScreen=""/>)
//     }} 
//     />*/}
//   </ProfileStack.Navigator>
// )
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Account" component={AccountScreen}/>
      <AccountStack.Screen name="Profile" component={ProfileScreen}/>
    </AccountStack.Navigator>
  )
}

export default AccountNavigator
