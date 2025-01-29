import { FC } from 'react'
import { TextStyle } from 'react-native';
import { MD3TypescaleKey, Text } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

interface Props {
    label: string,
    styleProps?: TextStyle;
    onPressText?: () => void;
    variant?: VariantProp<MD3TypescaleKey>;
    numberOfLines?: number
}

export const LabelGeneral: FC<Props> = ({ label, styleProps, onPressText, variant = 'labelMedium', numberOfLines = 2 }) => {
    return (
        <Text variant={variant} style={[styleProps]} onPress={onPressText} numberOfLines={numberOfLines}>
            {label}
        </Text>
    )
}
