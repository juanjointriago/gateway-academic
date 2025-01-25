import { FC } from 'react'
import LottieView from "lottie-react-native";
import { DimensionValue, View, ViewStyle } from 'react-native';
import { LabelGeneral } from '../labels';

import loading from '../../assets/lotties/loading.json';
import empty from '../../assets/lotties/empty.json';

const Lotties = {
    loading,
    empty,
}

type ANIMATION = keyof typeof Lotties;

interface Props {
    animation: ANIMATION,
    loop?: boolean;
    autoplay?: boolean;
    description?: string;
    height?: DimensionValue;
    width?: DimensionValue;
    styleContainer?: ViewStyle;
}

export const LottiesGeneral: FC<Props> = ({ animation, autoplay = true, loop = true, description = '', height = '50%', width = '100%', styleContainer }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', ...styleContainer }}>
            <LottieView
                source={Lotties[animation]}
                autoPlay={autoplay}
                loop={loop}
                style={{ width, height }}
            />
            <LabelGeneral label={description} variant='titleSmall' />
        </View>
    )
}
