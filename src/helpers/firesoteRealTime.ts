import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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
    let ref: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection(collectionName);

    if (queryFn) {
        ref = queryFn(ref as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>);
    }

    const unsubscribe = ref.onSnapshot((snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        if (callback) callback(data);
    });

    return unsubscribe;
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
    docId: string,
    callback?: (data: T | null) => void
) => {
    const ref = firestore().collection(collectionName).doc(docId);

    const unsubscribe = ref.onSnapshot((doc) => {
        if (callback) callback(doc.exists ? ({ id: doc.id, ...doc.data() } as T) : null);
    });

    return unsubscribe;
};