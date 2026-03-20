import { FC, ReactNode, useState } from 'react';
import { ScrollView, TextStyle, View, ViewStyle, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useDisclosure } from '@/src/hook';
import { useResponsiveScreen } from '@/src/hook/useResponsiveScreen';
import { MORE_ICON } from '@/src/constants/Constants';
import { stylesGlobal } from '@/theme/Styles';

export interface OpcionsHeader {
    icon: string;
    label: string;
    onPress: () => void;
}

export interface Props {
    children?: ReactNode;
    title?: string;
    onBackAction?: () => void;
    titleStyle?: TextStyle;
    containerStyle?: ViewStyle;
    optionsHeader?: OpcionsHeader[];
    hasDrawer?: boolean;
    onPressDrawer?: () => void;
    withScrollView?: boolean;
    onRefresh?: () => void;
}

export const LayoutGeneral: FC<Props> = ({ children, containerStyle, hasDrawer, onBackAction, onPressDrawer, optionsHeader = [], title, titleStyle, withScrollView, onRefresh }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isTablet, isLargeScreen, isLandscape } = useResponsiveScreen();

    // Estilos responsivos
    const responsiveContainerStyle: ViewStyle = {
        ...stylesGlobal.container,
        backgroundColor: colors.background,
        paddingHorizontal: isTablet ? (isLargeScreen ? 32 : 24) : 16,
        maxWidth: isTablet ? (isLandscape ? '100%' : 800) : '100%',
        alignSelf: 'center',
        width: '100%',
    };

    const responsiveHeaderStyle = {
        backgroundColor: colors.background,
        elevation: isTablet ? 2 : 4,
    };

    return (
        <>
            <Appbar.Header style={responsiveHeaderStyle}>
                {onBackAction && <Appbar.BackAction onPress={onBackAction} animated={false} />}
                {title && (<Appbar.Content title={title} titleStyle={{ ...titleStyle, fontSize: isTablet ? 20 : 18 }} />)}
                {hasDrawer && <Appbar.Action icon={() => <MaterialIcons name="menu" size={isTablet ? 28 : 24} color={colors.primary} />} onPress={onPressDrawer} animated={false} />}
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
                                titleStyle={{ fontSize: 14 }}
                            />
                        ))}
                    </Menu>
                )}
            </Appbar.Header>
            {withScrollView ? (
                <ScrollView
                    contentContainerStyle={[containerStyle, { flexGrow: 1 }]}
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    style={[responsiveContainerStyle, containerStyle]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={async () => {
                                setRefreshing(true);
                                if (onRefresh) await onRefresh();
                                setRefreshing(false);
                            }}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[responsiveContainerStyle, containerStyle]}>{children}</View>
            )}
        </>
    )
}
