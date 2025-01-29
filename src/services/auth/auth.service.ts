import auth, { FirebaseAuthTypes, updateProfile } from '@react-native-firebase/auth';
import { IResLocalFirebase, IUser, LoginSchemaType, RegisterSchemaType } from "@/src/interfaces";
import { firebaseErrorMessages } from '@/src/constants/ConstantsErrors';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { format } from 'date-fns';
import { createDocumentId, getDocumentById } from '@/src/helpers/firestoreHelper';
import { USER_COLLECTION } from '@/src/constants/ContantsFirebase';

export class AuthService {
    static login = async ({ email, password }: LoginSchemaType): Promise<IResLocalFirebase<IUser>> => {
        try {
            const user = await auth().signInWithEmailAndPassword(email, password);
            const userFind = await getDocumentById<IUser>(USER_COLLECTION, user.user.uid);
            if (!userFind) {
                await auth().signOut();
                throw new Error('El usuario no existe en la base de datos.');
            }
            return { data: userFind, error: null };
        } catch (error: any) {
            console.debug('Login error:', error);
            return { data: null, error: firebaseErrorMessages[error.code] ?? error.message ?? 'Ha ocurrido un error inesperado.' };
        }
    }

    static loginWithGoogle = async (): Promise<IUser> => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            if (!isSuccessResponse(response)) throw new Error('Ha ocurrido un error inesperado.');
            const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            const userFind = await getDocumentById<IUser>('users', userCredential.user.uid);
            if (!userFind) {
                const newUser = {
                    uid: userCredential.user.uid,
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName ?? '',
                    email: userCredential.user.email ?? '',
                    role: 'student' as IUser["role"],
                    photoUrl: userCredential.user.photoURL ?? '',
                    phone: '',
                    address: '',
                    bornDate: '',
                    cc: '',
                    city: '',
                    country: '',
                    isActive: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }
                await createDocumentId(USER_COLLECTION, userCredential.user.uid, newUser);
                return {
                    ...newUser,
                    teacherLink: '',
                    subLevel: '',
                    level: '',
                    unitsForBooks: [],
                };
            }
            return userFind;
        } catch (error: any) {
            console.debug('Login with Google error:', error);
            throw new Error(firebaseErrorMessages[error.code] ?? 'Ha ocurrido un error inesperado.');
        }
    }

    static registerWithEmail = async (user: RegisterSchemaType): Promise<IResLocalFirebase<FirebaseAuthTypes.User>> => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(user.email, user.password!);
            if (!userCredential.user) {
                throw new Error('No se pudo crear el usuario.');
            }
            const dataUser = {
                uid: userCredential.user.uid,
                id: userCredential.user.uid,
                name: user.name,
                email: user.email,
                role: user.role ?? 'student',
                photoUrl: userCredential.user.photoURL ?? '',
                phone: user.phone,
                address: user.address,
                bornDate: format(user.bornDate, 'yyyy-MM-dd'),
                cc: user.cc,
                city: user.city.value,
                country: user.country.value,
                isActive: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            await updateProfile(userCredential.user, {
                displayName: user.name
            });
            await createDocumentId(USER_COLLECTION, userCredential.user.uid, dataUser);
            await auth().signOut();
            return { data: userCredential.user, error: null };
        } catch (error: any) {
            console.debug('Registration error ===>:', error);
            return { data: null, error: firebaseErrorMessages[error.code] ?? error.message ?? 'Ha ocurrido un error inesperado.' };
        }
    }

    static logout = async (): Promise<void> => {
        await auth().signOut();
    }
}