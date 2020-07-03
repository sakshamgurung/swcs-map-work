import React, { Component } from 'react'
import { Text, View, StyleSheet, PermissionsAndroid, Platform } from 'react-native'

//components
import {FAB} from 'components/button'

import MapView, { PROVIDER_GOOGLE, MAP_TYPES } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'

class ExploreMap extends Component {
  state={
    hasMapPermission:false,
    region:{
      latitude: 28.2674,
      longitude: 83.9750,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }
  }

  async requestFineLocation() {
    try {
        if(Platform.OS === 'android'){
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            //To Check, If Permission is granted
            if (granted === PermissionsAndroid.RESULTS.GRANTED){
                this.setState({hasMapPermission:true});
            }
        }
    } catch (err) {
        console.warn(err);
    }
  }

  componentDidMount(){
    this.requestFineLocation();
    this.locationWatchId = Geolocation.watchPosition(pos => {
      const region={
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude, 
        latitudeDelta:0.015,
        longitudeDelta:0.0121};
      this.setState({region:region});
    });
  }
  componentWillUnmount(){
    Geolocation.clearWatch(this.locationWatchId);
  }
  pickLocation=region=>{
    this.setState({region:region});
    console.log("Region change",region);
  }
  render() {
    if(this.state.hasMapPermission){
      return (
        <View style={styles.container}>
          <MapView
            showsUserLocation
            followsUserLocation
            MAP_TYPES={MAP_TYPES.STANDARD}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.pickLocation}
          >
          </MapView>
          <MaterialIcon name="crosshairs" color="#000" size={15} style={styles.crosshair}/> 
          <FAB style={styles.FAB}>
            <AntIcon name="pluscircle" color="#1ea362" size={35} style={styles.Button}/>
          </FAB>
        </View>
      )
    }else{
      return null;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    borderColor:"yellow",
    borderWidth:5
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  crosshair:{
    left:198,
    top:345
  },
  FAB:{
    flexDirection:"row-reverse",
    top:620,
    marginRight:16
  }
 });
export default ExploreMap
