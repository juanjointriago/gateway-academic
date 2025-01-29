import { getDocumentById, updateDocument } from '@/src/helpers/firestoreHelper';
import storage from '@react-native-firebase/storage';
import { IUser } from '@/src/interfaces';
import { IFiles } from '@/src/components';
import { USER_COLLECTION } from '@/src/constants/ContantsFirebase';

export class UserService {
    static getUserByDocId = async (docId: string): Promise<IUser | null> => {
        const user = await getDocumentById<IUser>(USER_COLLECTION, docId);
        if (!user) return null;
        return user;
    }

    static updateUser = async (user: IUser) => {
        const userFind = await getDocumentById<IUser>(USER_COLLECTION, user.uid);
        if (!userFind) return null;
        await updateDocument(USER_COLLECTION, user.uid, user);
        return userFind;
    }

    static uploadFile = async (file: IFiles): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const fileRef = storage().ref(`profile/${fileName}`);
            const task = fileRef.putFile(file.uri);
            await task;
            const url = await fileRef.getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    }

    static updateFile = async (uid: string, file: IFiles): Promise<string | null> => {
        try {
            const userFind = await getDocumentById<IUser>(USER_COLLECTION, uid);
            if (!userFind) throw new Error('El usuario no existe en la base de datos.');
            if (userFind.photoUrl) {
                const fileRef = storage().refFromURL(userFind.photoUrl);
                await fileRef.delete();
            }
            const url = await this.uploadFile(file);
            if (!url) throw new Error('Ha ocurrido un error al subir la imagen');
            // await updateDocument(USER_COLLECTION, uid, { photoUrl: url });
            return url;
        } catch (error) {
            console.error('Error updating file:', error);
            return null;
        }
    }
}