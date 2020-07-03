import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const Statistic = ({title, subtitle, metric})=> {
  const {containerStyle, titleStyle, subtitleStyle, metricStyle} = style;
  return (
    <View style={containerStyle}>
      <Text style={titleStyle}> {title} </Text>
      <Text style={subtitleStyle}> {subtitle} </Text>
      <Text style={metricStyle}> {metric} </Text>
    </View>
  )
}

const style = StyleSheet.create({
  containerStyle:{
    backgroundColor:"#bcbcbc"
  },
  titleStyle:{
    fontSize:24,
    fontWeight:"bold"
  },
  subtitleStyle:{
    fontSize:15,
    color:"#ffffff"
  },
  metricStyle:{}
});

export default Statistic;