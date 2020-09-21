import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
/** res */
import {shadow} from 'lib/res';

const MapEditPanel = ({headerLeft, headerTitle, headerRight, footer, modal}) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.header}>
        <View style = {styles.headerLeft}>{headerLeft}</View>
        <Text style = {styles.headerTitle}>{headerTitle}</Text>
        <View style = {styles.headerRight}>{headerRight}</View>
      </View>
      <View style={styles.footer}>
        <View style = {styles.footerContainer}>{footer}</View>
      </View>
      {modal}
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  header:{
    backgroundColor:"white",
    width: "100%",
    height:40,
    flexDirection:"row",
    alignItems:"center",
    ...shadow.DP4
  },
  headerLeft:{
    flex:1,
    alignItems:"flex-start",
    paddingLeft:18
  },
  headerTitle:{
    flex:5,
    fontSize:16,
    textAlign:"center"
  },
  headerRight:{
    flex:1,
    alignItems:"flex-end",
    paddingRight:18
  },
  footer:{
    flex:1,
    justifyContent:"flex-end",
  },
  footerContainer:{
    flexDirection:"row",
    backgroundColor:"white",
    height:60,
    paddingVertical:10,
    paddingHorizontal:10,
    ...shadow.DP4
  }
});
export default MapEditPanel
