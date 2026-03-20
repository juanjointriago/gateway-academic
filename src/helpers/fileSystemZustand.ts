import * as FileSystem from "expo-file-system";

const getFilePath = (key: string) => `${FileSystem.documentDirectory}${key}.json`;

export const fileStorage = {
    getItem: async (name: string) => {
        try {
            const path = getFilePath(name);
            const fileInfo = await FileSystem.getInfoAsync(path);
            if (!fileInfo.exists) return null; // Si el archivo no existe, retornamos null para evitar errores
            const data = await FileSystem.readAsStringAsync(path);
            return data; // `zustand/persist` espera un string
        } catch (error) {
            console.error(`Error al leer ${name}:`, error);
            return null;
        }
    },
    setItem: async (name: string, value: string) => {
        try {
            const path = getFilePath(name);
            await FileSystem.writeAsStringAsync(path, value);
        } catch (error) {
            console.error(`Error al guardar ${name}:`, error);
        }
    },
    removeItem: async (name: string) => {
        try {
            const path = getFilePath(name);
            await FileSystem.deleteAsync(path, { idempotent: true });
        } catch (error) {
            console.error(`Error al eliminar ${name}:`, error);
        }
    },
};