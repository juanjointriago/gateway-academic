import { LayoutGeneral } from '@/src/components'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

export const FeesScreen = () => {
  return (
    <LayoutGeneral title='Mis pagos'>
        <View>
            <Text>* Buscador de pagos</Text>
            <Text>* Boton para crear nuevo pago</Text>
            <Text>* Tabla con los pagos</Text>
        </View>
    </LayoutGeneral>
  )
}
