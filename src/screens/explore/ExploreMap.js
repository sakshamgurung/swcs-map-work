/**
 * @flow
 */
import React, { Component} from 'react';
import { Dimensions,StyleSheet, View, Text, PermissionsAndroid, Platform, 
  Alert, TextInput, ScrollView, Keyboard } from 'react-native';
/* Other dependencies */
import MapView,{ PROVIDER_GOOGLE, Polygon, Polyline, AnimatedRegion, Marker, Callout } from 'react-native-maps';
import {default as MapViewCluster} from 'react-native-map-clustering';
import Geolocation from 'react-native-geolocation-service'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
/** Utilities */
import {getRegionFromMarkers, grahamScan, isPointInsidePolygon, getCheckpoints} from 'lib/utilities';
import _ from 'lodash';
/** Components */
import Slider from '@react-native-community/slider';
import {FAB, Button, Chips} from 'lib/components/button';
import {CustomModal, BottomSheetList, SearchModal, BottomSheetInfo} from 'lib/components/card';
import {CheckpointMarker} from 'lib/components/customMarker';
import {MapEditPanel} from 'lib/components/frame';
import {DummySearchBox} from 'lib/components/input';
/** res */
import {shadow, colors} from 'lib/res';
import {mapStyle} from './style';

import {trackContains, zoneContains, getObjects, getTrackWasteData} from 'mock/explore/MockServer';

class Point {
  constructor(c, identifier) {
    this.latitude = c.latitude;
    this.longitude = c.longitude;
    this.identifier = identifier;
  }

  get x(): number {
    return this.latitude;
  }

  set x(value: number) {
    this.latitude = value;
  }

  get y(): number {
    return this.longitude;
  }

  set y(value: number) {
    this.longitude = value;
  }
}

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
export default class ExploreMap extends Component {
  _currentRegion:AnimatedRegion;
  constructor() {
    super();
    this._currentRegion = new MapView.AnimatedRegion({
      latitude: 28.2674,
      longitude: 83.9750,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15});
    this.state = {
      categories: [
        {
          name: 'Today\'s jobs',
          id: 'c1'
          //icon: <Ionicons name="ios-restaurant" style={styles.chipsIcon} size={18} />,
        },
        {
          name: 'Active jobs',
          id: 'c2'
          //icon: <Ionicons name="md-restaurant" style={styles.chipsIcon} size={18} />,
        },
        {
          name: 'Staff',
          id: 'c3'
          //icon: <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />,
        },
        {
          name: 'Vehicles',
          id: 'c4'
          //icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
        }
      ],
      region:{
        latitude: 28.2674,
        longitude: 83.9750,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121},
      dimensions: {window,screen}, hasMapPermission:false,
      showDefaultPanel:true, mapSearchVisible:true, mapSearchFocused:false, searchQuery:"",
      showZonePanel:false,
      showTrackPanel:false, showTrackPanelState1:false,
      nameModalVisible:false, nameModalValue:"",
      currentMarkerID:"",
      zone:[], queryZone:[], fullQueryZone:[],
      zonePoints: [],
      track:[], queryTrack:[], fullQueryTrack:[],
      trackPoints:[], trackCheckPoints:[], interval:50,
      selectedTrackIndex:-1, selectedZoneIndex:-1,
      trackWasteData:{},
    };
  }

  async componentDidMount(): void {
    Dimensions.addEventListener("change", this.onChange);
    this.requestFineLocation();
    this.makeRemoteRequest();
  }
  componentWillUnmount(): void{
    Dimensions.removeEventListener("change", this.onChange);
    if(this.watchId){
      Geolocation.clearWatch(this.watchId);
    }
  }
  /** fetching data */ 
  makeRemoteRequest = _.debounce(async() => {
    const objects = await getObjects(this.state.searchQuery);
    this.setState({track:objects.trackDataResult, zone:objects.zoneDataResult,
      queryTrack:objects.trackDataResult, queryZone:objects.zoneDataResult,
      fullQueryTrack:objects.trackDataResult, fullQueryZone:objects.zoneDataResult
    });
  },0);

  makeRequestForWasteData = async(trackID, index) => {
    const trackWasteData = await getTrackWasteData(trackID);
    //after setting selectedTrackIndex checkpoints appears and bottomsheet of info
    this.setState({trackWasteData, selectedTrackIndex:index});
  }

