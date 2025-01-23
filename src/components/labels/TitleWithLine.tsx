import { FC } from 'react'
import { View } from 'react-native'
import { Divider } from 'react-native-paper'
import { LabelGeneral } from './LabelGeneral'
import { stylesGlobal } from '@/theme/Styles'

interface Props {
    title: string
}
export const TitleWithLine: FC<Props> = ({ title }) => {
    return (
        <View style={stylesGlobal.containerTextWithLine}>
            <Divider style={stylesGlobal.lineInText} />
            <LabelGeneral label={title} styleProps={{ fontSize: 10, marginHorizontal: 8 }} variant='titleSmall' />
            <Divider style={stylesGlobal.lineInText} />
        </View>
    )
}
