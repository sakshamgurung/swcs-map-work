import React, { Component } from 'react'
import { Text, View, StyleSheet} from 'react-native'

//components
//import ExploreMap from './ExploreMap'
import TestMap from './TestMap'
import TestMap2 from './TestMap2'
import PolygonScreen from './PolygonScreen'


class ExploreScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TestMap2/>
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
