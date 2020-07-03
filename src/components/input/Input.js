import React from 'react'
import { TextInput, View, StyleSheet} from 'react-native'

const Input = ({placeholder, value, secureTextEntry, onChangeText, onSubmitEditing, multiline}) => {
  const {containerStyle} = style;
  return (
    <View style={containerStyle}>
      <TextInput
      multiline={multiline}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry} 
      placeholder={placeholder} 
      autoCorrect={false}
      value={value}/>
    </View>
  )
}

const style = StyleSheet.create({
  containerStyle:{
  }
});

export default Input;
