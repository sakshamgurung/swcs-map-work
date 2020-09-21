import React, { Component } from 'react'
import {View, Text, ActivityIndicator}  from 'react-native' 
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage'

import {connect} from 'react-redux'
import {postChanged, posting} from 'store/actions'
//components
import {Statistic} from 'lib/components/card'
import {Input} from 'lib/components/input'
import {SubmitButton} from 'lib/components/button';

class DashboardScreen extends Component {
  componentDidMount(){
    this.checkNotificationPermission();
    this.addNotificationListeners();
  }
  componentWillUnmount(){
    this.removeNotificationListeners();
  }
  async checkNotificationPermission(){
    const enabled = await messaging().hasPermission();
    //console.log(enabled);
    if(enabled){
      this.getToken();
    }else{
      this.getNotificationPermission();
    }
  }
  async getNotificationPermission(){
    try {
      console.log("Requesting for permission");
      await messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log("Notification permission not granted.");
    }  
  }
  async getToken(){
    console.log("Getting token for fcm.");
    let fcmToken =  await AsyncStorage.getItem("fcmToken");
    console.log(fcmToken);
    if(!fcmToken){
      fcmToken = await messaging().getToken();
      if(fcmToken){
        //user has a device token
        console.log(fcmToken);
        await AsyncStorage.setItem('fcmToken',fcmToken);
        
      }
    }
  }
  async addNotificationListeners(){
    //app open in foreground
    this.notificationListener = messaging().onMessage(remoteMessage => {
      this.displayNotification(remoteMessage);
    });
    //app open in background
    this.notificationOpenedListner = messaging().onNotificationOpenedApp(remoteMessage => {
      this.displayNotification(remoteMessage);
    });
    //app is closed and then opened
    const notificationOpen = await messaging().getInitialNotification();
    if(notificationOpen){
      this.displayNotification(notificationOpen);
    }
    //refresh fcm token
    this.tokenRefreshListener = messaging().onTokenRefresh(async fcmToken => {
      await AsyncStorage.setItem('fcmToken',fcmToken);
    });
  }
  removeNotificationListeners(){
    this.notificationListener();
    this.notificationOpenedListner();
    this.tokenRefreshListener();
  }
  displayNotification(remoteMessage){
      console.log(remoteMessage);
  }
  onPostChange = (text)=>{
    this.props.postChanged(text);
  }
  onPost = ()=>{
    const {post} = this.props;
    this.props.posting(post);
  }
  renderButton = ()=>{
    if(this.props.loading){
      return(<ActivityIndicator color="black" size={15} />)
    }
    return(
      <SubmitButton onPress={this.onPost.bind(this)}>
        Post
      </SubmitButton>
    )
  }
  render() {
    return (
      <View>
        <Statistic title="Title" subtitle="Subtitle" metric="1000"/>
        <View>
          <Text style={{color:'#d32f2f',fontSize:15, alignItems:'center'}}>
            {this.props.postMsg}
          </Text>
          <Input
          multiline={true}
          secureTextEntry={false}
          onChangeText={this.onPostChange.bind(this)}
          placeholder="Enter your post"
          value={this.props.post}
          />
          {this.renderButton()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const{
    post,
    loading,
    postMsg
  } = state.dashboard;
  return{
    post,
    loading,
    postMsg
  }
}

export default connect (mapStateToProps, {
  postChanged,
  posting
})(DashboardScreen);
