import React, { useState, useRef, useEffect, Component } from 'react'
import { Text, View, Pressable, TextInput, StyleSheet, Platform, ScrollView, Modal, TouchableWithoutFeedback} from 'react-native'
import _ from 'lodash'

import Awesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import {shadow, colors} from 'lib/res'
import {Button} from 'lib/components/button'

function Header({title, onPressBack, onPressOption}){
  return(
    <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
      <Pressable onPress={()=>onPressBack()} style={{flex:1}}>
        <MaterialCommIcon name="arrow-left" color="rgba(255, 255, 255, 1)" size={20}/>
      </Pressable>
      <View style={{flex:16}}>
        <Text style={{fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>{title}</Text>
      </View>
      <Pressable onPress={onPressOption} style={{flex:1}}>
        <EntypoIcon  name="dots-three-vertical" color="rgba(255, 255, 255, 1)" size={16}/>
      </Pressable>
    </View>
  );
}

function FilterChips({activeChips, onPressFilterChips}){
  return(
    <View style={{flexDirection:"row", justifyContent:"center"}}>
      <View style={{justifyContent:"center", marginLeft:15, marginVertical:10}}>
        <Button buttonType="contained" text="Staff" onPress={() => onPressFilterChips("staff")} 
        style={{flexDirection:"row", borderRadius:30, borderWidth:activeChips=="staff"?0:2, borderColor:colors.primaryButton, backgroundColor:activeChips == "staff"?colors.primaryButton:"transparent"}} 
        childrenStyle={{marginHorizontal:10, marginRight:5}} buttonContainStyle={{marginRight:5}}>
          <View style={{justifyContent:"center"}}>
            <Awesome5Icon name="user-alt" color="rgba(255, 255, 255, 1)" size={14}/>
          </View>
        </Button>
      </View>
      <View style={{justifyContent:"center", marginLeft:15, marginVertical:10}}>
        <Button buttonType="contained" text="Group" onPress={() => onPressFilterChips("group")} 
        style={{flexDirection:"row", borderRadius:30, borderWidth:activeChips=="group"?0:2, borderColor:colors.primaryButton, backgroundColor:activeChips == "group"?colors.primaryButton:"transparent"}} 
        childrenStyle={{marginHorizontal:10, marginRight:5}} buttonContainStyle={{marginRight:5}}>
          <View style={{justifyContent:"center"}}>
            <Awesome5Icon name="users" color="rgba(255, 255, 255, 1)" size={18}/>
          </View>
        </Button>
      </View>
    </View>
  )
}

function ListItem({memberIndex, onToggleMember, isWorkMember, staff, group, groupMember, activeChips }){
  const [toggleInfo, setToggleInfo] = useState(false);
  const onToggleInfo = () => {
    setToggleInfo(!toggleInfo);
  }

  let id, firstName, lastName, address, email, phoneNumber, groupName, groupMemberId, listedName;

  function renderInfoModal(){
    if(activeChips == "staff"){
      ({id, firstName, lastName, address, email, phoneNumber} = staff);
      listedName = `${firstName} ${lastName}`;
      return (
        <TouchableWithoutFeedback>
          <View style = {{backgroundColor:"rgba(26, 28, 82, 1)", width:300, height:"20%", 
            paddingVertical:15, paddingHorizontal:10, borderRadius:5, ...shadow.DP24}}>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Name: {listedName}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Address: {address}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Email: {email}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Phone: {phoneNumber}</Text>
          </View>        
        </TouchableWithoutFeedback>
      )
    }
    if(activeChips == "group"){
      console.log("group: ", group);
      ({id, groupName, groupMemberId} = group);
      listedName = groupName
      return(
        <TouchableWithoutFeedback>
          <View style = {{backgroundColor:"rgba(26, 28, 82, 1)", width:350, height:"60%", 
            paddingVertical:15, paddingHorizontal:10, borderRadius:5, ...shadow.DP24}}>
            <ScrollView scrollEventThrottle={14} style={{flex:1}}>
              <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Group Name: {groupName}</Text>
              <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Group Member</Text>
              {
                groupMember.map((gm)=>{
                  const {id, firstName, lastName, address, email, phoneNumber} = gm;
                  const name = `${firstName} ${lastName}`;
                  return(
                    <View key={id} style={{marginVertical:5}}>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:16}}> {name} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Address: {address} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Email: {email} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Phone: {phoneNumber} </Text>
                      <View style={{borderBottomWidth:1, borderBottomColor:"rgba(97, 97, 97, 1)", marginTop:5}}/>
                    </View>
                    )
                })
              }
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
  return(
    <View style={{flexDirection:"row", marginVertical:5}}>
      <Modal visible={toggleInfo} transparent = {true}>
        <Pressable style={{backgroundColor:"#00000099", flex:1, justifyContent:"center", alignItems:"center"}} onPress={onToggleInfo}>
        {renderInfoModal()}
        </Pressable>
      </Modal>
      
      <Pressable onPress={() => onToggleMember(id, memberIndex, activeChips)} style={{flex:7, justifyContent:"center"}}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:16, marginLeft:15}}>{listedName}</Text>
      </Pressable>
      
      <Pressable onPress={onToggleInfo} android_ripple={{color:"rgba(255, 255, 255, 1)", 
      radius:10,}} style={{flex:2, padding:5, justifyContent:"center", alignItems:"center"}}>
        <MaterialCommIcon name="information" color="rgba(255, 255, 255, 1)" size={24}/>
      </Pressable>
      
      <Pressable onPress={() => onToggleMember(id, memberIndex, activeChips)} style={{flex:1, justifyContent:"center"}}>
        {
          isWorkMember?
          <View style={{borderRadius:50,  alignSelf:"baseline", backgroundColor:"rgba(224, 49, 49, 1)"}}>
            <EntypoIcon name="minus" color="rgba(255, 255, 255, 1)" size={24}/>
          </View>:
          <View style={{borderRadius:50, borderWidth:1, alignSelf:"baseline", borderColor:"rgba(34, 224, 85, 1)"}}>
            <EntypoIcon name="plus" color="rgba(34, 224, 85, 1)" size={24}/>
          </View>
        }
      </Pressable>
    </View>
  )
}

function List({staffData, groupData, memberData, onToggleMember, activeChips}){
  return(
    <ScrollView scrollEventThrottle={13}>
      {
        (!_.isEmpty(staffData) && activeChips == "staff") ? staffData.map((staff) => {
          const memberIndex = _.findIndex(memberData.staffMember, (m) => m == staff.id);
          return(
            <ListItem key={staff.id} memberIndex={memberIndex} isWorkMember={memberIndex>=0?true:false} 
            onToggleMember={onToggleMember} staff = {staff} activeChips={activeChips}/>
          )
        }):null
      }
      {
        (!_.isEmpty(groupData) && activeChips == "group") ? groupData.map((group) => {
          const memberIndex = _.findIndex(memberData.groupMember, (m) => m == group.id);
          const groupMember = _.filter(staffData, (staff)=>{
            const memberIndex = _.findIndex(group.groupMemberId, (gm) => gm == staff.id);
            if(memberIndex >= 0) {return true;}
            else {return false;}
          });
          return(
            <ListItem key={group.id} memberIndex={memberIndex} isWorkMember={memberIndex>=0?true:false} 
            onToggleMember={onToggleMember} group = {group} groupMember = {groupMember} activeChips={activeChips} />
          )
        }):null
      }
    </ScrollView>
  )
}

function AddMember({showModal, onDone, staffData, groupData, memberData, onToggleMember }){
  const [activeChips, setActiveChips] = useState("staff")
  const onPressFilterChips = (type) => {
    setActiveChips(type);
  }
  const onPressDone = () => {
    onDone();
  }
  return(
    <Modal visible={showModal} transparent = {true}>
      <Pressable style={{backgroundColor:"#00000099", flex:1, justifyContent:"center", alignItems:"center"}} onPress={onPressDone}>
        <TouchableWithoutFeedback>
          <View style = {{backgroundColor:"rgba(26, 28, 82, 1)", width:380, height:"80%", borderRadius:5, ...shadow.DP24}}>
            <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
              <View style={{flex:15, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <Text style={{flex: 1, fontSize:20, fontWeight:"bold", color:"rgba(255, 255, 255, 1)", paddingHorizontal:10}}>Edit members</Text>
                <Text style={{flex: 1, fontSize:12, color:"rgba(255, 255, 255, 1)", paddingTop:5}}>{`MemberCount: ${memberData.length}`}</Text>
              </View>
              <Pressable onPress={onPressDone} style={{flex:1}}>
                <MaterialIcon name="check" color="rgba(255, 255, 255, 1)" size={20}/>
              </Pressable>
            </View>
            <FilterChips activeChips={activeChips} onPressFilterChips={onPressFilterChips}/>
            {
              activeChips == "staff"?
              <List staffData={staffData} memberData={memberData} onToggleMember={onToggleMember} activeChips={activeChips}/>:
              <List groupData={groupData} staffData={staffData} memberData={memberData} onToggleMember={onToggleMember} activeChips={activeChips}/>
            }
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

function MemberListItem({staff, group, groupMember, goToDetail, activeChips}){
  const [toggleInfo, setToggleInfo] = useState(false);
  const onToggleInfo = () => {
    setToggleInfo(!toggleInfo);
  }

  let id, firstName, lastName, address, email, phoneNumber, groupName, groupMemberId, listedName;

  function renderInfoModal(){
    if(activeChips=="staff"){
      ({id, firstName, lastName, address, email, phoneNumber} = staff);
      listedName = `${firstName} ${lastName}`;
      return(
        <TouchableWithoutFeedback>
          <View style = {{backgroundColor:"rgba(26, 28, 82, 1)", width:300, height:"20%", 
            paddingVertical:15, paddingHorizontal:10, borderRadius:5, ...shadow.DP24}}>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Name: {listedName}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Address: {address}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Email: {email}</Text>
            <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Phone: {phoneNumber}</Text>
          </View>        
        </TouchableWithoutFeedback>
      )
    }else if(activeChips=="group"){
      ({id, groupName, groupMemberId} = group);
      listedName = groupName;
      return(
        <TouchableWithoutFeedback>
          <View style = {{backgroundColor:"rgba(26, 28, 82, 1)", width:350, height:"60%", 
            paddingVertical:15, paddingHorizontal:10, borderRadius:5, ...shadow.DP24}}>
            <ScrollView scrollEventThrottle={14} style={{flex:1}}>
              <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Group Name: {groupName}</Text>
              <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:18}}> Group Member</Text>
              {
                groupMember.map((gm)=>{
                  const {id, firstName, lastName, address, email, phoneNumber} = gm;
                  const name = `${firstName} ${lastName}`;
                  return(
                    <View key={id} style={{marginVertical:5}}>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:16}}> {name} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Address: {address} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Email: {email} </Text>
                      <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}> Phone: {phoneNumber} </Text>
                      <View style={{borderBottomWidth:1, borderBottomColor:"rgba(97, 97, 97, 1)", marginTop:5}}/>
                    </View>
                    )
                })
              }
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      )}
  }
  return(
    <View style={{flexDirection:"row", marginVertical:5}}>
      <Modal visible={toggleInfo} transparent = {true}>
        <Pressable style={{backgroundColor:"#00000099", flex:1, justifyContent:"center", alignItems:"center"}} onPress={onToggleInfo}>
          {renderInfoModal()}
        </Pressable>
      </Modal>
      <View style={{flex:7}}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:16, marginLeft:15}}>{listedName}</Text>
      </View>
      <Pressable onPress={onToggleInfo} style={{flex:2, padding:5, alignItems:"center"}}>
        <MaterialCommIcon name="information" color="rgba(255, 255, 255, 1)" size={24}/>
      </Pressable>
      <Pressable onPress={()=>goToDetail(id)} style={{flex:1, justifyContent:"center"}}>
        <EntypoIcon name="chevron-right" color="rgba(255, 255, 255, 1)" size={24}/>
      </Pressable>
    </View>
  )
}

