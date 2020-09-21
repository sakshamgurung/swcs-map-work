import React, { Component } from 'react'
import { Text, View, StyleSheet} from 'react-native'

//components
import ExploreMap from './ExploreMap'

class ExploreScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ExploreMap/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1
  }
 });
export default ExploreScreen
