import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native'
import {colors, shadow} from 'lib/res'

/*components */
import EntypoIcon from 'react-native-vector-icons/Entypo'

class FAB extends Component{
  animation = new Animated.Value(0);
  toggleMenu = () => {
    const toValue = this.open ? 0:1;
    Animated.spring(this.animation,{
      toValue,
      friction:7,
      tension:20,
      useNativeDriver:true
    }).start()
    this.open = !this.open;
  }
  render(){
    const rotation = {
      transform: [
        {rotate: this.animation.interpolate({
          inputRange: [0,1],
          outputRange: ["0deg", "45deg"]
        })}
      ]
    }
    const option3Style = {
      transform: [
        {scale:this.animation},
        {
          translateY: this.animation.interpolate({
            inputRange: [0,1],
            outputRange: [0,-180]
          })
        }
      ]
    } 
    const option2Style = {
      transform: [
        {scale:this.animation},
        {
          translateY: this.animation.interpolate({
            inputRange: [0,1],
            outputRange: [0,-120]
          })
        }
      ]
    } 
    const option1Style = {
      transform: [
        {scale:this.animation},
        {
          translateY: this.animation.interpolate({
            inputRange: [0,1],
            outputRange: [0,-60]
          })
        }
      ]
    } 
    const opacity = {
      opacity:this.animation.interpolate({
        inputRange:[0, 0.5, 1],
        outputRange:[0, 0, 1]
      })
    }
    const {option1,option1Icon, option2, option2Icon, option3, option3Icon} = this.props;
    return (
      <View style={[styles.container]}>
        {/* option3 */}
        <Animated.View style = {[ styles.button, option3Style, opacity]}>
          {option3?option3:null}
          <Animated.View style={[styles.FABOptionStyle]}>
            {option3Icon?option3Icon:null}
          </Animated.View>
        </Animated.View>

        {/* option2 */}
        <Animated.View style = {[ styles.button, option2Style, opacity]}>
          {option2?option2:null}
          <Animated.View style={[styles.FABOptionStyle]}>
            {option2Icon?option2Icon:null}
          </Animated.View>
        </Animated.View>

        {/* option1 */}
        <Animated.View style = {[styles.button, option1Style, opacity]}>
          {option1?option1:null}
          <Animated.View style={[styles.FABOptionStyle]}>
            {option1Icon?option1Icon:null}
          </Animated.View>
        </Animated.View>
        
        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <Animated.View style={[styles.FABStyle, rotation]}>
            <EntypoIcon name="plus" color="#fff" size={30} style={styles.plusIcon}/>       
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
  },
  button:{
    position:"absolute",
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row"
  },
  FABOptionStyle:{
    backgroundColor:colors.primaryButton,
    alignSelf:"baseline",
    marginLeft:15,
    borderRadius:50,
    ...shadow.DP6
  },
  FABStyle:{
    backgroundColor:colors.primaryButton,
    alignSelf:"baseline",
    marginLeft:92,
    borderRadius:50,
    ...shadow.DP6
  },
  plusIcon:{
    padding:5
  },
});

export default FAB
// import React from 'react'
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
// import {colors, shadow} from 'lib/res'

// /*components */
// import AntIcon from 'react-native-vector-icons/AntDesign'

// const FAB = ({onPress, option1, option2, option3, style}) => {
//   return (
//     <View style={[styles.container,style]}>
//       <View style={styles.option1Style}>
//         {option3?option3:null}
//       </View>
//       <View style={styles.option1Style}>
//         {option2?option2:null}
//       </View>
//       <View style={styles.option1Style}>
//         {option1?option1:null}
//       </View>
//       <TouchableOpacity onPress={onPress}  style={styles.FABStyle}>
//         <AntIcon name="plus" color="#fff" size={25} style={styles.plusIcon}/>       
//       </TouchableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container:{
//   },
//   FABStyle:{
//     backgroundColor:colors.button,
//     alignSelf:"baseline",
//     marginLeft:120,
//     borderRadius:50,
//     ...shadow.DP6
//   },
//   plusIcon:{
//     padding:5
//   },
//   option1Style:{
//     alignSelf:"baseline",
//     marginBottom:10,
//   },
// });

// export default FAB
