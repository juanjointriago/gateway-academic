import { useDisclosure } from '@/src/hook'
import { FC } from 'react'
import { IconButton } from 'react-native-paper'
import { ModalGeneral } from '../modal'
import { WebView } from 'react-native-webview'
import { ButtonGeneral } from '../buttons'
import { Linking } from 'react-native'
import { toast } from '@/src/helpers/toast'

interface Props {
  iconName?: string
  size?: number
  color?: string
  url: string
}

export const IconRenderWeb: FC<Props> = ({ color = '#D4AF37', iconName = 'file-table-box', size = 24, url }) => {

  const toogleOpenModal = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      toast({ description: 'No se pudo abrir la URL', type: 'danger' });
    }
  }


  return (
    <>
      <IconButton icon={iconName} size={size} onPress={toogleOpenModal} iconColor={color} />
    </>
  )
}
