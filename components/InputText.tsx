import { theme } from '@/app/theme/theme';
import { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TextInput as Input, Text } from 'react-native-paper'


interface Props extends TextInput {
  description?: string;
  errorText?: string;
}
export const InputText:FC<Props> = ({ description, errorText,...props }) => {
  return (
    <View style={styles.container}>
            <Input
              style={styles.input}
              selectionColor={theme.colors.primary}
              underlineColor="transparent"
              mode="outlined"
              {...props}
            />
            
            {description && !errorText ? (
              <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
          </View>
  )
}


const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginVertical: 12,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    description: {
      fontSize: 13,
      color: theme.colors.secondary,
      paddingTop: 8,
    },
    error: {
      fontSize: 13,
      color: theme.colors.error,
      paddingTop: 8,
    },
  })