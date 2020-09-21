import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import {shadow} from 'lib/res'

const Chips = ({name, onPress}) => {
  return (
    <TouchableOpacity style={styles.chipsItem} onPress={onPress}>
      <Text>{name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:15, 
    marginHorizontal:5,
    height:35,
    ...shadow.DP8
  }
});

export default Chips
