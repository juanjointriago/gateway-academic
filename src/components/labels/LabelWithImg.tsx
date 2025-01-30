import { FC } from 'react'
import { View, ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'
import { LabelGeneral } from './LabelGeneral'
import { URL_PROFILE_DEFAULT } from '@/src/constants/Constants'

interface Props {
    title?: string
    subtitle?: string
    description?: string
    url?: string
    contentStyle?: ViewStyle
}


export const LabelWithImg: FC<Props> = ({ title = 'Hola', subtitle, description, contentStyle, url = URL_PROFILE_DEFAULT }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, ...contentStyle }}>
            <Avatar.Image size={70} source={{ uri: !url ? URL_PROFILE_DEFAULT : url }} />
            <View>
                <LabelGeneral label={title} variant='titleMedium' />
                {subtitle && <LabelGeneral label={subtitle} variant='bodySmall' styleProps={{ marginBottom: description ? 5 : 0 }} />}
                {description && <LabelGeneral label={description} variant='bodySmall' styleProps={{ fontSize: 12 }} />}
            </View>
        </View>
    )
}
