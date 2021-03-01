import React, { Component, useState } from 'react'
import { Text, View, Pressable, Image, StyleSheet, Platform, Button, ScrollView} from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import DateRangePicker from "react-native-daterange-picker"

import Awesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import {shadow} from 'lib/res'


function Header({title, onPressBack, onPressOption}){
  return(
    <View style = {{flexDirection:"row", backgroundColor:"rgba(62, 115, 222, 1)", alignItems:"center", padding:8, marginBottom:10, ...shadow.DP8 }}>
      <Pressable onPress={() => onPressBack()} style={{flex:1}}>
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

function DaysButton(){
  const weekDays = [
    {id:1, day:"Sunday", initial:"S", isSelected:false},
    {id:2, day:"Monday", initial:"M", isSelected:false},
    {id:3, day:"Tuesday", initial:"T", isSelected:false},
    {id:4, day:"Wednesday", initial:"W", isSelected:false},
    {id:5, day:"Thursday", initial:"T", isSelected:false},
    {id:6, day:"Friday", initial:"F", isSelected:false},
    {id:7, day:"Saturday", initial:"S", isSelected:false},
  ];
  const [day, setDay] = useState(weekDays);
  const toggleDayButton = (id)=>{
    const index = _.findIndex(day, (d)=>{
      return d.id == id;
    });
    let temp = _.cloneDeep(day);
    temp[index].isSelected = !temp[index].isSelected;
    setDay(temp);
  }
  return(
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    scrollEventThrottle={15}
    >
      {
        day.map((weekDay)=>{
          return(
            <Pressable key={weekDay.id} onPress={()=>toggleDayButton(weekDay.id)}  android_ripple={{color:"rgba(62, 115, 222, 1)", 
            radius:20,}}
            style={{borderWidth:weekDay.isSelected?0:2, borderColor:"rgba(176, 176, 176, 1)", borderRadius:50, width:40, height:40, marginHorizontal:7, marginVertical:10,
            backgroundColor:weekDay.isSelected?"rgba(62, 115, 222, 1)":"rgba(196, 196, 196, 0)", justifyContent:"center", alignItems:"center"}
            }>
              <Text style={{fontSize:20, color:"rgba(255,255,255,1)", padding:5}}>
                {weekDay.initial}
              </Text>
            </Pressable>
          )
        })
      }
    </ScrollView>
  )
}

function ActiveDays(){
  return(
    <View style={{marginHorizontal:10}}>
      <View>
        <Text style={{color:"rgba(255, 255, 255, 1)"}}>
          Active Days
        </Text>
      </View>
      <DaysButton/>
    </View>
  )
}

function TimePickerList({text1, text2, selectedTime="00:00"}){
  const [visibility, setVisibility] = useState(false);
  const [time, setTime] = useState(selectedTime);
  
  const handleConfirm = (date)=>{
    setVisibility(false);
    setTime(moment(date).format("h:mm a"));
  }
  const onPressCancel = ()=>{
    setVisibility(false);
  }
  const onPressButton = ()=>{
    setVisibility(true);
  }
  return(
    <View style={{flexDirection:"row", alignItems:"center", marginLeft:28, marginRight:10, marginVertical:5, padding:5}}>
      <View style={{flex:2}}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}>{text1}</Text>
      </View>
      <View style={{flex:4}}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}>{time}</Text>
      </View>
      <Pressable onPress = {onPressButton} android_ripple={{color:"rgba(26, 28, 82, 1)", 
        radius:70,}} style={{flex:4, justifyContent:"center", alignItems:"center", 
        padding:5, backgroundColor:"rgba(62, 115, 222, 1)", alignSelf:"baseline", borderRadius:4,
        ...shadow.DP2
      }}>
        <Text style={{color:"rgba(255, 255, 255, 1)", fontSize:14}}>
          {text2}
        </Text>
      </Pressable>
      <DateTimePickerModal 
        isVisible={visibility}
        onConfirm={handleConfirm}
        onCancel={onPressCancel}
        is24Hour={false}
        display="spinner"
        mode="time"
      />
    </View>
  )
}

