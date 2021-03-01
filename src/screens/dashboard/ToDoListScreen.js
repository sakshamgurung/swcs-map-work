import React, { useState, useRef, useEffect, Component } from 'react'
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

function ToDoListItem({toDoListItemRef, id, value, completed, onChangeToDoListText, onToggleToDoListItem, onDeleteToDoListItem, onFocus}){
  return(
    <View style={{flexDirection:"row"}}>
      <Pressable onPress={()=>onToggleToDoListItem(id)} android_ripple={{color:"rgba(62, 115, 222, 1)", 
      radius:15,}} style={{flex:2, justifyContent:"center", alignItems:"center"}}>
        {
          completed?
          <MaterialCommIcon name="check-box-outline" color="rgba(62, 115, 222, 1)" size={16}/>:
          <MaterialCommIcon name="checkbox-blank-outline" color="rgba(255, 255, 255, 1)" size={16}/>
        }
      </Pressable>
      <TextInput ref={toDoListItemRef} value = {value} onChangeText = {(text)=>onChangeToDoListText(text, id)} multiline={true} maxLength={100} selectionColor="rgba(255, 255, 255, 1)"
        style={{flex:7, justifyContent:"center", color:"rgba(255, 255, 255,1)", paddingHorizontal:10, textDecorationColor:"rgba(255, 255, 255, 1)",
        textDecorationLine:completed?"line-through":"none", fontStyle:completed?"italic":"normal", borderWidth:1}}
        onFocus={()=>onFocus(id, value)}
      />
      <Pressable onPress={()=>onDeleteToDoListItem(id)} android_ripple={{color:"rgba(62, 115, 222, 1)", 
      radius:15,}} style={{flex:2, padding:5, alignItems:"center"}}>
        <MaterialCommIcon name="delete" color="rgba(255, 255, 255, 1)" size={20}/>
      </Pressable>
    </View>
  )
}

