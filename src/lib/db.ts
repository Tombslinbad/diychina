import { initializeApp as initializeClientApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json" assert { type: "json" };

const clientApp = initializeClientApp(firebaseConfig);
export const db = initializeFirestore(clientApp, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
