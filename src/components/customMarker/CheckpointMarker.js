import React, {Component, useState} from 'react'
import {Marker} from 'react-native-maps'

let _ = require("lodash");

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
    const {coordinate, onPress} = this.props;
    return (
      <Marker
      coordinate = {coordinate}
      onPress = {onPress}
      image = {require("assets/images/delete-icon-outline-15.png")}
      tracksViewChange={this.state.tracksViewChange}
      />
    )
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