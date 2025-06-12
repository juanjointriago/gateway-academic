import { FC } from 'react'
import { View, ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'
import { LabelGeneral } from './LabelGeneral'
import { URL_PROFILE_DEFAULT } from '@/src/constants/Constants'
import { useState, useEffect } from 'react';

interface Props {
    title?: string
    subtitle?: string
    description?: string
    url?: string
    contentStyle?: ViewStyle
}


export const LabelWithImg: FC<Props> = ({ title = 'Hola', subtitle, description, contentStyle, url = URL_PROFILE_DEFAULT }) => {
    const [cachedUrl, setCachedUrl] = useState(url);

useEffect(() => {
  if (url !== cachedUrl) {
    setCachedUrl(url);
  }
}, [url, cachedUrl]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, ...contentStyle }}>
            <Avatar.Image size={70} source={{ uri: !cachedUrl ? URL_PROFILE_DEFAULT : cachedUrl }} />
            <View>
                <LabelGeneral label={title} variant='titleMedium' />
                {subtitle && <LabelGeneral label={subtitle} variant='bodySmall' styleProps={{ marginBottom: description ? 5 : 0 }} />}
                {description && <LabelGeneral label={description} variant='bodySmall' styleProps={{ fontSize: 12 }} />}
            </View>
        </View>
    )
}

