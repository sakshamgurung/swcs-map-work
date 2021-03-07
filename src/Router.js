import React,{Component} from 'react';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

//screen navigators
import {DashboardNavigator} from "screens/dashboard";
import {ExploreNavigator} from "screens/explore";

const SwitchStack = createStackNavigator();
const MainBottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = () => (
  <MainBottomTab.Navigator>
    <MainBottomTab.Screen name="Work" component={DashboardNavigator}/>
    <MainBottomTab.Screen name="Explore" component={ExploreNavigator}/>
  </MainBottomTab.Navigator>
)

class Router extends Component{
  render(){
    return(
      <NavigationContainer>
        <SwitchStack.Navigator headerMode="none">
          <SwitchStack.Screen name="Main" component={MainBottomTabNavigator}/>
        </SwitchStack.Navigator>
      </NavigationContainer>
    )
  }
}

export default Router;