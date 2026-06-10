import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { db, DB_SECRET_SUFFIX, closeDb } from "../src/lib/db.js";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { UNIVERSITIES } from "../src/universitiesData.js";
import { CSCA_MATH_QUESTIONS } from "../src/cscaQuestionsData.js";
import { LANGUAGE_INSTITUTES } from "../src/languageInstitutesData.js";
import { sendSystemEmail, getOtpTemplate, getReceiptTemplate } from "../src/lib/emailService.js";
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
    if (cscaSnapshot.empty) {
      console.log(`[LAZY SEEDER] Seeding Firestore with ${CSCA_MATH_QUESTIONS.length} CSCA mock questions...`);
      for (const q of CSCA_MATH_QUESTIONS) {
        await setDoc(doc(db, "csca_mock_questions", q.questionId), { ...q, seedingToken: DB_SECRET_SUFFIX });
      }
      console.log("[LAZY SEEDER] CSCA questions seeding complete!");
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
  "demo@diychina.com",
  "student@example.com",
  "student@diychina.com",
  "igwev2956@gmail.com",
  "admin@diychina.com"
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
        paymentReference: "DIY-2026-WHITELIST-VIP",
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

// --- ADMIN CONTROL PANEL DIRECT API HOOKS ---

// Get all sales metrics & users list
app.get("/api/admin/users", async (req, res) => {
  try {
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    const users: any[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const idClean = docSnap.id.replace(DB_SECRET_SUFFIX, "");
      users.push({ ...data, id: idClean });
    });

    return res.json({ users });
  } catch (err: any) {
    console.error("Admin retrieve users error:", err);
    return res.status(500).json({ error: "Failed retrieving users database.", details: err?.message });
  }
});

// Grant or revoke premium subscription (₦35,000) status manually
app.post("/api/admin/toggle-premium", async (req, res) => {
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
    const newPremium = !userData.premium;

    await setDoc(userDocRef, {
      ...userData,
      premium: newPremium,
      paymentReference: newPremium ? (userData.paymentReference || "ADMIN-GRANTED-" + Date.now()) : "",
      updatedAt: new Date().toISOString()
    });

    return res.json({ status: "success", premium: newPremium });
  } catch (err: any) {
    console.error("Admin toggle premium error:", err);
    return res.status(500).json({ error: "Failed to toggle subscription state.", details: err?.message });
  }
});

// Irreversibly delete user
app.post("/api/admin/delete-user", async (req, res) => {
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

// Create or update a university document in Firestore
app.post("/api/admin/university/save", async (req, res) => {
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
app.post("/api/admin/university/delete", async (req, res) => {
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
app.post("/api/admin/question/save", async (req, res) => {
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
app.post("/api/admin/question/delete", async (req, res) => {
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
app.post("/api/admin/language-institute/save", async (req, res) => {
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
app.post("/api/admin/language-institute/delete", async (req, res) => {
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
      "Your Temporary Secure Sign-In Code - Admissions DIY Nigeria",
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
      "Your Secure login Verification PIN Code - Admissions DIY Nigeria",
      getOtpTemplate(email, otp)
    );

    return res.json({
      status: "success",
      registered: true,
      message: "Safety PIN code successfully dispatched to your email address. It will expire in 15 minutes."
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
          paymentReference: "DIY-2026-DEMO-VIP",
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
      return res.json({ questions: CSCA_MATH_QUESTIONS, source: "static" });
    }
    const questions: any[] = [];
    snapshot.forEach((docSnap) => {
      questions.push(docSnap.data());
    });
    return res.json({ questions, source: "firestore" });
  } catch (err) {
    console.error("Failed to fetch questions from Firestore. Falling back to static data.");
    return res.json({ questions: CSCA_MATH_QUESTIONS, source: "static" });
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
