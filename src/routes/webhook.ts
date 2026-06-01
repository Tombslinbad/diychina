import express from "express";
import crypto from "crypto";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db, DB_SECRET_SUFFIX } from "../lib/db";
import { sendSystemEmail, getReceiptTemplate } from "../lib/emailService";

const router = express.Router();

// Mounts at /api/webhook/paystack (Express router handles "/" POST as mounted)
router.post("/", async (req, res) => {
  console.log("=================================================");
  console.log("SECURE PAYSTACK WEBHOOK INGRESS AT:", new Date().toISOString());
  console.log("=================================================");

  const signature = req.headers["x-paystack-signature"];
  const secretKey = (process.env.PAYSTACK_SECRET_KEY || "").trim();

  // In production, we require PAYSTACK_SECRET_KEY to be set
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && (!secretKey || secretKey === "sk_test_your_secret_key_here" || secretKey === "")) {
    console.error("❌ WEBHOOK CONFIGURATION ERROR: PAYSTACK_SECRET_KEY is missing or invalid in production.");
    return res.status(500).send("Gateway configuration error");
  }

  if (!signature) {
    console.warn("⚠️ Webhook warning: Paystack Signature header is missing.");
    return res.status(400).send("Missing signature header");
  }

  // 1. Convert raw body buffer directly to string for HMAC verification (no stringify modifications)
  let rawBody = "";
  if (Buffer.isBuffer(req.body)) {
    rawBody = req.body.toString("utf8");
  } else if (typeof req.body === "string") {
    rawBody = req.body;
  } else {
    // Fail-safe fallback if express.raw wasn't registered cleanly
    rawBody = JSON.stringify(req.body);
  }

  // 2. Compute HMAC SHA-512 cryptographic verification
  const computedHash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  // 3. Extract and verify upstream client IP Address from Cloud Run x-forwarded-for header
  const PAYSTACK_IPS = ["52.31.139.75", "52.49.236.97", "52.214.14.220"];
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIp = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : req.socket.remoteAddress || "";

  const isPaystackSourceIp = PAYSTACK_IPS.includes(clientIp) || clientIp === "127.0.0.1" || clientIp === "::1";
  const isSignatureValid = computedHash === signature;

  console.log(`[Webhook Security Ingress] Client IP: ${clientIp}, Verified Paystack Source Net: ${isPaystackSourceIp}`);

  // Endpoint acts exclusively on requests coming from verified Paystack IP addresses OR securely validated cryptographic signatures
  if (!isPaystackSourceIp && !isSignatureValid) {
    console.error("❌ WEBHOOK SECURITY DENIED: Request fails both IP Whitelist checks and cryptographic signature checks.");
    return res.status(403).send("Unauthorized webhook traffic source");
  }

  // Reject invalid signatures in production even if IP spoofed
  if (!isSignatureValid && isProd) {
    console.error("❌ WEBHOOK SECURITY DENIED: Cryptographic check failed in production.");
    return res.status(401).send("Invalid signature payload");
  }

  console.log("✅ Webhook Cryptographic Checksum Passed!");

  // 3. Return 200 instantly to close connection pool, preventing redundant retries & timeout delays
  res.status(200).send("Webhook Received");

  // 4. Run entire transaction database execution asynchronously
  // Process the async Firestore ledger mapping
  (async () => {
    try {
      const event = JSON.parse(rawBody);
      if (event && event.event === "charge.success") {
        const data = event.data;
        const reference = (data?.reference || "").trim();
        const userId = (data?.metadata?.userId || "").trim();
        const email = (data?.customer?.email || "").trim().toLowerCase();

        if (!reference) {
          console.error("❌ Webhook aborted: No reference id in payload.");
          return;
        }

        if (!userId) {
          console.error("❌ Webhook aborted: No userId inside paystack metadata identifiers map.");
          return;
        }

        console.log(`[ASYNC DEFER] Writing Ledger. Ref: ${reference}, User UID: ${userId}, Customer Email: ${email}`);

        // Wrap db execution inside an idempotent ACID transaction
        await runTransaction(db, async (transaction) => {
          const ledgerDocRef = doc(db, "payment_ledgers", `${reference}${DB_SECRET_SUFFIX}`);
          const ledgerSnap = await transaction.get(ledgerDocRef);

          // If payment document ledger already exists, we stop the transact (idempotency check)
          if (ledgerSnap.exists()) {
            throw new Error(`ABORT_DUPLICATE_IDEMPOTENCY: reference: ${reference} already registered.`);
          }

          const userDocRef = doc(db, "users", `${userId}${DB_SECRET_SUFFIX}`);
          const userSnap = await transaction.get(userDocRef);

          const existingUserData = userSnap.exists() ? userSnap.data() : {};

          // Write reference ledger document
          transaction.set(ledgerDocRef, {
            reference,
            userId,
            email,
            amount: data?.amount ? data.amount / 100 : 35000,
            gateway: "paystack",
            status: "success",
            createdAt: serverTimestamp()
          });

          // Upgrade user document to Premium
          transaction.set(userDocRef, {
            ...existingUserData,
            uid: userId,
            email: email || existingUserData.email || "",
            premium: true, // compatible with frontend components
            isPremium: true, // system state
            paymentReference: reference,
            premiumUpdatedAt: serverTimestamp(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        });

        console.log(`🚀 [SUCCESSFUL IDEMPOTENT TRANSACTION] Elevated ${userId} to premium! Ledger written for ${reference}`);

        // Async dispatch of gorgeous receipt email
        const targetEmail = email || userId;
        sendSystemEmail(targetEmail, "Your Lifetime Admission Portals Receipt - Verified!", getReceiptTemplate(targetEmail, reference))
          .catch((e) => console.error("[EMAIL ERROR] Webhook trigger receipt failed:", e));
      } else {
        console.log(`[IGNORE EVENT] Captured event: ${event?.event || "unknown"}. (Not a charge.success)`);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("ABORT_DUPLICATE_IDEMPOTENCY")) {
        console.warn(`[IDEMPOTENCY TRIGGERED] Dropping duplicate webhook payment retry for reference.`);
      } else {
        console.error("❌ Asynchronous Webhook Transaction Database Error:", err.message || err);
      }
    }
  })();
});

export default router;
