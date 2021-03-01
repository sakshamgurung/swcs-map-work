import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {shadow, colors} from 'lib/res'

const Chips = ({name, onPress, id, type, query, selectedChipsId}) => {
  return (
    <TouchableOpacity  style={[styles.chipsItem, selectedChipsId==id?styles.chipsItemSelected:styles.chipsItemInactive]} 
    onPress={() => onPress(type, query, id)}>
      <Text style={[selectedChipsId==id?styles.chipsItemSelectedText:styles.chipsItemInactiveText]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    borderRadius:20,
    padding:8,
    paddingHorizontal:15, 
    marginHorizontal:5,
    height:35,
    ...shadow.DP8
  },
  chipsItemInactive:{
    backgroundColor:"#fff",
  },
  chipsItemSelected:{
    backgroundColor:colors.primaryButton,
  },
  chipsItemInactiveText:{
    color:"#000"
  },
  chipsItemSelectedText:{
    color:colors.buttonText
  }
});

export default Chips
