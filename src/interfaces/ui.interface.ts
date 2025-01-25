export interface IAlertContext {
    customAlert: (props: IAlertProps) => void;
    onToggle?: () => void;
}

export interface ButtonAlert {
    text: string,
    onPress: () => void
}

export interface IAlertProps {
    title?: string,
    message: string,
    accions?: ButtonAlert[],
}