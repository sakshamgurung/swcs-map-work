import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

import {connect} from 'react-redux';
import {emailChanged, passwordChanged, resetState, login} from 'store/actions'
//components
import {Card} from 'lib/components/card';
import {Input} from 'lib/components/input';
import {SubmitButton} from 'lib/components/button';

class LoginScreen extends Component {
  componentWillUnmount(){
    this.props.resetState();
  }
  onEmailChange = (text)=>{
    this.props.emailChanged(text);
  }
  onPasswordChange = (text)=>{
    this.props.passwordChanged(text);
  }
  onLogin = () => {
    const {email, password} = this.props;
    this.props.login({email,password});
  }
  renderButton = ()=>{
    if(this.props.loading){
      return(<ActivityIndicator color="white" size={15} />)
    }
    return(
      <SubmitButton onPress={this.onLogin.bind(this)}>
        Login
      </SubmitButton>
    )
  }
  render() {
    if(this.props.loggedIn){
      this.props.navigation.navigate('Main');
    }
    return (
      <View style={{flex:1, backgroundColor:"#2196f3"}}>
        <Card>
         <Input
          onChangeText={this.onEmailChange.bind(this)}
          value = {this.props.email}
          placeholder="email"
          secureTextEntry={false}
          />
          <Input
          onChangeText={this.onPasswordChange.bind(this)}
          value = {this.props.password}
          placeholder="password"
          secureTextEntry={true}
          />
          <Text style={{color:'#d32f2f',fontSize:15, alignItems:'center'}}>
            {this.props.loginMsg}
          </Text>
          {this.renderButton()}
        </Card> 
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const{
    email,
    password,
    loading,
    loginMsg,
    loggedIn
  } = state.auth;
  return{
    email,
    password,
    loading,
    loginMsg,
    loggedIn
  }
}

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  resetState,
  login
})(LoginScreen);
