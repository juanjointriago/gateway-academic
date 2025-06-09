import { theme } from '@/app/theme/theme';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'


interface Props{
    mode: 'text' | 'outlined' | 'contained';
    style?: object;
}

export const Button:FC<Props> = ({ mode, style, ...props }) => {
  return (
    <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}
  >
    <></>
  </PaperButton>
  )
}


const styles = StyleSheet.create({
    button: {
      width: '100%',
      marginVertical: 10,
      paddingVertical: 2,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 15,
      lineHeight: 26,
    },
  })