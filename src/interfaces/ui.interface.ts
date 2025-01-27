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

export interface ISection {
    title: string;
    description?: string;
    nameIcon: string;
}

export interface PropsFiles {
    error: string | null,
    path: string | null,
    fileName: string | null,
    type: string | null
}  