  /**location handlers*/
  async requestFineLocation() {
    try {
        if(Platform.OS === 'android'){
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          //To Check, If Permission is granted
          if (granted === PermissionsAndroid.RESULTS.GRANTED){
            this.setState({hasMapPermission:true});
            this.watchId = Geolocation.watchPosition(pos => {
              const region={
                latitude:pos.coords.latitude,
                longitude:pos.coords.longitude, 
                latitudeDelta:0.15,
                longitudeDelta:0.15};
              this._currentRegion.setValue(region);
            });
          }
        }
    } catch (err) {
        console.warn("Permissioin denied: ",err);
    }
  }
  /** Generic Handlers */
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  }
  
  _onRegionChangeComplete = (region) => {
    this._currentRegion.setValue(region);
    this.setState({region});
  }

  /** Button Handlers */

  _showAll = () => {
    const points = this.state.zonePoints;
    const region = getRegionFromMarkers(points);
    this._currentRegion
      .timing({...region, duration:1000})
      .start();
  };

  _onPressDone = (panelName) => {
    if(panelName == "zone"){
      if(this.state.zonePoints.length >=3){
        const zoneID = `${ Date.now() }.${ Math.random() }`;
        const zonePoints = this.state.zonePoints;
        const zoneName = this.state.nameModalValue;
        const newZone = _.cloneDeep({zoneID, zoneName, zonePoints});
        const zone = _.cloneDeep([...this.state.zone,newZone]);
        this.setState({zone, zonePoints:[], currentMarkerID:"", nameModalValue:"", 
        nameModalVisible:false, showZonePanel:false, showDefaultPanel:true, mapSearchVisible:true});
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(panelName == "track"){
      if(this.state.trackPoints.length >=2){
        const trackID = `${ Date.now() }.${ Math.random() }`;
        const trackPoints = this.state.trackPoints;
        const trackCheckPoints = this.state.trackCheckPoints;
        const trackName = this.state.nameModalValue;
        const newTrack = _.cloneDeep({trackID, trackName, trackPoints, trackCheckPoints});
        const track = _.cloneDeep([...this.state.track,newTrack]);
        this.setState({track, trackPoints:[],trackCheckPoints:[], interval:50, currentMarkerID:"",
          nameModalValue:"", nameModalVisible:false, showTrackPanel:false, showDefaultPanel:true,
          mapSearchVisible:true});
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
  }

  _onPressCancel = (panelName) => {
    if(panelName == "zone"){
      if(this.state.zonePoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [
            {
              text: "No"
            },
            { 
              text: "Yes", onPress: () => {
              this.setState({points:[], showZonePanel:false, currentMarkerID:"", showDefaultPanel:true, mapSearchVisible:true});
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.setState({showZonePanel:false, showDefaultPanel:true, currentMarkerID:"", mapSearchVisible:true});
      }
    }
    if(panelName == "track"){
      if(this.state.trackPoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [{
              text: "No"
            },{ 
              text: "Yes", onPress: () => {
              this.setState({trackPoints:[], trackCheckPoints:[], showTrackPanel:false, currentMarkerID:"",
                showDefaultPanel:true, mapSearchVisible:true});
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.setState({showTrackPanel:false, showDefaultPanel:true, currentMarkerID:"", mapSearchVisible:true});
      }
    }
  }  
  _onPressMoveTo = (from, to) => {
    if(from == "zone" && to == "nameModal"){
      if(this.state.zonePoints.length >= 3 ){
        this.setState({nameModalVisible:true});
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "trackPanel" && to == "trackPanelState1"){
      if(this.state.trackPoints.length >= 2 ){
        this.setState({showTrackPanel:false, showTrackPanelState1:true});
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "trackPanelState1" && to == "trackPanel"){
      this.setState({showTrackPanelState1:false, showTrackPanel:true, trackCheckPoints:[], interval:50});
    }
  }
  _getMarkerKey = (markerId) => {
    console.log("markerId ",markerId);
    //const markerId = e._targetInst.return.key;
    this.setState({currentMarkerID:markerId});
  }
  _onDragReposition = (e, markerOf) => {
    if(markerOf == "track"){
      let id = e._targetInst.return.key;
      let index = _.findIndex(this.state.trackPoints, (o) => o.identifier == id);
      const newPoint = new Point(e.nativeEvent.coordinate, this.state.trackPoints[index].identifier);
      const trackPoints = _.cloneDeep(this.state.trackPoints);
      trackPoints[index] = _.cloneDeep(newPoint);
      this.setState({trackPoints});
    }
  }
  _onMapPress = (e) => {
    this.setState({selectedTrackIndex:-1, currentMarkerID:""});
    this.setState({selectedZoneIndex:-1});
  }
  // Zone panel button handlers
  _onPressAddZone = () => {
    this.setState({showDefaultPanel:false, mapSearchVisible:false, 
      selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerID:"",showZonePanel:true});
  }

  _onPressAddZonePoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    const coordinate = {latitude, longitude};
    const newPoint = new Point(coordinate, `${ Date.now() }.${ Math.random() }`);
    const rawPoints = _.cloneDeep([...this.state.zonePoints, newPoint]);
    if(rawPoints.length <=3){
      this.setState({zonePoints:rawPoints});
      return;
    }
    const zonePoints = grahamScan(rawPoints);
    this.setState({ zonePoints });
  }

  _onPressDeleteZonePoint = () => {
    const markerId = this.state.currentMarkerID;
    let removeIndex = 0;
    this.state.zonePoints.map((zonePoint, index)=>{
      if(zonePoint.identifier == markerId) {
        removeIndex = index;
      }
    });
    const zonePoints = _.cloneDeep(this.state.zonePoints);
    zonePoints.splice(removeIndex,1);
    this.setState({zonePoints});
  }
  // Track panel button handlers
  _onPressAddTrack =()=> {
    this.setState({showDefaultPanel:false, mapSearchVisible:false, 
      selectedTrackIndex:-1, selectedZoneIndex:-1, currentMarkerID:"", showTrackPanel:true});
  }
  _onPressAddTrackPoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    const coordinate = {latitude, longitude};
    const newPoint = new Point(coordinate, `${ Date.now() }.${ Math.random() }`);
    //let n = this.state.zonePoints.length;
    //if(isPointInsidePolygon(this.state.zonePoints, n, newPoint)){
    const trackPoints = _.cloneDeep([...this.state.trackPoints, newPoint]);
    this.setState({trackPoints});
    // }else{
    //   Alert.alert("Track point not inside the zone","",[],{cancelable:true});
    // }
  }
  _onPressProcessCheckpoint = () => {
    if(this.state.trackPoints.length >=2){
      const trackCheckPoints = getCheckpoints(this.state.trackPoints,this.state.interval);
      const temp = [];
      for (let i = 0; i<trackCheckPoints.length; i++) {
        const newPoint = new Point(
          {latitude:trackCheckPoints[i].x,longitude:trackCheckPoints[i].y}
          , `${ Date.now() }.${ Math.random() }`);
        temp.push(newPoint);
      }
      this.setState({trackCheckPoints:temp});
    }
  }
  _onPressDeleteTrackPoint = () => {
    const markerId = this.state.currentMarkerID;
    let removeIndex = 0;
    this.state.trackPoints.map((trackPoint, index)=>{
      if(trackPoint.identifier == markerId) {
        removeIndex = index;
      }
    });
    const trackPoints = _.cloneDeep(this.state.trackPoints);
    trackPoints.splice(removeIndex,1);
    this.setState({trackPoints});
  }
  _onPressTrack = (e) => {
    const trackID = e._targetInst.return.key;
    let index = _.findIndex(this.state.track, (o) => {return o.trackID == trackID});
    this.makeRequestForWasteData(trackID, index);
    //this.setState({selectedTrackIndex:index});
  }
  _onPressZone = (e) => {
    const zoneID = e._targetInst.return.key;
    let index = _.findIndex(this.state.zone, (o) => {return o.zoneID == zoneID});
    this.setState({selectedZoneIndex:index});
  }

  /** Renderers */
  // Zone renderers
  _renderAddZonePolygon = () => {
    if(this.state.showZonePanel){
      if(this.state.zonePoints.length >= 3){
        return(
          <Polygon coordinates={ this.state.zonePoints } fillColor="rgba(9,176,73,0.50)" strokeColor="rgba(9,176,73,0.50)"/>  //greenish color
        );
      }
      return(
        <Polyline coordinates={ this.state.zonePoints } strokeColor="rgba(9,176,73,0.50)" />  
      );
    }
  }
  _renderAddZonePolygonMarkers =() => {
    if(this.state.showZonePanel){
      if(this.state.zonePoints.length >=1){
        return(
          this.state.zonePoints.map((m) => (
            <Marker
              key={ m.identifier }
              coordinate={ m }
              onPress={e => this._getMarkerKey(e)}
            >
              <Callout onPress={this._onPressDeleteZonePoint}>
                <Text>Delete Point</Text>
              </Callout>
            </Marker>
          ))
        );
      }
    }
  }
  _renderZonePolygon = () => {
    if(this.state.zone.length != 0){
      return(
        this.state.zone.map(z => (
          <Polygon key={z.zoneID} coordinates={z.zonePoints}
          tappable={true} 
          fillColor="rgba(75, 150, 235,0.50)" strokeColor="rgba(75, 150, 235,0.50)"/> //bluish color
        ))
      )
    }
  }

  // Track renderers
  _renderAddTrackPolyline = () => {
    if(this.state.showTrackPanel || this.state.showTrackPanelState1){
      return(
        <Polyline coordinates={this.state.trackPoints} strokeColor="rgba(242, 180, 65, 0.80)" strokeWidth={5}/>
      )
    }
  }
  _renderAddTrackPolylineMarkers = () => {
    if(this.state.showTrackPanel){
      if(this.state.trackPoints.length >=1){
        return(
          this.state.trackPoints.map((m) => (
            <Marker
              key={ m.identifier }
              coordinate={ m }
              draggable = {true}
              onDragEnd = {(e)=> {this._onDragReposition(e, "track")}}
              onPress={e => this._getMarkerKey(e)}
            >
              <Callout onPress={this._onPressDeleteTrackPoint}>
                    <Text>Delete Point</Text>
              </Callout>
            </Marker>
          ))
        );
      }
    }
  }
  _renderTrackCheckPoints = () => {
    if(this.state.trackCheckPoints.length >=2 && this.state.showTrackPanelState1){
      return(
        this.state.trackCheckPoints.map((t) => 
        <CheckpointMarker key={t.identifier} coordinate={{latitude:t.latitude,longitude:t.longitude}} 
        onPress={e => this._getMarkerKey(e)}/>
        )
        );
      }
  }
  _renderTrackPolyline = () => {
    if(this.state.track.length != 0){
      return(
        this.state.track.map(t => (
          <Polyline 
          tappable = {true}
          onPress = {e => this._onPressTrack(e)}
          key={t.trackID} coordinates={t.trackPoints} 
          strokeColor="rgba(245, 146, 24, 0.80)" strokeWidth={5}/> //bluish color
        ))
      )
    }
  }

  // Renderers on top of default panels
  _renderDummySearchBox = () => {
    if(this.state.mapSearchVisible){
      return(
        <DummySearchBox
          onPress = {()=>this.setState({mapSearchFocused:true, mapSearchVisible:false})}
          rightIcon = {
            <Button buttonType="iconOnly" icon={<IonIcons name="ios-search" color="#000" size={20}/>}/>
          }
        />)
    } 
    return null;
  }  
  _renderChips = () => {
    if(this.state.mapSearchVisible){
      return(
        <ScrollView
          horizontal scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false} height={50}
          style={styles.chipsScrollView}
          contentContainerStyle={{
            paddingRight: 20
          }}
        >
          {this.state.categories.map((category) => (
            <Chips
             name = {category.name} key={category.id}
            onPress = {() => {console.log("chips: ",category.id)}}/>
          ))}
        </ScrollView>
      )
    }else return null;
  }
  _renderSelectedTrackCheckPoints = () => {
    if((this.state.showDefaultPanel) && (this.state.selectedTrackIndex >= 0)){
      let index = this.state.selectedTrackIndex;
      return(
        this.state.track[index].trackCheckPoints.map((t) => 
          <CheckpointMarker key={t.identifier} coordinate={{latitude:t.latitude,longitude:t.longitude}} 
          onPress={() => this._getMarkerKey(t.identifier)}/>
        )
      );
    }
  }
  _renderSelectedZoneMarker = () => {
    if((this.state.showDefaultPanel) && (this.state.selectedZoneIndex >= 0)){
      let index = this.state.selectedZoneIndex;
      return(
        this.state.zone[index].zonePoints.map((zp) => 
          <Marker 
            key = {zp.identifier}
            coordinate = {zp}
          />
        )
      );
    }
  }
  _renderInfoEditFooter = ()=>{
    if(this.state.showDefaultPanel && this.state.selectedTrackIndex >=0 ){
      let trackName = this.state.track[this.state.selectedTrackIndex].trackName;
      const {totalWasteSummary, allCheckPointWasteSummary} = this.state.trackWasteData;
      if(this.state.currentMarkerID == ""){
        return(
          <BottomSheetInfo title={trackName} data={totalWasteSummary.totalWasteSummary} dataPresent={true}/>
        )
      }else{
        const index = _.findIndex(allCheckPointWasteSummary,(s)=>{
          return s.trackCheckPointRef == this.state.currentMarkerID;
        });
        if(index != -1){
          return(
            <BottomSheetInfo title={trackName} data={allCheckPointWasteSummary[index].wasteSummary} dataPresent={true}/>
          )
        }else{
          return(
            <BottomSheetInfo title={trackName} dataPresent={false}/>
          )
        }
      }
    }else return null;
  }

  // Panel renderers
  _renderPanel = () => {
    if(this.state.showDefaultPanel){
      return(
        <View style={styles.defaultPanelStyle}>
          <FAB style={styles.FABStyle}
            option1 = {<Button text="Add zone" buttonType="contained" onPress={this._onPressAddZone}/>}
            option2 = {<Button text="Add track" buttonType="contained" onPress={this._onPressAddTrack}/>}
          />
        </View>
      )
    }
    if(this.state.showZonePanel){
      return(
        <MapEditPanel
          headerTitle = "Create Zone"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
            onPress={() => this._onPressCancel("zone")}/>
          }
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
            onPress={() => this._onPressMoveTo("zone", "nameModal")}/>
          }
          footer = {<Button text="Add zone point" buttonType="contained" onPress={this._onPressAddZonePoint}/>}
          modal = {this.nameModalObject("zone")}
        />
      )
    }
    if(this.state.showTrackPanel){
      return(
        <MapEditPanel 
          headerTitle = "Create Track"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel("track")}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanel", "trackPanelState1")}
            />}
          footer = {<Button text="Add track point" buttonType="contained" onPress={this._onPressAddTrackPoint}/>}
        />
      )
    }
    if(this.state.showTrackPanelState1){
      return(
        <MapEditPanel 
          headerTitle = "Process checkpoint"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-left" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanelState1", "trackPanel")}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this.setState({nameModalVisible:true})}
            />}
          footer = {
            <View style={{flex:1, flexDirection:"row"}}>
              <Slider 
                style={{width:"60%"}} minimumValue = {50} maximumValue = {200} minimumTrackTintColor = {colors.button}
                step = {50} onValueChange = {(i)=>this.setState({interval:i})} />
              <View style = {{alignSelf:"baseline", width:40, borderRadius:4, borderColor:"black", marginHorizontal:5}}>
                <Text style = {{flex:1, fontSize:15, padding:5}}>{this.state.interval}</Text>
              </View>
              <Button text="Process" buttonType="contained" onPress={this._onPressProcessCheckpoint}/>
            </View>
          }
          modal = {this.nameModalObject("track")}
        />
      )
    }
  }
  handleSearchQuery = (text) => {
    const formatedQuery = text.toLowerCase();
    const trackDataResult = _.filter(this.state.fullQueryTrack, td => {
      return trackContains(td, formatedQuery);
    });
    const zoneDataResult = _.filter(this.state.fullQueryZone, zd => {
    return zoneContains(zd, formatedQuery);
    });
    this.setState({queryTrack:trackDataResult, queryZone:zoneDataResult,
      searchQuery:formatedQuery
    }, () => this.makeRemoteRequest());
  }
  _renderSearchList = () => {
    if(this.state.mapSearchFocused){
      return(
        <SearchModal
          autoFocus = {true}
          onRequestClose = {()=> this.setState({mapSearchFocused:false, mapSearchVisible:true})}
          onChangeText = {text => this.handleSearchQuery(text)}
          value = {this.state.searchQuery}
          onPressBack = {()=> this.setState({mapSearchFocused:false, mapSearchVisible:true})}
          onPressClear = {()=>this.setState({searchQuery:""})}
          trackData = {this.state.queryTrack}
          zoneData = {this.state.queryZone}
        />
      )
    }
  }
  handleNameModalText(text){
    this.setState({nameModalValue:text});
  }
  nameModalObject(modalFor){
    if(this.state.nameModalVisible && modalFor=="track"){
      return(
        <CustomModal 
          visible = {this.state.nameModalVisible}
          onRequestClose = {() => this.setState({nameModalVisible:false})}
          onPressTouchableOpacity = {() => this.setState({nameModalVisible:false})}
          title = "Track Name"
          content = {
            <TextInput
              autoCorrect = {false}
              keyboardType = "visible-password" underlineColorAndroid = "transparent"
              style={{height:50, borderBottomWidth:1,
                borderRadius:4, borderColor:colors.button, width:"80%", textAlignVertical:"bottom",fontSize:15}}
              onChangeText={text => this.handleNameModalText(text)}
              value = {this.state.nameModalValue} placeholder = "Track Name"
            />
          }
          footerContent1 = {<Button text="Cancel" buttonType="contained" onPress={() => this.setState({ nameModalValue:"", nameModalVisible:false})}/>}
          footerContent2 = {<Button text="Done" buttonType="contained" onPress={() => this._onPressDone("track")}/>}
        />
      )
    }
    if(this.state.nameModalVisible && modalFor == "zone"){
      return(
        <CustomModal 
          visible = {this.state.nameModalVisible}
          onRequestClose = {() => this.setState({nameModalVisible:false})}
          onPressTouchableOpacity = {() => this.setState({nameModalVisible:false})}
          title = "Zone Name"
          content = {
            <TextInput
              autoCorrect = {false}
              keyboardType = "visible-password" underlineColorAndroid = "transparent"
              style={{height:50, borderBottomWidth:1,
                borderRadius:4, borderColor:colors.button, width:"80%", textAlignVertical:"bottom",fontSize:15}}
              onChangeText={text => this.handleNameModalText(text)}
              value = {this.state.nameModalValue} placeholder = "Zone Name"
            />
          }
          footerContent1 = {<Button text="Cancel" buttonType="contained" onPress={() => this.setState({ nameModalValue:"", nameModalVisible:false})}/>}
          footerContent2 = {<Button text="Done" buttonType="contained" onPress={() => this._onPressDone("zone")}/>}
        />
      )
    }
  }

  // Main renderers
  render() {
    return (
      <View style={ styles.container}>
        <MapView.Animated
          customMapStyle = {mapStyle}
          onPress = {this._onMapPress}
          //showsUserLocation
          followsUserLocation
          provider={ PROVIDER_GOOGLE }
          region={this._currentRegion}
          onRegionChangeComplete={ this._onRegionChangeComplete }
          style={styles.mapViewContainer }
        >
            {this._renderAddZonePolygon()}
            {this._renderAddZonePolygonMarkers()}
            {this._renderZonePolygon()}

            {this._renderAddTrackPolyline()}
            {this._renderAddTrackPolylineMarkers()}
            {this._renderTrackPolyline()}
            {this._renderTrackCheckPoints()}

            {this._renderSelectedTrackCheckPoints()}
        </MapView.Animated>
        {this._renderDummySearchBox()}
        {this._renderSearchList()}
        {this._renderChips()}
        <MaterialIcon name="crosshairs" color="#000" size={15} style={styles.crosshairIcon}/>
        {this._renderPanel()}
        {this._renderInfoEditFooter()}
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex:1
  },
  mapViewContainer: {
    ...StyleSheet.absoluteFillObject
  },
  chipsScrollView: {
    position:'absolute', 
    top:80, 
    paddingHorizontal:10
  },
  defaultPanelStyle:{
    position:"absolute",
    alignSelf:"flex-end",
    top:"80%"
  },
  FABStyle:{
    //alignSelf:"flex-end",
    marginRight:10,
  },
  crosshairIcon:{
    position:"absolute",
    alignSelf:"center",
    top:"48.6%"
  },
});
