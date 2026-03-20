import { FC } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

interface Props {
    source: ImageSourcePropType
    width?: number | undefined
    height?: number | undefined
}

export const ImageContainer: FC<Props> = ({ source, width, height }) => {
    return (
        <Image
            style={{ width: width, height: height }}
            source={source}
        />
    )
}
