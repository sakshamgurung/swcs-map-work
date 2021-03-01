import React, { useState, useRef, Component } from 'react'
import { Text, View, Pressable, TextInput, StyleSheet, Platform, Button, ScrollView} from 'react-native'
import _ from 'lodash'

import Awesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import {shadow} from 'lib/res'

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
function EditHeader({title, onCancel, onDone, charCount}){
  return(
    <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
      <Pressable onPress={onCancel} style={{flex:1}}>
        <MaterialIcon name="close" color="rgba(255, 255, 255, 1)" size={25}/>
      </Pressable>
      <View style={{flex:16, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
        <Text style={{flex: 1, fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>{title}</Text>
        <Text style={{flex: 1, fontSize:14, color:"rgba(255, 255, 255, 1)", paddingTop:5}}>{`(${charCount}/1000)`}</Text>
      </View>
      <Pressable onPress={onDone} style={{flex:1}}>
        <MaterialIcon name="check" color="rgba(255, 255, 255, 1)" size={25}/>
      </Pressable>
    </View>
  );
}

const WorkDescriptionScreen = ({navigation}) => {
  const textInputRef = useRef(null);
  const [toggleEditHeader, setToggleEditHeader] = useState(false);
  const [description, setDescription] = useState("");
  const [descBuffer, setDescBuffer] = useState("");
  const [charCounter, setCharCounter] = useState(description.length);
  
  const onPressBack = () => {
    navigation.navigate("Work");
  }
  const onCancel = () => {
    setDescription(descBuffer);
    setToggleEditHeader(false);
    textInputRef.current.blur();
  }
  const onDone = () => {
    setToggleEditHeader(false);
    textInputRef.current.blur();
  }
  const onFocus = () => {
    setDescBuffer(description);
    setToggleEditHeader(true);
  }
  function descriptionChanged(text){
    setCharCounter(text.length);
    setDescription(text);
  }
  return (
    <View style={{flex:1, backgroundColor:"rgba(26, 28, 82, 1)"}}>
      {
        toggleEditHeader?
        <EditHeader title="Edit description" onCancel={onCancel} onDone={onDone} charCount={charCounter}/>:
        <Header title="Work Description" onPressBack={onPressBack}/>
      }
      <TextInput placeholder="Type work description..." value = {description} onChangeText = {descriptionChanged}
      underlineColorAndroid = {toggleEditHeader? "rgba(62, 115, 222, 1)" : "rgba(0,0,0,0)"}
      placeholderTextColor="rgba(255, 255, 255,1)" multiline={true} maxLength={1000} selectionColor="rgba(255, 255, 255, 1)"
      style={{color:"rgba(255, 255, 255,1)", paddingHorizontal:10}} onFocus={onFocus} ref={textInputRef}
      />
    </View>
  )
}

export default WorkDescriptionScreen
