import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import {colors,shadow} from 'lib/res'

const Button = ({buttonType, text, children, icon, onPress, disabled, style, buttonContainStyle, childrenStyle}) => {
  const styles = StyleSheet.create({
    containedStyle:{
      //flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:colors.primaryButton,
      // width:110,
      // height:30,
      borderRadius:4,
      alignSelf:"baseline",
      ...shadow.DP2
    },
    outlineStyle:{
      borderWidth:1,
      borderColor:colors.primaryButton,
      borderRadius:4,
      alignSelf:"baseline",
    },
    textStyle:{
      fontSize:15,
      fontFamily:"Roboto",
      fontWeight:"normal",
      color:buttonType === "outline"? colors.primaryButton:colors.buttonText,
      padding:5,
    },
    icon_round_style:{
      backgroundColor:colors.primaryButton,
      alignSelf:"baseline",
      borderRadius:50,
      ...shadow.DP6
    }
  });
  if(buttonType === "outline"){
    return(
      <Pressable disabled={disabled} onPress={onPress}>
        <View style={[styles.outlineStyle, style]}>
          <Text style={[styles.textStyle, buttonContainStyle]}>{text}</Text>
        </View>
      </Pressable>
    )
  }
  if(buttonType === "iconOnly"){
    return(
      <Pressable disabled={disabled} onPress={onPress}>
        <View style={[style]}>
          {icon}
        </View>
      </Pressable>
    )
  }
  //default buttonType "contained"
  if(children){
    return(
      <Pressable disabled={disabled} onPress={onPress}>
        <View style={[styles.containedStyle, style]}>
          <View style={[childrenStyle]}>
            {children}
          </View>
          <Text style={[styles.textStyle, buttonContainStyle]}>{text}</Text>
        </View>
      </Pressable>
    )
  }else{
    return(
      <Pressable disabled={disabled} onPress={onPress}>
        <View  style={[styles.containedStyle, style]}>
          <Text style={[styles.textStyle, buttonContainStyle]}>{text}</Text>
        </View>
      </Pressable>
    )
  }
}//end Button function

export default Button
