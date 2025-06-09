import { theme } from '@/app/theme/theme'
import { FC } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet } from 'react-native'

interface Props{
    children: React.ReactNode;
}
export const Background:FC<Props>=({ children })=> {
    return (
      <ImageBackground
        source={require('../assets/background_dot.png')}
        resizeMode="repeat"
        style={styles.background}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {children}
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.surface,
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })