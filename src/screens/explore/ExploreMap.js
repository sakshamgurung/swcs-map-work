/**
 * @flow
 */
import React, { Component} from 'react';
import {connect} from 'react-redux';
//action creator
import {actions as exploreActions} from 'ducks/explore';
import {types as exploreActionTypes} from 'ducks/explore';
import { Dimensions, StyleSheet, View, Text, PermissionsAndroid, Platform, 
  Alert, TextInput, ScrollView} from 'react-native';
/* Other dependencies */
import MapView,{ PROVIDER_GOOGLE, Polygon, Polyline, AnimatedRegion, Marker, Callout } from 'react-native-maps';
import {default as MapViewCluster} from 'react-native-map-clustering';
import Geolocation from 'react-native-geolocation-service'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
/** Utilities */
import {grahamScan, getCheckpoints} from 'lib/utilities';
import _ from 'lodash';
/** Components */
import Slider from '@react-native-community/slider';
import {FAB, Button, Chips} from 'lib/components/button';
import {CustomModal, SearchModal, BottomSheetInfo} from 'lib/components/card';
import {CheckpointMarker} from 'lib/components/customMarker';
import {MapEditPanel} from 'lib/components/frame';
import {DummySearchBox, MapSearch as ChipsFilterSearch} from 'lib/components/input';
/** res */
import {shadow, colors} from 'lib/res';
import {mapStyle} from './style';

import {trackContains, zoneContains} from 'mock/explore/MockServer';
import { bindActionCreators } from 'redux';

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
// using ES6 class
class ExploreMap extends Component {
  _currentRegion:AnimatedRegion;
  constructor() {
    super();
    this._currentRegion = new MapView.AnimatedRegion({
      latitude: 28.2674,
      longitude: 83.9750,
      latitudeDelta: 0.10,
      longitudeDelta: 0.10});
    this.references = {};
    //this._mapViewRef = React.createRef();
  }

  componentDidMount(){
    this.requestFineLocation();
    this._makeRemoteRequest();
  }
  componentWillUnmount(){
    Dimensions.removeEventListener("change", this.onChange);
    if(this.watchId){
      Geolocation.clearWatch(this.watchId);
    }
  }
  /** fetching data */ 
  _makeRemoteRequest = _.debounce(() => {
    this.props.thunkLoadGeoObjects(this.props.searchQuery);
  },500);
  
  _makeRequestForWorkData(geoObjectId, selectedGeoObjectIndex, workDataOf, infoType){
    this.props.thunkLoadGeoObjectWork(geoObjectId, selectedGeoObjectIndex, workDataOf, infoType);
    return new Promise((resolve, reject)=> resolve());
  }

  _makeRequestForWasteData(geoObjectId, selectedGeoObjectIndex, wasteDataOf){
    //after setting selectedTrackIndex checkpoints appears and bottomsheet of info
    this.props.thunkLoadGeoObjectWaste(geoObjectId, selectedGeoObjectIndex, wasteDataOf);
  }

  /**location handlers*/
  async requestFineLocation() {
    try {
      if(Platform.OS === 'android'){
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        //To Check, If Permission is granted
        if (granted === PermissionsAndroid.RESULTS.GRANTED){
          this.watchId = Geolocation.watchPosition(position => {
            const region={
              latitude:position.coords.latitude,
              longitude:position.coords.longitude, 
              latitudeDelta:0.15,
              longitudeDelta:0.15};
            this._currentRegion.setValue(region);
            //this.props.locationGranted(position);
          });
        }
      }
    } catch (err) {
      this.props.locationDenied(err);
      console.warn("Permissioin denied: ",err);
    }
  }
  //using class field syntax
  _onRegionChangeComplete = (region) => {
    this._currentRegion.setValue(region);
    //this.props.changeRegion(region);
  }
  _showAll = (coordinate) => {
    const region = {
      ...coordinate,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15
    }
    this._currentRegion
      .timing({ ...region,duration: 1000})
      .start();
  };
  /** Button Handlers */