function ToDoList({data, onDone, onCancel, onChangeToDoListText, onToggleToDoListItem, onDeleteToDoListItem}){
  
  const [showEditHeader, setShowEditHeader] = useState(false);
  const [counter, setCounter] = useState(0);
  const [bufferToDoText, setBufferToDoText] = useState("");
  const [idToDoItem, setIdToDoItem] = useState("");
  let editTextInputRef = null;
  
  const textInputFocus = (id, value) => {
    setIdToDoItem(id);
    setBufferToDoText(value);
    setCounter(value.length);
    setShowEditHeader(true);
  }
  const onDoneEditList = () => {
    //onDone();
    setShowEditHeader(false);
    editTextInputRef.blur();
  }
  const onCancelEditList = () => {
    onCancel(idToDoItem, bufferToDoText);
    setShowEditHeader(false);
    editTextInputRef.blur();
  }
  const onDelete = (id) => {
    onDeleteToDoListItem(id);
    setShowEditHeader(false);
    editTextInputRef.blur();
  }
  const onChangeText = (text, id) => {
    setCounter(text.length);
    onChangeToDoListText(text, id);
  }
  return(
    <View>
      {showEditHeader?
        (
          <View style = {{position:"absolute", top:-104, flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
            <Pressable onPress={onCancelEditList} style={{flex:1}}>
              <MaterialIcon name="close" color="rgba(255, 255, 255, 1)" size={25}/>
            </Pressable>
            <View style={{flex:16, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
              <Text style={{flex: 1, fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>Edit Todo item</Text>
              <Text style={{flex: 1, fontSize:14, color:"rgba(255, 255, 255, 1)", paddingTop:5}}>{`(${counter}/100)`}</Text>
            </View>
            <Pressable onPress={onDoneEditList} style={{flex:1}}>
              <MaterialIcon name="check" color="rgba(255, 255, 255, 1)" size={25}/>
            </Pressable>
          </View>
        ):
        null
      }
      <ScrollView
      scrollEventThrottle={15}>
        {
          data.map((item)=>{
            return(<ToDoListItem id={item.id} key={item.id} value={item.toDo} completed={item.completed} 
              onToggleToDoListItem={onToggleToDoListItem} onDeleteToDoListItem={onDelete}
              onChangeToDoListText={onChangeText} onFocus={textInputFocus} toDoListItemRef={(r)=>editTextInputRef = r}/>
            )
          })
        }
      </ScrollView>
    </View>
  )
}

function AddToDo({onDone}){
  const addToDoTextInputRef = useRef(null);
  const [showAddListEditHeader, setShowAddListEditHeader] = useState(false);
  const [newToDoText, setNewToDoText] = useState("");
  const [charCounter, setCharCounter] = useState(0);

  function newToDoTextChanged(text){
    setCharCounter(text.length);
    setNewToDoText(text);
  }
  const onAddToDoFocus = () => {
    console.log("hello")
    setShowAddListEditHeader(true);
  }
  const onAddToDoBlur = () => {
    setShowAddListEditHeader(false);
  }
  const onPressDone = () => {
    setShowAddListEditHeader(false);
    addToDoTextInputRef.current.blur();
    onDone(newToDoText);
    setNewToDoText("");
  }
  const onPressCancel = () => {
    setNewToDoText("");
    setShowAddListEditHeader(false);
    addToDoTextInputRef.current.blur();
  }
  return(
    <View>
      {showAddListEditHeader?(
        <View style = {{position:"absolute", top:-56, flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
          <Pressable onPress={onPressCancel} style={{flex:1}}>
            <MaterialIcon name="close" color="rgba(255, 255, 255, 1)" size={20}/>
          </Pressable>
          <View style={{flex:16, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            <Text style={{flex: 1, fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>Add new to do</Text>
            <Text style={{flex: 1, fontSize:14, color:"rgba(255, 255, 255, 1)", paddingTop:5}}>{`(${charCounter}/100)`}</Text>
          </View>
          <Pressable onPress={onPressDone} disabled={newToDoText.length == 0} style={{flex:1}}>
            {newToDoText.length != 0 ?
              <MaterialIcon name="check" color="rgba(255, 255, 255, 1)" size={20}/>:
              <MaterialIcon name="check" color="rgba(176, 176, 176, 1)" size={20}/>
            }
          </Pressable>
        </View>
      ):null}
      <TextInput placeholder="Add item..." value = {newToDoText} onChangeText = {newToDoTextChanged}
        underlineColorAndroid = {showAddListEditHeader? "rgba(62, 115, 222, 1)" : "rgba(0,0,0,0)"}
        placeholderTextColor="rgba(255, 255, 255,1)" multiline={true} maxLength={100} selectionColor="rgba(255, 255, 255, 1)"
        style={{color:"rgba(255, 255, 255,1)", paddingHorizontal:10}} onFocus={onAddToDoFocus} onBlur={onAddToDoBlur} 
        ref={addToDoTextInputRef}
      />
    </View>
  );
}

const ToDoListScreen = ({navigation}) => {

  const [toDoList, setToDoList] = useState([]);

  const onPressBack = () => {
    navigation.navigate("Work");
  }
  
  const onCancelEditList = (id, text) => {
    const index = _.findIndex(toDoList, (item)=>item.id==id);
    const tempToDoList = _.cloneDeep(toDoList);
    tempToDoList[index].toDo = text
    setToDoList(tempToDoList);
  }

  const onToggleToDoListItem = (id) => {
    const index = _.findIndex(toDoList, (item)=>item.id==id);
    const tempToDoList = _.cloneDeep(toDoList);
    tempToDoList[index].completed = !tempToDoList[index].completed;
    setToDoList(tempToDoList);
  }
  const onDeleteToDoListItem = (id) => {
    const tempToDoList = _.cloneDeep(toDoList);
    _.remove(tempToDoList, (item)=> item.id == id);
    setToDoList(tempToDoList);
  }
  const onChangeToDoListText = (text, id) => {
    const index = _.findIndex(toDoList, (item) => item.id==id);
    const tempToDoList = _.clone(toDoList);
    tempToDoList[index].toDo = text;
    setToDoList(tempToDoList);
  }
  const onDoneAddToDo = (text) => {
    const newToDo = {id:`${toDoList.length + 1}`, toDo:text, completed:false};
    setToDoList([newToDo, ...toDoList]);
  }
  return (
    <View style={{flex:1, backgroundColor:"rgba(26, 28, 82, 1)"}}>
      <Header title="To Do List" onPressBack={onPressBack}/>
      <AddToDo onDone={onDoneAddToDo}/>
      <ToDoList data={toDoList} onChangeToDoListText={onChangeToDoListText} onToggleToDoListItem={onToggleToDoListItem} 
      onDeleteToDoListItem={onDeleteToDoListItem} onCancel={onCancelEditList}/>
    </View>
  )
}

export default ToDoListScreen
