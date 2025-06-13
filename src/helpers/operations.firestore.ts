import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

/**
 * @description Add a new item
 * @param collectionName
 * @param data
 * @returns
 */

const db = getFirestore();

export const addItem = async (collectionName: string, data: any) => {
  try {

    const docRef = await addDoc(collection(db, collectionName), { data });
    console.debug("Document written with ID: ", docRef.id);
  } catch (error) {
    console.warn("Error adding document: ", error);
  }
};

/**
 * @description Set a new item
 * @param collectionName
 * @param data
 * @returns
 */

export const setItem = async (collectionName: string, data: any) => {
  if (!collectionName || !data || !data.id)
    throw new Error("CollectionName, data y data.id son requeridos");
  return await setDoc(doc(db, collectionName, data.id), data);
};

export const updateItem = async (
  collectionName: string,
  data: any
) => {
  console.log("FOR UPDATE => 🐒", { data });
  return await updateDoc(doc(db, collectionName, data.id), data);
  // return await setDoc(doc(db, collectionName, data.uid), data);
};

export const deleteItem = async (collectionName: string, id: string) => {
  return await deleteDoc(doc(db, collectionName, id));
};

export const getDocsFromCollection = async <T>(collectionName: string) => {
  const data: T[] = [];
  (await getDocs(collection(db, collectionName))).forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as T);
    // data.push({ ...doc.data() } as T)
  });
  return data;
};

export const getDocsFromCollectionQuery = async <T>(
  collectionName: string,
  field: string,
) => {
  const data: T[] = [];
  const q = query(
    collection(db, collectionName),
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as T);
    // data.push({ ...doc.data() } as T)
  });
  return data;
};

/**
 *
 * @param collectionName
 * @param id
 * @returns
 */
export const getItemById = async <T>(collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  console.debug("Document data:", `${collectionName}`, docSnap.data());
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  } else {
    return {} as T;
  }
};

interface email {
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
}

export const sendCustomEmail = async (dataForSend: email) => {
  const message: email = dataForSend;
  try {
    await addDoc(collection(db, "mail"), message);
    console.debug("Sending 📧 => ", { message });
  } catch (error) {
    console.warn("Error adding document: ", error);
  }
};

export const footerMail = `
<table width="100%" style="max-width:640px;">
    <tr>
        <td>
        <a href="https://gateway-english.com">
        <p> © 2024 Gateway Corp derechos reservados </p>
                <img width="40%" src='https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd'/>
            </a>
        </td>
    </tr>
    <tr>
        <td>
        <a href="https://purple-widget.com/">
        <p><small>Creado por: Purple-Widget - Software a medida - +(593)987357965</small></p>
                <img style="max-width:20%;height:auto;" src='https://firebasestorage.googleapis.com/v0/b/zustand-practice-e2ec6.appspot.com/o/purplewidgetlogo.png?alt=media&token=9673f9b9-8b45-4ff0-a931-c0e6b4b72f01'/>
            </a>
        </td>
    </tr>
</table>`;
