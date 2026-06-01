import { initializeApp as initializeClientApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration securely via FS to bypass any ESM import assertion syntax discrepancies on Vercel
const firebaseConfigPath = path.resolve(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

const clientApp = initializeClientApp(firebaseConfig);
export const db = initializeFirestore(clientApp, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

// Secure backend-only suffix token used to isolate server-brokered database documents
export const DB_SECRET_SUFFIX = "_secure_gateway_passkey_235027986297";
