import { FC, useState } from 'react'
import * as FileSystem from 'expo-file-system'
import { useDisclosure } from '@/src/hook'
import { IconButton } from 'react-native-paper'
import { ModalGeneral } from '../modal'
import { LottiesGeneral } from '../lotties'
import Pdf from 'react-native-pdf'

interface Props {
    iconName?: string
    size?: number
    color?: string
    url: string
    titleModal?: string
}
export const IconRenderPDF: FC<Props> = ({ color = '#3eb798', iconName = 'folder-open', size = 24, url, titleModal = 'PDF' }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false);
    const [fileUri, setFileUri] = useState<string | null>(null);

    const toogleOpenModal = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error('Invalid URL');
            }
            const fileUri = FileSystem.documentDirectory + 'pdfFile.pdf';
            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            setFileUri(uri);
        } catch (error) {
            console.debug("Error downloading the PDF: ", error);
            setFileUri(null);
        } finally {
            setIsLoading(false);
            onOpen();
        }
    }

    const toogleCloseModal = async () => {
        onClose();
        setFileUri(null);
        if(fileUri) await FileSystem.deleteAsync(fileUri).then(() => console.debug('PDF deleted')).catch((error) => console.error("Error deleting the PDF: ", error));
    }


    return (
        <>
            <IconButton icon={iconName} size={size} onPress={toogleOpenModal} iconColor={color} loading={isLoading} disabled={isLoading} />
            <ModalGeneral onDismiss={toogleCloseModal} visible={isOpen} title={titleModal} snapPoint={0.8}>
                {!fileUri ?
                    <LottiesGeneral animation='empty' description='No se ha podido cargar el PDF' /> :
                    (
                        <Pdf
                            source={{ uri: fileUri, cache: true }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.debug(`number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.debug(`current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.debug(error);
                            }}
                            style={{ flex: 1 }}
                        />
                    )}
            </ModalGeneral>
        </>
    )
}
