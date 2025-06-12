import { getFirestore, collection, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FirestoreUser, IUser } from '@/src/interfaces';
import { IFiles } from '@/src/components';
import { USER_COLLECTION } from '@/src/constants/ContantsFirebase';
import firestore from '@react-native-firebase/firestore';
import { getAllDocuments } from '@/src/helpers/firestoreHelper';


export class UserService {
    static getUsers = async () => await getAllDocuments<FirestoreUser>(USER_COLLECTION);
    static getUserByDocId = async (docId: string): Promise<IUser | null> => {
        try {
            const userDoc = await firestore()
            .collection(USER_COLLECTION)
            .where('uid', '==', docId)
            .get().then(snapshot => {
                if (snapshot.empty) return null;
                return snapshot.docs[0];
            } );
            return userDoc ? (userDoc.data() as IUser) : null;

        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    static updateUser = async (user: IUser | any) => {
        try {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, user);
            return user;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
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
            const user = await this.getUserByDocId(uid);
            if (!user) throw new Error('El usuario no existe en la base de datos.');
            if (user.photoUrl) {
                const fileRef = storage().refFromURL(user.photoUrl);
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