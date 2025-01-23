import { IUser } from '@/src/interfaces';
import firestore from '@react-native-firebase/firestore';

export class UserService {
    static getUserByDocId = async (docId: string): Promise<IUser | null> => {
        const user = await firestore().collection('users').doc(docId).get();
        if (!user.exists) return null;
        return user.data() as IUser;
    }
}