import React, { FC } from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
// import { getStatusBarHeight } from 'react-native-status-bar-height'


interface Props{
    goBack:()=>void
}
export const BackButton:FC<Props> = ({ goBack })=> {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
})