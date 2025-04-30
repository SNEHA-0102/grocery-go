import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD66T6j0MmSAmb0DFla_WNLggEaqvsy76w",
  authDomain: "grocerygo-1e67e.firebaseapp.com",
  databaseURL: "https://grocerygo-1e67e-default-rtdb.firebaseio.com",
  projectId: "grocerygo-1e67e",
  storageBucket: "grocerygo-1e67e.appspot.com",
  messagingSenderId: "1045275659734",
  appId: "1:1045275659734:web:3ad4ecb37480bead7fa877",
  measurementId: "G-3F1RP26TC4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export { auth, db };
