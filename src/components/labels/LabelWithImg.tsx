import { FC } from 'react'
import { View, ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'
import { LabelGeneral } from './LabelGeneral'

interface Props {
    title?: string
    subtitle?: string
    description?: string
    url?: string
    contentStyle?: ViewStyle
}


export const LabelWithImg: FC<Props> = ({ title = 'Hola', subtitle, description, contentStyle, url = 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/profile%2FdefaultProfile.png?alt=media&token=c314af93-f40f-41f3-a406-92f5e4d0e7da' }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, ...contentStyle }}>
            <Avatar.Image size={70} source={{ uri: url }} />
            <View>
                <LabelGeneral label={title} variant='titleMedium' />
                {subtitle && <LabelGeneral label={subtitle} variant='bodySmall' styleProps={{ marginBottom: description ? 5 : 0 }} />}
                {description && <LabelGeneral label={description} variant='bodySmall' styleProps={{ fontSize: 12 }} />}
            </View>
        </View>
    )
}
