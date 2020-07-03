import React from 'react'
import { View, Text, StyleSheet, 
  TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native'
import shadow from 'res/shadow'
const CustomModal = (props) => {
  const{title, content, footerContent1, footerContent2,
    onRequestClose, onPressTouchableOpacity, visible
  } = props;
  console.log("Visible ",visible);
  return (
    <Modal 
      visible = {visible}
      transparent = {true}
      onRequestClose = {() => onRequestClose()}
    >
    <TouchableOpacity style={styles.modal} onPress = {() => onPressTouchableOpacity()}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style = {styles.content}>
            {content}
          </View>
          <View style = {styles.footer}>
            <View style = {styles.footerContent1}>{footerContent1}</View>
            <View style = {styles.footerContent2}>{footerContent2}</View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  </Modal>
  )
}

const styles = StyleSheet.create({
  modal:{
    backgroundColor:"#00000099",
    flex:1,
    justifyContent:"center", 
    alignItems:"center"
  },
  modalContainer:{
    backgroundColor:"#f9fafb",
    width:"80%",
    borderRadius:5,
    ...shadow.DP24
  },
  title:{
    fontFamily:"Roboto",
    fontSize:20,
    marginTop:10,
    marginLeft:10 
  },
  content:{
    marginLeft:10,
    marginVertical:10
  },
  footer:{
    flexDirection: "row",
    marginBottom: 10
  },
  footerContent1:{
    flex:1,
    marginLeft:10
  },
  footerContent2:{
    flex:1,
    marginLeft:10
  }
});



export default CustomModal
