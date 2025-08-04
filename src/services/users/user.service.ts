import { FirestoreUser, ImageInfo, IUser } from '@/src/interfaces';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { USER_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments } from "@/src/helpers/firestoreHelper";
import { updateItem } from "@/src/helpers/operations.firestore";

export class UserService {
  static getUsers = async () =>
    await getAllDocuments<FirestoreUser>(USER_COLLECTION);
  static getUserByDocId = async (docId: string): Promise<IUser | null> => {
    try {
      const userDoc = await firestore()
        .collection(USER_COLLECTION)
        .where("uid", "==", docId)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) return null;
          return snapshot.docs[0];
        });
      return userDoc ? (userDoc.data() as IUser) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  };

  static updateUser = async (user: IUser | any) => {
    try {
    //   const db = getFirestore();
    //   const userRef = doc(db, USER_COLLECTION, user.uid);
    //   await updateDoc(userRef, user);
    await updateItem(USER_COLLECTION, {...user, updatedAt: new Date().getTime()});

      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  /**
   * Actualiza el perfil del usuario, incluyendo su foto si se proporciona
   */
  static updateFile = async (uid: string, photo: ImageInfo): Promise<string | undefined> => {
    try {
      if (!photo?.uri) {
        console.log('No se proporcionó imagen para actualizar');
        return undefined;
      }

      console.log('Iniciando actualización de foto para usuario:', uid);
      
      // Pasar el tipo de imagen como tercer parámetro
      const downloadURL = await UserService.uploadFile(
        photo.uri, 
        `users/${uid}`, 
        photo.type || 'image/jpeg'
      );
      const updatedUser = {
        id: uid,
        photoUrl: downloadURL,
        updatedAt: Date.now()
      }
      await updateItem(USER_COLLECTION, updatedUser);
      
      console.log('Foto actualizada exitosamente:', downloadURL);

      return downloadURL;
    } catch (error:any) {
      console.error('Error updating file:', error);
      throw new Error(`Error al actualizar el archivo: ${error.message}`);
    }
  };

  /**
   * Sube un archivo a Firebase Storage y devuelve la URL
   */
  static uploadFile = async (
    fileUri: string, 
    storagePath: string,
    fileType: string = 'image/jpeg'
  ): Promise<string> => {
    try {
      console.log('Subiendo archivo:', fileUri);
      console.log('Tipo de archivo:', fileType);
      
      // Verificar que el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('El archivo no existe en la ruta especificada');
      }
      
      console.log('Tamaño del archivo:', fileInfo.size);
      

      // Usar fetch para obtener el blob directamente
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      // Usar API modular de Firebase Storage
      const storage = getStorage();
      const fileName = `photo_${Date.now()}.jpg`;
      const storageRef = ref(storage, `${storagePath}/${fileName}`);
      
      // Subir con monitoreo de progreso
      const uploadTask = uploadBytesResumable(storageRef, blob as Blob, );
      
      // Monitorear progreso
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error('Error durante la subida:', error);
          throw error;
        }
      );
      
      // Esperar a que termine la subida
      await uploadTask;
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Archivo subido exitosamente, URL:', downloadURL);
      
      return downloadURL;
    } catch (error:any) {
      console.error('Error detallado:', JSON.stringify(error));
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }
  };
}
