import { FC } from 'react'
import { ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

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
            icon={icon}
        >
            {text}
        </Button>
    )
}
