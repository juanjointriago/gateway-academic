import { ISection } from '@/src/interfaces'
import { FC } from 'react'
import { List, useTheme } from 'react-native-paper'

interface Prosp {
    title: string
    setionsList: ISection[]
}
export const Section: FC<Prosp> = ({ setionsList, title }) => {
    const { colors } = useTheme();
    return (
        <List.Section>
            <List.Subheader variant='titleSmall' numberOfLines={2} style={{ marginBottom: 20, fontFamily: 'Montserrat_500Medium' }}>{title}</List.Subheader>
            {
                setionsList.map((item, index) => (
                    <List.Item
                        key={index}
                        title={item.title}
                        left={() => <List.Icon icon={item.nameIcon} color={colors.primary} />}
                        description={item.description}
                        titleStyle={{ fontSize: 14, fontFamily: 'Montserrat_500Medium' }}
                    />
                ))
            }
        </List.Section>
    )
}
