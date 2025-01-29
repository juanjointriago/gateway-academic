import { FC, useMemo } from 'react'
import { ViewStyle } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'
import { LabelGeneral } from '../labels'

type mode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
interface Props {
    onPress?: () => void
    loading?: boolean
    disabled?: boolean
    styleBtn?: ViewStyle
    text?: string
    icon?: IconSource
    mode?: mode
}

export const ButtonGeneral: FC<Props> = ({ onPress, loading, disabled, styleBtn, text = 'Boton', icon, mode = 'outlined' }) => {
    const { colors } = useTheme();

    const colorText = useMemo(() =>
        mode === 'elevated' ? colors.primary :
            mode === 'contained' ? colors.onPrimary : 
            mode === 'contained-tonal' ? colors.onSecondaryContainer : 
            mode === 'outlined' ? colors.primary : 
            mode === 'text' ? colors.primary : colors.primary, [mode, colors])

    return (
        <Button
            onPress={onPress}
            mode={mode}
            loading={loading}
            disabled={disabled}
            style={{
                borderRadius: 6,
                height: 45,
                ...styleBtn,
            }}
            contentStyle={{ height: 45 }}
            icon={icon}
        >
            <LabelGeneral label={text} styleProps={{ color: colorText, fontSize: 14 }} variant='titleMedium' />
        </Button>
    )
}
