import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyChJMeObU1MXGv9eGotIJyOBKufAVEeTAw",

	authDomain: "fir-new-project-ce390.firebaseapp.com",

	projectId: "fir-new-project-ce390",

	storageBucket: "fir-new-project-ce390.appspot.com",

	messagingSenderId: "1030870830540",

	appId: "1:1030870830540:web:447b3208e0cfb491926169",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