function MemberList({staffData, groupData, activeChips, memberData, goToDetail}){
  function processData(staffData, groupData, activeChips, memberData){
    let staffs = [];
    let groups = [];
    let groupMember = [];
    let staffResult;
    let groupResult;

    if(activeChips == "staff"){
      staffs = _.filter(staffData, (staff)=>{
        return _.includes(memberData.staffMember, staff.id);
      });
      staffResult = staffs.map((staff)=>{
        return (<MemberListItem key={staff.id} staff={staff} goToDetail={goToDetail} activeChips={activeChips}/>)
      })
    }else if(activeChips == "group"){
      groups = _.filter(groupData, (group)=>{
        return _.includes(memberData.groupMember, group.id);
      });
      groupResult = groups.map((group)=>{
        groupMember = _.filter(staffData, (staff)=>{
          const memberIndex = _.findIndex(group.groupMemberId, (gm) => gm == staff.id);
          if(memberIndex >= 0) {return true;}
          else {return false;}
        });
        return (<MemberListItem key={group.id} group={group} groupMember={groupMember} goToDetail={goToDetail} activeChips={activeChips}/>)
      });
    }
    return(
      <ScrollView scrollEventThrottle={13}>
        { staffResult }
        { groupResult }
      </ScrollView>
    )
  }
  return(
    <View>
      {processData(staffData, groupData, activeChips, memberData)}
    </View>
  )
}

