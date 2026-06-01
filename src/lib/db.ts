import { initializeApp as initializeClientApp, getApps, getApp, deleteApp } from "firebase/app";
import { initializeFirestore, terminate, getFirestore } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load configuration securely via FS with multi-level fallbacks to handle compile environments
let firebaseConfig: any = null;

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

if (!firebaseConfig) {
  // Absolute fallback: mock or empty schema representation to prevent server crash during builds
  firebaseConfig = {
    projectId: "gen-lang-client-0951823801",
    apiKey: "AIzaSyBNkOCl2-gJiRZuOEccZ0Nj8RYV1POuv8I",
    firestoreDatabaseId: "ai-studio-87d80e78-7f01-4799-8071-b66b2f4316d0"
  };
}

let clientApp: any = null;
let dbInstance: any = null;

export function getDb() {
  if (!dbInstance) {
    if (getApps().length > 0) {
      clientApp = getApp();
    } else {
      clientApp = initializeClientApp(firebaseConfig);
    }
    
    try {
      dbInstance = initializeFirestore(clientApp, {
        experimentalForceLongPolling: true
      }, firebaseConfig.firestoreDatabaseId);
      console.log("[Dynamic Firestore] Created a clean live database session instance.");
    } catch (err: any) {
      if (err.code === "failed-precondition" || err.message?.includes("already been") || err.message?.includes("different options")) {
        dbInstance = getFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
        console.log("[Dynamic Firestore] Retrieved existing warmed database instance safely.");
      } else {
        throw err;
      }
    }
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
  // We avoid deleting the clientApp registration in warm lambdas to ensure fast re-indexing across warm runs
  clientApp = null;
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
