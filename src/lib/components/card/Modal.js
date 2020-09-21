import React from 'react'
import { View, Text, StyleSheet,
  TouchableOpacity, TouchableWithoutFeedback, Modal, ScrollView} from 'react-native'
import shadow from 'lib/res/shadow'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
// component
import {MapSearch} from 'lib/components/input'
import {Button} from 'lib/components/button'

export const CustomModal = (props) => {
  const{title, content, footerContent1, footerContent2,
    onRequestClose, onPressTouchableOpacity, visible
  } = props;
  return (
    <Modal
      visible = {visible}
      transparent = {true}
      onRequestClose = {() => onRequestClose()}
    >
      <TouchableOpacity style={styles.dialogModal} onPress = {() => onPressTouchableOpacity()}>
        <TouchableWithoutFeedback>
          <View style={styles.dialogModalContainer}>
            <Text style={styles.dialogTitle}>{title}</Text>
            <View style = {styles.dialogContent}>
              {content}
            </View>
            <View style = {styles.dialogFooter}>
              <View style = {styles.dialogFooterContent1}>{footerContent1}</View>
              <View style = {styles.dialogFooterContent2}>{footerContent2}</View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

const ListItem = ({onPressItem, icon, distance, title, desc}) => {
  return(
    <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:"rgbs(0,0,0,0.3)", flexDirection:"row"}}>
      <View style = {{alignContent:"center", marginHorizontal:10, marginVertical:5 }}>
        <View style = {{paddingTop:5}}>{icon}</View>
        <Text style={{fontSize:14}}>{distance}</Text>
      </View>
      <View style = {{alignContent:"center", marginHorizontal:10, marginVertical:5}}>
        <Text style={{fontSize:18}}>{title}</Text>
        <Text style={{fontSize:14}}>{desc}</Text>
      </View>
    </TouchableOpacity>
  )
}
export const SearchModal = ({onRequestClose, onPressBack, onPressClear, 
  onChangeText, value, trackData, zoneData, autoFocus}) => {
  return (
    <Modal
      visible = {true}
      onRequestClose = {onRequestClose}
    >
      <View style = {styles.searchModal}>
        <View style = {styles.searchHeader}>
          <MapSearch 
            style = {{position:"relative"}}
            visible = {true}
            autoFocus = {autoFocus}
            onChangeText = {onChangeText}
            value = {value}
            leftIcon = {
              <Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-left" color="#000" size={25}/>}
              onPress={onPressBack}/>}
            rightIcon = {
              <Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={onPressClear}/>}
          />
        </View>
        <View style = {styles.searchModalContainer}>
          <ScrollView style = {styles.listContent}>
            {trackData.map((td)=>
              <ListItem
                key = {td.trackID}
                icon = {<MaterialIcon name="vector-polyline" size={20} color="rgba(247, 72, 72,1)"/>}
                distance = {null}
                title = {td.trackName}
                desc = {td.trackName}
              />
            )}
            {zoneData.map((zd)=>
              <ListItem
                key = {zd.zoneID}
                icon = {<MaterialIcon name="vector-polygon" size={20} color="rgba(72, 162, 247,1)"/>}
                distance = {null}
                title = {zd.zoneName}
                desc = {zd.zoneName}
              />
            )
            }
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  dialogModal:{
    backgroundColor:"#00000099",
    flex:1,
    justifyContent:"center", 
    alignItems:"center"
  },
  dialogModalContainer:{
    backgroundColor:"#f9fafb",
    width:"80%",
    borderRadius:5,
    ...shadow.DP24
  },
  dialogTitle:{
    fontFamily:"Roboto",
    fontSize:20,
    marginTop:10,
    marginLeft:10 
  },
  dialogContent:{
    marginLeft:10,
    marginVertical:10
  },
  dialogFooter:{
    flexDirection: "row",
    marginBottom: 10
  },
  dialogFooterContent1:{
    flex:1,
    marginLeft:10
  },
  dialogFooterContent2:{
    flex:1,
    marginLeft:10
  },
  //search modal style
  searchModal:{
    flex:1,
    marginHorizontal:0,
  },
  searchHeader:{
    marginBottom: 20
  },
  searchModalContainer:{
    backgroundColor:"#fff",
    flex:1,
    marginHorizontal:5,
    ...shadow.DP24
  },
  listContent:{
    flex:1,
    marginHorizontal:5,
    marginVertical:15,
    ...shadow.DP1
  }
});
