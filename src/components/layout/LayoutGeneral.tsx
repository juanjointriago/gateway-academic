import { FC, ReactNode } from 'react';
import { Platform, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useDisclosure } from '@/src/hook';
import { MORE_ICON } from '@/src/constants/Constants';
import { stylesGlobal } from '@/theme/Styles';

export interface OpcionsHeader {
    icon: string;
    label: string;
    onPress: () => void;
}

interface Props {
    children?: ReactNode;
    title?: string;
    onBackAction?: () => void;
    titleStyle?: TextStyle;
    containerStyle?: ViewStyle;
    optionsHeader?: OpcionsHeader[];
    hasDrawer?: boolean;
    onPressDrawer?: () => void;
    withScrollView?: boolean;
}

export const LayoutGeneral: FC<Props> = ({ children, containerStyle, hasDrawer, onBackAction, onPressDrawer, optionsHeader = [], title, titleStyle, withScrollView }) => {
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Appbar.Header style={{ height: Platform.OS === 'ios' ? 60 : undefined }}>
                {onBackAction && <Appbar.BackAction onPress={onBackAction} animated={false} />}
                {title && (<Appbar.Content title={title} titleStyle={{ ...titleStyle, fontSize: 18 }} />)}
                {hasDrawer && <Appbar.Action icon={() => <MaterialIcons name="menu" size={24} color={colors.primary} />} onPress={onPressDrawer} animated={false} />}
                {optionsHeader.length > 0 && (
                    <Menu
                        visible={isOpen}
                        onDismiss={onClose}
                        anchor={<Appbar.Action icon={MORE_ICON} onPress={onOpen} animated={false} />}
                        style={{
                            marginTop: 50,
                        }}
                    >
                        {optionsHeader.map(({ icon, label, onPress }, index) => (
                            <Menu.Item
                                key={index}
                                onPress={() => {
                                    onPress();
                                    onClose();
                                }}
                                title={label}
                                leadingIcon={icon}
                                titleStyle={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                            />
                        ))}
                    </Menu>
                )}
            </Appbar.Header>
            {withScrollView ? (
                <ScrollView
                    contentContainerStyle={containerStyle}
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    style={[containerStyle, { ...stylesGlobal.container, backgroundColor: colors.background }]}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[containerStyle, { ...stylesGlobal.container, backgroundColor: colors.background }]}>{children}</View>
            )}
        </>
    )
}
