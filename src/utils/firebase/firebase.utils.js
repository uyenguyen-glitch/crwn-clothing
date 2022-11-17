import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdlRMLKw2S7y8AzxNDgHjKjHmBjacb-48",
  authDomain: "crown-clothing-db-69ec6.firebaseapp.com",
  projectId: "crown-clothing-db-69ec6",
  storageBucket: "crown-clothing-db-69ec6.appspot.com",
  messagingSenderId: "364534561138",
  appId: "1:364534561138:web:15feb2479e6bc3c19005eb",
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoolgeRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

// gồm có 2 đối số:
// + collectionKey: tên đối số
// + objectsToAdd: actual document that want to add
export const addCollectionAndDocument = async (collectionKey, objectsToAdd) => {
  // collection: tạo collection
  const collectionRef = collection(db, collectionKey);
  // create batch
  const batch = writeBatch(db);

  // Creat and Set object into collection as a new document
  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    // Set object into specific collection -> because fivebase will give a document reference, even if it doesn't
    // exist yet. It will just point to place for this specific key inside of our collection
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

/**
 * Get products from firebase
 */
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

// Tạo user từ Authencation
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  // arugement additonalInformation là để xử lí cho bên xác thực email/password
  // Nó được dùng để lấy đối số đầu vào là displayName: "Uyên"
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  // if user data does not exist
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt,
        ...additionalInformation,
      });

      // Giải tham số additionalInformation có chứ displayName, lúc này displayName sẽ overwrite displayNam phía trên
    } catch (error) {
      console.log("erro creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
