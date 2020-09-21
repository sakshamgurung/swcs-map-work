import React from 'react';
import {View, StyleSheet} from 'react-native';

const Card = ({children}) => {
  return(
    <View style={styles.containerStyle}>{children}</View>
  );
};

const styles= StyleSheet.create({
  containerStyle:{
    flexDirection:"column",
    justifyContent:"space-between",
    borderRadius:10,
    backgroundColor:'#64b5f6',
    opacity:1,
    shadowColor:'#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset:{width:0, height:5},
    elevation: 5,
    padding:12,
    marginBottom:12,
    marginTop:12,
    marginLeft:15,
    marginRight:15
  }
});
export default Card;