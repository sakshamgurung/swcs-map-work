import React, { Component} from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

const SubmitButton = ({onPress, children}) => {
  const {buttonStyle, textStyle} = style;
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}
const style = StyleSheet.create({
  buttonStyle:{
    alignSelf: 'stretch',
    backgroundColor: '#007aff',
    borderWidth: 0,
    borderRadius: 5,
    paddingTop: 2,
    paddingBottom: 3,
    margin:5    
  },
  textStyle:{
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    color: '#fff'

  }
})
export default SubmitButton;
