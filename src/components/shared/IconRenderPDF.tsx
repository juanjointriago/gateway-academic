import { FC, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import WebView from 'react-native-webview'
import { useDisclosure } from '@/src/hook'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import { ModalGeneral } from '../modal'
import { LottiesGeneral } from '../lotties'

interface Props {
    iconName?: string
    size?: number
    color?: string
    url: string
    titleModal?: string
}

const getPdfUrl = (url: string) => {
    if (Platform.OS === 'ios') {
        return url
    }
    return `https://docs.google.com/gviewer?url=${encodeURIComponent(url)}&embedded=true`
}

export const IconRenderPDF: FC<Props> = ({ color = '#3eb798', iconName = 'folder-open', size = 24, url, titleModal = 'PDF' }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleOpen = () => {
        setIsLoading(true)
        setHasError(false)
        onOpen()
    }

    return (
        <>
            <IconButton icon={iconName} size={size} onPress={handleOpen} iconColor={color} />
            <ModalGeneral onDismiss={onClose} visible={isOpen} title={titleModal} snapPoint={0.8}>
                {hasError ? (
                    <LottiesGeneral animation='empty' description='No se ha podido cargar el PDF' />
                ) : (
                    <View style={styles.container}>
                        <WebView
                            source={{ uri: getPdfUrl(url) }}
                            style={styles.webview}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false)
                                setHasError(true)
                            }}
                            originWhitelist={['*']}
                            javaScriptEnabled
                            scalesPageToFit
                        />
                        {isLoading && (
                            <View style={styles.loader}>
                                <ActivityIndicator size='large' />
                            </View>
                        )}
                    </View>
                )}
            </ModalGeneral>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
