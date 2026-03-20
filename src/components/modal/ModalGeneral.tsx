import { FC } from 'react'
import { Dimensions, Modal, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
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
            onDismiss={onDismiss}
            visible={visible}
            animationType="slide"
            transparent
        >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <View style={{ height: modalHeight, backgroundColor: colors.background, overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 }}>
                    <Appbar.Header style={{ backgroundColor: colors.background }}>
                        <Appbar.Action icon="close" onPress={onDismiss} />
                        {title && (<Appbar.Content title={title} titleStyle={{ fontSize: 16 }} />)}
                    </Appbar.Header>
                    {children}
                </View>
            </View>
        </Modal>
    )
}
