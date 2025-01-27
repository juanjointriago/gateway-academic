import * as ImagePicker from "expo-image-picker";
import { PropsFiles } from "../interfaces";
import { SIZEFILEIMG } from "../constants/Constants";

const getPermission = async () => {
    // Solicitar permisos para la galería
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // Solicitar permisos para la cámara
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

    // Verificar si los permisos fueron otorgados
    if (!cameraStatus || galleryStatus !== 'granted') {
        throw new Error("Debe aceptar los permisos para acceder a la cámara y la galería.");
    }

    return true; // Si todos los permisos fueron otorgados
};

export const pickImage = async (): Promise<PropsFiles> => {
    const hasPermission = await getPermission();
    if (!hasPermission) return { error: "Debe aceptar los permisos para acceder a la galeria", path: null, fileName: null, type: null };

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
    });

    if (!result.canceled) {
        const fileSizeInBytes = result.assets[0].fileSize;
        const maxFileSizeInBytes = SIZEFILEIMG;

        if (fileSizeInBytes! > maxFileSizeInBytes) {
            return { error: "El archivo es demasiado grande.", path: null, fileName: null, type: null };
        }

        const name = result.assets[0].uri.split("/").pop();
        const match = /\.(\w+)$/.exec(`${name}`);
        const type = match ? `image/${match[1]}` : `image`;
        return { path: result.assets[0].uri, fileName: `${name}`, type, error: null };
    } else {
        return { error: "No se seleccionó ninguna imagen.", path: null, fileName: null, type: null };
    }
};

export const pickCamera = async (): Promise<PropsFiles> => {
    const hasPermission = await getPermission();
    if (!hasPermission) return { error: "Debe aceptar los permisos para acceder a la cámara", path: null, fileName: null, type: null };

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.7,
    });

    if (!result.canceled) {
        const fileSizeInBytes = result.assets[0].fileSize;
        const maxFileSizeInBytes = SIZEFILEIMG;

        if (fileSizeInBytes! > maxFileSizeInBytes) {
            return { error: "El archivo es demasiado grande.", path: null, fileName: null, type: null };
        }

        const name = result.assets[0].uri.split("/").pop();
        const match = /\.(\w+)$/.exec(`${name}`);
        const type = match ? `image/${match[1]}` : `image`;
        return { path: result.assets[0].uri, fileName: `${name}`, type: type, error: null };
    } else {
        return { error: "No se seleccionó ninguna imagen.", path: null, fileName: null, type: null };
    }
};