import * as ImagePicker from "expo-image-picker";
import { PropsFiles } from "../interfaces";
import { SIZEFILEIMG } from "../constants/Constants";

const getPermission = async () => {
    try {
        // Solicitar permisos para la galería
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // Solicitar permisos para la cámara
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        console.log('Estado de permisos - Galería:', galleryStatus, 'Cámara:', cameraStatus);

        // Verificar si los permisos fueron otorgados
        if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
            console.log('Permisos denegados - Galería:', galleryStatus, 'Cámara:', cameraStatus);
            return false;
        }

        return true; // Si todos los permisos fueron otorgados
    } catch (error) {
        console.error('Error al solicitar permisos:', error);
        return false;
    }
};

export const pickImage = async (): Promise<PropsFiles> => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            console.log('Permiso de galería denegado');
            return { error: "Debe aceptar los permisos para acceder a la galería", path: null, fileName: null, type: null };
        }

        console.log('Abriendo galería...');
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        console.log('Resultado de la galería:', result.canceled ? 'Cancelado' : 'Imagen seleccionada');

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const fileSizeInBytes = result.assets[0].fileSize;
            const maxFileSizeInBytes = SIZEFILEIMG;

            if (fileSizeInBytes && fileSizeInBytes > maxFileSizeInBytes) {
                return { error: "El archivo es demasiado grande.", path: null, fileName: null, type: null };
            }

            const name = result.assets[0].uri.split("/").pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(`${name}`);
            const type = match ? `image/${match[1]}` : `image/jpeg`;
            return { path: result.assets[0].uri, fileName: `${name}`, type, error: null };
        } else {
            return { error: "No se seleccionó ninguna imagen.", path: null, fileName: null, type: null };
        }
    } catch (error) {
        console.error('Error al abrir la galería:', error);
        return { error: `Error al abrir la galería: ${error}`, path: null, fileName: null, type: null };
    }
};

export const pickCamera = async (): Promise<PropsFiles> => {
    try {
        // Solicitamos explícitamente los permisos de cámara
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            console.log('Permiso de cámara denegado');
            return { error: "Debe aceptar los permisos para acceder a la cámara", path: null, fileName: null, type: null };
        }

        console.log('Abriendo cámara...');
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            // Aseguramos que use la cámara trasera por defecto
            exif: false,
        });

        console.log('Resultado de la cámara:', result.canceled ? 'Cancelado' : 'Imagen capturada');

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const fileSizeInBytes = result.assets[0].fileSize;
            const maxFileSizeInBytes = SIZEFILEIMG;

            if (fileSizeInBytes && fileSizeInBytes > maxFileSizeInBytes) {
                return { error: "El archivo es demasiado grande.", path: null, fileName: null, type: null };
            }

            const name = result.assets[0].uri.split("/").pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(`${name}`);
            const type = match ? `image/${match[1]}` : `image/jpeg`;
            return { path: result.assets[0].uri, fileName: `${name}`, type: type, error: null };
        } else {
            return { error: "No se seleccionó ninguna imagen.", path: null, fileName: null, type: null };
        }
    } catch (error) {
        console.error('Error al abrir la cámara:', error);
        return { error: `Error al abrir la cámara: ${error}`, path: null, fileName: null, type: null };
    }
};