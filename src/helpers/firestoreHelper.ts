import firestore from "@react-native-firebase/firestore";

// Crear un nuevo documento
export const createDocument = async (collection: string, data: any) => {
    return await firestore().collection(collection).add(data);
};

// Crear un nuevo documento con id presonalizada
export const createDocumentId = async (
    collection: string,
    id: string,
    data: any
) => {
    return await firestore().collection(collection).doc(id).set(data);
};

// Obtener todos los documentos de una colección
export const getAllDocuments = async <T>(collection: string): Promise<T[]> => {
    return await firestore()
        .collection(collection)
        .get()
        .then((querySnapshot) => {
            const documents: T[] = [];
            querySnapshot.forEach((documentSnapshot) => {
                documents.push({
                    id: documentSnapshot.id,
                    ...documentSnapshot.data(),
                } as T);
            });
            return documents;
        });
};

// Obtener un documento por su ID
export const getDocumentById = async <T>(
    collection: string,
    id: string
): Promise<T | null> => {
    return await firestore()
        .collection(collection)
        .doc(id)
        .get()
        .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
                return {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data(),
                } as T;
            }
            return null;
        });
};

// Actualizar un documento existente
export const updateDocument = async (
    collection: string,
    id: string,
    data: any
) => {
    return await firestore().collection(collection).doc(id).update(data);
};

// Eliminar un documento
export const deleteDocument = async (collection: string, id: string) => {
    return await firestore().collection(collection).doc(id).delete();
};