const WorkMemberScreen = ({navigation}) => {

  const staffD = [{id:"Staff1", firstName:"John", lastName:"Doe", address:"batulechour", email:"john@doe.com", phoneNumber:"9879898994"},
    {id:"Staff2", firstName:"Dow", lastName:"Ny", address:"bagar", email:"dow@ny.com", phoneNumber:"9845668994"},
    {id:"Staff3", firstName:"Joh", lastName:"Ny", address:"lamachour", email:"john@ny.com", phoneNumber:"9879897889"},
    {id:"Staff4", firstName:"Ram", lastName:"Ae", address:"bagar", email:"ram@ae.com", phoneNumber:"9845695994"},
    {id:"Staff5", firstName:"Shyam", lastName:"Me", address:"batulechour", email:"shyam@me.com", phoneNumber:"9879787889"}
  ];
  const groupD = [{id:"Group1", groupName:"lama gang", groupMemberId:["Staff2","Staff3","Staff4"]},
    {id:"Group2", groupName:"batu gang", groupMemberId:["Staff1","Staff5"]}
  ];

  const [activeChips, setActiveChips] = useState("staff")
  const [staffData, setStaffData] = useState(staffD);
  const [groupData, setGroupData] = useState(groupD);
  const [memberData, setMemberData] = useState({staffMember:[], groupMember:[]});
  const [showModal, setShowModal] = useState(false);

  const onPressBack = () => {
    navigation.navigate("Work");
  }
  
  const onPressAddMember = () => {
    setShowModal(true);
  }

  const onPressDoneAddMember = () => {
    setShowModal(false);
  }

  const onToggleMember = (id, memberIndex, activeChips) => {
    console.log("id, memberIndex, activeChips: ", id, memberIndex, activeChips);
    if(memberIndex == -1){
      const tempMemberData = _.cloneDeep(memberData);
      if(activeChips == "staff"){
        tempMemberData.staffMember.push(id);
      }else if(activeChips == "group"){
        tempMemberData.groupMember.push(id);
      }
      setMemberData(tempMemberData);
    }else{
      const tempMemberData = _.cloneDeep(memberData);
      if(activeChips == "staff"){
        _.remove(tempMemberData.staffMember, (staffMember)=>staffMember == id);
      }else if(activeChips == "group"){
        _.remove(tempMemberData.groupMember, (groupMember)=>groupMember == id);
      }
      setMemberData(tempMemberData);
    }
  }

  const goToDetail = (id) => {
    console.log("member id: ",id);
  }

  const onPressFilterChips = (type) => {
    setActiveChips(type);
  }

  return (
    <View style={{flex:1, backgroundColor:"rgba(26, 28, 82, 1)"}}>
      <Header title="To Do List" onPressBack={onPressBack}/>
      <FilterChips activeChips={activeChips} onPressFilterChips={onPressFilterChips}/>
      <View style={{justifyContent:"center", marginLeft:15, marginVertical:10}}>
        <Button buttonType="contained" text="Add member" onPress={onPressAddMember} style={{flexDirection:"row"}} 
        childrenStyle={{marginHorizontal:5}} buttonContainStyle={{marginRight:5}}>
          <View style={{borderRadius:50, borderWidth:1, alignSelf:"baseline", borderColor:"rgba(34, 224, 85, 1)"}}>
            <EntypoIcon name="plus" color="rgba(34, 224, 85, 1)" size={18}/>
          </View>
        </Button>
      </View>
      <AddMember showModal={showModal} onDone={onPressDoneAddMember} staffData={staffData} 
      memberData={memberData} groupData={groupData} onToggleMember={onToggleMember}/>
      <MemberList staffData={staffData} groupData={groupData} activeChips={activeChips} memberData={memberData} goToDetail={goToDetail}/>
    </View>
  )
}

export default WorkMemberScreen
