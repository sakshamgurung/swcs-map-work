import React from 'react'
import { View, Text, StyleSheet, ScrollView,
  TouchableOpacity} from 'react-native'
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient'
import shadow from 'lib/res/shadow'
import colors from 'lib/res/colors'
import AntIcon from 'react-native-vector-icons/AntDesign'
import {Button} from 'components/button'

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

const StatusChips = ({status, chipsTitle}) => {
  return(
    <View style={styles.chipsContainerItem}>
      <Text style={styles.chipsTitle}>{chipsTitle}</Text>
      <View style={[styles.chipsItem, getBGColor(status)]}>
        <Text style={styles.chipsText}>{status}</Text>
      </View>
    </View>
  )
}

const Header = ({title, onPressDismiss}) => {
  return(
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitle}>{title.length > 35 ? `${title.slice(0,30).toUpperCase()}...` : title.toUpperCase()}</Text>
      <View style={styles.headerSecondaryTitle}>
        <Button buttonType="iconOnly" icon={<AntIcon name="closecircle" color="rgb(201, 201, 201)" size={20}/>}
          onPress={onPressDismiss}/>
      </View>
    </View>
  )
}

const SummaryInfo = ({workStatus, wasteCondition, staffGroupName, vehiclePlateNo}) => {
  if(_.isEmpty(workStatus)){ workStatus = "no work"; }
  if(_.isEmpty(wasteCondition)){ wasteCondition = "no waste"; }
  if(_.isEmpty(staffGroupName)){ staffGroupName = "no staff group"; }
  if(_.isEmpty(vehiclePlateNo)){ vehiclePlateNo = "no vehicle"; }
  return(
    <View style={styles.summaryInfoContainer}>
      <View style={styles.chipsContainer}>
        <StatusChips status = {workStatus} chipsTitle={"Work"}/>
        <StatusChips status = {wasteCondition} chipsTitle={"Waste"}/>
      </View>
      <View style={styles.chipsContainer}>
          <StatusChips status = {staffGroupName} chipsTitle={"Staff group"}/>
          <StatusChips status = {vehiclePlateNo} chipsTitle={"Vehicle"}/>
      </View>
    </View>
  )
}

const WasteCategoryItem = ({amount, category}) => {
  return(
    <View style={styles.wasteCategoryItemContainer}>
      <View>
        <Text style={styles.wasteCategoryItemText}>
          {amount}
        </Text>
      </View>
      <Divider/>
      <View>
        <Text style={styles.wasteCategoryItemText}>
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

const WasteSummaryInfo = ({wasteData}) => {
  return(
    <View style={styles.wasteSummaryInfoContainer}>
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
    </View>
  )
}

const EditCard = ({onPressEditMap, onPressEditDetails, onPressDelete}) => {
  return(
    <View style={styles.EditCardContainer}>
      <View style={styles.EditCardItemContainer}>
        <Button disabled={false} onPress={onPressEditMap} buttonType="outline" text="Edit Map" style={styles.EditCardItem}/>
        <Button disabled={false} onPress={onPressEditDetails} buttonType="outline" text="Edit Detail" style={styles.EditCardItem}/>
        <Button disabled={false} onPress={onPressDelete} buttonType="outline" text="Delete" 
        style={[styles.EditCardItem, {borderColor:"red"}]} buttonContainStyle={{color:"red"}}/>
      </View>
    </View>
  )
}

export const BottomSheetInfo = ({
  title, 
  workStatus, 
  wasteCondition,  
  staffGroupName, 
  vehiclePlateNo, 
  wasteData, 
  onPressDismiss,
  onPressEditMap,
  onPressEditDetails,
  onPressDelete,
}) => {
  return (
    <View style = {styles.infoEditBottomBackground}>
      <LinearGradient colors={["rgba(236, 233, 230, 1)","rgba(242, 242, 242, 1)"]} style = {styles.infoEditContainer}>
        <ScrollView
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={true}
          style={styles.infoEditContainerScrollView}
        >
          <Header title = {title} onPressDismiss={onPressDismiss}/>
          <SummaryInfo workStatus={workStatus}  wasteCondition={wasteCondition} staffGroupName={staffGroupName} vehiclePlateNo={vehiclePlateNo}/>
          <WasteSummaryInfo wasteData={wasteData}/>
          <EditCard onPressEditMap={onPressEditMap} onPressEditDetails={onPressEditDetails} onPressDelete={onPressDelete}/>
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
  infoEditBottomBackground:{
    flex:1,
    justifyContent:"flex-end",
  },
  infoEditContainer:{
    backgroundColor:"rgba(249, 250, 251, 1)",
    width:"100%",
    height:"30%",
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    ...shadow.DP24
  },
  infoEditContainerScrollView:{
    flex:1,
  },

  //Info Header
  headerTitleContainer:{
    padding:10,
    paddingTop:15,
    marginBottom:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    flexDirection:"row",
    backgroundColor:"rgba(255,255,255,1)"
  },
  headerTitle:{
    flex:4,
    fontFamily:"Roboto",
    fontWeight:"bold",
    fontSize:16,
  },
  headerSecondaryTitle:{
    flex:1,
    alignItems:"flex-end", 
    paddingRight:5
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

  //Summary info
  summaryInfoContainer:{
    padding:10,
    backgroundColor:"rgba(255,255,255,1)",
    marginBottom:10,
  },

  //Chips
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    //flexDirection:"row",
    borderRadius:20,
    padding:5,
    paddingHorizontal:10, 
    marginHorizontal:10,
    height:25,
    width:"65%",
    ...shadow.DP1
  },
  chipsText: {
    fontFamily:"Roboto", 
    fontSize:10, 
    fontWeight:"bold", 
    color:"#fff"
  },

  //Waste Category
  wasteSummaryInfoContainer:{
    padding:10,
    marginBottom:10,
    backgroundColor:"rgba(255, 255, 255, 1)"
  },  
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
    //backgroundColor:"rgba(95, 120, 199, 1)",
    borderWidth:2,
    borderRadius:5,
    borderColor:"rgba(95, 120, 199, 1)",
    paddingHorizontal:10, 
    marginHorizontal:5, 
    height:60, 
    //...shadow.DP1
  },
  wasteCategoryItemText:{
    fontFamily:"Roboto",
    fontSize:15, 
    textAlign:"center", 
    color:"rgba(95, 120, 199, 1)",
  },
  //Edit Card
  EditCardContainer:{
    backgroundColor:"rgba(255, 255, 255, 1)"
  },
  EditCardItemContainer:{
    flexDirection:"row",
    margin:10,
  },
  EditCardItem:{
    marginHorizontal:10,
  },
  EditCardItemText:{
    fontFamily:"Roboto",
    fontSize:16,
    color:"rgba(95, 120, 199, 1)"
  }
});