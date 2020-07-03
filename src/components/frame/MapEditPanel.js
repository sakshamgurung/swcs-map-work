import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
/** res */
import {shadow} from 'res';

function MapEditPanel({header, footer}) {
  return (
    <View>
      <View style={styles.headerStyle}>
        {header}
      </View>
      <View style={styles.footerStyle}>
        {footer}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  headerStyle:{
    position:"absolute",
    backgroundColor:"white",
    width: window.width,
    height:60,
    flexDirection:"row",
    alignItems:"center",
    ...shadow.DP4
  },
  footerStyle:{

  }
});
export default MapEditPanel
