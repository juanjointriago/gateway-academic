import { getDocumentById } from '@/src/helpers/firestoreHelper';
import { IUser } from '@/src/interfaces';

export class UserService {
    static getUserByDocId = async (docId: string): Promise<IUser | null> => {
        const user = await getDocumentById<IUser>('users', docId);
        if (!user) return null;
        return user;
    }

    static registerUser = async (user: IUser) => {
        try {

        } catch (error) {

        }
    }
}