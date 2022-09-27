import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

export const signInWithGoolgePopUp = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoolgeRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

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
