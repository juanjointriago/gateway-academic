import { FC, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { stylesGlobal } from '@/theme/Styles';

interface Props {
    children?: ReactNode;
    title?: string;
    onBackAction?: () => void;
    titleStyle?: TextStyle;
    containerStyle?: ViewStyle;
    hasAppBar?: boolean;
    withScrollView?: boolean;
}

export const LayoutAuth: FC<Props> = ({ children, hasAppBar = true, onBackAction, containerStyle, title, titleStyle, withScrollView = false }) => {
    const { colors } = useTheme();
    return (
        <>
            {
                hasAppBar && (
                    <Appbar.Header style={{ backgroundColor: colors.background }}>
                        {onBackAction && <Appbar.BackAction onPress={onBackAction} />}
                        {title && (<Appbar.Content title={title} titleStyle={{ ...titleStyle, fontSize: 16 }} />)}
                    </Appbar.Header>
                )
            }
            <KeyboardAvoidingView
                style={stylesGlobal.containerAppBar}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}
