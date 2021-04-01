import React from 'react'
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Modal, 
  ScrollView, 
  Keyboard, 
  TextInput, 
  Pressable} from 'react-native'
import {shadow} from 'lib/res'
import {colors} from 'lib/res'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ModalDropdown from 'react-native-modal-dropdown';
// component
import {MapSearch} from 'components/input'
import {Button} from 'components/button'
import _ from 'lodash'

function EditHeader({title, onCancel, onDone}){
  return(
    <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
      <Pressable onPress={onCancel} style={{flex:1}}>
        <MaterialIcon name="close" color="rgba(255, 255, 255, 1)" size={25}/>
      </Pressable>
      <View style={{flex:16, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
        <Text style={{flex: 1, fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>{title}</Text>
      </View>
      <Pressable onPress={onDone} style={{flex:1}}>
        <MaterialIcon name="check" color="rgba(255, 255, 255, 1)" size={25}/>
      </Pressable>
    </View>
  );
}

export const GeoObjectsDetailModal = (props) => {
  const{
    title,
    onCancel, 
    onDone,
    onChangeGeoObjectsDetail,
    geoObjectsName, wasteLimit, wasteLimitUnit, description,
    onRequestClose, 
    onPressTouchableOpacity, 
    visible
  } = props;
  const wasteLimitUnitOptions = ['kg', 'litre'];
  return (
    <Modal
      visible = {visible}
      transparent = {true}
      onRequestClose = {() => onRequestClose()}
    >
      <TouchableOpacity style={styles.dialogModal} onPress = {() => onPressTouchableOpacity()}>
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={[styles.dialogModalContainer]}>
            <EditHeader title={title} onCancel={onCancel} onDone={onDone}/>

            <View style={{backgroundColor:"rgba(255, 255, 255, 1)", marginBottom:10, paddingVertical:10}}>
              <View style={{paddingHorizontal:10, marginBottom:5}}>
                <Text style={{fontWeight:"bold"}}>Name</Text>
                <View style={{paddingHorizontal:10}}>
                  <TextInput
                    autoCorrect = {false}
                    keyboardType = "visible-password" underlineColorAndroid = "transparent" secureTextEntry={false}
                    style={{height:50, borderBottomWidth:1, paddingVertical:0,borderRadius:4, 
                      borderColor:colors.button, width:"100%", textAlignVertical:"bottom",fontSize:15}}
                    onChangeText={text => onChangeGeoObjectsDetail({property:"name", value:text})}
                    value = {geoObjectsName} placeholder = "Name"
                  />
                </View>
              </View>
            </View>

            <View style={{backgroundColor:"rgba(255, 255, 255, 1)", marginBottom:10, paddingVertical:10}}>
              <View style={{paddingHorizontal:10, marginBottom:10}}>
                <Text style={{fontWeight:"bold"}}>Waste Limit</Text>
                <View style={{paddingHorizontal:10}}>
                  <TextInput
                    autoCorrect = {false}
                    keyboardType = 'number-pad'  underlineColorAndroid = "transparent" secureTextEntry = {false}
                    style={{height:40, paddingVertical:0, borderBottomWidth:1, borderColor:colors.button, width:"100%", textAlignVertical:"bottom", fontSize:15}}
                    onChangeText={text => onChangeGeoObjectsDetail({property:"wasteLimit", value:text.match('^(\s*|[1-9][0-9]*)$')?text:wasteLimit})}
                    value={wasteLimit}
                  />
                </View>
              </View>
              <View style={{paddingHorizontal:10, marginBottom:10}}>
                <Text style={{fontWeight:"bold"}}>Waste Limit Unit</Text>
                <View style={{paddingHorizontal:10}}>
                  <ModalDropdown options={wasteLimitUnitOptions} 
                    defaultIndex={_.findIndex(wasteLimitUnitOptions, e=>e==wasteLimitUnit)} 
                    defaultValue={wasteLimitUnit}
                    onSelect = {(i, value)=> onChangeGeoObjectsDetail({property:"wasteLimitUnit", value:value})}
                    style={styles.dropdownButtonStyle}
                    textStyle={styles.dropdownButtonTextStyle}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.dropdownTextStyle}
                    dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
                  />
                </View>
              </View>
            </View>

            <View style={{backgroundColor:"rgba(255, 255, 255, 1)", marginBottom:10, paddingVertical:10}}>
              <View style={{paddingHorizontal:10, marginBottom:10}}>
                <Text style={{fontWeight:"bold", marginBottom:10}}>Geo Object description</Text>
                <ScrollView scrollEventThrottle={1} showsVerticalScrollIndicator={true} style={{height:150}}>
                  <TextInput placeholder="Type description..." underlineColorAndroid="rgba(62, 115, 222, 1)"
                    multiline={true} maxLength={1000} style={{paddingHorizontal:10}} 
                    onChangeText={text => onChangeGeoObjectsDetail({property:"description", value:text})}
                    value={description}
                  />
                </ScrollView>
              </View>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

const ListItem = ({onPressItem, icon, distance, title, desc, id}) => {
  return(
    <TouchableOpacity 
    onPress = {(e) => onPressItem(e, id, "list")}
    style={{borderBottomWidth:2, borderBottomColor:"rgba(204, 204, 204, 1)",flexDirection:"row"}}>
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
export const SearchModal = ({onRequestClose, onPressBack, onPressClear, onPressTrack, onChangeText, value, trackData}) => {
    return (
    <Modal
      visible = {true}
      //hardware backbutton callback
      onRequestClose = {onRequestClose}
    >
      <View style = {styles.searchModal}>
        <View style = {styles.searchHeader}>
          <MapSearch 
            style = {{position:"relative"}}
            visible = {true}
            //autoFocus = {true}
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
          {/* <TouchableWithoutFeedback accessible = {false} onPress={Keyboard.dismiss}> */}
            <ScrollView style = {styles.listContent} onScrollBeginDrag={Keyboard.dismiss}>
              {trackData.map((td)=>
                <ListItem
                  key = {td._id}
                  id = {td._id}
                  icon = {<MaterialIcon name="vector-polyline" size={20} color="rgba(247, 72, 72,1)"/>}
                  distance = {null}
                  title = {td.trackName}
                  desc = {td.trackName}
                  onPressItem = {onPressTrack}
                />
              )}
            </ScrollView>
          {/* </TouchableWithoutFeedback> */}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  dialogModal:{
    backgroundColor:"#00000099",
    flex:1,
  },
  dialogModalContainer:{
    flex:1,
    backgroundColor:"rgba(247, 247, 247, 1)",
    borderRadius:5,
    ...shadow.DP24
  },
  dialogTitle:{
    fontFamily:"Roboto",
    fontSize:20,
    marginTop:10,
    marginLeft:10 
  },
  dropdownButtonStyle:{
    borderBottomWidth:1,
    justifyContent:"center",
    paddingLeft:5,
    height:"10%", 
    width:"25%",
    height:40,
  },
  dropdownButtonTextStyle:{
    fontFamily:"Roboto",
    fontSize:14,
  },
  dropdownStyle:{
    marginTop:10,
    height:"11%", 
    width:"20%",
    borderRadius:5,
    ...shadow.DP2
  },
  dropdownTextStyle:{
    fontFamily:"Roboto",
    fontSize:14,
    color:"grey"
  },
  dropdownTextHighlightStyle:{
    color:"blue"
  },
  //search modal style
  searchModal:{
    flex:1,
    marginHorizontal:0,
  },
  searchHeader:{
    marginBottom:0,
  },
  searchModalContainer:{
    backgroundColor:"#fff",
    flex:1,
    marginHorizontal:5,
    marginTop:10,
    ...shadow.DP24
  },
  listContent:{
    flex:1,
    marginHorizontal:5,
    marginVertical:15,
    ...shadow.DP1
  }
});

// export const CustomModal = (props) => {
//   const{title, content, footerContent1, footerContent2,
//     onRequestClose, onPressTouchableOpacity, visible
//   } = props;
//   return (
//     <Modal
//       visible = {visible}
//       transparent = {true}
//       onRequestClose = {() => onRequestClose()}
//     >
//       <TouchableOpacity style={styles.dialogModal} onPress = {() => onPressTouchableOpacity()}>
//         <TouchableWithoutFeedback>
//           <View style={styles.dialogModalContainer}>
//             <Text style={styles.dialogTitle}>{title}</Text>
//             <View style = {styles.dialogContent}>
//               {content}
//               <Text>Amount Limit</Text>
//               <TextInput
//                 autoCorrect = {false}
//                 keyboardType = "visible-password" underlineColorAndroid = "transparent"
//                 style={{height:40, borderBottomWidth:1,
//                   borderRadius:4, borderColor:colors.button, width:"80%", textAlignVertical:"bottom",fontSize:15}}
//                   onChangeText={text => console.log(text)}
//                   value = {"test"} placeholder = {title}
//                 />

//                 <Text>Amount Unit</Text>
//                 <TextInput
//                 autoCorrect = {false}
//                 keyboardType = "visible-password" underlineColorAndroid = "transparent"
//                 style={{height:50, borderBottomWidth:1,
//                   borderRadius:4, borderColor:colors.button, width:"80%", textAlignVertical:"bottom",fontSize:15}}
//                 onChangeText={text => console.log(text)}
//                 value = {"test"} placeholder = {title}
//               />
//             </View>
//             <View style = {styles.dialogFooter}>
//               <View style = {styles.dialogFooterContent1}>{footerContent1}</View>
//               <View style = {styles.dialogFooterContent2}>{footerContent2}</View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </Modal>
//   )
// }



// const styles = StyleSheet.create({
//   dialogModal:{
//     backgroundColor:"#00000099",
//     flex:1,
//     justifyContent:"center", 
//     alignItems:"center"
//   },
//   dialogModalContainer:{
//     backgroundColor:"#f9fafb",
//     width:"80%",
//     borderRadius:5,
//     ...shadow.DP24
//   },
//   dialogTitle:{
//     fontFamily:"Roboto",
//     fontSize:20,
//     marginTop:10,
//     marginLeft:10 
//   },
//   dialogContent:{
//     marginLeft:10,
//     marginVertical:10
//   },
//   dialogFooter:{
//     flexDirection: "row",
//     marginBottom: 10
//   },
//   dialogFooterContent1:{
//     flex:1,
//     marginLeft:10
//   },
//   dialogFooterContent2:{
//     flex:1,
//     marginLeft:10
//   },
//   //search modal style
//   searchModal:{
//     flex:1,
//     marginHorizontal:0,
//   },
//   searchHeader:{
//     marginBottom:0,
//   },
//   searchModalContainer:{
//     backgroundColor:"#fff",
//     flex:1,
//     marginHorizontal:5,
//     marginTop:10,
//     ...shadow.DP24
//   },
//   listContent:{
//     flex:1,
//     marginHorizontal:5,
//     marginVertical:15,
//     ...shadow.DP1
//   }
// });