class DateList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showCalendar:false,
      date: null,
      displayedDate: moment(),
      minDate: moment()
    };
  }
  setDates = (dates) => {
    this.setState({...dates});
  };
  onOpenCalendar = () => {
    this.setState({showCalendar:true});
  }
  onCloseCalendar = () => {
    this.setState({showCalendar:false});
  }
  render() {
    const { showCalendar, date, displayedDate, minDate} = this.state;
    const {text1, text2, disabled} = this.props;
    return (
      <View>
        <Pressable disabled={disabled} onPress={this.onOpenCalendar} android_ripple={{color:"rgba(26, 28, 82, 1)", 
        radius:60,}}
        style={{justifyContent:"center", alignItems:"center", marginLeft:28, marginRight:10, marginVertical:5, padding:5,
          backgroundColor:disabled?"rgba(176, 176, 176, 1)":"rgba(62, 115, 222, 1)", alignSelf:"baseline", paddingHorizontal:10,
          borderRadius:4, ...shadow.DP2
        }}>
          <Text style={{fontSize:14, color:"rgba(255, 255, 255,1)"}}>{text2}</Text>
        </Pressable>
        <View style={{flexDirection:"row", alignItems:"center", marginLeft:28, marginRight:10, marginVertical:5, padding:5}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{text1}</Text>
          </View>
          <View style={{flex:4}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{date == null?"Not selected":moment(date).format("D MMM YYYY")}</Text>
          </View>
        </View>
        <DateRangePicker
          onChange={this.setDates}
          showCalendar={showCalendar}
          onOpenCalendar={this.onOpenCalendar}
          onCloseCalendar={this.onCloseCalendar}
          minDate={minDate}
          date={date}
          displayedDate={displayedDate}
          headerTextStyle={{color:"rgba(255, 255, 255, 1)"}}
        />
      </View>
    );
  }
}

class DateRangeList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showCalendar:false,
      startDate: null,
      endDate: null,
      displayedDate: moment(),
      minDate: moment()
    };
  }
 
  setDates = (dates) => {
    this.setState({...dates});
  };
  onOpenCalendar = () => {
    this.setState({showCalendar:true});
  }
  onCloseCalendar = () => {
    this.setState({showCalendar:false});
  }
  render() {
    const { showCalendar ,startDate, endDate, displayedDate, minDate} = this.state;
    const { text1, text2, text3, disabled} = this.props;
    return (
      <View>
        <Pressable disabled={disabled} onPress={this.onOpenCalendar} android_ripple={{color:"rgba(26, 28, 82, 1)", 
        radius:100,}}
          style={{justifyContent:"center", alignItems:"center", marginLeft:28, marginRight:10, 
          marginVertical:5, padding:5, backgroundColor:disabled?"rgba(176, 176, 176, 1)":"rgba(62, 115, 222, 1)",
          alignSelf:"baseline", paddingHorizontal:10, borderRadius:4, ...shadow.DP2
        }}>
          <Text style={{fontSize:14, color:"rgba(255, 255, 255,1)"}}>{text3}</Text>
        </Pressable>
        <View style={{flexDirection:"row", alignItems:"center", marginLeft:28, marginRight:10, marginVertical:5, padding:5}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{text1}</Text>
          </View>
          <View style={{flex:4}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{startDate == null?"Not selected":moment(startDate).format("D MMM YYYY")}</Text>
          </View>
        </View>
        <View style={{flexDirection:"row", alignItems:"center", marginLeft:28, marginRight:10, marginVertical:5, padding:5}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{text2}</Text>
          </View>
          <View style={{flex:4}}>
            <Text style={{fontSize:14, color:disabled?"rgba(176, 176, 176, 1)":"rgba(255, 255, 255,1)"}}>{endDate == null?"Not selected":moment(endDate).format("D MMM YYYY")}</Text>
          </View>
        </View>
        <DateRangePicker
          onChange={this.setDates}
          showCalendar={showCalendar}
          onOpenCalendar={this.onOpenCalendar}
          onCloseCalendar={this.onCloseCalendar}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          range
          displayedDate={displayedDate}
          headerTextStyle={{color:"rgba(255, 255, 255, 1)"}}
        />
      </View>
    );
  }
}

function WorkHour(){
  return(
    <View style={{margin:10}}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <View style={{flex:1}}>
          <AntIcon name="clockcircleo" color="rgba(255, 255, 255, 1)" size={15}/>
        </View>
        <View style={{flex:14}}>
          <Text style={{color:"rgba(255, 255, 255, 1)"}}> Work Hour </Text>
        </View>
      </View>
      <TimePickerList text1="Starts" text2="Pick start time"/>
      <TimePickerList text1="Ends" text2="Pick end time"/>
    </View>
  )
}

function Date(){
  const [disabled, setDisabled] = useState({date:false, dateRange:true});
  const toggleRadioButton = () => {
    let tempDisabled = _.cloneDeep(disabled);
    tempDisabled.date = !tempDisabled.date;
    tempDisabled.dateRange = !tempDisabled.dateRange;
    setDisabled(tempDisabled);
  }
  
  return(
    <View style={{margin:10}}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <View style={{flex:1}}>
          <AwesomeIcon name="calendar" color="rgba(255, 255, 255, 1)" size={15}/>
        </View>
        <View style={{flex:14}}>
          <Text style={{color:"rgba(255, 255, 255, 1)"}}>
            Work Hour
          </Text>
        </View>
      </View>

      <View style={{flexDirection:"row", alignItems:"center"}}>
        <Pressable disabled={!disabled.date} onPress = {toggleRadioButton} android_ripple={{color:"rgba(62, 115, 222, 1)", 
        radius:15,}} style={{flex:1, padding:10, marginBottom:40, marginLeft:15, alignItems:"center"}}>
          {
            disabled.date?
            <MaterialCommIcon name="radiobox-blank" color="rgba(255, 255, 255, 1)" size={14}/>:
            <MaterialCommIcon name="radiobox-marked" color="rgba(62, 115, 222, 1)" size={14}/>
          }
        </Pressable>
        <View style={{flex:14}}>
          <DateList disabled={disabled.date} text1="Date" text2="Pick Date"/>
        </View>
      </View>

      <View style={{flexDirection:"row", alignItems:"center"}}>
        <Pressable disabled={!disabled.dateRange} onPress = {toggleRadioButton} android_ripple={{color:"rgba(62, 115, 222, 1)", 
        radius:15,}} style={{flex:1, padding:10, marginBottom:80, marginLeft:15, alignItems:"center"}}>
          {
            disabled.dateRange?
            <MaterialCommIcon name="radiobox-blank" color="rgba(255, 255, 255, 1)" size={14}/>:
            <MaterialCommIcon name="radiobox-marked" color="rgba(62, 115, 222, 1)" size={14}/>
          }
        </Pressable>
        <View style={{flex:14}}>
          <DateRangeList disabled={disabled.dateRange} text1="Starts" text2="Ends" text3="Pick Date Range"/>
        </View>
      </View>

    </View>
  )
}

class DateTimeScreen extends Component{
  onPressBack = () => {
    console.log("datetimescreen")
    const {navigation} = this.props;
    navigation.navigate("Work");
  }
  render(){
    return(
      <View style={{flex:1, backgroundColor:"rgba(26, 28, 82, 1)"}}>
        <Header title = "Date and time" onPressBack={this.onPressBack}/>
        <ActiveDays/>
        <WorkHour/>
        <Date/>
      </View>
    )
  }
}
export default DateTimeScreen