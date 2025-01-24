import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { IUser, LoginSchemaType } from "@/src/interfaces";
import { firebaseErrorMessages } from '@/src/constants/ConstantsErrors';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

export class AuthService {
    static login = async ({ email, password }: LoginSchemaType): Promise<IUser> => {
        try {
            const user = await auth().signInWithEmailAndPassword(email, password);
            const userFind = await firestore().collection('users').doc(user.user.uid).get();
            if (!userFind.exists) {
                await auth().signOut();
                throw new Error('El usuario no existe en la base de datos.');
            }
            return userFind.data() as IUser;
        } catch (error: any) {
            console.debug('Login error:', error.message);
            throw new Error(firebaseErrorMessages[error.code] ?? 'Ha ocurrido un error inesperado.');
        }
    }

    static loginWithGoogle = async () : Promise<IUser> => {
        try {
            const response = await GoogleSignin.signIn();
            if(!isSuccessResponse(response)) throw new Error('Ha ocurrido un error inesperado.');
            const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            const userFind = await firestore().collection('users').doc(userCredential.user.uid).get();
            if (!userFind.exists) {
                const newUser: IUser = {
                    email: userCredential.user.email ?? '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                    role: 'student',
                    level: '',
                    subLevel: '',
                    teacherLink: '',
                    unitForBooks: [],
                    address: '',
                    bornDate: '',
                    cc: '',
                    city: '',
                    country: '',
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName ?? '',
                    phone: '',
                    uid: userCredential.user.uid,
                    photoUrl: userCredential.user.photoURL ?? '',
                }
                await firestore().collection('users').doc(userCredential.user.uid).set(newUser);
                return newUser;
            }
            return userFind.data() as IUser;
        } catch (error: any) {
            console.debug('Login with Google error:', error);
            throw new Error(firebaseErrorMessages[error.code] ?? 'Ha ocurrido un error inesperado.');
        }
    }

    static registerWithEmail = async ({ email, password }: LoginSchemaType): Promise<FirebaseAuthTypes.User> => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error: any) {
            console.debug('Registration error:', error.message);
            throw new Error(firebaseErrorMessages[error.code] ?? 'Ha ocurrido un error inesperado.');
        }
    }

    static logout = async (): Promise<void> => {
        try {
            await auth().signOut();
        } catch (error: any) {
            console.debug('Logout error:', error.message);
            throw new Error(firebaseErrorMessages[error.code] ?? 'Ha ocurrido un error inesperado.');
        }
    }
}