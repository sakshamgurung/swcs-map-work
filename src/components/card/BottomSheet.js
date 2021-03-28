import React from 'react'
import { View, Text, StyleSheet, ScrollView,
  TouchableOpacity} from 'react-native'
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient'
import shadow from 'lib/res/shadow'
import colors from 'lib/res/colors'
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

const StatusChips = ({status}) => {
  return(
    <View style={[styles.chipsItem, getBGColor(status)]}>
      <Text style={styles.chipsText}>{status}</Text>
    </View>
  )
}

const Header = ({title, workStatus, wasteCondition, staffGroupName, vehiclePlateNo, onPressSeeDetail}) => {
  if(_.isEmpty(workStatus)){
    workStatus = "no work";
  }
  if(_.isEmpty(wasteCondition)){
    wasteCondition = "no waste";
  }
  if(_.isEmpty(staffGroupName)){
    staffGroupName = "no staff group";
  }
  if(_.isEmpty(vehiclePlateNo)){
    vehiclePlateNo = "no vehicle";
  }

  return(
    <View style = {styles.infoHeader}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{title.length > 30 ? `${title.slice(0,27)}...` : title}</Text>
        <TouchableOpacity onPress = {onPressSeeDetail}>
          <Text style={styles.headerSecondaryTitle}>See Detail</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chipsContainer}>
        <View style={styles.chipsContainerItem}>
          <Text style={styles.chipsTitle}>Work</Text>
          <StatusChips status = {workStatus}/>
        </View>
        <View style={styles.chipsContainerItem}>
          <Text style={styles.chipsTitle}>Waste</Text>
          <StatusChips status = {wasteCondition}/>
        </View>
      </View>
      <View style={styles.chipsContainer}>
        <View style={styles.chipsContainerItem}>
          <Text style={styles.chipsTitle}>Staff Group</Text>
          <StatusChips status = {staffGroupName}/>
        </View>
        <View style={styles.chipsContainerItem}>
          <Text style={styles.chipsTitle}>Vehicle</Text>
          <StatusChips status = {vehiclePlateNo}/>
        </View>
      </View>
    </View>
  )
}

const WasteCategoryItem = ({amount, category}) => {
  return(
    <View style={styles.wasteCategoryItemContainer}>
      <View>
        <Text style={{fontFamily:"Roboto",fontSize:20, textAlign:"center"}}>
          {amount}
        </Text>
      </View>
      <Divider/>
      <View>
        <Text style={{fontFamily:"Roboto",fontSize:14, textAlign:"center"}}>
          {category}
        </Text>
      </View>
    </View>
  )
}

const Divider = () => {
  return (
   <View style={{borderTopWidth:2, borderTopColor:"rgba(204, 204, 204, 1)", marginHorizontal:10}}></View> 
  )
}

export const BottomSheetInfo = ({title, workStatus, wasteCondition,  staffGroupName, vehiclePlateNo, wasteData}) => {
  return (
    <View style = {styles.infoEdit}>
      <LinearGradient colors={["rgba(236, 233, 230, 1)","rgba(242, 242, 242, 1)"]} style = {styles.infoEditContainer}>
        <ScrollView
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={true}
          style={styles.infoEditContainerScrollView}
        >
          <Header title = {title} workStatus={workStatus}  wasteCondition={wasteCondition} staffGroupName={staffGroupName} vehiclePlateNo={vehiclePlateNo}/>

          <Divider/>

          <View>
            <Text style={styles.wasteCategoryItemTitle}>Waste amount by category</Text>
          </View>
          <ScrollView
            horizontal scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false} height={100}
            style={styles.wasteCategoryScrollView}
            contentContainerStyle={{
              paddingRight: 20
            }}
          >
            {_.isEmpty(wasteData)? (<View><Text>No Waste Data</Text></View>)
              : Object.entries(wasteData).map(([key, value])=>{
              return(<WasteCategoryItem key={key} category={key} amount={value}/>)
            })}
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function getBGColor(buttonStatus){
  switch(buttonStatus){
    case "unconfirmed":
    case "medium":
      return ({backgroundColor:colors.warningButton});
    case "confirmed":
    case "low":
      return ({backgroundColor:colors.primaryButton});
    case "on progress":
      return ({backgroundColor:colors.secondaryButton});
    case "finished":
      return ({backgroundColor:colors.successButton});
    case "high":
      return ({backgroundColor:colors.dangerButton});
    default:
      return ({backgroundColor:colors.primaryButton});
  }
}

const styles = StyleSheet.create({
  searchBottomSheet:{
    flex:1,
    justifyContent:"flex-end",
  },
  searchContainer:{
    backgroundColor:"rgba(249, 250, 251, 1)",
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
  infoEditContainerScrollView:{
    flex:1,
  },
  infoEditContainer:{
    backgroundColor:"rgba(249, 250, 251, 1)",
    width:"100%",
    height:"30%",
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    ...shadow.DP24
  },
  //Info Header
  infoHeader:{
    margin:10,
  },
  headerTitleContainer:{
    flexDirection:"row",
    marginBottom:5
  },
  headerTitle:{
    flex:3,
    fontFamily:"Roboto",
    fontWeight:"bold",
    fontSize:20,
  },
  headerSecondaryTitle:{
    flex:1,
    fontFamily:"Roboto",
    fontWeight:"normal",
    fontSize:15,
    color:`${colors.primaryButton}`
  },
  chipsContainer:{
    flexDirection:"row",
    marginBottom:5
  },
  chipsContainerItem:{
    flex:1
  },  
  chipsTitle:{
    paddingVertical:5, 
    fontWeight:"bold",
    fontSize:14, 
  },
  //Chips
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    borderRadius:20,
    padding:5,
    paddingHorizontal:10, 
    marginHorizontal:10,
    height:30,
    width:"70%",
    ...shadow.DP1
  },
  chipsText: {
    fontFamily:"Roboto", 
    fontSize:12, 
    fontWeight:"bold", 
    color:"#fff"
  },
  //Waste Category
  wasteCategoryItemTitle: {
    margin:10,
    fontFamily:"Roboto",
    fontWeight:"bold",
    fontSize:18,
  },
  wasteCategoryScrollView: {
    //position:'absolute',
    margin:10,
  },
  wasteCategoryItemContainer: {
    backgroundColor:"rgba(249, 250, 251, 1)", 
    borderRadius:5, 
    paddingHorizontal:10, 
    marginHorizontal:5, 
    height:60, 
    ...shadow.DP1
  }
});