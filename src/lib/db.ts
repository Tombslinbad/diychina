import { initializeApp as initializeClientApp, getApps, getApp, deleteApp } from "firebase/app";
import { initializeFirestore, terminate, getFirestore } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load configuration securely via FS with multi-level fallbacks to handle compile environments
let firebaseConfig: any = {};

let localDir = "";
try {
  // Safe ESM __dirname derivation
  const filename = fileURLToPath(import.meta.url);
  localDir = path.dirname(filename);
} catch (err) {
  // Fallback for legacy environments
}

const configPaths = [
  path.resolve(process.cwd(), "firebase-applet-config.json"),
];

if (localDir) {
  configPaths.push(
    path.resolve(localDir, "../../firebase-applet-config.json"),
    path.resolve(localDir, "../firebase-applet-config.json"),
    path.resolve(localDir, "firebase-applet-config.json")
  );
}

for (const p of configPaths) {
  try {
    if (fs.existsSync(p)) {
      firebaseConfig = JSON.parse(fs.readFileSync(p, "utf8"));
      break;
    }
  } catch (err) {}
}

if (!firebaseConfig || !firebaseConfig.projectId) {
  console.warn("[Firebase Config] firebase-applet-config.json was empty or missing required attributes!");
}

const activeGlobal: any = typeof globalThis !== "undefined" ? globalThis : {};

let clientApp: any;
if (activeGlobal._global_firebase_app) {
  clientApp = activeGlobal._global_firebase_app;
} else if (getApps().length > 0) {
  clientApp = getApp();
  activeGlobal._global_firebase_app = clientApp;
} else {
  clientApp = initializeClientApp(firebaseConfig);
  activeGlobal._global_firebase_app = clientApp;
}

const firestoreKey = `_firestore_instance_${firebaseConfig.firestoreDatabaseId || "default"}`;
let firestoreInstance: any = activeGlobal[firestoreKey] || (clientApp as any)[firestoreKey];

if (!firestoreInstance) {
  try {
    // Try retrieving existing initialized firestore first to avoid double initializeFirestore
    firestoreInstance = getFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
    activeGlobal[firestoreKey] = firestoreInstance;
    (clientApp as any)[firestoreKey] = firestoreInstance;
    console.log("[Dynamic Firestore] Cleanly retrieved initialized database instance.");
  } catch (e) {
    try {
      firestoreInstance = initializeFirestore(clientApp, {
        experimentalForceLongPolling: true
      }, firebaseConfig.firestoreDatabaseId);
      activeGlobal[firestoreKey] = firestoreInstance;
      (clientApp as any)[firestoreKey] = firestoreInstance;
      console.log("[Dynamic Firestore] Cleanly initialized new live database session instance.");
    } catch (err: any) {
      firestoreInstance = getFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
      activeGlobal[firestoreKey] = firestoreInstance;
      (clientApp as any)[firestoreKey] = firestoreInstance;
      console.log("[Dynamic Firestore] Fallback retrieved existing database instance safely.");
    }
  }
}

export const db = firestoreInstance;

export function getDb() {
  return db;
}

export async function closeDb() {
  // Safe no-op to prevent destroying database connections on active request lifecycles
}

// Secure backend-only suffix token used to isolate server-brokered database documents
export const DB_SECRET_SUFFIX = "_secure_gateway_passkey_235027986297";
