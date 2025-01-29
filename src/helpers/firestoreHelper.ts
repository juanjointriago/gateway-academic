import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface ICollectionQuery {
    collection: string;
    condition: { field: string; operator: FirebaseFirestoreTypes.WhereFilterOp; value: any }[];
    orderByField?: string;
    orderByDirection?: "asc" | "desc";
    limit?: number;
    startAfterDoc?: FirebaseFirestoreTypes.DocumentData | null;
}

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

export const getQueryDocuments = async <T>({ collection, condition = [], orderByField, orderByDirection = "asc", limit, startAfterDoc }: ICollectionQuery): Promise<T[]> => {
    let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection(collection);
    condition.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
    });
    if (orderByField) {
        query = query.orderBy(orderByField, orderByDirection);
    }
    if (limit) {
        query = query.limit(limit);
    }

    if (startAfterDoc) {
        query = query.startAfter(
            ...(Array.isArray(startAfterDoc) ? startAfterDoc : [startAfterDoc])
        );
    }

    return await query.get().then((querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((documentSnapshot) => {
            documents.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
            } as T);
        });
        return documents;
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        return [];
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