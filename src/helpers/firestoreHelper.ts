import {
    addDoc,
    collection as col,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit as firestoreLimit,
    orderBy as firestoreOrderBy,
    query,
    QueryConstraint,
    setDoc,
    startAfter as firestoreStartAfter,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";


interface ICollectionQuery {
    collection: string;
    condition: { field: string; operator: FirebaseFirestoreTypes.WhereFilterOp; value: any }[];
    orderByField?: string;
    orderByDirection?: "asc" | "desc";
    limit?: number;
    startAfterDoc?: FirebaseFirestoreTypes.DocumentData | null;
}

const db = getFirestore();

// Crear un nuevo documento
export const createDocument = async (collectionName: string, data: any) => {
    return await addDoc(col(db, collectionName), data);
};

export const createDocumentId = async (collectionName: string, data: FirebaseFirestoreTypes.DocumentData) => {
    try {
        const docRef = await addDoc(col(db, collectionName), data)
        console.debug('Document written with ID: ', docRef.id);
    } catch (error) {
        console.warn("Error adding document: ", error)
    }
}

// Obtener todos los documentos de una colección
export const getAllDocuments = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const q = query(col(db, collectionName));
    const querySnapshot = await getDocs(q);
    const documents: T[] = [];
    querySnapshot.forEach((document: any) => {
      documents.push(document.data() as T);
    });
    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
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

export const getQueryDocuments = async <T>({
    collection: collectionName,
    condition = [],
    orderByField,
    orderByDirection = "asc",
    limit: limitCount,
    startAfterDoc,
}: ICollectionQuery): Promise<T[]> => {
    const constraints: QueryConstraint[] = [];

    condition.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value));
    });
    if (orderByField) {
        constraints.push(firestoreOrderBy(orderByField, orderByDirection));
    }
    if (limitCount) {
        constraints.push(firestoreLimit(limitCount));
    }
    if (startAfterDoc) {
        const args = Array.isArray(startAfterDoc) ? startAfterDoc : [startAfterDoc];
        constraints.push(firestoreStartAfter(...args));
    }

    const q = query(col(db, collectionName), ...constraints);
    return await getDocs(q).then((querySnapshot) => {
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
    collectionName: string,
    id: string
): Promise<T | null> => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        return { id: docSnap.id, ...docSnap.data() } as T;
    } catch (error) {
        console.error('Error in getDocumentById:', error);
        throw error;
    }
};

// Actualizar un documento existente
export const updateDocument = async (
    collectionName: string,
    id: string,
    data: any
) => {
    return await updateDoc(doc(db, collectionName, id), data);
};

// Eliminar un documento
export const deleteDocument = async (collectionName: string, id: string) => {
    return await deleteDoc(doc(db, collectionName, id));
};

export const getCollection = async <T>(
    collectionName: string,
    whereConstraints: { field: string; operator: FirebaseFirestoreTypes.WhereFilterOp; value: any }[] = []
): Promise<T[]> => {
    try {
        const constraints: QueryConstraint[] = whereConstraints.map(
            ({ field, operator, value }) => where(field, operator, value)
        );
        const q = query(col(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        })) as T[];
    } catch (error) {
        console.error('Error en getCollection:', error);
        return [];
    }
};

export const createDocumentWithLocalId = async <T extends { id?: string }>(
    collectionName: string,
    data: Omit<T, 'id'>
): Promise<T> => {
    try {
        const newDocRef = doc(col(db, collectionName));
        const newId = newDocRef.id;

        const dataWithId = {
            id: newId,
            ...data,
        } as T;

        await setDoc(newDocRef, dataWithId);

        return dataWithId;
    } catch (error) {
        console.error('Error en createDocumentWithLocalId:', error);
        throw new Error('Error al crear el documento con ID local');
    }
};
