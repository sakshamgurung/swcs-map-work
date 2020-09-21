import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native'

import {shadow} from 'lib/res'

const MapSearch = ({style, visible, placeholder, onFocus, onChangeText, value , 
  autoFocus, leftIcon, rightIcon}) => {
  if(visible){
    return (
      <View style={[styles.searchBox, style]}>
        <View style={{paddingRight:5}}>{leftIcon ? leftIcon: null}</View>
        <TextInput
          placeholder = {placeholder || "Search here"}
          placeholderTextColor = "#000"
          autoCapitalize = "none"
          autoFocus = {autoFocus || false}
          onFocus = {onFocus}
          style = {styles.textInput}
          value = {value}
          onChangeText = {onChangeText}
        />
        <View>{rightIcon ? rightIcon: null}</View>
      </View>
    )
  }else{
    return null;
  }
}
export const DummySearchBox = ({onPress, style, leftIcon, rightIcon}) => {
  return (
    <TouchableWithoutFeedback onPress = {onPress}>
      <View style={[styles.searchBox, style]}>
        <View>{leftIcon ? leftIcon: null}</View>
        <View style = {styles.textInput}>
          <Text>
            Search here ...
          </Text>
        </View>
        <View>{rightIcon ? rightIcon: null}</View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  searchBox: {
    position:'absolute', 
    marginTop: Platform.OS === 'ios' ? 40 : 20, 
    flexDirection:"row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf:'center',
    borderRadius: 5,
    padding: 10,
    ...shadow.DP12
  },
  textInput: {
    flex:1,
    padding:0
  }
});

export default MapSearch
