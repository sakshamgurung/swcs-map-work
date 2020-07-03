/**
 * @flow
 */

import React, { Component} from 'react';
import { Dimensions,StyleSheet, View, Text, PermissionsAndroid, Platform, 
  Alert, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
/* Other dependencies */
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline, AnimatedRegion, Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
/** Utilities */
import {getRegionFromMarkers, grahamScan, isPointInsidePolygon,getCheckpoints} from 'utilities';

import _ from 'lodash';
/** Components */
import Slider from '@react-native-community/slider'
import {FAB, Button} from 'components/button';
import {CustomModal} from 'components/card';
import {CheckpointMarker} from 'components/customMarker';
/** res */
import {shadow, colors} from 'res';
import {mapStyle} from './style';

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
export default class TestMap extends Component {
  _currentRegion:AnimatedRegion;
  constructor() {
    super();
    this._currentRegion = new MapView.AnimatedRegion({
      latitude: 28.2674,
      longitude: 83.9750,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121});
    this.state = {
      dimensions: {window,screen}, hasMapPermission:false,
      showDefaultPanel:true,
      showZonePanel:false,
      showTrackPanel:false, showTrackPanelState1:false,
      nameModalVisible:false, nameModalValue:"",
      currentMarkerID:"",
      selectedTrackIndex:-1, selectedZoneIndex:-1,
      zone:[],
      zonePoints: [],
      track:[],
      trackPoints:[], trackCheckPoints:[]
    };
  }

  async componentDidMount(): void {
    Dimensions.addEventListener("change", this.onChange);
    this.requestFineLocation();
  }
  componentWillUnmount(): void{
    Dimensions.removeEventListener("change", this.onChange);
    if(this.watchId){
      Geolocation.clearWatch(this.watchId);
    }
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
                latitudeDelta:0.015,
                longitudeDelta:0.0121};
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
  }

  /** Button Handlers */

  _showAll = (): void => {
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
        this.setState({zone, zonePoints:[], nameModalValue:"", nameModalVisible:false, showZonePanel:false, showDefaultPanel:true});
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
        this.setState({track, trackPoints:[],trackCheckPoints:[], nameModalValue:"", nameModalVisible:false, showTrackPanel:false, showDefaultPanel:true});
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
              this.setState({points:[], showZonePanel:false, showDefaultPanel:true});
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.setState({showZonePanel:false, showDefaultPanel:true});
      }
    }
    if(panelName == "track"){
      if(this.state.trackPoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [{
              text: "No"
            },{ 
              text: "Yes", onPress: () => {
              this.setState({trackPoints:[], trackCheckPoints:[], showTrackPanel:false, showDefaultPanel:true});
            }}
          ]
          ,{cancelable:true}
        );
      }else{
        this.setState({showTrackPanel:false, showDefaultPanel:true});
      }
    }
  }  
  _onPressMoveTo = (from, to) => {
    if(from == "zonePanelState1" && to == "zonePanel"){
      this.setState({showZonePanelState1:false, showZonePanel:true});
    }
    if(from == "zonePanel" && to == "zonePanelState1"){
      if(this.state.zonePoints.length >= 3 ){
        this.setState({showZonePanel:false, showZonePanelState1:true});
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "trackPanelState1" && to == "trackPanel"){
      this.setState({showTrackPanelState1:false, showTrackPanel:true, trackCheckPoints:[]});
    }
    if(from == "trackPanel" && to == "trackPanelState1"){
      if(this.state.trackPoints.length >= 2 ){
        this.setState({showTrackPanel:false, showTrackPanelState1:true});
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
  }
  _getMarkerKey = (e) => {
    const markerId = e._targetInst.return.key;
    this.setState({currentMarkerID:markerId});
  }
  _onMapPress = (e) => {
    this.setState({selectedTrackIndex:-1});
  }
  // Zone panel button handlers
  _onPressAddZone = () => {
    this.setState({showDefaultPanel:false, selectedTrackIndex:-1, showZonePanel:true});
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
    this.setState({showDefaultPanel:false, selectedTrackIndex:-1, showTrackPanel:true});
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
      const trackCheckPoints = getCheckpoints(this.state.trackPoints,100);
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
    this.setState({selectedTrackIndex:index});
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
        <Polyline coordinates={this.state.trackPoints} strokeColor="rgba(242, 180, 65, 0.80)" strokeWidth={3}/>
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
  _renderTrackPolyline = () => {
    if(this.state.track.length != 0){
      return(
        this.state.track.map(t => (
          <Polyline 
          tappable = {true}
          onPress = {e=> this._onPressTrack(e)}
          key={t.trackID} coordinates={t.trackPoints} 
          strokeColor="rgba(245, 146, 24, 0.80)" strokeWidth={3}/> //bluish color
        ))
      )
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
  _renderSelectedTrackCheckPoints = () => {
    if((this.state.showDefaultPanel) && (this.state.selectedTrackIndex >= 0)){
      let index = this.state.selectedTrackIndex;
      return(
        this.state.track[index].trackCheckPoints.map((t) => 
          <CheckpointMarker key={t.identifier} coordinate={{latitude:t.latitude,longitude:t.longitude}} 
          onPress={e => this._getMarkerKey(e)}/>
        )
      );
    }
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
        <View>
          <View style={styles.editPanelHeaderStyle}>
            <Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel("zone")}
            />
            <Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this.setState({nameModalVisible:true})}
            />
          </View>
          <View style={styles.editPanelFooterStyle}>
            <Button text="Add zone point" buttonType="contained" onPress={this._onPressAddZonePoint}/>
          </View>
          {this.nameModalObject("zone")}
        </View>
      )
    }

    if(this.state.showTrackPanel){
      return(
        <View>
          <View style={styles.editPanelHeaderStyle}>
            <Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel("track")}
            />
            <Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanel", "trackPanelState1")}
            />
          </View>
          <View style={styles.editPanelFooterStyle}>
            <Button text="Add track point" buttonType="contained" onPress={this._onPressAddTrackPoint}/>
          </View>
        </View>
      )
    }
    if(this.state.showTrackPanelState1){
      return(
        <View>
          <View style={styles.editPanelHeaderStyle}>
            <Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-left" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo("trackPanelState1", "trackPanel")}
            />
            <Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this.setState({nameModalVisible:true})}
            />
          </View>
          <View style={styles.editPanelFooterStyle}>
            <Button text="Process checkpoint" buttonType="contained" onPress={this._onPressProcessCheckpoint}/>
          </View>
          {this.nameModalObject("track")}
        </View>
      )
    }
  }
  onTextChange(text){
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
              onChangeText={text => this.onTextChange(text)}
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
              onChangeText={text => this.onTextChange(text)}
              value = {this.state.nameModalValue} placeholder = "Zone Name"
            />
          }
          footerContent1 = {<Button text="Cancel" buttonType="contained" onPress={() => this.setState({ nameModalValue:"", nameModalVisible:false})}/>}
          footerContent2 = {<Button text="Done" buttonType="contained" onPress={() => this._onPressDone("zone")}/>}
        />
      )
    }
  }
  render() {
    return (
      <View style={ styles.container}>
        <MapView.Animated
          customMapStyle = {mapStyle}
          onPress = {this._onMapPress}
          showsUserLocation
          followsUserLocation
          provider={ PROVIDER_GOOGLE }
          region={this._currentRegion}
          onRegionChangeComplete={ this._onRegionChangeComplete }
          style={styles.mapViewContainer }>
          {this._renderAddZonePolygon()}
          {this._renderAddZonePolygonMarkers()}
          {this._renderZonePolygon()}

          {this._renderAddTrackPolyline()}
          {this._renderAddTrackPolylineMarkers()}
          {this._renderTrackPolyline()}
          {this._renderTrackCheckPoints()}
          {this._renderSelectedTrackCheckPoints()}
        </MapView.Animated>
        <MaterialIcon name="crosshairs" color="#000" size={15} style={styles.crosshairIcon}/>
        {this._renderPanel()}
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
  editPanelHeaderStyle:{
    position:"absolute",
    backgroundColor:"white",
    width: window.width,
    height:50,
    flexDirection:"row",
    alignItems:"center",
    ...shadow.DP4
  },
  editPanelFooterStyle:{
    position:"absolute",
    top:700,
    backgroundColor:"white",
    width: window.width,
    height:60,
    flexDirection:"row",
    alignItems:"center",
    ...shadow.DP4
  },
  modal:{
    backgroundColor:"#00000099",
    flex:1, 
    justifyContent:"center", 
    alignItems:"center"
  },
  modalContainer:{
    backgroundColor:"#f9fafb",
    width:"80%",
    borderRadius:5
  }
});
