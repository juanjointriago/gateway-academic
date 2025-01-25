import { createContext, useContext, useState } from "react";
// import { ButtonAlert, IAlertContext, IAlertProps } from "@/src/interfaces";
import { NAME_APP } from "@/src/constants/Constants";
import { Button, Dialog, Portal } from "react-native-paper";
import { useDisclosure } from "../hook";
import { ButtonAlert, IAlertContext, IAlertProps } from "../interfaces";
import { LabelGeneral } from "../components";

export const AlertContext = createContext({} as IAlertContext);

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const AlertProvider = ({ children }: Props) => {
    const { isOpen, onClose: onCloseModal, onOpen: onOpenModal } = useDisclosure();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [listButtons, setListButtons] = useState<ButtonAlert[]>([]);

    const onToggle = () => {
        if (isOpen) return onCloseModal();
        return onOpenModal();
    };

    const onHandleConfirm = () => {
        onCloseModal();
    };

    const customAlert = ({
        title = NAME_APP,
        message,
        accions = [{ text: 'Aceptar', onPress: onHandleConfirm }]
    }: IAlertProps) => {
        onOpenModal();
        setTitle(title);
        setMessage(message);
        const mappedActions = accions.map((action) => ({
            ...action,
            onPress: () => {
                action.onPress();
                onCloseModal(); // Ensure modal closes after any action
            },
        }));
        setListButtons(mappedActions);
    }

    return (
        <AlertContext.Provider value={{
            customAlert,
            onToggle
        }}>
            {children}
            <Portal>
                <Dialog visible={isOpen} onDismiss={onCloseModal} dismissable={false} dismissableBackButton={false}>
                    <Dialog.Title style={{ fontSize: 18 }}>{title}</Dialog.Title>
                    <Dialog.Content>
                        <LabelGeneral label={message} variant='titleSmall' styleProps={{ fontSize: 13 }} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        {listButtons.map((item, index) => (
                            <Button key={index} onPress={item.onPress}>{item.text}</Button>
                        ))}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};