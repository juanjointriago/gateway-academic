import { FC } from 'react'
import { ViewStyle } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'
import { LabelGeneral } from '../labels'

type mode = "text" | "contained-tonal" | "outlined" | "contained" | "elevated"
interface Props {
    onPress?: () => void
    loading?: boolean
    disabled?: boolean
    styleBtn?: ViewStyle
    text?: string
    icon?: IconSource
    mode?: mode
}

export const ButtonGeneral: FC<Props> = ({ onPress, loading, disabled, styleBtn, text = 'Boton', icon, mode = 'elevated' }) => {
    const {colors} = useTheme();
    return (
        <Button
            onPress={onPress}
            mode={mode}
            loading={loading}
            disabled={disabled}
            style={{
                borderRadius: 6,
                ...styleBtn,
            }}
            contentStyle={{ height: 45 }}
            icon={icon}
        >
            <LabelGeneral label={text} variant='titleSmall' styleProps={{ color: colors.onPrimary }} />
        </Button>
    )
}
