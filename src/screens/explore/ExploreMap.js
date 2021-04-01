/**
 * @flow
 */
import React, { Component} from 'react';
import {connect} from 'react-redux';
//action creator
import {actions as exploreActions, types as exploreActionTypes} from 'store/ducks/explore';
import { SafeAreaView, StatusBar, Dimensions, StyleSheet, View, Text, PermissionsAndroid, Platform, 
  Alert, TextInput, ScrollView} from 'react-native';
/* Other dependencies */
import MapView,{ PROVIDER_GOOGLE, Polygon, Polyline, AnimatedRegion, Marker, Callout } from 'react-native-maps';
import {default as MapViewCluster} from 'react-native-map-clustering';
import Geolocation from 'react-native-geolocation-service'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
/** Utilities */
import {sortPoints, trackContains} from 'utilities';
import pointInPolygon from 'point-in-polygon';
import _ from 'lodash';
/** Components */
import {FAB, Button, Chips} from 'components/button';
import {GeoObjectsDetailModal, SearchModal, BottomSheetInfo} from 'components/card';
import {CheckpointMarker} from 'components/customMarker';
import {MapEditPanel} from 'components/frame';
import {DummySearchBox, MapSearch as ChipsFilterSearch} from 'components/input';
/** res */
import {shadow, colors} from 'lib/res';
import {mapStyle} from './style';
import { bindActionCreators } from 'redux';

