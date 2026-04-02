import { FC } from 'react'
import { Dimensions, Modal, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

interface Props {
    visible: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
    snapPoint?: number;
    title?: string
}

const { height } = Dimensions.get('window');

export const ModalGeneral: FC<Props> = ({ children, onDismiss, visible, snapPoint = 0.2, title = 'Modal' }) => {
    const { colors } = useTheme();
    const modalHeight = height * snapPoint;
    return (
        <Modal
            onRequestClose={onDismiss}
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
        >
            {/* Backdrop — toca fuera del sheet para cerrar */}
            <TouchableWithoutFeedback onPress={onDismiss}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    {/* Sheet — bloquea el toque para que no llegue al backdrop */}
                    <View
                        style={{ height: modalHeight, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 }}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={{ flex: 1, backgroundColor: colors.background, overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <Appbar.Header style={{ backgroundColor: colors.background }}>
                                <Appbar.Action icon="close" onPress={onDismiss} />
                                {title && (<Appbar.Content title={title} titleStyle={{ fontSize: 16 }} />)}
                            </Appbar.Header>
                            {children}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
