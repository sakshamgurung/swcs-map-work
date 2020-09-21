import AsyncStorage from '@react-native-community/async-storage';
import React,{ Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import {connect} from 'react-redux';
import {logout} from 'store/actions';
//components
import {Card} from 'lib/components/card';
import {BackToButton} from 'lib/components/button';

class ProfileScreen extends Component {
  render() {
    return (
      <View>
        <BackToButton destinationScreen="Account"/>
        <TouchableOpacity 
        onPress={()=>{
          AsyncStorage.clear();
          this.props.logout();
        } 
        }>
          <Text style={{marginLeft:36,fontSize:15,fontWeight:'bold',color:"#e8253f"}}>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const{
    loggedIn
  } = state.auth;
  return{
    loggedIn
  }
}

export default connect(mapStateToProps, {logout})(ProfileScreen);
