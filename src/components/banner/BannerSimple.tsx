import { useDisclosure } from '@/src/hook'
import { FC, useCallback } from 'react'
import { Banner, Icon, useTheme } from 'react-native-paper';
import { LabelGeneral } from '../labels';

interface Props {
  iconName?: string
  description?: string
  isOpen: boolean
}

export const BannerSimple: FC<Props> = ({ iconName = 'file-table-box', description = '', isOpen }) => {
  const { colors } = useTheme();

  const renderIcon = useCallback(({ size }: { size: number }) => (
    <Icon source={iconName} size={size} color={colors.primary} />
  ), [iconName, colors]);

  return (
    <Banner
      visible={isOpen}
      icon={renderIcon}
      style={{ marginBottom: 10 }}
    >
      <LabelGeneral label={description} styleProps={{ fontSize: 12 }} variant='bodySmall' />
    </Banner>
  )
}
