import React,{Component} from 'react';
import {connect} from 'react-redux';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
//components
import BackToButton from 'lib/components/button';
//screen navigators
import {LoginNavigator} from "screens/login";
import {DashboardNavigator} from "screens/dashboard";
import {ExploreNavigator} from "screens/explore";
import {AccountNavigator} from "screens/account";
import {PostNavigator} from "screens/post";
import {CustomerNavigator}  from "screens/customer";
import {InboxNavigator} from "screens/inbox";


const SwitchStack = createStackNavigator();
const MainBottomTab = createBottomTabNavigator();

const MainBottomTabNavigator = () => (
  <MainBottomTab.Navigator>
    <MainBottomTab.Screen name="Explore" component={ExploreNavigator}/>
    <MainBottomTab.Screen name="DashBoard" component={DashboardNavigator}/>
    {/* <MainBottomTab.Screen name="Account" component={AccountNavigator}/> */}
    <MainBottomTab.Screen name="Post" component={PostNavigator}/>
    <MainBottomTab.Screen name="Customer" component={CustomerNavigator}/>
    <MainBottomTab.Screen name="Inbox" component={InboxNavigator}/>
  </MainBottomTab.Navigator>
)

class Router extends Component{
  render(){
    return(
      <NavigationContainer>
        <SwitchStack.Navigator headerMode="none">
          {/* {
            this.props.loggedIn == false ?(
            <SwitchStack.Screen name="Login" component={LoginNavigator}/>
            ):(<SwitchStack.Screen name="Main" component={MainBottomTabNavigator}/>)
          } */}
          {/* <SwitchStack.Screen name="Main" component={MainBottomTabNavigator}/> */}
          <SwitchStack.Screen name="Main" component={ExploreNavigator}/>
        </SwitchStack.Navigator>
      </NavigationContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const{
    loggedIn
  } = state.auth;
  return{
    loggedIn
  }
}

export default connect(mapStateToProps, null)(Router);