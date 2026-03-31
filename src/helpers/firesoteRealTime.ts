import {
    collection,
    doc,
    getFirestore,
    onSnapshot,
    query,
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const db = getFirestore();

/**
 * Suscribe a cambios en una colección de Firestore y ejecuta un callback cuando hay cambios.
 * @param collectionName - Nombre de la colección en Firestore.
 * @param queryFn - Función opcional para aplicar filtros a la consulta.
 * @param callback - Función que recibe los datos actualizados.
 * @returns Función para cancelar la suscripción.
 */
export const subscribeToCollection = <T>(
    collectionName: string,
    queryFn?: (ref: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>) => FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>,
    callback?: (data: T[]) => void
) => {
    const colRef = collection(db, collectionName) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
    const ref: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = queryFn ? queryFn(colRef) : query(colRef);

    return onSnapshot(ref, (snapshot) => {
        const data: T[] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as T));
        if (callback) callback(data);
    });
};

/**
 * Suscribe a un documento en Firestore en tiempo real.
 * @param collectionName - Nombre de la colección.
 * @param docId - ID del documento a escuchar.
 * @param callback - Función que recibe el documento actualizado.
 * @returns Función para cancelar la suscripción.
 */
export const subscribeToDocument = <T>(
    collectionName: string,
    documentId: string,
    callback: (data: T | null) => void
) => {
    return onSnapshot(doc(db, collectionName, documentId), (snapshot) => {
        if (!snapshot.exists()) {
            callback(null);
            return;
        }

        callback({
            id: snapshot.id,
            ...snapshot.data()
        } as T);
    });
};
