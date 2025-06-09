import firestore from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

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

interface QueryCondition {
    field: string;
    operator: FirebaseFirestoreTypes.WhereFilterOp;
    value: any;
}

interface QueryOptions {
    collection: string;
    condition?: QueryCondition[];
}

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
    try {
        const db = firestore();
        const doc = await db.collection(collection).doc(id).get();
        
        if (!doc.exists) return null;
        
        return { id: doc.id, ...doc.data() } as T;
    } catch (error) {
        console.error('Error in getDocumentById:', error);
        throw error;
    }
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

/**
 * Obtiene documentos de una colección con restricciones opcionales
 * @param collection Nombre de la colección
 * @param constraints Restricciones de consulta (where)
 * @returns Array de documentos tipados
 */
export const getCollection = async <T>(
    collection: string,
    constraints: { field: string; operator: FirebaseFirestoreTypes.WhereFilterOp; value: any }[] = []
): Promise<T[]> => {
    try {
        const query = firestore().collection(collection);
        
        // Si hay restricciones, las aplicamos
        let constrainedQuery: FirebaseFirestoreTypes.Query = query;
        if (constraints.length > 0) {
            constraints.forEach(({ field, operator, value }) => {
                constrainedQuery = constrainedQuery.where(field, operator, value);
            });
        }

        const querySnapshot = await constrainedQuery.get();
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    } catch (error) {
        console.error('Error en getCollection:', error);
        return [];
    }
};