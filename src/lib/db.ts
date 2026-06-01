import { initializeApp as initializeClientApp, getApps, getApp, deleteApp } from "firebase/app";
import { initializeFirestore, terminate } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration securely via FS to bypass any ESM import assertion syntax discrepancies on Vercel
const firebaseConfigPath = path.resolve(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

let clientApp: any = null;
let dbInstance: any = null;

export function getDb() {
  if (!dbInstance) {
    if (getApps().length > 0) {
      try {
        const app = getApp();
        deleteApp(app);
      } catch (e) {}
    }
    clientApp = initializeClientApp(firebaseConfig);
    dbInstance = initializeFirestore(clientApp, {
      experimentalForceLongPolling: true
    }, firebaseConfig.firestoreDatabaseId);
    console.log("[Dynamic Firestore] Created a clean live database session instance.");
  }
  return dbInstance;
}

export async function closeDb() {
  if (dbInstance) {
    try {
      await terminate(dbInstance);
      console.log("[Dynamic Firestore] Terminated database connection successfully.");
    } catch (e: any) {
      console.warn("[Dynamic Firestore] Warning while terminating Firestore session:", e?.message || e);
    }
    dbInstance = null;
  }
  if (clientApp) {
    try {
      await deleteApp(clientApp);
    } catch (e: any) {
      console.warn("[Dynamic Firestore] Warning while deleting Firebase App registration:", e?.message || e);
    }
    clientApp = null;
  }
}

// Proxied exports allows existing imports to bind on fresh dynamic connections transparently
export const db = new Proxy({}, {
  get(target, prop, receiver) {
    const activeDb = getDb();
    const val = Reflect.get(activeDb, prop, activeDb);
    if (typeof val === "function") {
      return val.bind(activeDb);
    }
    return val;
  },
  getPrototypeOf(target) {
    return Object.getPrototypeOf(getDb());
  }
}) as any;

// Secure backend-only suffix token used to isolate server-brokered database documents
export const DB_SECRET_SUFFIX = "_secure_gateway_passkey_235027986297";
