import { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, useTheme } from 'react-native-paper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LabelGeneral } from '../labels'

interface Props {
    avatarText?: string
    avatarImage?: string
    avatarIcon?: string
    size?: number
    title: string
    description?: string
    onPress?: () => void
    color?: string
}

export const ButtonSelectable: FC<Props> = ({ avatarText, avatarImage, avatarIcon, size = 24, onPress, title, description = '', color = 'red' }) => {
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 }} onPress={onPress} activeOpacity={0.8}>
            {avatarIcon && <Avatar.Icon size={size} icon={avatarIcon} style={{ backgroundColor: color }} />}
            {avatarImage && <Avatar.Image size={size} source={{ uri: avatarImage }} />}
            {avatarText && <Avatar.Text size={size} label={avatarText} />}
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1, alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <LabelGeneral label={title} variant='titleSmall' />
                        {description && <LabelGeneral label={description} variant='bodySmall' />}
                    </View>
                </View>
            </View>
            {onPress && <MaterialIcons name="keyboard-arrow-right" size={24} color={color} />}
        </TouchableOpacity>
    )
}