  _onPressDone = (panelName) => {
    if(panelName == "zone"){
      if(this.props.zonePoints.length >=3){
        const zoneId = `${ Date.now() }.${ Math.random() }`;
        const zonePoints = this.props.zonePoints;
        const zoneName = this.props.nameModalValue;
        const newZone = _.cloneDeep({zoneId, zoneName, zonePoints});
        const zone = [...this.props.zone,newZone];
        this.props.doneZonePanel(zone);
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(panelName == "track"){
      if(this.props.trackPoints.length >=2){
        const trackId = `${ Date.now() }.${ Math.random() }`;
        const trackPoints = this.props.trackPoints;
        const trackCheckpoints = this.props.trackCheckpoints;
        const trackName = this.props.nameModalValue;
        const newTrack = _.cloneDeep({trackId, trackName, trackPoints, trackCheckpoints});
        const track = [...this.props.track,newTrack];
        this.props.doneTrackPanel2(track);
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
  }
  _onPressCancel = (panelName) => {
    if(panelName == "zone"){
      if(this.props.zonePoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [{text: "No"},{ 
              text: "Yes", onPress: () => {
              this.props.cancelZonePanel();
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.props.cancelZonePanel();
      }
    }
    if(panelName == "track"){
      if(this.props.trackPoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [{text: "No"},{
              text: "Yes", onPress: () => {
              this.props.cancelTrackPanel2();
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.props.cancelTrackPanel2();
      }
    }
  }  
  _onPressMoveTo = (from, to) => {
    if(from == "zone" && to == "nameModal"){
      if(this.props.zonePoints.length >= 3 ){
        this.props.toggleNameModal();
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "trackPanel1" && to == "trackPanel2"){
      if(this.props.trackPoints.length >= 2 ){
        this.props.toggleTrackPanels();
        this.props.intervalChanged(150);
        this._onPressProcessCheckpoint();
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "trackPanel2" && to == "trackPanel1"){
      this.props.toggleTrackPanels();
    }
  }
  _getMarkerKey = (e, identifier = "", coordinate = "" ) => {
    let markerId = "";
    if(identifier != ""){
      markerId = identifier;
    }else{
      //e is SyntheticEvent use e.persist() to see the event value if needed
      markerId = e._targetInst.return.key;
    }
    console.log("_getMarkerKey: ",markerId);
    this.props.markerSelected(markerId);
    if(coordinate != ""){
      //this._showAll(coordinate);
    }
  }
  _onDragReposition = (e, markerOf) => {
    if(markerOf == "track"){
      let id = e._targetInst.return.key;
      let index = _.findIndex(this.props.trackPoints, (o) => o.identifier == id);
      const newPoint = new Point(e.nativeEvent.coordinate, this.props.trackPoints[index].identifier);
      const trackPoints = _.cloneDeep(this.props.trackPoints);
      trackPoints[index] = _.cloneDeep(newPoint);
      this.props.dragTrackMarker(trackPoints);
    }else if(markerOf == "zone"){
      let id = e._targetInst.return.key;
      let index = _.findIndex(this.props.zonePoints, (o) => o.identifier == id);
      const newPoint = new Point(e.nativeEvent.coordinate, this.props.zonePoints[index].identifier);
      const zonePoints = _.cloneDeep(this.props.zonePoints);
      zonePoints[index] = _.cloneDeep(newPoint);
      if(zonePoints.length <=3){
        this.props.dragZoneMarker(zonePoints);
      }else{
        const tempZonePoints = grahamScan(zonePoints);
        this.props.dragZoneMarker(tempZonePoints);
      }
    }
  }
  _onMapPress = (e) => {
    this.props.dismissSelectedGeoObject();
  }
  _onPressChips = (type, query, id ) => {
    this.props.thunkChipsSelected(type, query, id);
    
  }
  // Zone panel button handlers
  _toggleZonePanel = () => {
    this.props.togglePanel(exploreActionTypes.SHOW_ZONE_PANEL);
  }

  _onPressAddZonePoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    const coordinate = {latitude, longitude};
    const newPoint = new Point(coordinate, `${ Date.now() }.${ Math.random() }`);
    const rawPoints = _.cloneDeep([...this.props.zonePoints, newPoint]);
    if(rawPoints.length <=3){
      this.props.addZonePoint(rawPoints);
      return;
    }
    const zonePoints = grahamScan(rawPoints);
    this.props.addZonePoint(zonePoints);
  }

  _onPressDeleteZonePoint = () => {
    const markerId = this.props.currentMarkerId;
    let removeIndex = 0;
    this.props.zonePoints.map((zonePoint, index)=>{
      if(zonePoint.identifier == markerId) {
        removeIndex = index;
      }
    });
    this.props.deleteZonePoint(removeIndex);
  }
  _onPressZone = (e, key = "", from = "default") => {
    //zoneSelected() action creator not used yet
    let zoneId = "";
    if(key == ""){
      zoneId = e._targetInst.return.key;
    }else {
      zoneId = key;
    }
    let index = _.findIndex(this.props.zone, (o) => {return o.zoneId == zoneId});
    if(from == "list"){
      this._onCloseSearchBox();
    }
    this._makeRequestForWorkData(zoneId, index, "zone", "summary")
    .then(()=>{
      this._makeRequestForWasteData(zoneId, index, "zone");
    });
  }
  // Track panel button handlers
  _toggleTrackPanel = ()=> {
    this.props.togglePanel(exploreActionTypes.SHOW_TRACK_PANEL_1);
  }
  _onPressAddTrackPoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    const coordinate = {latitude, longitude};
    const newPoint = new Point(coordinate, `${ Date.now() }.${ Math.random() }`);
    //let n = this.props.zonePoints.length;
    //if(isPointInsidePolygon(this.props.zonePoints, n, newPoint)){
    const trackPoints = _.cloneDeep([...this.props.trackPoints, newPoint]);
    this.props.addTrackPoint(trackPoints);
    // }else{
    //   Alert.alert("Track point not inside the zone","",[],{cancelable:true});
    // }
  }
  _preetifier(data){
    for(let i=0; i<data.length; i++){
      console.log(data[i],"\n");
    }
  }
  _onPressProcessCheckpoint = () => {
    if(this.props.trackPoints.length >=2){
      const trackCheckpoints = getCheckpoints(this.props.trackPoints, this.props.interval);
      this.props.checkpointsProcessed(trackCheckpoints);
    }
  }
  _onPressDeleteTrackPoint = () => {
    const markerId = this.props.currentMarkerId;
    let removeIndex = 0;
    this.props.trackPoints.map((trackPoint, index)=>{
      if(trackPoint.identifier == markerId) {
        removeIndex = index;
      }
    });
    this.props.deleteTrackPoint(removeIndex);
  }
  _onPressTrack = (e, key = "", from = "default") => {
    //trackSelected() action creator not used yet
    let trackId = "";
    if(key == ""){
      trackId = e._targetInst.return.key;
    }else {
      trackId = key;
    }
    let index = _.findIndex(this.props.track, (o) => {return o.trackId == trackId});
    if(from == "list"){
      this._onCloseSearchBox();
    }
    this._makeRequestForWorkData(trackId, index, "track", "summary")
    .then(()=>{
      this._makeRequestForWasteData(trackId, index, "track");
    });
  }

  /** Renderers */
  // Zone renderers
  _renderAddZone(){
    if(this.props.showZonePanel){
      if(this.props.zonePoints.length >= 3){
        return(
          <Polygon coordinates={ this.props.zonePoints } fillColor="rgba(9,176,73,0.50)" strokeColor="rgba(9,176,73,0.50)"/>  //greenish color
        );
      }
      return(
        <Polyline coordinates={ this.props.zonePoints } strokeColor="rgba(9,176,73,0.50)" />  
      );
    }
  }
  _renderAddZoneMarkers(){
    if(this.props.showZonePanel){
      if(this.props.zonePoints.length >=1){
        return(
          this.props.zonePoints.map((m) => (
            <Marker
              key={ m.identifier }
              coordinate={ m }
              draggable={true}
              onDragEnd={e => this._onDragReposition(e, "zone")}
              onPress={e => this._getMarkerKey(e)}
            >
              <Callout onPress={() => this._onPressDeleteZonePoint()}>
                <Text>Delete Point</Text>
              </Callout>
            </Marker>
          ))
        );
      }
    }
  }
  _renderZone(){
    if(this.props.zone.length != 0){
      return(
        this.props.zone.map(z => (
          <Polygon key={z.zoneId} coordinates={z.zonePoints}
          tappable={true}  onPress={(e) => this._onPressZone(e)}
          fillColor="rgba(75, 150, 235,0.50)" strokeColor="rgba(29, 60, 94, 0.50)"/> //bluish color
        ))
      )
    }
  }

  // Track renderers
  _renderAddTrack(){
    if(this.props.showTrackPanel1 || this.props.showTrackPanel2){
      return(
        <Polyline coordinates={this.props.trackPoints} strokeColor="rgba(242, 180, 65, 0.80)" strokeWidth={5}/>
      )
    }
  }
  _renderAddTrackMarkers(){
    if(this.props.showTrackPanel1){
      if(this.props.trackPoints.length >=1){
        return(
          this.props.trackPoints.map((m) => (
            <Marker
              key={ m.identifier }
              coordinate={ m }
              draggable = {true}
              onDragEnd = {e => this._onDragReposition(e, "track")}
              onPress={e => this._getMarkerKey(e)}
            >
              <Callout onPress={() => this._onPressDeleteTrackPoint()}>
                    <Text>Delete Point</Text>
              </Callout>
            </Marker>
          ))
        );
      }
    }
  }
  _renderProcessedCheckpoints(){
    if(this.props.trackCheckpoints.length >=2 && this.props.showTrackPanel2){
      return(
        this.props.trackCheckpoints.map((t) => 
        <CheckpointMarker key={t.identifier} coordinate={{latitude:t.latitude,longitude:t.longitude}} 
        />
        )
        );
      }
  }
  _renderTrack(){
    if(this.props.track.length != 0){
      return(
        this.props.track.map(t => (
          <Polyline key={t.trackId} coordinates={t.trackPoints} 
          tappable = {true} onPress = {e => this._onPressTrack(e)}
          strokeColor="rgba(250, 125, 0, 0.80)" strokeWidth={3}/> //orangish color
        ))
      )
    }
  }

  // Renderers for panels and utility components
  _renderDummySearchBox(){
    if(this.props.mapSearchVisible){
      return(
        //toggle searchBox
        <DummySearchBox
          onPress = {()=>{this.props.dismissSelectedGeoObject();this.props.toggleSearchBox()}}
          rightIcon = {
            <Button buttonType="iconOnly" icon={<IonIcons name="ios-search" color="#000" size={20}/>}/>
          }
        />)
    } 
    return null;
  }
  _handleSearchQuery = (text) => {
    const formatedQuery = text.toLowerCase();
    const trackDataResult = _.filter(this.props.fullQueryTrack, td => {
      return trackContains(td, formatedQuery);
    });
    const zoneDataResult = _.filter(this.props.fullQueryZone, zd => {
      return zoneContains(zd, formatedQuery);
    });
    this.props.thunkQueryChanged(trackDataResult, zoneDataResult,
      formatedQuery);
    // this.props.thunkQueryChanged(trackDataResult, zoneDataResult,
    //   formatedQuery).then(() => {this._makeRemoteRequest()});
  }
  _onCloseSearchBox = () => {
    //this.props.thunkClearCloseSearchBox();
    this.props.thunkToggleSearchBox()
    .then(() => { this._handleSearchQuery("")});
  }
  _renderSearchList(){
    //android:windowSoftInputMode="adjustResize"||"adjustPan" from AndroidManifest.xml
    if(this.props.mapSearchFocused){
      return(
        <SearchModal
          //autoFocus = {true}
          //toggleSearchBox using android back button
          onRequestClose = {this._onCloseSearchBox}
          onChangeText = {text => this._handleSearchQuery(text)}
          value = {this.props.searchQuery}
          //toggleSearchBox
          onPressBack = {this._onCloseSearchBox}
          onPressClear = {() => this._handleSearchQuery("")}
          trackData = {this.props.queryTrack}
          zoneData = {this.props.queryZone}
          //sending only the reference of _onPressTrack()
          onPressTrack = {this._onPressTrack}
          //sending only the reference of _onPressZone()
          onPressZone = {this._onPressZone}
        />
      )
    }
  }
  _renderChipsFilterSearch(){
    if(this.props.selectedChipsId != ""){
      const index = _.findIndex(this.props.categories, (o) => {
        return o.id == this.props.selectedChipsId;
      });
      const cat = this.props.categories[index];
      return(
        <ChipsFilterSearch
        visible = {true}
        autoFocus = {false}
        editable = {false}
        value = {cat.name}
        rightIcon = {
          <Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
          onPress={this._onMapPress}/>}
        />
      )
    }
  }
  _renderChips(){
    if(this.props.mapSearchVisible){
      return(
        <ScrollView
          horizontal scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false} height={50}
          style={styles.chipsScrollView}
          contentContainerStyle={{
            paddingRight: 20
          }}
        >
          {this.props.categories.map((category) => (
            <Chips
              name = {category.name} key={category.id} id={category.id}
              selectedChipsId={this.props.selectedChipsId }
              query = {category.query} type = {category.type}
              onPress = {this._onPressChips}/>
          ))}
        </ScrollView>
      )
    }else return null;
  }
  _renderChipsQueryTrack(){
    if(this.props.selectedChipsId != ""){
      return(
        this.props.chipsFilteredTrack.map(t => (
          <Polyline
            key = {`c.${t.trackId}`} coordinates = {t.trackPoints}
            strokeWidth = {4} strokeColor = "rgba(156, 19, 19, 0.8)"
          />
        ))
      );
    }
  }
  _renderChipsQueryZone(){
    if(this.props.selectedChipsId != ""){
      return(
        this.props.chipsFilteredZone.map(z => (
          <Polygon
            key = {`c.${z.zoneId}`} coordinates = {z.zonePoints}
            strokeColor = "rgba(176, 29, 0, 0.8)" fillColor = "rgba(255, 13, 13, 0.7)"
          />
        ))
      );
    }
  }
  _renderSelectedTrackCheckpoints(){
    if((this.props.showDefaultPanel) && (this.props.selectedTrackIndex >= 0)){
      let index = this.props.selectedTrackIndex;
      return(
        this.props.track[index].trackCheckpoints.map((t) => 
          <CheckpointMarker key={t.identifier} coordinate={{latitude:t.latitude, longitude:t.longitude}}
          id = {t.identifier}
          onPress={this._getMarkerKey}/>
        )
      );
    };
  }
  _renderHighlightOnSelectedCheckpoint(){
    const {showDefaultPanel, selectedTrackIndex, currentMarkerId} = this.props;
    if(showDefaultPanel && selectedTrackIndex >= 0 && currentMarkerId != ""){
      const {track} = this.props;
      const t = _.filter(track[selectedTrackIndex].trackCheckpoints,(o)=>{
        return o.identifier === currentMarkerId ;
      });
      return(
        <CheckpointMarker key={t[0].identifier} coordinate={{latitude:t[0].latitude, longitude:t[0].longitude}} 
        markerType={"highlight"}/>
      )
    }
  }
  _renderSelectedZoneMarker(){
    if((this.props.showDefaultPanel) && (this.props.selectedZoneIndex >= 0)){
      let index = this.props.selectedZoneIndex;
      return(
        this.props.zone[index].zonePoints.map((zp) => 
          <Marker key = {zp.identifier} coordinate = {zp}/>
        )
      );
    }
  }
  _renderInfoEditFooter(){
    const {showDefaultPanel, selectedTrackIndex, selectedZoneIndex, currentMarkerId, workData} = this.props;
    if(showDefaultPanel && selectedTrackIndex >=0 ){
      const {trackName, wasteCondition, workId} = this.props.track[selectedTrackIndex];
      const {totalWasteSummary, allCheckpointWasteSummary} = this.props.trackWasteData;
      if(currentMarkerId == ""){
        //when no checkpoint is selected show all summary of selected track
        return(
          <BottomSheetInfo title={trackName} wasteCondition={wasteCondition} workId={workId} workData={workData.workSummary}
          wasteData={totalWasteSummary}/>
        )
      }else{
        //_.findIndex() return index of id if found else return -1 as index
        const index = _.findIndex(allCheckpointWasteSummary,(s)=>{
          return s.trackCheckpointRef == currentMarkerId;
        });
        if(index != -1){
          return(
            <BottomSheetInfo title={trackName} wasteCondition={wasteCondition} workData={workData.workSummary}
            wasteData={allCheckpointWasteSummary[index].wasteSummary}/>
          )
        }else{
          return(<BottomSheetInfo title={trackName}/>)
        }
      }
    }else if(showDefaultPanel && selectedZoneIndex >=0){
      //for zone infoEdit bottomsheet
      const {zoneName, wasteCondition, workId} = this.props.zone[selectedZoneIndex];
      const {totalWasteSummary} = this.props.zoneWasteData;
      return(
        <BottomSheetInfo title={zoneName} wasteCondition={wasteCondition} workId={workId} workData={workData.workSummary}
        wasteData={totalWasteSummary}/>
      )
    }
  }
  _handleNameModalText = (text) => {
    this.props.nameModalChanged(text);
  }
  nameModalObject(modalFor = ""){
    if(this.props.nameModalVisible && modalFor!=""){
      let title = "";
      if(modalFor == "track"){
        title = "Track Name";
      }else if(modalFor == "zone"){
        title = "Zone Name";
      }
      return(
        <CustomModal 
          visible = {this.props.nameModalVisible}
          //toggleNameModal
          onRequestClose = {() => this.props.toggleNameModal()}
          onPressTouchableOpacity = {() => this.props.toggleNameModal()}
          title = {title}
          content = {
            <TextInput
              autoCorrect = {false}
              keyboardType = "visible-password" underlineColorAndroid = "transparent"
              style={{height:50, borderBottomWidth:1,
                borderRadius:4, borderColor:colors.button, width:"80%", textAlignVertical:"bottom",fontSize:15}}
              onChangeText={text => this._handleNameModalText(text)}
              value = {this.props.nameModalValue} placeholder = {title}
            />
          }
          footerContent1 = {<Button text="Cancel" buttonType="contained" onPress={() => this.props.cancelNameModal()}/>}
          footerContent2 = {<Button text="Done" buttonType="contained" onPress={() => this._onPressDone(modalFor)}/>}
        />
      )
    }
  }
  _renderPanel(){
    if(this.props.showDefaultPanel){
      return(
        <View style={styles.defaultPanelStyle}>
          <FAB 
            option1 = {<Button text="Add zone" buttonType="contained" onPress={()=>this._toggleZonePanel()}/>}
            option1Icon = {<MaterialIcon name="vector-polygon" size={24} color="rgba(255, 255, 255, 1)" style={{padding:6}}/>}
            option2 = {<Button text="Add track" buttonType="contained" onPress={()=>this._toggleTrackPanel()}/>}
            option2Icon = {<MaterialIcon name="vector-polyline" size={24} color="rgba(255, 255, 255, 1)" style={{padding:6}}/>}
          />
        </View>
      )
    }
    if(this.props.showZonePanel){
      return(
        <MapEditPanel
          headerTitle = "Create Zone"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
            onPress={() => this._onPressCancel("zone")}/>
          }
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
            onPress={() => this._onPressMoveTo("zone", "nameModal")}/>
          }
          footer = {<Button text="Add zone point" buttonType="contained" onPress={()=>this._onPressAddZonePoint()}/>}
          modal = {this.nameModalObject("zone")}
        />
      )
    }
    if(this.props.showTrackPanel1){
      return(
        <MapEditPanel 
          headerTitle = "Create Track"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel("track")}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanel1", "trackPanel2")}
            />}
          footer = {<Button text="Add track point" buttonType="contained" onPress={()=>this._onPressAddTrackPoint()}/>}
        />
      )
    }
    if(this.props.showTrackPanel2){
      return(
        <MapEditPanel 
          headerTitle = "Process checkpoint"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-left" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanel2", "trackPanel1")}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this.props.toggleNameModal()}
            />}
          footer = {
            <View style={{flex:1, flexDirection:"row"}}>
              <Slider 
                style={{width:"60%"}} minimumValue = {50} maximumValue = {200} minimumTrackTintColor = {colors.button}
                step = {50} value = {150} onValueChange = {(i) => this.props.intervalChanged(i)} />
              <View style = {{alignSelf:"baseline", width:40, borderRadius:4, borderColor:"black", marginHorizontal:5}}>
                <Text style = {{flex:1, fontSize:15, padding:5}}>{this.props.interval}</Text>
              </View>
              <Button text="Process" buttonType="contained" onPress={() => this._onPressProcessCheckpoint()}/>
            </View>
          }
          modal = {this.nameModalObject("track")}
        />
      )
    }
  }


  // Main renderers
  render() {
    return (
      <View style={ styles.container}>
        <MapView.Animated
          //ref = {this._mapViewRef}
          customMapStyle = {mapStyle}
          onPress = {this._onMapPress}
          //showsUserLocation
          followsUserLocation
          provider={ PROVIDER_GOOGLE }
          region={this._currentRegion}
          onRegionChangeComplete={ this._onRegionChangeComplete }
          style={styles.mapViewContainer }
        >
            {/* on track panel */}
            {this._renderAddTrack()}
            {this._renderAddTrackMarkers()}
            {this._renderProcessedCheckpoints()}
            {/* on zone panel */}
            {this._renderAddZone()}
            {this._renderAddZoneMarkers()}
            {/* on default panel */}
            {this._renderTrack()}
            {this._renderSelectedTrackCheckpoints()}
            {this._renderHighlightOnSelectedCheckpoint()}

            {this._renderZone()}
            {this._renderSelectedZoneMarker()}

            {this._renderChipsQueryTrack()}
            {this._renderChipsQueryZone()}
        </MapView.Animated>
        {this._renderDummySearchBox()}
        {this._renderChipsFilterSearch()}
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
    bottom:40,
    right:20,
  },
  crosshairIcon:{
    position:"absolute",
    alignSelf:"center",
    top:"48.6%"
  },
});

const mapStateToProps = (state) => {
  const {
    categories,
    region,
    errorInfo,
    hasMapPermission,
    mapSearchVisible,
    mapSearchFocused,
    searchQuery,
    showDefaultPanel,
    showZonePanel,
    showTrackPanel1,
    showTrackPanel2,
    nameModalVisible,
    nameModalValue,
    zone,
    zonePoints,
    queryZone,
    fullQueryZone,
    track,
    trackPoints,
    trackCheckpoints,
    interval,
    queryTrack,
    fullQueryTrack,
    currentMarkerId,
    selectedTrackIndex,
    selectedZoneIndex,
    workData,
    trackWasteData,
    zoneWasteData,
    selectedChipsId,
    chipsFilteredTrack,
    chipsFilteredZone
  } = state.explore;
    return {
      categories,
      region,
      errorInfo,
      hasMapPermission,
      mapSearchVisible,
      mapSearchFocused,
      searchQuery,
      showDefaultPanel,
      showZonePanel,
      showTrackPanel1,
      showTrackPanel2,
      nameModalVisible,
      nameModalValue,
      zone,
      zonePoints,
      queryZone,
      fullQueryZone,
      track,
      trackPoints,
      trackCheckpoints,
      interval,
      queryTrack,
      fullQueryTrack,
      currentMarkerId,
      selectedTrackIndex,
      selectedZoneIndex,
      workData,
      trackWasteData,
      zoneWasteData,
      selectedChipsId,
      chipsFilteredTrack,
      chipsFilteredZone
    }
}
const mapDispatchToProps = (dispatch)=>{
  return ({...bindActionCreators(exploreActions, dispatch)})
};

export default connect (mapStateToProps, mapDispatchToProps
)(ExploreMap)