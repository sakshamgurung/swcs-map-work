import React, { Component, useState } from 'react'
import { Text, View, Pressable, Image, StyleSheet, Platform, Button, ScrollView} from 'react-native'
import momentTimeZone from 'moment-timezone'
import moment from 'moment'
import _ from 'lodash'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import DateRangePicker from "react-native-daterange-picker"

import Awesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import {shadow} from 'lib/res'

//Awesome5Icon clipboard-list users map-marked-alt
//AwesomeIcon suitcase refresh calendar
//Antdesign filetext1 clockcircleo
//MaterialCommIcon truck radiobox-blank radiobox-marked keyboard-arrow-right arrow-left
//Entypo dots-three-vertical

const workPanelListData = [
  {id:"wld1", screenName:"Work.WorkDescription", title:"Work description...", icon:<Awesome5Icon name="clipboard-list" color="rgba(255, 255, 255, 1)" size={20}/>},
  {id:"wld2", screenName:"Work.ToDoList", title:"To do list...", icon:<AntIcon name="filetext1" color="rgba(255, 255, 255, 1)" size={20}/>},
  {id:"wld3", screenName:"Work.WorkMember", title:"Work member...", icon:<Awesome5Icon name="users" color="rgba(255, 255, 255, 1)" size={18}/>},
  {id:"wld4", screenName:"Work.DateTime", title:"Date and time...", icon:<MaterialCommIcon name="calendar-clock" color="rgba(255, 255, 255, 1)" size={20}/>},
  {id:"wld5", screenName:"Work.TrackZone", title:"Track and zone...", icon:<Awesome5Icon name="map-marked-alt" color="rgba(255, 255, 255, 1)" size={20}/>},
  {id:"wld6", screenName:"Work.Vehicle", title:"Vehicle...", icon:<MaterialCommIcon name="truck" color="rgba(255, 255, 255, 1)" size={22}/>},
];

function List({icon, title}){
  return(
    <View style={{flexDirection:"row",alignItems:"center"}}>
      <View style={{marginHorizontal:10, marginVertical:5, flex:1}}>
        {icon}
      </View>
      <View style={{marginHorizontal:10, marginVertical:5, flex:14}}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:16}}>{title}</Text>
      </View>
    </View>
  )
}

function PressableList({icon, title, onPress, id, screenName}){
  return(
    <Pressable onPress = {()=>onPress(id, screenName)} style={{marginHorizontal:10, marginVertical:5}}>
      <List icon={icon} title={title}/>
    </Pressable>
  )
}

function Header({title, onPressBack, onPressOption}){
  return(
    <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
      <Pressable onPress={()=>onPressBack()} style={{flex:1}}>
        <MaterialCommIcon name="arrow-left" color="rgba(255, 255, 255, 1)" size={20}/>
      </Pressable>
      <View style={{flex:16}}>
        <Text style={{fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>{title}</Text>
      </View>
      <Pressable onPress={onPressOption} style={{flex:1}}>
        <EntypoIcon  name="dots-three-vertical" color="rgba(255, 255, 255, 1)" size={16}/>
      </Pressable>
    </View>
  );
}

export class WorkScreen extends Component {
  onPress = (id, screenName) => {
    const {navigation} = this.props;
    console.log("my id is: ",id);
    navigation.navigate(`${screenName}`);
  }
  onPressBack = () => {
    console.log("workscreen")
    const {navigation} = this.props;
    //navigation.navigate("Dashboard");
  }
  render() {
    return (
      <View style={{flex:1, backgroundColor:"rgba(26, 28, 82, 1)"}}>
        <Header title = "Work 1" onPressBack={this.onPressBack}/>
        {
          workPanelListData.map((l) => {
            return(<PressableList key={l.id} id={l.id} screenName={l.screenName} title={l.title} icon={l.icon} onPress={this.onPress}/>)
          })
        }
      </View>
    )
  }
}

export default WorkScreen
