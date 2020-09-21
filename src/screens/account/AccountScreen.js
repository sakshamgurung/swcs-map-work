import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'

//components
import {Card} from 'lib/components/card'

class AccountScreen extends Component {
  render() {
    return (
      <View>
        <Text> Account Screen </Text>
        <Button title="Go to profile" onPress={()=>this.props.navigation.navigate("Profile")}/>
      </View>
    )
  }
}

export default AccountScreen;
