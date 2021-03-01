import React, {Component, useState} from 'react'
import {Marker} from 'react-native-maps'

let _ = require("lodash");
const checkpointMarker = require("assets/images/delete-icon-outline-15.png");
const checkpointMarkerHighlight = require("assets/images/delete-icon-outline-highlight.png");
class CheckpointMarker extends Component{
  constructor(){
    super();
    this.state = {
      tracksViewChange:true
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    // console.log(`this.state: ${JSON.stringify(this.state)}`);
    // console.log(`this.nextState: ${JSON.stringify(nextState)}`);
    if(this.props.id === nextProps.id){
      return false;
    }
    if(this.props.latitude === nextProps.latitude && this.props.longitude === nextProps.longitude){
      return false;
    }
    return true;
  }
  componentDidMount(){
    this.stopRendering();
  }
  stopRendering = () => {
    this.setState({tracksViewChange:false});
  }
  render(){
    const {coordinate, id, onPress, markerType="default"} = this.props;
    if(markerType == "default"){
      return (
        <Marker
        coordinate = {coordinate}
        onPress = {(e) => onPress(e, id, coordinate)}
        image = {checkpointMarker}
        tracksViewChange={this.state.tracksViewChange}
        />
      )
    }else if(markerType == "highlight"){
      return (
        <Marker
        coordinate = {coordinate}
        onPress = {onPress}
        image = {checkpointMarkerHighlight}
        tracksViewChange={this.state.tracksViewChange}
        />
      )
    }
  } 
}

export default CheckpointMarker;
// const areEqual = (prevProps, nextProps) => {
//   console.log(`areEqual(${JSON.stringify(prevProps)}, ${JSON.stringify(nextProps)}): `,prevProps.id === nextProps.id);
//   if(prevProps.id == nextProps.id){
//     return true;
//   }else{
//     return false;
//   }
// }


//export default CheckpointMarker = React.memo(CheckpointPin,areEqual);