/** ts class */
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
  
  _makeRequsetForInfoEditFooter(geoObjectId, selectedGeoObjectIndex, workDataOf){
    this.props.thunkLoadInfoEditFooterData(geoObjectId, selectedGeoObjectIndex, workDataOf);
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
  //public class field syntax. Below event handler syntax ensures "this" is bind
  _onPressDone(panelName, geoObjectType){
    if(panelName == "zone"){
      if(this.props.zonePoints.length >=3){
        const zonePoints = this.props.zonePoints;
        const zoneName = this.props.geoObjectsDetail.name;
        const newZone = {zoneName, zonePoints};
        this.props.thunkPostGeoObjects(newZone, "zone");
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(panelName == "track"){
      if(this.props.trackPoints.length >=2){
        const trackPoints = this.props.trackPoints;
        const trackName = this.props.geoObjectsDetail.name;
        let {wasteLimit, wasteLimitUnit, description} = this.props.geoObjectsDetail;
        wasteLimit = parseInt(_.isEmpty(wasteLimit)?"500":wasteLimit, 10);
        const newTrack = {trackName, trackPoints, wasteLimit, wasteLimitUnit, description};
        this.props.thunkPostGeoObjects(newTrack, "track");
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
    if(panelName == "geoObjectEdit"){
      let updatedGeoObject = updatedGeoObjectIndex = updatedGeoObjectId = undefined;
      if(geoObjectType == "track"){
        const trackPoints = this.props.trackPoints;
        updatedGeoObject = {trackPoints};
        updatedGeoObjectIndex = this.props.selectedTrackIndex;
        updatedGeoObjectId = this.props.track[updatedGeoObjectIndex]._id;
      }
      this.props.thunkPutGeoObjects(updatedGeoObject, updatedGeoObjectIndex, updatedGeoObjectId, geoObjectType);
    }
  }

  _onPressCancel(panelName, geoObjectType){
    if(panelName == "zone"){
      if(this.props.zonePoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [
            {text: "No"},
            {text: "Yes", onPress: () => this.props.closeZonePanel()}
          ],
          {cancelable:true}
        );
      }else{
        this.props.closeZonePanel();
      }
    }
    if(panelName == "track"){
      if(this.props.trackPoints.length != 0){
        Alert.alert("Do you want to cancel?","Selecting Yes will delete your current progress",
          [ 
            {text: "No"},
            {text: "Yes", onPress: () => this.props.closeTrackPanel() }
          ],
          {cancelable:true}
        );
      }else{
        this.props.closeTrackPanel();
      }
    }
    if(panelName == "geoObjectEdit"){
      Alert.alert("Do you want to cancel?","Selecting Yes will discard your current progress",
        [
          {text: "No"},
          {text: "Yes", onPress:() => this.props.closeGeoObjectEditPanel(geoObjectType) }
        ],
        {cancelable:true}
      );
    }
  }

  _onPressMoveTo(from, to){
    if(from == "zone" && to == "nameModal"){
      if(this.props.zonePoints.length >= 3 ){
        this.props.toggleGeoObjectsDetailModal();
      }else{
        Alert.alert("Less than three points!","To create a region atleast three points are needed",[{text:"Ok"}]);
      }
    }
    if(from == "track" && to == "nameModal"){
      if(this.props.trackPoints.length >= 2 ){
        this.props.toggleGeoObjectsDetailModal();
      }else{
        Alert.alert("Less than two points!","To create a track atleast two points are needed",[{text:"Ok"}]);
      }
    }
  }

  _getMarkerKey = (e, identifier = "", coordinate = "" ) => {
    let markerId = "";
    //e is SyntheticEvent use e.persist() to see the event value if needed
    identifier == "" ? markerId = e._targetInst.return.key:markerId = identifier;

    this.props.markerSelected(markerId);
    
    if(coordinate != ""){
      //this._showAll(coordinate);
    }
  }

  _onDragReposition(e, markerOf){
    if(markerOf == "track"){
      let id = e._targetInst.return.key;
      let index = _.findIndex(this.props.trackPoints, (o) => o.identifier == id);
      const newPoint = new Point(e.nativeEvent.coordinate, this.props.trackPoints[index].identifier);
      const trackPoints = _.cloneDeep(this.props.trackPoints);
      trackPoints[index] = newPoint;
      this.props.dragTrackMarker(trackPoints);
    }else if(markerOf == "zone"){
      let id = e._targetInst.return.key;
      let index = _.findIndex(this.props.zonePoints, (o) => o.identifier == id);
      const newPoint = new Point(e.nativeEvent.coordinate, this.props.zonePoints[index].identifier);
      const zonePoints = _.cloneDeep(this.props.zonePoints);
      zonePoints[index] = newPoint;
      const tempZonePoints = sortPoints(zonePoints);
      this.props.dragZoneMarker(tempZonePoints);
    }
  }

  _onMapPress = (e) => {
    this.props.dismissSelectedGeoObject();
  }

  _onPressChips = (type, query, id ) => {
    this.props.thunkChipsSelected(type, query, id);
  }

  /**
   * Zone panel and button handlers
   */
  _showZonePanel = () => {
    if(this.props.zone.length >= 1){
      Alert.alert("One company can have max one zone.","",[],{cancelable:true});
      return;
    }
    this.props.showPanel(exploreActionTypes.SHOW_ZONE_PANEL);
  }

  _onPressAddZonePoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    const coordinate = {latitude, longitude};
    const newPoint = new Point(coordinate, `${ Date.now() }.${ Math.random() }`);
    const rawPoints = _.cloneDeep([...this.props.zonePoints, newPoint]);
    const zonePoints = sortPoints(rawPoints);
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
    let index = _.findIndex(this.props.zone, (o) => {return o._id == zoneId});
    //this.props.zoneSelected(index);
  }
  
  _renderNewZone(){
    if(this.props.showZonePanel){
      if(this.props.zonePoints.length >= 1){
        return(
          <Polygon coordinates={ this.props.zonePoints } fillColor="rgba(9,176,73,0.50)" strokeColor="rgba(9,176,73,0.50)"/>  //greenish color
        );
     }
    }
  }

  _renderNewZoneMarkers(){
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
          <Polygon key={z._id} coordinates={z.zonePoints} holes={[z.zonePoints]}
          tappable={true}  onPress={(e) => this._onPressZone(e)}
          //fillColor="rgba(153, 153, 153, 0.30)"
          strokeWidth={2} 
          strokeColor="rgba(29, 60, 94, 0.50)"
          />
        ))
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

  /**
   * Track panel and button handlers
   * */ 
  _showTrackPanel = () => {
    this.props.showPanel(exploreActionTypes.SHOW_TRACK_PANEL);
  }

  _onPressAddTrackPoint = () => {
    const latitude = this._currentRegion.latitude._value;
    const longitude = this._currentRegion.longitude._value;
    let arr = [];
    this.props.zone[0].zonePoints.forEach(e => {
      arr.push([e.latitude,e.longitude]);
    })

    if(pointInPolygon([latitude, longitude ], arr)){
      const newPoint = new Point({latitude, longitude}, `${ Date.now() }.${ Math.random() }`);
      const trackPoints = _.cloneDeep([...this.props.trackPoints, newPoint]);
      this.props.addTrackPoint(trackPoints);
    }else{
      Alert.alert("Track point not inside the zone","",[],{cancelable:true});
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
    let trackId = "";
    key == "" ? trackId = e._targetInst.return.key: trackId = key ;

    const index = _.findIndex(this.props.track, (o) => {return o._id == trackId});
    
    if(from == "list"){
      this._onCloseSearchBox();
    }
    this._makeRequsetForInfoEditFooter(trackId, index, "track")
  }

  _renderNewTrack(){
    if(this.props.showTrackPanel || this.props.showGeoObjectEditPanel){
      return(
        <Polyline coordinates={this.props.trackPoints} strokeColor="rgba(12, 168, 80, 0.80)" strokeWidth={5}/>
      )
    }
  }

  _renderNewTrackMarkers(){
    if((this.props.showTrackPanel || this.props.showGeoObjectEditPanel) && this.props.trackPoints.length >=1){
      return(
        this.props.trackPoints.map((m) => (
          <Marker
            key={ m.identifier } coordinate={ m }
            draggable = {true} onDragEnd = {e => this._onDragReposition(e, "track")}
            onPress={this._getMarkerKey}
          >
            <Callout onPress={() => this._onPressDeleteTrackPoint()}>
                  <Text>Delete Point</Text>
            </Callout>
          </Marker>
        ))
      );
    }
  }

  _renderTrack(){
    if(this.props.track.length != 0){
      return(
        this.props.track.map(t => (
          <Polyline key={t._id} coordinates={t.trackPoints} 
          tappable = {true} onPress = {e => this._onPressTrack(e)}
          strokeColor="rgba(250, 125, 0, 0.90)" strokeWidth={3}/> //orangish color
        ))
      )
    }
  }

  _renderSelectedTrackMarker(){
    if((this.props.showDefaultPanel) && (this.props.selectedTrackIndex >= 0)){
      let index = this.props.selectedTrackIndex;
      return(
        this.props.track[index].trackPoints.map((tp) => 
          <CheckpointMarker key={tp.identifier} coordinate={{latitude:tp.latitude, longitude:tp.longitude}} id = {tp.identifier}/>
        )
      );
    };
  }

  /** Renderers for panels and utility components */ 
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

  _handleSearchQuery = async(query) => {
    const formattedQuery = query.toLowerCase();
    const trackDataResult = _.filter(this.props.fullQueryTrack, td => trackContains(td, formattedQuery));
    await this.props.thunkQueryChanged(trackDataResult, formattedQuery);
    // this.props.thunkQueryChanged(trackDataResult,formatedQuery).then(() => {this._makeRemoteRequest()});
  }

  _onCloseSearchBox = () => {
    this.props.thunkToggleSearchBox()
    .then(() => { this._handleSearchQuery("")});
  }

  _renderSearchList(){
    //android:windowSoftInputMode="adjustResize"||"adjustPan" from AndroidManifest.xml
    if(this.props.mapSearchFocused){
      return(
        <SearchModal
          //toggleSearchBox using android back button
          onRequestClose = {this._onCloseSearchBox}
          onChangeText = {text => this._handleSearchQuery(text)}
          value = {this.props.searchQuery}
          onPressBack = {this._onCloseSearchBox}
          onPressClear = {() => this._handleSearchQuery("")}
          trackData = {this.props.queryTrack}
          onPressTrack = {this._onPressTrack}
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
            key = {`c.${t._id}`} coordinates = {t.trackPoints}
            strokeWidth = {4} strokeColor = "rgba(156, 19, 19, 0.8)"
          />
        ))
      );
    }
  }

 _showGeoObjectEditPanel = (geoObjectType, selectedGeoObjectIndex)=>{
    this.props.showGeoObjectEditPanel(geoObjectType, selectedGeoObjectIndex);
 }

 _showDeleteModal = (geoObjectType, selectedGeoObjectIndex, geoObjectId, geoObjectName) => {
  Alert.alert(`Do you really want to delete ${geoObjectName}?`,"Selecting Yes will permanently delete all related information.",
    [
      {text: "No"},
      {text: "Yes", onPress: () => this.props.thunkDeleteGeoObjects(selectedGeoObjectIndex, geoObjectId, geoObjectType)}
    ],
    {cancelable:true}
  );
 }

  _renderInfoEditFooter(){
    const {showDefaultPanel, selectedTrackIndex, selectedZoneIndex, infoEditFooterData} = this.props;
    if(showDefaultPanel && selectedTrackIndex >=0 ){
      const {totalWasteSummary, plateNo, groupName} = infoEditFooterData;
      const {_id, trackName, wasteCondition, workId} = this.props.track[selectedTrackIndex];
      
      return(
        <BottomSheetInfo title={trackName} wasteCondition={wasteCondition} workStatus={workId} staffGroupName={groupName}
        vehiclePlateNo={plateNo}  wasteData={totalWasteSummary} 
        onPressDismiss={this._onMapPress} 
        onPressEditMap={() => this._showGeoObjectEditPanel("track", selectedTrackIndex)}
        onPressDelete={() => this._showDeleteModal("track", selectedTrackIndex, _id, trackName)}
        />
      )
    }else if(showDefaultPanel && selectedZoneIndex >=0){
      //for zone infoEdit bottomsheet
      const {zoneName} = this.props.zone[selectedZoneIndex];
      return(
        <BottomSheetInfo title={zoneName}/>
      )
    }
  }

  _renderGeoObjectDetailModal(modalFor = ""){
    if(this.props.geoObjectsDetailModalVisible && modalFor!=""){
      let title = "";
      if(modalFor == "track"){
        title = "Track Detail";
      }else if(modalFor == "zone"){
        title = "Zone Detail";
      }
      return(
        <GeoObjectsDetailModal 
          visible = {this.props.geoObjectsDetailModalVisible}
          //toggleGeoObjectsDetailModal
          onRequestClose = {() => this.props.toggleGeoObjectsDetailModal()}
          onPressTouchableOpacity = {() => this.props.toggleGeoObjectsDetailModal()}
          title = {title} 
          onCancel={()=>this.props.cancelGeoObjectsDetailModal()}
          onDone={()=>this._onPressDone(modalFor)}
          onChangeGeoObjectsDetail={ this.props.geoObjectsDetailChanged}
          geoObjectsName={this.props.geoObjectsDetail.name}
          wasteLimit={this.props.geoObjectsDetail.wasteLimit}
          wasteLimitUnit={this.props.geoObjectsDetail.wasteLimitUnit}
          description={this.props.geoObjectsDetail.description}
        />
      )
    }
  }

  _renderPanel(){
    if(this.props.showDefaultPanel){
      return(
        <View style={styles.defaultPanelStyle}>
          <FAB 
            option1 = {<Button text="Add zone" buttonType="contained" onPress={this._showZonePanel}/>}
            option1Icon = {<MaterialIcon name="vector-polygon" size={24} color="rgba(255, 255, 255, 1)" style={{padding:6}}/>}
            option2 = {<Button text="Add track" buttonType="contained" onPress={this._showTrackPanel}/>}
            option2Icon = {<MaterialIcon name="vector-polyline" size={24} color="rgba(255, 255, 255, 1)" style={{padding:6}}/>}
          />
        </View>
      )
    }

    if(this.props.showTrackPanel || this.props.showZonePanel){
      let headerTitle, cancel, moveFrom, moveTo, addBtnTitle, addBtnHandler, modalFor;
      
      if(this.props.showTrackPanel){
        headerTitle = "Create Track";
        cancel = moveFrom = modalFor = "track";
        moveTo = "nameModal";
        addBtnTitle = "Add track point";
        addBtnHandler = this._onPressAddTrackPoint;
      
      }else if(this.props.showZonePanel){
        headerTitle = "Create Zone";
        cancel = moveFrom = modalFor = "zone";
        moveTo = "nameModal";
        addBtnTitle = "Add zone point";
        addBtnHandler = this._onPressAddZonePoint;
      }
      return(
        <MapEditPanel 
          headerTitle = {headerTitle}
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel(cancel)}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="arrow-right" color="#000" size={25}/>}
              onPress={() => this._onPressMoveTo(moveFrom, moveTo)}
            />}
          footer = {<Button text={addBtnTitle} buttonType="contained" onPress={addBtnHandler}/>}
          modal = {this._renderGeoObjectDetailModal(modalFor)}
        />
      )
    }
    
    if(this.props.showGeoObjectEditPanel){
      return(
        <MapEditPanel
          headerTitle = "Edit Map"
          headerLeft = {<Button buttonType="iconOnly" icon={<MaterialIcon name="close" color="#000" size={25}/>}
              onPress={() => this._onPressCancel("geoObjectEdit", "track")}
            />}
          headerRight = {<Button buttonType="iconOnly" icon={<MaterialIcon name="check" color="#000" size={25}/>}
              onPress={() => this._onPressDone("geoObjectEdit", "track")}
            />}
          footer = {<Button text="Add track point" buttonType="contained" onPress={()=>this._onPressAddTrackPoint()}/>}
          modal = {this._renderGeoObjectDetailModal("track")}
        />
      )
    }
  }

  /* Main renderers */
  render() {
    return (
      <SafeAreaView style={ styles.container}>
        <StatusBar
          backgroundColor="rgba(62, 115, 222, 1)"
          barStyle="default"
        />
        <MapView.Animated
          //ref = {this._mapViewRef}
          customMapStyle = {mapStyle.style2}
          onPress = {this._onMapPress}
          //showsUserLocation
          followsUserLocation
          provider={ PROVIDER_GOOGLE }
          region={this._currentRegion}
          onRegionChangeComplete={ this._onRegionChangeComplete }
          style={styles.mapViewContainer }
        >
            {/* on track panel */}
            {this._renderNewTrack()}
            {this._renderNewTrackMarkers()}
            {/* on zone panel */}
            {this._renderNewZone()}
            {this._renderNewZoneMarkers()}
            {/* on default panel */}
            {this._renderTrack()}
            {this._renderSelectedTrackMarker()}
            {this._renderZone()}
            {this._renderSelectedZoneMarker()}

            {this._renderChipsQueryTrack()}
        </MapView.Animated>
        {this._renderDummySearchBox()}
        {this._renderChipsFilterSearch()}
        {this._renderSearchList()}
        {this._renderChips()}
        <MaterialIcon name="crosshairs" color="#000" size={15} style={styles.crosshairIcon}/>
        {this._renderPanel()}
        {this._renderInfoEditFooter()}
      </SafeAreaView>
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
  return _.cloneDeep(state.explore);
}

const mapDispatchToProps = (dispatch)=>{
  return ({...bindActionCreators(exploreActions, dispatch)})
};

export default connect (mapStateToProps, mapDispatchToProps
)(ExploreMap)