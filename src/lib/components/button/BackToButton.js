import React from 'react'
import {StyleSheet, View,TouchableWithoutFeedback } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';


const BackToButton = ({destinationScreen}) => {
  const navigation = useNavigation();
  const backToScreen= ()=>{
    navigation.popToTop(`${destinationScreen}`);
  };
  return (
    <TouchableWithoutFeedback onPress={backToScreen} style={styles.buttonContainerStyles}>
      <Feather 
        name='arrow-left'
        size={25}
        color='rgba(0, 0, 0, 1.0)'
      />
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  buttonContainerStyles:{
    marginLeft:10
  }
})

export default BackToButton;

