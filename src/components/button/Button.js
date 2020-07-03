import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {colors,shadow} from 'res'

const Button = ({buttonType, text, children, icon, onPress, style}) => {
  const styles = StyleSheet.create({
    containedStyle:{
      flexDirection:"row",
      backgroundColor:colors.button,
      borderRadius:4,
      alignSelf:"baseline",
      ...shadow.DP2
    },
    outlineStyle:{
      borderWidth:1,
      borderColor:colors.button,
      borderRadius:4,
      alignSelf:"baseline",
    },
    textStyle:{
      fontSize:16,
      fontFamily:"Roboto",
      fontWeight:"normal",
      color:buttonType === "outline"? colors.button:colors.buttonText,
      padding:5,
      paddingLeft:children?8:16,
      paddingRight:16,
    },
    icon_round_style:{
      backgroundColor:colors.button,
      alignSelf:"baseline",
      borderRadius:50,
      ...shadow.DP6
    }
  });
  if(buttonType === "outline"){
    return(
      <View style={style}>
        <TouchableOpacity style={styles.outlineStyle} onPress={onPress}>
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  if(buttonType === "iconOnly"){
    return(
      <View>
        <TouchableOpacity onPress={onPress}>
          {icon}
        </TouchableOpacity>
      </View>
    )
  }
  //default buttonType "contained"
  if(children){
    return(
      <View style={style}>
        <TouchableOpacity style={styles.containedStyle} onPress={onPress}>
          {children}
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }else{
    return(
      <View style={style}>
        <TouchableOpacity style={styles.containedStyle} onPress={onPress}>
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}//end Button function

export default Button
