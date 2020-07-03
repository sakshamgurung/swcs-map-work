import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {colors, shadow} from 'res'

/*components */
import AntIcon from 'react-native-vector-icons/AntDesign'

const FAB = ({onPress, option1, option2, option3, style}) => {
  return (
    <View style={[styles.container,style]}>
      <View style={styles.option1Style}>
        {option3?option3:null}
      </View>
      <View style={styles.option1Style}>
        {option2}
      </View>
      <View style={styles.option1Style}>
        {option1}
      </View>
      <TouchableOpacity onPress={onPress}  style={styles.FABStyle}>
        <AntIcon name="plus" color="#fff" size={25} style={styles.plusIcon}/>       
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
  },
  FABStyle:{
    backgroundColor:colors.button,
    alignSelf:"baseline",
    marginLeft:120,
    borderRadius:50,
    ...shadow.DP6
  },
  plusIcon:{
    padding:5
  },
  option1Style:{
    alignSelf:"baseline",
    marginBottom:10,
  },
});

export default FAB
