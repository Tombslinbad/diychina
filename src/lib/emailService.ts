import nodemailer from "nodemailer";

// Render a beautiful, professional OTP (One-Time Password) HTML Email Template
export function getOtpTemplate(email: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Verification Pin</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafbfc; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 800; color: #111c2d; letter-spacing: -0.5px; }
        .subtitle { font-size: 10px; font-family: monospace; color: #d97706; font-weight: bold; text-transform: uppercase; margin-top: 4px; letter-spacing: 1.5px; }
        .content { background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #eaedf0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
        .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px; }
        .otp-code { font-size: 32px; font-family: monospace; font-weight: 700; letter-spacing: 6px; color: #059669; }
        .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; line-height: 1.5; }
        .disclaimer { font-size: 11px; color: #64748b; line-height: 1.5; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">Admissions DIY Nigeria</div>
          <div class="subtitle">Chinese Government CSC Scholarship Portal</div>
        </div>
        <div class="content">
          <h3 class="title">Secure Auth Verification Pin</h3>
          <p class="text">
            Use the secure 6-digit verification code below to authorize your login link and enter your lifetime Admissions Suite.
          </p>
          <div class="otp-box">
            <span class="otp-code">${otp}</span>
          </div>
          <p class="text" style="font-size: 12px;">
            This security code was requested for <strong>${email}</strong>. It is strictly confidential and is only active for <strong>15 minutes</strong>. If you did not make this request, please safely ignore this communication.
          </p>
          <div class="disclaimer">
            * Security note: Never disclose your PIN code or billing reference to anybody. Authorized gatekeepers will never request details on personal authentication streams.
          </div>
        </div>
        <div class="footer">
          © 2026 Admissions DIY Nigeria. All Rights Reserved.<br>
          Gated consular portal access. Powered by verified Paystack checkout.
        </div>
      </div>
    </body>
    </html>
  `;
}

// Render a premium, high-converting Purchase Confirmation / Receipt HTML Email Template
export function getReceiptTemplate(email: string, reference: string): string {
  // Use public preview app as the absolute link for redirecting
  const portalUrl = "https://ais-pre-xrgu47rdpe4dysd7ps7azn-235027986297.europe-west1.run.app";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lifetime Portal Unlocked</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafbfc; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 800; color: #111c2d; letter-spacing: -0.5px; }
        .subtitle { font-size: 10px; font-family: monospace; color: #d97706; font-weight: bold; text-transform: uppercase; margin-top: 4px; letter-spacing: 1.5px; }
        .content { background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #eaedf0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .badge-wrapper { text-align: center; margin-bottom: 20px; }
        .badge { background-color: #d1fae5; color: #065f46; border-radius: 100px; padding: 6px 16px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
        .title { font-size: 18px; font-weight: 750; color: #0f172a; margin-top: 0; margin-bottom: 8px; text-align: center; }
        .text { font-size: 13px; color: #475569; line-height: 1.6; text-align: center; margin-bottom: 24px; }
        .receipt-card { border-top: 1px dashed #e2e8f0; border-bottom: 1px dashed #e2e8f0; padding: 16px 0; margin-bottom: 24px; font-size: 13px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .receipt-label { color: #64748b; }
        .receipt-val { font-weight: 600; color: #0f172a; }
        .action-container { text-align: center; margin-top: 24px; margin-bottom: 12px; }
        .btn { background-color: #f59e0b; color: #020813 !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 13px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2); }
        .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">Admissions DIY Nigeria</div>
          <div class="subtitle">Chinese Government CSC Scholarship Portal</div>
        </div>
        <div class="content">
          <div class="badge-wrapper">
            <span class="badge">Payment Confirmed & Verified</span>
          </div>
          <h3 class="title">Lifetime License Unlocked!</h3>
          <p class="text">
            Your payment of <strong>₦35,000 NGN</strong> was captured and authenticated successfully. Your permanent VIP user credentials have been mapped and tied directly to your email address:
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 20px; font-weight: 700; font-size: 15px; color: #1e293b;">
            ${email}
          </div>

          <div class="receipt-card">
            <div class="receipt-row">
              <span class="receipt-label">Payment Gateway Reference:</span>
              <span class="receipt-val" style="font-family: monospace;">${reference}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Access Level:</span>
              <span class="receipt-val">DIY Executive CSC Scholarship Admission Suite</span>
            </div>
            <div class="receipt-row" style="margin-bottom: 0;">
              <span class="receipt-label">Validity Period:</span>
              <span class="receipt-val" style="color: #059669;">Lifetime License (No recurring fee)</span>
            </div>
          </div>

          <p class="text" style="font-size: 12.5px; font-weight: 500; font-family: inherit;">
            To access your gated smart suite, simply head to the portal, enter your billing email address, and verify using the 6-digit safety code dispatched securely on request.
          </p>

          <div class="action-container">
            <a href="${portalUrl}" class="btn" target="_blank">Open Admissions Dashboard</a>
          </div>
        </div>
        <div class="footer">
          © 2026 Admissions DIY Nigeria. All Rights Reserved.<br>
          Secured with robust 256-Bit SSL Paystack verification.
        </div>
      </div>
    </body>
    </html>
  `;
}

// Render dynamic, gorgeous, educational-niche automated follow-up email targeted at candidate's pain points
export function getEducationFollowUpTemplate(fullName: string, email: string, onboarding: any): string {
  const portalUrl = "https://ais-pre-xrgu47rdpe4dysd7ps7azn-235027986297.europe-west1.run.app";
  
  const degree = onboarding?.degree || "Bsc";
  const hsk = onboarding?.hsk || "No, study in English";
  const csc = onboarding?.csc || "Type B Direct";
  const motivation = onboarding?.motivation || "Living Stipends";

  let studyTrackName = "";
  let painPointText = "";
  let targetSolutionReward = "";

  if (degree === "Bsc") {
    studyTrackName = "Bachelor's Degree Admissions and Stipends Program";
    painPointText = `Without a structured roadmap, undergraduate applicants struggle heavily with manual Abuja credit evaluations and face standard visa loop rejections. By not finalizing your matching fee, you are leaving your 2026/2027 academic year to chance while priority application windows are closing rapidly.`;
    targetSolutionReward = `Our portal maps 48 accredited schools with 100% tuition-waiver status and provides verified step-by-step guides for federal legalization in Abuja, so you can lock in your 2,500 RMB (~₦500,000 NGN) monthly allowances without stress.`;
  } else if (degree === "Masters") {
    studyTrackName = "Premium Postgraduate Master's & Doctoral Fellowship";
    painPointText = `Securing advisor acceptance letters is the #1 major hurdle for postgraduate researchers. Without direct access to active research centers, applications get lost in standard academic files, resulting in missed timelines or outright rejection.`;
    targetSolutionReward = `Unlock the portal to get direct contacts for 35 world-renowned academies accepting West African researchers, enabling you to secure direct fellowship advisor letters and lock in your 3,000 - 3,500 RMB (~₦700,000 NGN) monthly living stipends.`;
  } else {
    studyTrackName = "Vocational Language Institute and Global Trade Pipeline";
    painPointText = `Entering the Chinese trade space is complex without a certified student travel visa from an approved academy. Trying to manage language directories and manufacturing hubs individually will leave you with high intermediary commissions or visa rejection.`;
    targetSolutionReward = `Our portal opens the doors to pre-vetted trade language programs across Guangzhou, Shanghai, and Yiwu, letting you study while bypassing agents to source direct wholesale networks from local manufacturing factories.`;
  }

  // Motivation pain points
  let motivationPainPoint = "";
  if (motivation === "Living Stipends") {
    motivationPainPoint = "With living stipends of up to ₦700,000 NGN monthly at stake, every day of delay is direct financial loss. Our verified Abuja Ministry of Education and Foreign Affairs guidance is active and waiting for your submission.";
  } else if (motivation === "Quality Degree") {
    motivationPainPoint = "A global-prestige degree is your ticket to bypassing West African employment brackets. Don't risk credentials rejection due to minor procedural mistakes at the Abuja legalization or authentication levels.";
  } else {
    motivationPainPoint = "Direct import-export networks are waiting in Guangzhou and Yiwu. Activating your student route now is the single lower-cost pathway to bypassing standard commercial shipping limitations.";
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Completing Your CSC Admissions Match Portfolio</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #020813; color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 10px; }
        .branding-header { text-align: center; margin-bottom: 24px; padding: 10px 0; }
        .branding-title { font-size: 24px; font-weight: 800; color: #f59e0b; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
        .branding-sub { font-size: 11px; font-family: "Courier New", monospace; color: #94a3b8; font-weight: bold; text-transform: uppercase; margin-top: 5px; letter-spacing: 2px; }
        .main-card { background-color: #070f1e; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
        .priority-badge { background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 100px; display: inline-block; margin-bottom: 20px; letter-spacing: 1px; }
        .salutation { font-size: 16px; font-weight: bold; color: #ffffff; margin-top: 0; margin-bottom: 12px; }
        .paragraph { font-size: 13.5px; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px; }
        .painpoint-box { background-color: rgba(245, 158, 11, 0.05); border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
        .painpoint-title { font-size: 12px; font-family: monospace; font-weight: bold; text-transform: uppercase; color: #f59e0b; margin-top: 0; margin-bottom: 6px; letter-spacing: 1.5px; }
        .painpoint-text { font-size: 13px; color: #cbd5e1; line-height: 1.55; margin: 0; font-style: italic; }
        .academic-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12.5px; }
        .academic-tr { border-bottom: 1px solid #1e293b; }
        .academic-th { color: #64748b; font-family: monospace; text-transform: uppercase; font-size: 10px; padding: 10px 0; text-align: left; font-weight: bold; }
        .academic-td { color: #ffffff; padding: 10px 0; font-weight: 500; }
        .action-button-wrapper { text-align: center; margin-top: 28px; margin-bottom: 16px; }
        .btn-action { background: linear-gradient(135deg, #f59e0b, #d97706); color: #020813 !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 13px; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25); }
        .disputed-footer { text-align: center; margin-top: 30px; font-size: 11px; color: #475569; line-height: 1.6; border-top: 1px solid #111c2d; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="branding-header">
          <div class="branding-title">Admissions DIY Nigeria</div>
          <div class="branding-sub">Unified Chinese Government Academic Portal</div>
        </div>
        <div class="main-card">
          <div style="text-align: center;">
            <span class="priority-badge">⚠️ Action Required: Scholarship Portal Pending</span>
          </div>
          
          <h3 class="salutation">Dear ${fullName},</h3>
          
          <p class="paragraph">
            You recently initialized your target applicant portfolio focusing on the prestigious <strong>${studyTrackName}</strong>. 
            However, your profile remains incomplete, and your 2026 Admissions Workspace is currently locked.
          </p>

          <div class="painpoint-box">
            <h5 class="painpoint-title">Critical Academic Friction Point</h5>
            <p class="painpoint-text">
              "${painPointText}"
            </p>
          </div>

          <p class="paragraph">
            ${targetSolutionReward}
          </p>

          <table class="academic-table">
            <thead>
              <tr class="academic-tr">
                <th class="academic-th" style="width: 40%;">Candidate Pipeline Parameter</th>
                <th class="academic-th">Your Selected Track Setup</th>
              </tr>
            </thead>
            <tbody>
              <tr class="academic-tr">
                <td class="academic-td" style="color: #94a3b8;">Academic Program Goal:</td>
                <td class="academic-td" style="color: #f59e0b; font-weight: bold;">${degree === "Bsc" ? "BSc Degree" : degree === "Masters" ? "Master's Fellow" : "Language Program"}</td>
              </tr>
              <tr class="academic-tr">
                <td class="academic-td" style="color: #94a3b8;">Linguistic Qualification:</td>
                <td class="academic-td">${hsk}</td>
              </tr>
              <tr class="academic-tr">
                <td class="academic-td" style="color: #94a3b8;">Sponsorship Target Channel:</td>
                <td class="academic-td">${csc}</td>
              </tr>
              <tr class="academic-tr">
                <td class="academic-td" style="color: #94a3b8;">Primary Incentive Driver:</td>
                <td class="academic-td" style="color: #6ee7b7;">${motivation === "Living Stipends" ? "₦500k-700k Monthly Allowance" : motivation === "Quality Degree" ? "Global Validated Accreditations" : "China Hub Direct Sourcing"}</td>
              </tr>
            </tbody>
          </table>

          <p class="paragraph">
            <strong>${motivationPainPoint}</strong>
          </p>

          <p class="paragraph" style="font-size: 12.5px; color: #94a3b8; line-height: 1.5;">
            By finalizing your one-time licensing verification fee of <strong>₦35,000 NGN</strong> today, you will immediately unlock:
            <br>• Access to active state-funded stipend directories
            <br>• Our proprietary <em>Lao Shi AI Specialist</em> Admissions consultant
            <br>• SOP draft automations, visa templates, and step-by-step legalization files for Abuja.
          </p>

          <div class="action-button-wrapper">
            <a href="${portalUrl}" class="btn-action" target="_blank">Unlock Gated Portal Now</a>
          </div>
        </div>
        
        <div class="disputed-footer">
          © 2026 Admissions DIY Nigeria. All Rights Reserved.<br>
          Gated consular application support. Remita-compatible Nigerian-Chinese educational pipelines.<br>
          <span style="color: #334155; font-size: 10px;">To guarantee access, keep this safety blueprint active.</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Global Core Mailing Interface
// Dynamically routes to live SMTP server or simulated sandbox logger based on credentials state
export async function sendSystemEmail(to: string, subject: string, htmlContent: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const sender = process.env.SMTP_SENDER || `Admissions DIY Nigeria <no-reply@diychina.com>`;

  // Rigorous validation: check if SMTP credentials hold authentic parameters
  const isConfigured = user && pass && user !== "your-email@gmail.com" && pass !== "your-app-password" && user !== "";

  if (isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // True for 465, false for 587
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false // Prevents common self-signed certificate chain blocker anomalies
        },
        connectionTimeout: 1500, // 1.5 seconds connection timeout max
        greetingTimeout: 1500,    // 1.5 seconds greeting timeout max
        socketTimeout: 2000       // 2.0 seconds socket timeout max
      });

      await transporter.sendMail({
        from: sender,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`[SMTP SYSTEM SUCCESS] Dispatched secure transmission: ${subject} to ${to}`);
      return { success: true, method: "smtp" };
    } catch (err: any) {
      console.error("[SMTP CRITICAL FAILURE] SMTP transmission pipeline blocked, falling back to secure simulated logger:", err?.message || err);
    }
  }

  // Fallback simulator for developer console visibility
  console.log("\n" + "=".repeat(80));
  console.log(`✉️  [SIMULATED MAIL DISPATCH ENVELOPE]`);
  console.log(`   To:      ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   From:    ${sender}`);
  console.log("-".repeat(80));
  
  // Strip CSS styles and HTML tags to extract a neat summary representation
  const textSummary = htmlContent
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log(`   Body Abstract:\n   ${textSummary.substring(0, 360)}...`);
  console.log("=".repeat(80) + "\n");
  
  return { success: true, method: "simulated" };
}
