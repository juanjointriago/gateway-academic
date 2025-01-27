import { createContext, FC, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

export interface PermissionsContextProps {
    permissions: IPermissions;
    loading: boolean;
    errors: {
        camera: string | null;
    };
};


export interface IPermissions {
    camera: boolean | null;
    galery: boolean | null;
}

export const PermissionsContext = createContext<PermissionsContextProps>({} as PermissionsContextProps);

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const PertmissionsProvider: FC<Props> = ({ children }) => {
    const [permissions, setPermissions] = useState<IPermissions>({
        camera: null,
        galery: null
    });

    const [errors, setErrors] = useState({
        camera: null,
        galery: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            setPermissions({
                camera: cameraPermission.status === 'granted',
                galery: galleryPermission.status === 'granted'
            });
        } catch (err: any) {
            setErrors({
                camera: err.message || 'Error al solicitar permiso de cámara',
                galery: err.message || 'Error al solicitar permiso de galería'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PermissionsContext.Provider value={{ permissions, errors, loading }}>
            {children}
        </PermissionsContext.Provider>
    )
}