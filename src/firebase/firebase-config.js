import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNbcrgyvsPWwpHjXcdZivREgP8BpgX4LY",
    authDomain: "skillshareplatform.firebaseapp.com",
    databaseURL: "https://skillshareplatform-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skillshareplatform",
    storageBucket: "skillshareplatform.firebasestorage.app",
    messagingSenderId: "1043971595863",
    appId: "1:1043971595863:web:7356a6ef16569888f60d12"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage };