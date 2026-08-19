import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { db, DB_SECRET_SUFFIX, closeDb } from "../src/lib/db.js";
import { generateCSCAQuestions } from "../src/lib/cscaGenerator.js";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { UNIVERSITIES } from "../src/universitiesData.js";
import { CSCA_MATH_QUESTIONS } from "../src/cscaQuestionsData.js";
import { LANGUAGE_INSTITUTES } from "../src/languageInstitutesData.js";
import { sendSystemEmail, getOtpTemplate, getReceiptTemplate, getEducationFollowUpTemplate, getBroadcastTemplate } from "../src/lib/emailService.js";
import webhookRouter from "../src/routes/webhook.js";

const app = express();

// Mount Paystack secure webhook handler route on raw buffer parsing BEFORE global express.json()
app.use("/api/webhook/paystack", express.raw({ type: "application/json" }), webhookRouter);

app.use(express.json());

// Keep legacy webhook mount for backward compatibility in standard JSON-parsed simulations if needed
app.use("/api/webhook", webhookRouter);

// Initialize Gemini SDK with telemetry User-Agent as per gemini-api skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Initialize OpenAI SDK (ChatGPT) if OPENAI_API_KEY is available
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Seed API verification status lazily
let isSeeded = false;
async function ensureSeeded() {
  if (isSeeded) return;
  try {
    console.log("[LAZY SEEDER] Checking if universities collection is populated in Firestore...");
    const universitiesCol = collection(db, "universities");
    const snapshot = await getDocs(universitiesCol);
    let needReSeed = snapshot.empty;
    if (!needReSeed) {
      const firstDoc = snapshot.docs[0]?.data();
      if (firstDoc && firstDoc.tuitionFeeUndergrad === undefined) {
        console.log("[LAZY SEEDER] Existing universities are missing 'tuitionFeeUndergrad'. Forcing a migration/update...");
        needReSeed = true;
      }
    }

    if (needReSeed) {
      console.log(`[LAZY SEEDER] Seeding/Updating Firestore with ${UNIVERSITIES.length} universities...`);
      for (const uni of UNIVERSITIES) {
        await setDoc(doc(db, "universities", uni.id), { ...uni, seedingToken: DB_SECRET_SUFFIX });
      }
      console.log("[LAZY SEEDER] Universities seeding/update complete!");
    } else {
      console.log(`[LAZY SEEDER] Universities already populated (${snapshot.size} records present in Firestore)`);
    }

    // Seed CSCA Mock Questions
    console.log("[LAZY SEEDER] Checking if csca_mock_questions collection is populated...");
    const cscaCol = collection(db, "csca_mock_questions");
    const cscaSnapshot = await getDocs(cscaCol);
    if (cscaSnapshot.empty || cscaSnapshot.size < 800) {
      console.log(`[LAZY SEEDER] CSCA questions collection underpopulated (${cscaSnapshot.size} records). Seeding 250 distinct CSCA questions per subject (1000 total)...`);
      
      const allQ: any[] = [];
      const subjects: ("math" | "physics" | "chemistry" | "professional_chinese")[] = ["math", "physics", "chemistry", "professional_chinese"];
      for (const sub of subjects) {
        const generated = generateCSCAQuestions(sub, 250);
        allQ.push(...generated);
      }
      
      console.log(`[LAZY SEEDER] Seeding Firestore with ${allQ.length} CSCA mock questions in chunked batches...`);
      // Upload in parallel chunks of 100 docs
      const chunkSize = 100;
      for (let k = 0; k < allQ.length; k += chunkSize) {
        const chunk = allQ.slice(k, k + chunkSize);
        await Promise.all(chunk.map(q => 
          setDoc(doc(db, "csca_mock_questions", q.questionId), { ...q, seedingToken: DB_SECRET_SUFFIX })
        ));
        console.log(`[LAZY SEEDER] Seeded chunk ${Math.floor(k / chunkSize) + 1} of ${Math.ceil(allQ.length / chunkSize)}`);
      }
      console.log("[LAZY SEEDER] 1000 CSCA questions seeding complete!");
    } else {
      console.log(`[LAZY SEEDER] CSCA questions already populated (${cscaSnapshot.size} records present)`);
    }

    // Seed Language Institutes
    console.log("[LAZY SEEDER] Checking if language_institutes collection is populated...");
    const langCol = collection(db, "language_institutes");
    const langSnapshot = await getDocs(langCol);
    if (langSnapshot.empty || langSnapshot.size < LANGUAGE_INSTITUTES.length) {
      console.log(`[LAZY SEEDER] Seeding/Synching Firestore with ${LANGUAGE_INSTITUTES.length} language institutes...`);
      for (const inst of LANGUAGE_INSTITUTES) {
        await setDoc(doc(db, "language_institutes", inst.id), { ...inst, seedingToken: DB_SECRET_SUFFIX });
      }
      console.log("[LAZY SEEDER] Language institutes seeding/sync complete!");
    } else {
      console.log(`[LAZY SEEDER] Language institutes already populated (${langSnapshot.size} records present)`);
    }

    isSeeded = true;
  } catch (err) {
    console.error("[LAZY SEEDER ERROR] Optional auto-seeding error (standard if Firestore rules are deploying or pending):", err);
  }
}

// Route to get universities list
app.get("/api/universities", async (req, res) => {
  await ensureSeeded();
  try {
    const col = collection(db, "universities");
    const snapshot = await getDocs(col);
    if (snapshot.empty) {
      return res.json({ universities: UNIVERSITIES, source: "static" });
    }
    const list: any[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    list.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
    return res.json({ universities: list, source: "firestore" });
  } catch (err) {
    console.warn("[API UNIVERSITIES] Serving static universities database because of permission or connection limits:", err);
    return res.json({ universities: UNIVERSITIES, source: "static" });
  }
});

const WHITELIST_EMAILS = [
  "demo@verifieduni.com",
  "student@example.com",
  "student@verifieduni.com",
  "igwev2956@gmail.com",
  "admin@verifieduni.com"
];

function isWhitelisted(email: string): boolean {
  return WHITELIST_EMAILS.includes(email.trim().toLowerCase());
}

// Check premium account status route
app.get("/api/check-premium", async (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  if (isWhitelisted(email)) {
    return res.json({
      registered: true,
      data: {
        uid: email,
        email: email,
        premium: true,
        fullName: email === "igwev2956@gmail.com" ? "Primary Administrator" : "White-listed Applicant",
        paymentReference: "VUNI-2026-WHITELIST-VIP",
        createdAt: new Date().toISOString()
      }
    });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return res.json({
        registered: true,
        data: userDoc.data()
      });
    } else {
      return res.json({
        registered: false,
        data: null
      });
    }
  } catch (err: any) {
    console.error("Error checking premium status in Firestore:", err);
    return res.status(500).json({ error: "Database reading error", details: err?.message });
  }
});

// Draft dynamic account registration endpoint
app.post("/api/auth/register", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const fullName = String(req.body.fullName || "").trim();
  const phoneNumber = String(req.body.phoneNumber || "").trim();
  const onboarding = req.body.onboarding || null;

  if (!email || !fullName) {
    return res.status(400).json({ error: "Email and Full Name are critical required fields." });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return res.status(400).json({
        error: "This email is registered already. Please use 'Existing (Log In)' to access your account."
      });
    }

    const newUser = {
      uid: email,
      email: email,
      fullName,
      phoneNumber,
      premium: false, // New users are locked behind 35k paywall
      onboarding,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signupStep: "onboarding_pending"
    };

    await setDoc(userDocRef, newUser);
    return res.status(201).json({
      status: "success",
      message: "Account created successfully.",
      user: newUser
    });
  } catch (err: any) {
    console.error("Register account error:", err);
    return res.status(500).json({ error: "Failed to register custom credentials.", details: err?.message });
  }
});

// Save client onboarding choices
app.post("/api/auth/save-onboarding", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const onboarding = req.body.onboarding;

  if (!email || !onboarding) {
    return res.status(400).json({ error: "Email and onboarding selections are mandatory." });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const updatedData = {
      ...userDoc.data(),
      onboarding,
      signupStep: "payment_pending",
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, updatedData);
    return res.json({
      status: "success",
      user: updatedData
    });
  } catch (err: any) {
    console.error("Save onboarding choices error:", err);
    return res.status(500).json({ error: "Failed to persist onboarding blueprint choices.", details: err?.message });
  }
});

// --- ADMIN CONTROL PANEL DIRECT API HOOKS & SECURITY MIDDLEWARE ---

const ADMIN_EMAILS = [
  "igwev2956@gmail.com",
  "admin@verifieduni.com"
];

function isAdmin(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// Admin Security Middleware: Verifies caller's authorization header or email parameter
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminEmail = String(
    req.headers["x-admin-email"] || 
    req.headers["x-admin-key"] || 
    req.query.adminEmail || 
    req.body.adminEmail || 
    ""
  ).trim().toLowerCase();

  if (!adminEmail || !isAdmin(adminEmail)) {
    return res.status(403).json({
      error: "Access Forbidden: Administrator authorization required.",
      code: "ADMIN_AUTH_REQUIRED"
    });
  }
  next();
};

// 1. Get all sales metrics & users list (Pure Read - No unintended side-effects)
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    const usersMap = new Map<string, any>();
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const rawId = docSnap.id;
      const idClean = rawId.replace(DB_SECRET_SUFFIX, "");
      const email = (data.email || idClean).trim().toLowerCase();
      
      // If we already have a record for this email, merge/keep the more complete one
      if (usersMap.has(email)) {
        const existing = usersMap.get(email);
        usersMap.set(email, {
          ...existing,
          ...data,
          id: email,
          email: email,
          premium: existing.premium || data.premium,
          onboarding: data.onboarding || existing.onboarding
        });
      } else {
        usersMap.set(email, { ...data, id: email, email });
      }
    });

    const users = Array.from(usersMap.values());

    // Compute accurate financial metrics
    let totalRevenue = 0;
    let totalPremium = 0;
    let followupPendingCount = 0;

    users.forEach((u) => {
      if (u.premium) {
        totalPremium++;
        // If payment was verified via Paystack or real checkout, count ₦35,000; if administrative zero waiver, count 0
        if (u.paymentReference && !u.paymentReference.startsWith("ADMIN-GRANTED-WAIVER")) {
          totalRevenue += 35000;
        }
      } else if (u.onboarding && !u.followupSent) {
        followupPendingCount++;
      }
    });

    const conversionRate = users.length > 0 ? ((totalPremium / users.length) * 100).toFixed(1) : "0";

    return res.json({ 
      users,
      metrics: {
        totalReg: users.length,
        totalPremium,
        totalRevenue,
        conversionRate,
        followupPendingCount
      }
    });
  } catch (err: any) {
    console.error("Admin retrieve users error:", err);
    return res.status(500).json({ error: "Failed retrieving users database.", details: err?.message });
  }
});

// 2. Explicit POST endpoint to manually trigger single student email follow-up
app.post("/api/admin/send-followup", requireAdmin, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email identifying parameter is required." });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return res.status(404).json({ error: "The selected user account could not be found." });
    }

    const userData = userDoc.data();
    if (!userData.onboarding) {
      return res.status(400).json({ error: "This candidate has not completed their onboarding setup questionnaire." });
    }

    console.log(`[ADMIN TRIGGER] Manual email follow-up initiated: ${email}`);
    const mailHtml = getEducationFollowUpTemplate(userData.fullName || "Applicant Portfolio", userData.email, userData.onboarding);
    await sendSystemEmail(
      userData.email,
      `⚠️ Strategic Priority Session Setup: Your ${userData.onboarding.degree === "Bsc" ? "BSc Target" : userData.onboarding.degree === "Masters" ? "Master's Target" : "Mandarin Study"} Admission Suite Details Urgently Pending`,
      mailHtml
    );

    const updated = {
      ...userData,
      followupSent: true,
      followupSentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, updated);
    return res.json({ status: "success", user: updated });
  } catch (err: any) {
    console.error("Admin manual send followup error:", err);
    return res.status(500).json({ error: "Failed manual email dispatch.", details: err?.message });
  }
});

// 3. Explicit Batch Follow-up Dispatcher (controlled by button in UI)
app.post("/api/admin/send-batch-followup", requireAdmin, async (req, res) => {
  try {
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    let countDispatched = 0;
    
    for (const docSnap of snapshot.docs) {
      const u = docSnap.data();
      if (!u.premium && u.onboarding && !u.followupSent && u.email) {
        try {
          const mailHtml = getEducationFollowUpTemplate(u.fullName || "Applicant Portfolio", u.email, u.onboarding);
          await sendSystemEmail(
            u.email,
            `⚠️ Strategic Priority Session Setup: Your ${u.onboarding.degree === "Bsc" ? "BSc Target" : u.onboarding.degree === "Masters" ? "Master's Target" : "Mandarin Study"} Admission Suite Details Urgently Pending`,
            mailHtml
          );

          const userDocRef = doc(db, "users", `${u.email}${DB_SECRET_SUFFIX}`);
          await setDoc(userDocRef, {
            ...u,
            followupSent: true,
            followupSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          countDispatched++;
        } catch (mailErr) {
          console.error(`Failed batch follow-up for ${u.email}:`, mailErr);
        }
      }
    }

    return res.json({ 
      status: "success", 
      message: `Successfully dispatched follow-up emails to ${countDispatched} pending applicant(s).`,
      countDispatched 
    });
  } catch (err: any) {
    console.error("Admin batch send followup error:", err);
    return res.status(500).json({ error: "Failed batch email dispatch.", details: err?.message });
  }
});

// 4. Broadcast Announcement Studio (Cohort-Wide / Segmented)
app.post("/api/admin/broadcast-email", requireAdmin, async (req, res) => {
  const { audience, customEmail, subject, messageBody, actionLabel, actionUrl } = req.body;

  if (!subject || !messageBody) {
    return res.status(400).json({ error: "Subject and Message Body are required for broadcasts." });
  }

  try {
    let targetEmails: { email: string; name: string }[] = [];

    if (audience === "custom" && customEmail) {
      targetEmails.push({ email: customEmail.trim().toLowerCase(), name: "Scholar" });
    } else {
      const colRef = collection(db, "users");
      const snapshot = await getDocs(colRef);

      snapshot.forEach((docSnap) => {
        const u = docSnap.data();
        if (!u.email) return;
        const isPrem = !!u.premium;
        if (audience === "all") {
          targetEmails.push({ email: u.email, name: u.fullName || "Candidate" });
        } else if (audience === "premium" && isPrem) {
          targetEmails.push({ email: u.email, name: u.fullName || "Subscriber" });
        } else if (audience === "leads" && !isPrem) {
          targetEmails.push({ email: u.email, name: u.fullName || "Applicant" });
        }
      });
    }

    let dispatchedCount = 0;
    for (const target of targetEmails) {
      try {
        const html = getBroadcastTemplate(target.name, subject, messageBody, actionUrl, actionLabel);
        await sendSystemEmail(target.email, subject, html);
        dispatchedCount++;
      } catch (err) {
        console.error(`Failed sending broadcast to ${target.email}:`, err);
      }
    }

    // Log the broadcast event in admin_broadcasts
    const broadcastId = "BC-" + Date.now();
    await setDoc(doc(db, "admin_broadcasts", broadcastId), {
      broadcastId,
      subject,
      audience,
      dispatchedCount,
      totalTargeted: targetEmails.length,
      createdAt: new Date().toISOString()
    });

    return res.json({
      status: "success",
      message: `Broadcast successfully sent to ${dispatchedCount} recipient(s).`,
      dispatchedCount,
      totalTargeted: targetEmails.length
    });
  } catch (err: any) {
    console.error("Admin broadcast error:", err);
    return res.status(500).json({ error: "Failed to dispatch broadcast campaign.", details: err?.message });
  }
});

// 5. Update student profile details & onboarding state
app.post("/api/admin/user/update", requireAdmin, async (req, res) => {
  const { email, fullName, phoneNumber, premium, onboarding, signupStep, resetOnboarding } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Target student email is required." });
  }

  try {
    const userDocRef = doc(db, "users", `${email.trim().toLowerCase()}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: "Student account not found." });
    }

    const current = userDoc.data();
    const updated = {
      ...current,
      fullName: fullName !== undefined ? fullName : current.fullName,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : current.phoneNumber,
      premium: premium !== undefined ? premium : current.premium,
      signupStep: signupStep !== undefined ? signupStep : current.signupStep,
      onboarding: resetOnboarding ? null : (onboarding !== undefined ? onboarding : current.onboarding),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, updated);
    return res.json({ status: "success", user: updated });
  } catch (err: any) {
    console.error("Admin update student profile error:", err);
    return res.status(500).json({ error: "Failed to update student profile.", details: err?.message });
  }
});

// 6. Grant or revoke premium subscription status manually
app.post("/api/admin/toggle-premium", requireAdmin, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email identifying parameter is required." });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);
    
    let newPremium = true;
    let userData: any = {};

    if (userDoc.exists()) {
      userData = userDoc.data();
      newPremium = !userData.premium;
    } else {
      userData = {
        uid: email,
        email: email,
        fullName: "Granted Applicant",
        phoneNumber: "",
        createdAt: new Date().toISOString(),
        signupStep: "completed"
      };
      newPremium = true;
    }

    const ref = newPremium ? (userData.paymentReference || "ADMIN-GRANTED-WAIVER-" + Date.now()) : "";

    await setDoc(userDocRef, {
      ...userData,
      premium: newPremium,
      paymentReference: ref,
      updatedAt: new Date().toISOString()
    });

    // Record into transactions ledger
    if (newPremium) {
      const txRef = doc(db, "transactions", ref);
      await setDoc(txRef, {
        reference: ref,
        email: email,
        fullName: userData.fullName || "Granted Applicant",
        phoneNumber: userData.phoneNumber || "",
        amount: 0,
        currency: "NGN",
        status: "success",
        channel: "admin_manual_grant",
        paidAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        verifiedBy: "admin_panel"
      });
    }

    return res.json({ status: "success", premium: newPremium, paymentReference: ref });
  } catch (err: any) {
    console.error("Admin toggle premium error:", err);
    return res.status(500).json({ error: "Failed to toggle subscription state.", details: err?.message });
  }
});

// 7. Irreversibly delete user
app.post("/api/admin/delete-user", requireAdmin, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email is required to purge account." });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    await deleteDoc(userDocRef);
    return res.json({ status: "success" });
  } catch (err: any) {
    console.error("Admin delete user error:", err);
    return res.status(500).json({ error: "Failed to purge database account.", details: err?.message });
  }
});

// 8. Transactions & Paystack Ledger Reconciliation
app.get("/api/admin/transactions", requireAdmin, async (req, res) => {
  try {
    const txCol = collection(db, "transactions");
    const txSnap = await getDocs(txCol);
    const transactions: any[] = [];

    txSnap.forEach((docSnap) => {
      transactions.push(docSnap.data());
    });

    // If transactions collection is sparse, also pull from users with paymentReference to guarantee full audit history
    const userCol = collection(db, "users");
    const userSnap = await getDocs(userCol);
    
    userSnap.forEach((docSnap) => {
      const u = docSnap.data();
      if (u.paymentReference && !transactions.some(t => t.reference === u.paymentReference)) {
        const isWaiver = u.paymentReference.startsWith("ADMIN-GRANTED-WAIVER");
        transactions.push({
          reference: u.paymentReference,
          email: u.email,
          fullName: u.fullName || "Verified User",
          phoneNumber: u.phoneNumber || "",
          amount: isWaiver ? 0 : 35000,
          currency: "NGN",
          status: "success",
          channel: isWaiver ? "admin_manual_grant" : "paystack",
          paidAt: u.createdAt || new Date().toISOString(),
          verifiedAt: u.updatedAt || new Date().toISOString(),
          verifiedBy: isWaiver ? "admin_panel" : "paystack_api"
        });
      }
    });

    transactions.sort((a, b) => {
      const timeA = new Date(a.paidAt || a.verifiedAt || 0).getTime();
      const timeB = new Date(b.paidAt || b.verifiedAt || 0).getTime();
      return timeB - timeA;
    });

    return res.json({ transactions });
  } catch (err: any) {
    console.error("Admin retrieve transactions error:", err);
    return res.status(500).json({ error: "Failed retrieving transactions database.", details: err?.message });
  }
});

// 9. CSCA Exam Cohort Analytics & Performance Monitoring
app.get("/api/admin/csca/analytics", requireAdmin, async (req, res) => {
  try {
    // 1. Check global attempts collection
    const globalCol = collection(db, "csca_global_attempts");
    const globalSnap = await getDocs(globalCol);
    let attempts: any[] = [];

    globalSnap.forEach((docSnap) => {
      attempts.push(docSnap.data());
    });

    // 2. If global attempts is empty, aggregate across user subcollections
    if (attempts.length === 0) {
      const usersCol = collection(db, "users");
      const userSnap = await getDocs(usersCol);
      for (const uDoc of userSnap.docs) {
        const emailKey = uDoc.id.replace(DB_SECRET_SUFFIX, "");
        const uAttemptsCol = collection(db, "users", uDoc.id, "csca_user_attempts");
        const uAttemptsSnap = await getDocs(uAttemptsCol);
        uAttemptsSnap.forEach((attDoc) => {
          const att = attDoc.data();
          attempts.push({ ...att, email: emailKey, fullName: uDoc.data().fullName || emailKey });
        });
      }
    }

    // Compute cohort statistics
    const totalAttempts = attempts.length;
    let totalScoreSum = 0;
    let passedCount = 0;
    let mathScoreSum = 0, mathCount = 0;
    let phyScoreSum = 0, phyCount = 0;
    let chemScoreSum = 0, chemCount = 0;
    let chineseScoreSum = 0, chineseCount = 0;

    attempts.forEach((a) => {
      const pct = Number(a.percentage ?? 0);
      totalScoreSum += pct;
      if (pct >= 70) passedCount++;

      if (a.subjectBreakdown) {
        if (a.subjectBreakdown.mathematics?.total) {
          mathScoreSum += (a.subjectBreakdown.mathematics.score / a.subjectBreakdown.mathematics.total) * 100;
          mathCount++;
        }
        if (a.subjectBreakdown.physicsChemistry?.total) {
          phyScoreSum += (a.subjectBreakdown.physicsChemistry.score / a.subjectBreakdown.physicsChemistry.total) * 100;
          phyCount++;
        }
        if (a.subjectBreakdown.academicChinese?.total) {
          chineseScoreSum += (a.subjectBreakdown.academicChinese.score / a.subjectBreakdown.academicChinese.total) * 100;
          chineseCount++;
        }
      }
    });

    const averageScore = totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    attempts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return res.json({
      totalAttempts,
      averageScore,
      passRate,
      subjectAverages: {
        math: mathCount > 0 ? Math.round(mathScoreSum / mathCount) : 0,
        physics: phyCount > 0 ? Math.round(phyScoreSum / phyCount) : 0,
        chinese: chineseCount > 0 ? Math.round(chineseScoreSum / chineseCount) : 0
      },
      recentAttempts: attempts.slice(0, 50)
    });
  } catch (err: any) {
    console.error("Admin CSCA analytics error:", err);
    return res.status(500).json({ error: "Failed calculating CSCA analytics.", details: err?.message });
  }
});

// 10. Database Re-Seed & Synchronization Tool
app.post("/api/admin/system/reseed", requireAdmin, async (req, res) => {
  try {
    console.log("[ADMIN ACTION] Forcing full system re-seed of Universities, Questions, and Institutes...");
    
    // Seed universities
    for (const uni of UNIVERSITIES) {
      await setDoc(doc(db, "universities", uni.id), { ...uni, seedingToken: DB_SECRET_SUFFIX });
    }

    // Seed language institutes
    for (const inst of LANGUAGE_INSTITUTES) {
      await setDoc(doc(db, "language_institutes", inst.id), { ...inst, seedingToken: DB_SECRET_SUFFIX });
    }

    // Seed 1,000 questions (250 per subject)
    const subjects: ("math" | "physics" | "chemistry" | "professional_chinese")[] = ["math", "physics", "chemistry", "professional_chinese"];
    let qCount = 0;
    for (const sub of subjects) {
      const generated = generateCSCAQuestions(sub, 250);
      for (const q of generated) {
        await setDoc(doc(db, "csca_mock_questions", q.questionId), { ...q, seedingToken: DB_SECRET_SUFFIX });
        qCount++;
      }
    }

    return res.json({
      status: "success",
      message: `Database synchronized successfully! ${UNIVERSITIES.length} universities, ${LANGUAGE_INSTITUTES.length} language schools, and ${qCount} CSCA questions cataloged in Cloud Firestore.`
    });
  } catch (err: any) {
    console.error("Admin re-seed failure:", err);
    return res.status(500).json({ error: "Failed to synchronize system collections.", details: err?.message });
  }
});

// Create or update a university document in Firestore
app.post("/api/admin/university/save", requireAdmin, async (req, res) => {
  const uni = req.body.university;
  if (!uni || !uni.id) {
    return res.status(400).json({ error: "University record body and unique ID are required." });
  }

  try {
    const uniRef = doc(db, "universities", uni.id);
    await setDoc(uniRef, { ...uni, seedingToken: DB_SECRET_SUFFIX });
    return res.json({ status: "success", university: uni });
  } catch (err: any) {
    console.error("Admin save university error:", err);
    return res.status(500).json({ error: "Failed to persist university database record.", details: err?.message });
  }
});

// Delete university document
app.post("/api/admin/university/delete", requireAdmin, async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ error: "University ID is required." });
  }

  try {
    const uniRef = doc(db, "universities", id);
    await deleteDoc(uniRef);
    return res.json({ status: "success" });
  } catch (err: any) {
    console.error("Admin delete university error:", err);
    return res.status(500).json({ error: "Failed to delete university record.", details: err?.message });
  }
});

// Create or update a CBT questions document
app.post("/api/admin/question/save", requireAdmin, async (req, res) => {
  const q = req.body.question;
  if (!q || !q.questionId) {
    return res.status(400).json({ error: "Question record body and questionId are required." });
  }

  try {
    const qRef = doc(db, "csca_mock_questions", q.questionId);
    await setDoc(qRef, { ...q, seedingToken: DB_SECRET_SUFFIX });
    return res.json({ status: "success", question: q });
  } catch (err: any) {
    console.error("Admin save question error:", err);
    return res.status(500).json({ error: "Failed to persist question record.", details: err?.message });
  }
});

// Delete CBT question document
app.post("/api/admin/question/delete", requireAdmin, async (req, res) => {
  const questionId = req.body.questionId;
  if (!questionId) {
    return res.status(400).json({ error: "Question ID is required." });
  }

  try {
    const qRef = doc(db, "csca_mock_questions", questionId);
    await deleteDoc(qRef);
    return res.json({ status: "success" });
  } catch (err: any) {
    console.error("Admin delete question error:", err);
    return res.status(500).json({ error: "Failed to delete question.", details: err?.message });
  }
});

// Create or update a Language school document
app.post("/api/admin/language-institute/save", requireAdmin, async (req, res) => {
  const inst = req.body.institute;
  if (!inst || !inst.id) {
    return res.status(400).json({ error: "Institute record body and ID are required." });
  }

  try {
    const instRef = doc(db, "language_institutes", inst.id);
    await setDoc(instRef, { ...inst, seedingToken: DB_SECRET_SUFFIX });
    return res.json({ status: "success", institute: inst });
  } catch (err: any) {
    console.error("Admin save language institute error:", err);
    return res.status(500).json({ error: "Failed to persist institute record.", details: err?.message });
  }
});

// Delete Language school document
app.post("/api/admin/language-institute/delete", requireAdmin, async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ error: "Language school ID is required." });
  }

  try {
    const instRef = doc(db, "language_institutes", id);
    await deleteDoc(instRef);
    return res.json({ status: "success" });
  } catch (err: any) {
    console.error("Admin delete language institute error:", err);
    return res.status(500).json({ error: "Failed to delete language school record.", details: err?.message });
  }
});

// Secure OTP Login: Request OTP PIN Code Dispatch
app.post("/api/auth/send-otp", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ status: "failed", error: "Registered billing email is required." });
  }

  if (isWhitelisted(email)) {
    const whitelistOtp = "123456";
    sendSystemEmail(
      email,
      "Your Temporary Secure Sign-In Code - VerifiedUni",
      getOtpTemplate(email, whitelistOtp)
    ).catch((e) => console.log("SMTP skipped or timed out asynchronously in whitelisting sandbox route:", e));

    return res.json({
      status: "success",
      registered: true,
      message: "Direct simulated OTP [123456] dispatched. Enter 123456 to bypass access validation."
    });
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({
        status: "failed",
        registered: false,
        error: "No student account matches this email address. Please go to 'New Student (Sign Up)' first."
      });
    }

    const userData = userDoc.data();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await setDoc(userDocRef, {
      ...userData,
      currentOtp: otp,
      otpExpiry: expiryTime,
      updatedAt: new Date().toISOString()
    });

    await sendSystemEmail(
      email,
      "Your Secure login Verification PIN Code - VerifiedUni",
      getOtpTemplate(email, otp)
    );

    return res.json({
      status: "success",
      registered: true,
      message: `Safety PIN code successfully dispatched to your email address (Dev Sandbox PIN: ${otp}). It will expire in 15 minutes.`
    });
  } catch (err: any) {
    console.error("Failed executing OTP send block:", err);
    return res.status(500).json({ status: "failed", error: "Mail system error. Please contact administrative support." });
  }
});

// Secure OTP Login: Verify PIN Code for entry
app.post("/api/auth/verify-otp", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const otpInput = String(req.body.otp || "").trim();

  if (!email || !otpInput) {
    return res.status(400).json({ status: "failed", error: "Both email and login code are required." });
  }

  if (isWhitelisted(email)) {
    if (otpInput === "123456" || otpInput === "000000") {
      return res.json({
        status: "success",
        user: {
          uid: email,
          email: email,
          premium: true,
          name: "Samuel Ayotunde",
          paymentReference: "VUNI-2026-DEMO-VIP",
          createdAt: "2026-05-28"
        }
      });
    } else {
      return res.status(400).json({ status: "failed", error: "Invalid simulated bypass PIN. Enter '123456'." });
    }
  }

  try {
    const userDocRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ status: "failed", error: "Account credentials could not be found." });
    }

    const userData = userDoc.data();
    const { currentOtp, otpExpiry } = userData;

    if (!currentOtp || currentOtp !== otpInput) {
      return res.status(400).json({ status: "failed", error: "Incorrect verification PIN code. Please check your keys." });
    }

    if (!otpExpiry || new Date(otpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ status: "failed", error: "Your verification PIN code has expired. Please request a new code." });
    }

    const updatedData = { ...userData };
    delete updatedData.currentOtp;
    delete updatedData.otpExpiry;

    await setDoc(userDocRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });

    console.log(`[SECURE AUTH SUCCESS] Unified OTP verified securely for ${email}`);

    return res.json({
      status: "success",
      user: updatedData
    });
  } catch (err: any) {
    console.error("Failed verification pin check:", err);
    return res.status(500).json({ status: "failed", error: "Database authentication failure." });
  }
});

// Real-or-Simulated Paystack Transaction Verification Endpoint
app.get("/api/verify-payment", async (req, res) => {
  const reference = String(req.query.reference || "").trim();
  const emailInput = String(req.query.email || "").trim().toLowerCase();
  const nameInput = String(req.query.name || "").trim();
  const phoneInput = String(req.query.phone || "").trim();

  if (!reference) {
    return res.status(400).json({ error: "Reference parameter is required" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const isDummySecret = !secretKey || secretKey === "sk_test_your_secret_key_here" || secretKey === "";

  if (isDummySecret) {
    console.log(`[PAYSTACK CLIENT SIMULATOR] No secret key set. Automatically certifying simulated payment for reference ${reference}`);
    const emailToUse = emailInput || "student@example.com";
    try {
      const userRef = doc(db, "users", `${emailToUse}${DB_SECRET_SUFFIX}`);
      const profileData = {
        uid: emailToUse,
        email: emailToUse,
        premium: true,
        fullName: nameInput,
        phoneNumber: phoneInput,
        createdAt: new Date().toISOString(),
        paymentReference: reference,
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, profileData);

      // Record to transactions collection for admin reconciliation
      try {
        await setDoc(doc(db, "transactions", reference), {
          reference,
          email: emailToUse,
          fullName: nameInput || "Sandbox Student",
          phoneNumber: phoneInput || "",
          amount: 35000,
          currency: "NGN",
          status: "success",
          channel: "sandbox_simulator",
          paidAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          verifiedBy: "sandbox_simulator"
        });
      } catch (txErr) {
        console.warn("Failed saving sandbox transaction ledger record:", txErr);
      }
      
      sendSystemEmail(emailToUse, "Your Lifetime Admission Portals Receipt - Verified!", getReceiptTemplate(emailToUse, reference))
        .catch((e) => console.error("[EMAIL ERROR] Simulated trigger failed:", e));

      return res.json({
        status: "success",
        message: "Simulated sandbox transaction certified successfully",
        user: profileData
      });
    } catch (err) {
      console.error("Failed to store user profile in firestore during simulated verification:", err);
      return res.status(500).json({ error: "Failed to store profile in database." });
    }
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json"
      }
    });

    const paystackData = await paystackRes.json();
    if (paystackData.status && paystackData.data?.status === "success") {
      const verifiedEmail = String(paystackData.data.customer?.email || emailInput).trim().toLowerCase();
      const metadata = paystackData.data.metadata || {};
      const customFields = metadata.custom_fields || [];
      const paystackName = customFields.find((f: any) => f.variable_name === "customer_name")?.value || "";
      const paystackPhone = customFields.find((f: any) => f.variable_name === "phone_number")?.value || "";

      const finalName = nameInput || paystackName || "";
      const finalPhone = phoneInput || paystackPhone || "";

      const userRef = doc(db, "users", `${verifiedEmail}${DB_SECRET_SUFFIX}`);
      const profileData = {
        uid: verifiedEmail,
        email: verifiedEmail,
        premium: true,
        fullName: finalName,
        phoneNumber: finalPhone,
        createdAt: new Date().toISOString(),
        paymentReference: reference,
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, profileData);

      // Record to transactions collection
      try {
        await setDoc(doc(db, "transactions", reference), {
          reference,
          email: verifiedEmail,
          fullName: finalName,
          phoneNumber: finalPhone,
          amount: (paystackData.data.amount ? paystackData.data.amount / 100 : 35000),
          currency: paystackData.data.currency || "NGN",
          status: "success",
          channel: paystackData.data.channel || "paystack",
          paidAt: paystackData.data.paid_at || new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          verifiedBy: "paystack_api"
        });
      } catch (txErr) {
        console.warn("Failed saving paystack transaction ledger record:", txErr);
      }

      console.log(`[PAYSTACK VERIFIED SUCCESS] Upgraded ${verifiedEmail} to premium with reference ${reference}`);
      
      sendSystemEmail(verifiedEmail, "Your Lifetime Admission Portals Receipt - Verified!", getReceiptTemplate(verifiedEmail, reference))
        .catch((e) => console.error("[EMAIL ERROR] Official live receipt triggered failure:", e));

      return res.json({
        status: "success",
        message: "Official Paystack transaction verified and premium unlocked!",
        user: profileData
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: paystackData.message || "Paystack verification failed or pending."
      });
    }
  } catch (err: any) {
    console.error("Paystack server-side request failure:", err);
    return res.status(500).json({
      error: "Could not complete transaction verification with Paystack.",
      details: err?.message
    });
  }
});

// Paystack Webhook Simulation handler
app.all("/api/paystack-webhook", async (req, res) => {
  console.log("Webhook triggered. Query params:", req.query, "Body:", req.body);
  
  let email = "";
  let success = false;
  let reference = "";

  if (req.query.simulate === "success" || req.body?.simulate === "success") {
    email = String(req.query.email || req.body?.email || "student@example.com").trim().toLowerCase();
    success = true;
    reference = "SIM-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  } else {
    const event = req.body;
    if (event && event.event === "charge.success") {
      email = String(event.data?.customer?.email).trim().toLowerCase();
      reference = String(event.data?.reference);
      success = true;
    }
  }

  if (success && email) {
    try {
      const userRef = doc(db, "users", `${email}${DB_SECRET_SUFFIX}`);
      const profileData = {
        uid: email,
        email: email,
        premium: true,
        createdAt: new Date().toISOString(),
        paymentReference: reference,
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, profileData);
      console.log(`SUCCESSFULLY PROVISIONED: Premium status for ${email} with reference ${reference}`);
      return res.json({
        status: "success",
        message: "Premium authorization successfully active",
        user: profileData
      });
    } catch (err) {
      console.error("Failed to store user profile in firestore during webhook activation:", err);
      return res.status(500).json({ error: "Failed to create premium profile record in database." });
    }
  }

  return res.status(400).json({
    status: "failed",
    message: "Payload validation failed. Pass ?simulate=success&email=your@email.com to provision premium instantly."
  });
});

// CSCA Practice Exam Center: Get Questions
app.get("/api/csca/questions", async (req, res) => {
  await ensureSeeded();
  try {
    const col = collection(db, "csca_mock_questions");
    const snapshot = await getDocs(col);
    if (snapshot.empty) {
      const allQ: any[] = [];
      const subjects: ("math" | "physics" | "chemistry" | "professional_chinese")[] = ["math", "physics", "chemistry", "professional_chinese"];
      for (const sub of subjects) {
        allQ.push(...generateCSCAQuestions(sub, 250));
      }
      return res.json({ questions: allQ, source: "static" });
    }
    const questions: any[] = [];
    snapshot.forEach((docSnap) => {
      questions.push(docSnap.data());
    });
    return res.json({ questions, source: "firestore" });
  } catch (err) {
    console.error("Failed to fetch questions from Firestore. Falling back to dynamic static data.");
    const allQ: any[] = [];
    const subjects: ("math" | "physics" | "chemistry" | "professional_chinese")[] = ["math", "physics", "chemistry", "professional_chinese"];
    for (const sub of subjects) {
      allQ.push(...generateCSCAQuestions(sub, 250));
    }
    return res.json({ questions: allQ, source: "static" });
  }
});

// Submit scoring attempt
app.post("/api/csca/submit-attempt", async (req, res) => {
  const { email, score, totalQuestions, startedAt, subjectBreakdown, responses } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email identifying field is required to store exam metric histories." });
  }

  const attemptId = "ATT-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const emailKey = email.trim().toLowerCase();

  const startedAtMs = Number(startedAt || Date.now() - 1200000);
  const submittedAtMs = Date.now();
  const elapsedSeconds = Math.round((submittedAtMs - startedAtMs) / 1000);

  const maxAllowedSeconds = 1200;
  const WestAfricanGraceSec = 60;
  const isInvalidOvertime = elapsedSeconds > (maxAllowedSeconds + WestAfricanGraceSec);

  try {
    const attemptData = {
      attemptId,
      totalScore: Number(score ?? 0),
      totalQuestions: Number(totalQuestions ?? 10),
      percentage: Math.round((Number(score ?? 0) / Number(totalQuestions ?? 10)) * 100),
      submittedAt: new Date(submittedAtMs).toISOString(),
      startedAt: new Date(startedAtMs).toISOString(),
      timestamp: submittedAtMs,
      elapsedSeconds,
      isInvalidOvertime,
      subjectBreakdown: subjectBreakdown || {
        mathematics: { score: Number(score ?? 0), total: Number(totalQuestions ?? 10) },
        physicsChemistry: { score: 0, total: 0 },
        academicChinese: { score: 0, total: 0 }
      },
      responses: responses || []
    };

    const attemptDocRef = doc(db, "users", `${emailKey}${DB_SECRET_SUFFIX}`, "csca_user_attempts", attemptId);
    await setDoc(attemptDocRef, attemptData);

    // Also write to global collection for instant admin analytics
    try {
      await setDoc(doc(db, "csca_global_attempts", attemptId), {
        ...attemptData,
        email: emailKey
      });
    } catch (gErr) {
      console.warn("Global attempt log failed:", gErr);
    }

    console.log(`[CSCA PRACTICE ATTEMPT LOGGED] Saved attempt ${attemptId} for student ${emailKey}. Score: ${score}/${totalQuestions}.`);
    return res.json({ status: "success", attemptId, data: attemptData });
  } catch (err: any) {
    console.error("Failed to record CSCA attempt in Firestore:", err);
    return res.status(500).json({ error: "Failing to persist test metrics to database", details: err?.message });
  }
});

// Get user performance history of exams
app.get("/api/csca/attempts", async (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required to load metrics history." });
  }

  try {
    const colRef = collection(db, "users", `${email}${DB_SECRET_SUFFIX}`, "csca_user_attempts");
    const snapshot = await getDocs(colRef);
    const attempts: any[] = [];
    snapshot.forEach((docSnap) => {
      attempts.push(docSnap.data());
    });
    attempts.sort((a, b) => {
      const timeA = a.timestamp || (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
      const timeB = b.timestamp || (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
      return timeA - timeB;
    });
    return res.json({ attempts });
  } catch (err: any) {
    console.error(`Failed to load historical attempts for user ${email}:`, err);
    return res.status(500).json({ error: "Database error reading credentials", details: err?.message });
  }
});

// GET Business Mandarin Language Schools Directory
app.get("/api/language-institutes", async (req, res) => {
  await ensureSeeded();
  try {
    const col = collection(db, "language_institutes");
    const snapshot = await getDocs(col);
    if (snapshot.empty) {
      return res.json({ institutes: LANGUAGE_INSTITUTES, source: "static" });
    }
    const list: any[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    return res.json({ institutes: list, source: "firestore" });
  } catch (err) {
    console.error("Failing to read language institutes from Firestore. Falling back to local data.");
    return res.json({ institutes: LANGUAGE_INSTITUTES, source: "static" });
  }
});

interface ConsultationLimit {
  count: number;
  resetTime: number;
}
const consultationRateLimits = new Map<string, ConsultationLimit>();

function checkConsultationLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const limitMax = 20;
  const windowMs = 24 * 60 * 60 * 1000;
  const now = Date.now();

  let limit = consultationRateLimits.get(identifier);
  if (!limit || now > limit.resetTime) {
    limit = {
      count: 0,
      resetTime: now + windowMs
    };
    consultationRateLimits.set(identifier, limit);
  }

  if (limit.count >= limitMax) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: limit.resetTime
    };
  }

  limit.count += 1;
  consultationRateLimits.set(identifier, limit);

  return {
    allowed: true,
    remaining: limitMax - limit.count,
    resetTime: limit.resetTime
  };
}

// Gemini/OpenAI Admissions Advisor secure endpoint
app.post("/api/gemini/consult", async (req, res) => {
  const { messages, email } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIp = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : req.socket.remoteAddress || "";

  const emailId = email ? String(email).trim().toLowerCase() : "";

  if (emailId) {
    const emailCheck = checkConsultationLimit(`email:${emailId}`);
    if (!emailCheck.allowed) {
      const hoursLeft = Math.ceil((emailCheck.resetTime - Date.now()) / (1000 * 60 * 60));
      return res.status(429).json({
        error: "Admissions Consultation limit exceeded.",
        details: `Your account billing email (${emailId}) has consumed its allocation of 20 daily consultations. Limits will refresh in approximately ${hoursLeft} hour(s) to protect server resources.`
      });
    }
  }

  if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
    const ipCheck = checkConsultationLimit(`ip:${clientIp}`);
    if (!ipCheck.allowed) {
      const hoursLeft = Math.ceil((ipCheck.resetTime - Date.now()) / (1000 * 60 * 60));
      return res.status(429).json({
        error: "Admissions consultation rate limit triggered.",
        details: `This IP address origin has called our consultant API 20 times today. To prevent automated token abuse, please wait ${hoursLeft} hour(s) or try again later.`
      });
    }
  }

  const systemPrompt = `You are 'Lao Shi' (老师), the premier 24/7 AI Chinese Admissions Consultant, designed specifically for West African students aiming to secure Chinese Government Scholarships (CSC Type A & B), Silk Road Scholarships, and University/Provincial tuition waivers. You hold comprehensive expertise in CSC agency codes, Document Legalization phases in Abuja (Ministry of Education, Ministry of Foreign Affairs, Chinese Embassy), Chinese Student Visa formats (X1 and X2), and HSK requirements. Speak encouragingly, with high-fidelity, actionable advice, and clear, structured, copy-pasteable formatting. Answer users with structured answers, bold headings, and elegant list layouts.`;

  const hasOpenAiKey = process.env.OPENAI_API_KEY && 
                        process.env.OPENAI_API_KEY !== "your-openai-api-key" && 
                        process.env.OPENAI_API_KEY.trim() !== "";

  if (hasOpenAiKey) {
    try {
      console.log("[AI ADVISOR] Proxying consultant query directly to ChatGPT (GPT-4o-Mini via OpenAI)...");
      const openAiMessages: any[] = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text || "",
        }))
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openAiMessages,
        temperature: 0.7,
      });

      const assistantText = response.choices[0]?.message?.content || "I apologize, but I am unable to formulate an OpenAI ChatGPT response at this moment.";
      return res.json({ text: assistantText });
    } catch (err: any) {
      console.error("OpenAI ChatGPT Advisor query failed:", err);
      return res.status(500).json({
        error: "OpenAI ChatGPT server issue occurred. Verify status or check your OPENAI_API_KEY environment credentials setting.",
        details: err?.message
      });
    }
  } else {
    try {
      console.log("[AI ADVISOR] No OpenAI ChatGPT key found. Falling back to Gemini API Advisor...");
      const contents: any[] = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const assistantText = response.text || "I apologize, but I am unable to formulate a Gemini response at this moment. Please check credentials configuration.";
      return res.json({ text: assistantText });
    } catch (err: any) {
      console.error("Gemini Advisor query failed:", err);
      return res.status(500).json({
        error: "Admissions advisor AI engine proxy issue. Ensure your OPENAI_API_KEY or GEMINI_API_KEY is configured in your secrets.",
        details: err?.message
      });
    }
  }
});

export default app;
