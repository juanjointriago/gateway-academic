import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export const mapFirestoreData = <T>(snapshot: FirebaseFirestoreTypes.QuerySnapshot): T[] => {
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as T[];
};