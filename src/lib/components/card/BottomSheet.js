import React from 'react'
import { View, Text, StyleSheet, ScrollView,
  TouchableOpacity} from 'react-native'
import shadow from 'lib/res/shadow'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const ListItem = ({onPressItem, icon, distance, title, desc}) => {
  return(
    <TouchableOpacity style={{borderBottomWidth:1, flexDirection:"row"}}>
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
export const BottomSheetList = ({data}) => {
  return (
    <View style = {styles.searchBottomSheet}>
      <View style = {styles.searchContainer}>
        <ScrollView style = {styles.listContent}>
          {data.map((d)=>
            <ListItem
              key = {d.id}
              icon = {<MaterialIcon name="map-marker" size={20} color="rgba(240,0,0,1)"/>}
              distance = {d.id}
              title = {d.name}
              desc = {d.name}
            />
          )}
        </ScrollView>
      </View>
    </View>
  )
}
const WasteAmountItem = ({amount, category}) => {
  return(
    <View style={{borderWidth:2, paddingHorizontal:10, marginHorizontal:5, height:60}}>
      <View><Text style={{fontFamily:"Roboto",fontSize:20, textAlign:"center"}}>
          {amount}
        </Text>
      </View>
      <View>
        <Text style={{fontFamily:"Roboto",fontSize:14, textAlign:"center"}}>
          {category}
        </Text>
      </View>
    </View>
  )
}

export const BottomSheetInfo = ({title, data, dataPresent}) => {
  if(dataPresent == true){
    return (
      <View style = {styles.infoEdit}>
        <View style = {styles.infoEditContainer}>
          <View style = {styles.infoHeader}>
            <View><Text style={{fontFamily:"Roboto",fontSize:14}}>{title}</Text></View>
            <View style={{flexDirection:"row"}}>
              <View><Text style={{fontFamily:"Roboto",fontSize:14}}>WasteStatus</Text></View>
              <View><Text style={{fontFamily:"Roboto",fontSize:14}}>WorkStatus</Text></View>
            </View>
          </View>
          <ScrollView
            horizontal scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false} height={100}
            style={styles.wasteCategoryScrollView}
            contentContainerStyle={{
              paddingRight: 20
            }}
          >
            {Object.entries(data).map(([key, value])=>{
              return(<WasteAmountItem key={key} category={key} amount={value}/>)
            })}
          </ScrollView>
        </View>
      </View>
    )
  }else{
    return(
      <View style = {styles.infoEdit}>
        <View style = {styles.infoEditContainer}>
          <View style = {styles.infoHeader}>
            <View><Text>{title}</Text></View>
            <View><Text>WasteStatus</Text></View>
            <View><Text>WorkStatus</Text></View>
          </View>
          <Text>Empty</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchBottomSheet:{
    flex:1,
    justifyContent:"flex-end",
  },
  searchContainer:{
    backgroundColor:"#f9fafb",
    width:"100%",
    height:"85%",
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    ...shadow.DP24
  },
  searchHeader:{
    alignItems:"center"
  },
  listContent:{
    flex:1,
    marginHorizontal:10,
    marginVertical:15,
    ...shadow.DP1
  },
  //Info and edit bottomsheet
  infoEdit:{
    flex:1,
    justifyContent:"flex-end"
  },
  infoEditContainer:{
    backgroundColor:"#f9fafb",
    width:"100%",
    height:"30%",
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    ...shadow.DP24
  },
  infoHeader:{
    
  },
  wasteCategoryScrollView: {
    //position:'absolute', 
    paddingVertical:10,
    paddingHorizontal:10
  },
});