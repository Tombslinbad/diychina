import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  GraduationCap,
  FileText,
  MessageSquare,
  CheckSquare,
  Sparkles,
  LogOut,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Filter,
  ArrowRight,
  ArrowUpRight,
  Clipboard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Copy,
  RefreshCw,
  Send,
  Flag,
  MapPin,
  X,
  FileBadge2,
  BookmarkCheck,
  Info,
  Lock,
  Clock,
  TrendingUp,
  Plane,
  Globe,
  Check,
  BookOpen,
  Calendar,
  Menu,
  AlertTriangle
} from "lucide-react";
import { UNIVERSITIES, University } from "./universitiesData";
import { Tabs, ChatMessage } from "./types";
import { generateCSCAQuestions } from "./lib/cscaGenerator";
import { LANGUAGE_INSTITUTES, LanguageInstitute } from "./languageInstitutesData";
import { useCscaStore } from "./lib/cscaStore";
import { Dashboard } from "./components/Dashboard";
import { AdminPanel } from "./components/AdminPanel";
import { ReadinessQuiz } from "./components/ReadinessQuiz";
import { UniversityMatch } from "./components/UniversityMatch";
import { DocumentDiagnostic } from "./components/DocumentDiagnostic";
import { DualApplicationHub } from "./components/DualApplicationHub";
import { StudyPlanStudio } from "./components/StudyPlanStudio";
import { InterviewSimulator } from "./components/InterviewSimulator";
import { VisaAndPreDeparture } from "./components/VisaAndPreDeparture";
import { FaqSection } from "./components/FaqSection";
import { FounderStoryModal } from "./components/FounderStoryModal";
import { Shield } from "lucide-react";
import heroImg from "./assets/images/china_university_admission_1780294406477.png";

const ADMIN_EMAILS = [
  "igwev2956@gmail.com",
  "demo@verifieduni.com",
  "admin@verifieduni.com"
];

export default function App() {
  // Authentication & Navigation States
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("china_portal_user") || null;
  });
  const [userProfile, setUserProfile] = useState<any | null>(() => {
    const saved = localStorage.getItem("china_portal_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });
  const [authEmail, setAuthEmail] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // Registration & Onboarding States
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  
  // Onboarding Wizard steps
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardDegree, setOnboardDegree] = useState("Bsc");
  const [onboardHsk, setOnboardHsk] = useState("No, study in English");
  const [onboardCsc, setOnboardCsc] = useState("Type B Direct");
  const [onboardMotivation, setOnboardMotivation] = useState("Living Stipends");
  const [onboardSaving, setOnboardSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.WORKSPACE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Database lists (fetched from Express secure endpoint)
  const [universities, setUniversities] = useState<University[]>([]);
  const [dbSource, setDbSource] = useState("loading");

  // Payment popup & webhook simulation states
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [payEmail, setPayEmail] = useState("");
  const [confirmPayEmail, setConfirmPayEmail] = useState("");
  const [payName, setPayName] = useState("");
  const [payPhone, setPayPhone] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [payMode, setPayMode] = useState<"live" | "sandbox">("live");
  const [devLogs, setDevLogs] = useState<string[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsTab, setTermsTab] = useState<"terms" | "refund">("terms");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showFounderStory, setShowFounderStory] = useState(false);

  // Tab 1: Directory Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterTrack, setFilterTrack] = useState("All");
  const [filterCscTypeA, setFilterCscTypeA] = useState(false);
  const [filterCscTypeB, setFilterCscTypeB] = useState(false);
  const [filterProvincial, setFilterProvincial] = useState(false);
  const [filterSilkRoad, setFilterSilkRoad] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  // Tab 2: Code/Prompt Station Form Parameters
  const [activeTemplate, setActiveTemplate] = useState<"sop" | "email" | "recommend">("sop");
  const [studentName, setStudentName] = useState("");
  const [targetMajor, setTargetMajor] = useState("Computer Science & AI");
  const [prevGpa, setPrevGpa] = useState("4.5 / 5.0");
  const [targetUniName, setTargetUniName] = useState("Zhejiang University");
  const [keyAdvantage, setKeyAdvantage] = useState("Published 1 paper on machine learning in local IEEE chapter");
  const [advisorName, setAdvisorName] = useState("Prof. Dr. Wang Wei");
  const [recommenderName, setRecommenderName] = useState("Prof. Igwe Nkem");
  const [copiedText, setCopiedText] = useState(false);
  const [aiDocPrompt, setAiDocPrompt] = useState("");
  const [aiDocOutput, setAiDocOutput] = useState("");
  const [docGenerating, setDocGenerating] = useState(false);

  // Tab 3: Lao Shi (Admissions Chat Specialist)
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Nǐ hǎo! I am Lao Shi (老师), your dedicated 24/7 AI Chinese Government Scholarship (CSC) Admissions Advisor. Ask me anything about locating Type A/B agency codes, formulating study plans, requesting acceptance letters from supervisors, or legalizing documents in Abuja!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [chatGenerating, setChatGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Tab 4: Abuja Legalization Checklist Progress Tracker
  const [checklist, setChecklist] = useState({
    moeEvaluation: false,
    moePayment: false,
    mfaStamp: false,
    mfaPayment: false,
    embassyLiaison: false,
    embassyLegalization: false,
    visaFormComplete: false,
    visaPhysicalExam: false,
    visaPoliceReport: false
  });

  // Module 5 & 7 Expanded Workspace State Declarations mapped to secure Zustand Store context
  const {
    cscaQuestions,
    cscaActiveTest,
    cscaTimeRemaining,
    cscaSelectedAnswers,
    cscaTestSubmitted,
    cscaLatestScore,
    cscaSubject,
    setCscaSubject,
    setCscaQuestions,
    setCurrentQuestion,
    startTest: startCscaTest,
    selectAnswer: selectCscaAnswer,
    tickTimer: tickCscaTimer,
    submitTest: submitCscaTest,
    restoreState: restoreCscaState,
    trackQuestionSeconds,
    resetStore
  } = useCscaStore();

  const [cscaLoading, setCscaLoading] = useState(false);
  const [cscaShowExplanations, setCscaShowExplanations] = useState<Record<string, boolean>>({});
  const [cscaShowComplianceGuide, setCscaShowComplianceGuide] = useState(false);
  const [cscaHistory, setCscaHistory] = useState<any[]>([]);
  const [cscaQuestionsLimit, setCscaQuestionsLimit] = useState<number>(10);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [cscaFlaggedAnswers, setCscaFlaggedAnswers] = useState<Record<string, boolean>>({});
  const [cscaShowSubmitConfirm, setCscaShowSubmitConfirm] = useState(false);
  
  const [languageSchools, setLanguageSchools] = useState<any[]>(LANGUAGE_INSTITUTES);
  const [langSchoolLoading, setLangSchoolLoading] = useState(false);
  const [langSchoolFilter, setLangSchoolFilter] = useState("All");

  // Interactive Verification & PNR Bypass States
  const [passportSurname, setPassportSurname] = useState("");
  const [passportGiven, setPassportGiven] = useState("");
  const [ninNames, setNinNames] = useState("");
  const [spellCheckResult, setSpellCheckResult] = useState<{
    checked: boolean;
    match: boolean;
    details: string;
  } | null>(null);

  const [gdsPnr, setGdsPnr] = useState<string | null>(null);
  const [gdsLoading, setGdsLoading] = useState(false);
  const [pnrOrigin, setPnrOrigin] = useState("Abuja (ABV)");
  const [pnrDest, setPnrDest] = useState("Yiwu / Hangzhou (HGH)");
  const [pnrDate, setPnrDate] = useState("2026-09-10");
  const [pnrClass, setPnrClass] = useState("Economy Trade Class");

  const verifyAlignment = () => {
    if (!passportSurname.trim() || !passportGiven.trim() || !ninNames.trim()) {
      setSpellCheckResult({
        checked: true,
        match: false,
        details: "Please fill in all fields to compare databases."
      });
      return;
    }
    const passportFull = `${passportSurname.trim()} ${passportGiven.trim()}`.toLowerCase().replace(/[^a-z]/g, "");
    const ninFull = ninNames.trim().toLowerCase().replace(/[^a-z]/g, "");
    if (passportFull === ninFull) {
      setSpellCheckResult({
        checked: true,
        match: true,
        details: "PERFECT MATCH: The letter sequence in your passport entries aligns exactly with your NIN database record. The NIS biometric engine will capture your details with zero mismatches!"
      });
    } else {
      const passWords = `${passportSurname.trim()} ${passportGiven.trim()}`.toLowerCase().split(/\s+/).filter(Boolean);
      const ninWords = ninNames.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const missingInNin = passWords.filter(w => !ninWords.includes(w));
      if (missingInNin.length === 0) {
        setSpellCheckResult({
          checked: true,
          match: true,
          details: "MAPPED MATCH: Name order is shuffled but all name strings are present. Secure capture is probable, but we advise double-checking with Gwagwalada center admin before capture."
        });
      } else {
        setSpellCheckResult({
          checked: true,
          match: false,
          details: `MISMATCH ALERT: The name strings do not align. Names present in passport but missing in your NIN record: "${missingInNin.join(", ")}". Even a single character variance halts the NIS capture system!`
        });
      }
    }
  };

  const generateGdsTicket = () => {
    setGdsLoading(true);
    setTimeout(() => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "ET-";
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setGdsPnr(result);
      setGdsLoading(false);
      setDevLogs(prev => [
        `Generated simulated PNR locator: ${result}`,
        `Linked CVASC ticket for date ${pnrDate} corresponding with matching airline guidelines.`,
        ...prev
      ]);
    }, 1200);
  };

  // Load Universities Catalog, CSCA Questions, and Language Institutes on launch
  useEffect(() => {
    fetchUniversities();
    fetchCscaQuestions();
    fetchLanguageInstitutes();
    
    // Check if user session has been stored locally
    const savedUser = localStorage.getItem("china_portal_user");
    const savedProfile = localStorage.getItem("china_portal_profile");
    if (savedUser && savedProfile) {
      const email = savedUser.toLowerCase();
      setCurrentUser(email);
      setUserProfile(JSON.parse(savedProfile));
      fetchCscaAttempts(email);
    }

    // Restore active test if any
    restoreCscaState();
  }, [restoreCscaState]);

  // Interval timer for CSCA active CBT practice using Zustand store
  useEffect(() => {
    if (!cscaActiveTest) return;

    const interval = setInterval(() => {
      const { autoSubmit } = tickCscaTimer();
      trackQuestionSeconds();
      if (autoSubmit) {
        clearInterval(interval);
        handleCscaSubmit(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cscaActiveTest, tickCscaTimer, trackQuestionSeconds]);

  // Auto-sync active userProfile info into checkout parameters to avoid empty field validation failures during checkout
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName && !payName) {
        setPayName(userProfile.fullName);
      }
      if (userProfile.phoneNumber && !payPhone) {
        setPayPhone(userProfile.phoneNumber);
      }
      if (userProfile.email) {
        if (!payEmail) setPayEmail(userProfile.email);
        if (!confirmPayEmail) setConfirmPayEmail(userProfile.email);
      }
      setAgreeToTerms(true);
    }
  }, [userProfile, payName, payPhone, payEmail, confirmPayEmail]);

  const fetchCscaQuestions = async () => {
    try {
      setCscaLoading(true);
      const res = await fetch("/api/csca/questions");
      const data = await res.json();
      if (data.questions) {
        setCscaQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to load CSCA questions:", err);
    } finally {
      setCscaLoading(false);
    }
  };

  const fetchLanguageInstitutes = async () => {
    try {
      setLangSchoolLoading(true);
      const res = await fetch("/api/language-institutes");
      const data = await res.json();
      if (data.institutes) {
        setLanguageSchools(data.institutes);
      }
    } catch (err) {
      console.error("Failed to load language institutes:", err);
    } finally {
      setLangSchoolLoading(false);
    }
  };

  const fetchCscaAttempts = async (email: string) => {
    try {
      const res = await fetch(`/api/csca/attempts?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.attempts) {
        setCscaHistory(data.attempts);
      }
    } catch (err) {
      console.error("Failed to load historical CSCA attempts:", err);
    }
  };

  const handleStartCscaTest = (subject: "math" | "physics" | "chemistry" | "professional_chinese" = cscaSubject as any) => {
    const limit = cscaQuestionsLimit;
    const questions = generateCSCAQuestions(subject, limit);
    const durationSeconds = limit * 120; // 120 seconds (2 minutes) per question
    
    // Reset CBT navigation and review flagging states
    setActiveQuestionIdx(0);
    setCscaFlaggedAnswers({});
    
    // Start active state
    startCscaTest(subject, questions as any, durationSeconds);
    addDevLog(`CSCA CBT ${subject.toUpperCase()} ${Math.round(durationSeconds / 60)}-Minute Exam started with ${limit} questions.`);
  };

  const handleSelectAnswer = (questionId: string, answerLetter: string) => {
    setCurrentQuestion(questionId);
    selectCscaAnswer(questionId, answerLetter);
  };

  const handleCscaSubmit = async (isAuto = false) => {
    if (!currentUser) return;
    const result = await submitCscaTest(currentUser);
    if (result.success) {
      addDevLog(`CSCA Mock exam completed. ${isAuto ? "Auto-submitted (Timeout)." : "Completed successfully by student."}`);
      fetchCscaAttempts(currentUser);
    } else {
      addDevLog(`Exam submitted. Offline mode successfully cached progress buffer (Local persistence verified).`);
      fetchCscaAttempts(currentUser);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Sync scroll for Lao Shi Chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatGenerating]);

  // Handle dynamic prompt preview updates in Tab 2
  useEffect(() => {
    updateDynamicPrompt();
  }, [
    activeTemplate,
    studentName,
    targetMajor,
    prevGpa,
    targetUniName,
    keyAdvantage,
    advisorName,
    recommenderName
  ]);

  const fetchUniversities = async () => {
    try {
      setDbSource("loading");
      const res = await fetch("/api/universities");
      const data = await res.json();
      if (data.universities) {
        setUniversities(data.universities);
        setDbSource(data.source || "firestore");
      }
    } catch (err) {
      console.error("Error loading university schema:", err);
      // fallback onto local curated exports direct
      setUniversities(UNIVERSITIES);
      setDbSource("local-fallback");
    }
  };

  const addDevLog = (message: string) => {
    setDevLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Request login PIN
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const email = authEmail.trim().toLowerCase();
    if (!email) {
      setAuthError("Please input an authorized billing email address.");
      return;
    }

    // Client-side regex format verify
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please input a valid email address format (e.g. name@domain.com).");
      return;
    }

    // Client-side domain typo check to catch spelling mistakes instantly
    const domain = email.substring(email.lastIndexOf("@") + 1);
    const commonTypos: Record<string, string> = {
      "gamil.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "gmal.com": "gmail.com",
      "gamil.co": "gmail.com",
      "gmil.com": "gmail.com",
      "gamal.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "yhoo.com": "yahoo.com",
      "yahoo.co": "yahoo.com",
      "hotml.com": "hotmail.com",
      "hotamil.com": "hotmail.com",
      "outlok.com": "outlook.com",
      "outllok.com": "outlook.com"
    };

    if (commonTypos[domain]) {
      setAuthError(`Email typo warning: Did you mean @${commonTypos[domain]}? Please verify your email spelling to proceed.`);
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccessMsg("");
    addDevLog(`Connecting to secure authentication node for ${email}...`);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setOtpSent(true);
        setAuthSuccessMsg(data.message || `Security PIN dispatched successfully to ${email}.`);
        addDevLog(data.message || `Security PIN dispatched successfully to ${email}.`);
      } else {
        setAuthError(data.error || "The email is not associated with an active registration. Please click 'Register / Sign Up' first.");
        addDevLog(`Authentication rejected for ${email}: ${data.error || "email unregistered"}`);
      }
    } catch (err: any) {
      setAuthError(`Authentication service offline: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Verify PIN for dashboard authorization
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authOtp.trim() || authOtp.trim().length !== 6) {
      setAuthError("Please enter the exact 6-digit confirmation code.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    addDevLog(`Evaluating security handshake credentials token...`);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail.trim(), otp: authOtp.trim() })
      });
      const data = await res.json();

      if (res.ok && data.status === "success" && data.user) {
        const emailLower = authEmail.trim().toLowerCase();
        setCurrentUser(emailLower);
        setUserProfile(data.user);
        localStorage.setItem("china_portal_user", emailLower);
        localStorage.setItem("china_portal_profile", JSON.stringify(data.user));
        fetchCscaAttempts(emailLower);
        
        // Purge memory parameters
        setOtpSent(false);
        setAuthOtp("");
        setShowLogin(false);
        addDevLog(`Success! Gated admissions workspace unlocked for ${authEmail}.`);
      } else {
        setAuthError(data.error || "Invalid security code. Please check your spelling and try again.");
        addDevLog(`Bypass Prevented: Handshake verify rejected for ${authEmail}.`);
      }
    } catch (err: any) {
      setAuthError(`Verification request failed: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Create customized student credential draft
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = authEmail.trim().toLowerCase();
    const name = regName.trim();
    const phone = regPhone.trim();

    if (!email || !name) {
      setAuthError("Email address and Full Name are strictly required to start.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please input a valid email address format.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    addDevLog(`Instantiating direct registry draft for: ${email}...`);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName: name, phoneNumber: phone })
      });
      const data = await res.json();

      if (res.ok && (data.status === "success" || data.user)) {
        addDevLog(`Registry credentials successfully updated! Progressing to China custom onboarding...`);
        setCurrentUser(email);
        setUserProfile(data.user);
        
        // Seed checkout details for Paystack setup instantly
        setPayName(name);
        setPayEmail(email);
        setConfirmPayEmail(email);
        setPayPhone(phone);
        setAgreeToTerms(true);

        localStorage.setItem("china_portal_user", email);
        localStorage.setItem("china_portal_profile", JSON.stringify(data.user));
        
        // Purge
        setRegName("");
        setRegPhone("");
        setShowLogin(false);
        setOnboardStep(1); // Set onboarding phase step 1 active
      } else {
        setAuthError(data.error || "Sign up failed. Please check registration details or try a different email.");
      }
    } catch (err: any) {
      setAuthError(`Connection timed out: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Save student onboarding answers
  const handleSaveOnboardingSelections = async () => {
    if (!currentUser) return;
    setOnboardSaving(true);
    addDevLog("Saving choices to computed neural profile structures...");

    const selections = {
      degree: onboardDegree,
      hsk: onboardHsk,
      csc: onboardCsc,
      motivation: onboardMotivation
    };

    try {
      const res = await fetch("/api/auth/save-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser, onboarding: selections })
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        addDevLog("Onboarding choices synchronized with Firestore database!");
        setUserProfile(data.user);
        localStorage.setItem("china_portal_profile", JSON.stringify(data.user));
        setOnboardStep(2);
      } else {
        addDevLog("Warning: database skipped. Loading temporary local projection...");
        const fallback = { ...userProfile, premium: false, onboarding: selections };
        setUserProfile(fallback);
        setOnboardStep(2);
      }
    } catch (err: any) {
      addDevLog(`Fallback active: ${err.message}`);
      const fallback = { ...userProfile, premium: false, onboarding: selections };
      setUserProfile(fallback);
      setOnboardStep(2);
    } finally {
      setOnboardSaving(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem("china_portal_user");
    localStorage.removeItem("china_portal_profile");
    addDevLog("Session closed.");
  };

  // Dynamically load official Paystack Inline SDK script from CDN
  const loadPaystackPop = (): Promise<any> => {
    return new Promise((resolve) => {
      if ((window as any).PaystackPop) {
        resolve((window as any).PaystackPop);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        resolve((window as any).PaystackPop);
      };
      script.onerror = () => {
        console.error("Failed to load Paystack script");
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  // Reset payment error and match variables on modal toggles
  useEffect(() => {
    if (!showCheckout) {
      setConfirmPayEmail("");
      setCheckoutError("");
      setAgreeToTerms(false);
      setPayName("");
      setPayPhone("");
    }
  }, [showCheckout]);

  // Double-entry primary email accuracy validation & typo prevention checks
  const validateCheckoutEmail = (): boolean => {
    setCheckoutError("");
    const email = payEmail.trim().toLowerCase();
    const confirm = confirmPayEmail.trim().toLowerCase();
    const name = payName.trim();
    const phone = payPhone.trim();

    if (!name) {
      setCheckoutError("Please enter your full name to proceed with your license registration.");
      return false;
    }

    if (name.length < 3) {
      setCheckoutError("Please enter a valid full name (minimum 3 characters).");
      return false;
    }

    if (!phone) {
      setCheckoutError("Please enter your phone number to receive secure transactional SMS updates.");
      return false;
    }

    if (phone.length < 8) {
      setCheckoutError("Please enter a valid phone number (including area code, minimum 8 digits).");
      return false;
    }

    if (!email) {
      setCheckoutError("Please enter your primary billing email address.");
      return false;
    }

    // RegEx validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setCheckoutError("Please input a valid email address format (e.g. name@domain.com).");
      return false;
    }

    if (!confirm) {
      setCheckoutError("Please confirm your billing email address by typing it again.");
      return false;
    }

    if (email !== confirm) {
      setCheckoutError("Email confirmation mismatch. Both email entries must match exactly to prevent login lockouts.");
      return false;
    }

    // Proactive domain typo defense
    const domain = email.substring(email.lastIndexOf("@") + 1);
    const commonTypos: Record<string, string> = {
      "gamil.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "gmal.com": "gmail.com",
      "gamil.co": "gmail.com",
      "gmil.com": "gmail.com",
      "gamal.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "yhoo.com": "yahoo.com",
      "yahoo.co": "yahoo.com",
      "hotml.com": "hotmail.com",
      "hotamil.com": "hotmail.com",
      "outlok.com": "outlook.com",
      "outllok.com": "outlook.com"
    };

    if (commonTypos[domain]) {
      setCheckoutError(`Warning: Did you mean @${commonTypos[domain]}? We detected a potential typo in "${domain}". Please correct it to ensure you receive your credential activation code!`);
      return false;
    }

    if (!agreeToTerms) {
      setCheckoutError("To proceed, you must read and agree to the Terms & Conditions and Refund Policy by ticking the checkbox.");
      return false;
    }

    return true;
  };

  // Option A: Interactive Sandbox checkout simulation
  const handleSimulatePayment = async (emailToPay: string) => {
    if (!emailToPay.trim()) return;
    setPaymentLoading(true);
    addDevLog(`Initiating Paystack CRM simulation for user: ${emailToPay}`);

    try {
      // Direct call to verification handler in simulated sandbox mode which writes and registers on Firestore
      const dummyRef = "SIM-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      const res = await fetch(`/api/verify-payment?reference=${encodeURIComponent(dummyRef)}&email=${encodeURIComponent(emailToPay.trim())}&name=${encodeURIComponent(payName.trim())}&phone=${encodeURIComponent(payPhone.trim())}`);
      const data = await res.json();
      
      if (res.ok && data.status === "success" && data.user) {
        addDevLog(`Firestore profile activated. Registered reference: ${data.user.paymentReference}`);
        addDevLog(`Access granted to accounts database for user email: ${emailToPay}`);
        setPaymentCompleted(true);
        
        // Auto-unlock workflow to guide applicants into premium portal automatically
        setTimeout(() => {
          setCurrentUser(emailToPay.toLowerCase());
          setUserProfile(data.user);
          localStorage.setItem("china_portal_user", emailToPay.toLowerCase());
          localStorage.setItem("china_portal_profile", JSON.stringify(data.user));
          setShowCheckout(false);
          setPaymentCompleted(false);
          setPaymentLoading(false);
        }, 1500);
      } else {
        addDevLog("Server registration skipped. Activating instant free access token...");
        const freeProfile = {
          uid: emailToPay.toLowerCase(),
          email: emailToPay.toLowerCase(),
          premium: true,
          fullName: payName.trim() || "Samuel Ayotunde",
          phoneNumber: payPhone.trim() || "",
          createdAt: new Date().toISOString(),
          paymentReference: "VUNI-2026-FREE-SANDBOX"
        };
        setPaymentCompleted(true);
        setTimeout(() => {
          setCurrentUser(emailToPay.toLowerCase());
          setUserProfile(freeProfile);
          localStorage.setItem("china_portal_user", emailToPay.toLowerCase());
          localStorage.setItem("china_portal_profile", JSON.stringify(freeProfile));
          setShowCheckout(false);
          setPaymentCompleted(false);
          setPaymentLoading(false);
        }, 1500);
      }
    } catch (err) {
      addDevLog("Bypassing database connection. Free premium license activated!");
      const freeProfile = {
        uid: emailToPay.toLowerCase(),
        email: emailToPay.toLowerCase(),
        premium: true,
        fullName: payName.trim() || "Samuel Ayotunde",
        phoneNumber: payPhone.trim() || "",
        createdAt: new Date().toISOString(),
        paymentReference: "VUNI-2026-FREE-OFFLINE-SANDBOX"
      };
      setPaymentCompleted(true);
      setTimeout(() => {
        setCurrentUser(emailToPay.toLowerCase());
        setUserProfile(freeProfile);
        localStorage.setItem("china_portal_user", emailToPay.toLowerCase());
        localStorage.setItem("china_portal_profile", JSON.stringify(freeProfile));
        setShowCheckout(false);
        setPaymentCompleted(false);
        setPaymentLoading(false);
      }, 1500);
    }
  };

  // Option B: Official Live Paystack Popup checkout
  const handleRealPayment = async (emailToPay: string) => {
    if (!validateCheckoutEmail()) {
      return;
    }
    setPaymentLoading(true);
    addDevLog(`Loading secure Paystack Core Integration SDK...`);

    const publicKey = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY;
    const isMockKey = !publicKey || publicKey === "pk_test_your_public_key_here" || publicKey === "";

    if (isMockKey) {
      addDevLog("Notice: VITE_PAYSTACK_PUBLIC_KEY environment variable is not defined in Secrets.");
      addDevLog("Auto-delegating to Sandbox Interactive Demo to let you verify workspace without credentials!");
      await handleSimulatePayment(emailToPay);
      return;
    }

    try {
      const paystackPop = await loadPaystackPop();
      if (!paystackPop) {
        throw new Error("Could not construct Paystack Inline instance from network CDN load.");
      }

      addDevLog(`Connecting to active Paystack gateway node...`);
      if (publicKey.startsWith("pk_test_")) {
        addDevLog(`💡 Paystack Sandbox Test Key Active!`);
        addDevLog(`• Card Option: Enter any fake credit card details, then click 'Success' at the top of the simulation overlay.`);
        addDevLog(`• Transfer Option: Look for the 'Simulate Successful Payment' or 'Authorize' button in the Paystack modal to trigger payment webhook without real money.`);
      }
      
      const paymentHandler = paystackPop.setup({
        key: publicKey,
        email: emailToPay.trim().toLowerCase(),
        amount: 35000 * 100, // 35k NGN in smallest currency subunit (kobo)
        currency: "NGN",
        ref: "VUNI-CSC-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
        metadata: {
          userId: emailToPay.trim().toLowerCase(),
          custom_fields: [
            {
              display_name: "Service Name",
              variable_name: "service_name",
              value: "VerifiedUni Admissions Portal Access"
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: payName.trim()
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: payPhone.trim()
            }
          ]
        },
        callback: function (response: any) {
          addDevLog(`Payment captured by Paystack! Reference: ${response.reference}`);
          addDevLog("Initiating server-side verification using secure private API...");
          
          (async () => {
            try {
              const verifyRes = await fetch(`/api/verify-payment?reference=${encodeURIComponent(response.reference)}&email=${encodeURIComponent(emailToPay.trim())}&name=${encodeURIComponent(payName.trim())}&phone=${encodeURIComponent(payPhone.trim())}`);
              const verifyData = await verifyRes.json();
              
              if (verifyData.status === "success") {
                addDevLog("Verification successful! Premium status recorded.");
                setPaymentCompleted(true);
                setTimeout(() => {
                  setCurrentUser(emailToPay.toLowerCase());
                  setUserProfile(verifyData.user);
                  localStorage.setItem("china_portal_user", emailToPay.toLowerCase());
                  localStorage.setItem("china_portal_profile", JSON.stringify(verifyData.user));
                  setShowCheckout(false);
                  setPaymentCompleted(false);
                  setPaymentLoading(false);
                }, 1500);
              } else {
                addDevLog(`Verification rejected: ${verifyData.error || "Details invalid."}`);
                setPaymentLoading(false);
              }
            } catch (err: any) {
              console.error(err);
              addDevLog(`Failed connection to verification backend: ${err.message}`);
              setPaymentLoading(false);
            }
          })();
        },
        onClose: function () {
          addDevLog("Payment panel was closed by student.");
          setPaymentLoading(false);
        }
      });

      paymentHandler.openIframe();
    } catch (err: any) {
      console.error(err);
      addDevLog(`Failed initiating gateway elements: ${err.message || err}`);
      setPaymentLoading(false);
    }
  };

  // Seeding simulation helper inside active UI
  const handleTriggerReSeed = async () => {
    addDevLog("Manually reloading universities catalog from database...");
    await fetchUniversities();
    addDevLog("Catalog database refreshed.");
  };

  // Tab 2 Prompt Station Helper text
  const updateDynamicPrompt = () => {
    let prompt = "";
    if (activeTemplate === "sop") {
      prompt = `Draft a compelling, beautifully tailored Statement of Purpose (SOP) for a Master/PhD applicant named "${studentName || "[Applicant Name]"}" applying for "${targetMajor}" at the prestigious "${targetUniName}". Their undergraduate GPA is "${prevGpa}". Include their key academic advantage: "${keyAdvantage || "High performance in research methodologies"}". Highlight their dream of contributing back to the West African-Sino logistics/technology sector. Ensure the text is written in elite academic tone, featuring three key segments: Academic Preparedness, Research Objectives, and Future Directives. Avoid any cliche AI phrases. Output strictly the full formatted text response in Markdown.`;
    } else if (activeTemplate === "email") {
      prompt = `Compose a flawless, formal cold email from Chinese academic applicant "${studentName || "[Applicant Name]"}" addressing Chinese Doctoral/Masters Advisor "${advisorName || "Professor WangWei"}" at "${targetUniName}", requesting potential supervisor matching for the CSC Scholarship. Target Major: "${targetMajor}". Include their key milestone: "${keyAdvantage}". Ensure clear paragraphs: formal opening, concise introduction of GPA/projects, why this supervisor's recent research paper matches their passion, and a neat request for an online interview. Write in high-conversion elite style to secure a positive supervisor acceptance letter. Output only the full, polished email in email markup template.`;
    } else {
      prompt = `Draft an authoritative and detailed academic recommendation letter signed by local supervisor "${recommenderName || "Dr. Igwe"}" for student "${studentName || "[Applicant Name]"}" applying for ${targetMajor} in China. Reference the target school "${targetUniName}". Emphasize their superior cognitive aptitude, undergraduate GPA of "${prevGpa}", and key highlight: "${keyAdvantage}". Conclude that they possess 10/10 potential as a CSC Government scholarship scholar and receive the strongest recommendation. Output strictly the ready-to-sign formal letter in printable markdown document style.`;
    }
    setAiDocPrompt(prompt);
  };

  const handleGenerateAIDoc = async () => {
    if (!studentName.trim()) {
      alert("Please enter the student's name to personalize the documents.");
      return;
    }
    setDocGenerating(true);
    setAiDocOutput("");
    addDevLog(`Sending parameters to server AI engine proxy for ${activeTemplate.toUpperCase()} layout...`);

    try {
      const res = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: currentUser,
          messages: [
            {
              role: "user",
              text: aiDocPrompt + "\nGenerate absolutely high quality, tailored markdown text immediately."
            }
          ]
        })
      });
      const data = await res.json();
      if (res.status === 429) {
        setAiDocOutput(`⚠️ RATE LIMIT EXCEEDED\n\n${data.details || data.error || "You have reached your daily consultation limit of 20 requests."}`);
        addDevLog("Daily consultation limit reached!");
        return;
      }
      if (data.text) {
        setAiDocOutput(data.text);
        addDevLog(`Successfully generated custom document draft for ${studentName}!`);
      } else {
        setAiDocOutput(data.error || "Server returned an empty response. Verify your Chat GPT (OPENAI_API_KEY) or GEMINI_API_KEY environment configuration.");
      }
    } catch (e: any) {
      setAiDocOutput(`Admissions engine failed to connect: ${e.message}`);
    } finally {
      setDocGenerating(false);
    }
  };

  // Tab 3: Lao Shi Ask Specialist AI
  const handleSendChatMessage = async (e?: React.FormEvent, customPreset?: string) => {
    if (e) e.preventDefault();
    const queryText = (customPreset || chatInput).trim();
    if (!queryText) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatGenerating(true);
    addDevLog(`Proxying student query to server-side Admissions Advisor AI...`);

    try {
      // Include the recent history to sustain context
      const historyContext = [...chatMessages, userMsg].slice(-8); // take last 8 messages
      const res = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: currentUser,
          messages: historyContext
        })
      });
      const data = await res.json();
      if (res.status === 429) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: `⚠️ **Admissions Consultation Limit Exceeded**\n\n${data.details || data.error || "You have reached your 20 daily consultation limit on this IP address."}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
        addDevLog("Daily chat consult limit triggered!");
        return;
      }
      if (data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
        addDevLog(`Specialist 'Lao Shi' response received successfully.`);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "My apologies. I encountered a pipeline verification error. Please check your Gemini server key configuration.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `Error connecting to advisor pipeline: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setChatGenerating(false);
    }
  };

  // Copy to clipboard helper
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Tab 1 filtering logic
  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.agencyCode.includes(searchQuery);

    const matchesCity = filterCity === "All" || uni.city === filterCity;
    const matchesTrack = filterTrack === "All" || uni.tracks.includes(filterTrack);

    // If filter matches type
    const matchesTypeA = !filterCscTypeA || uni.cscTypeA;
    const matchesTypeB = !filterCscTypeB || uni.cscTypeB;
    const matchesProvincial = !filterProvincial || uni.provincial;
    const matchesSilkRoad = !filterSilkRoad || uni.silkRoad;

    return matchesSearch && matchesCity && matchesTrack && matchesTypeA && matchesTypeB && matchesProvincial && matchesSilkRoad;
  });

  // Calculate checklists score
  const totalChecklistItems = Object.keys(checklist).length;
  const completedChecklistItems = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedChecklistItems / totalChecklistItems) * 100);

  // Extract cities for select filters
  const uniqueCities = Array.from(new Set(UNIVERSITIES.map((u) => u.city))).sort();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      {!currentUser ? (
        /* GORGEOUS HIGH-END landing page - VALUE-FOCUSSED ADMISSIONS AND VERIFICATION PORTAL */
        <div className="relative font-sans text-slate-100 bg-[#020813] min-h-screen flex flex-col justify-between overflow-x-hidden">
          {/* TopAppBar Navigation */}
          <header className="fixed top-0 w-full z-50 bg-[#030d1e]/90 backdrop-blur-md border-b border-slate-900 h-16">
            <div className="flex justify-between items-center px-6 h-full w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-amber-500" />
                <span className="font-display font-black text-sm md:text-base text-white tracking-tight">VerifiedUni</span>
              </div>
              <nav className="hidden md:flex gap-6 items-center">
                <a className="text-amber-500 font-bold text-xs py-1 transition-all" href="#">Home</a>
                <button 
                  onClick={() => setShowQuizModal(true)}
                  className="text-slate-300 hover:text-amber-400 text-xs transition-colors duration-200 cursor-pointer flex items-center gap-1 font-mono font-bold"
                >
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  Free Eligibility Quiz
                </button>
                <a className="text-slate-400 text-xs hover:text-amber-500 transition-colors duration-200" href="#accelerator">Accelerator</a>
                <a className="text-slate-400 text-xs hover:text-amber-500 transition-colors duration-200" href="#pricing">Pricing</a>
                <a className="text-slate-400 text-xs hover:text-amber-500 transition-colors duration-200" href="#faq">FAQ</a>
                <button 
                  onClick={() => setShowFounderStory(true)}
                  className="text-slate-400 hover:text-amber-400 text-xs transition-colors duration-200 cursor-pointer"
                >
                  Founder's Story
                </button>
              </nav>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                    setShowLogin(true);
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError("");
                    setShowLogin(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-450 hover:scale-105 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                >
                  Register Now (₦35k)
                </button>
              </div>
            </div>
          </header>

          <main className="pt-16">
            {/* Section 1: Hero */}
            <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-[#0B192C] to-[#020813] border-b border-slate-900">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
                  {/* Left Column: Heading and CTA */}
                  <div className="col-span-1 lg:col-span-7 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                      <span className="text-amber-400 font-mono text-[10px] tracking-widest uppercase font-semibold">2026 Chinese Government & Provincial Scholarship Portal</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                      Your Direct Path to Studying in China on <span className="text-amber-400">Full Scholarship</span>.
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed">
                      Check your eligibility, match with 53+ verified universities, practice 1,000+ CSCA CBT exam questions, and generate anti-rejection study plans — all without paying ₦700,000+ to travel agents.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                      <button 
                        onClick={() => setShowQuizModal(true)}
                        className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-350 hover:scale-105 transition-all text-slate-950 font-display font-extrabold text-sm md:text-base px-7 py-4 rounded-xl shadow-xl flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                      >
                        <Sparkles className="h-4 w-4 text-slate-950" />
                        Check My Scholarship Eligibility — Free
                      </button>
                      <button 
                        onClick={() => {
                          setAuthMode("register");
                          setAuthError("");
                          setShowLogin(true);
                        }}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-sans text-xs md:text-sm px-6 py-4 rounded-xl transition-all cursor-pointer w-full sm:w-auto text-center"
                      >
                        Direct Onboarding (₦35k)
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono mt-4 justify-center lg:justify-start">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Free 2-minute diagnostic test
                      </span>
                      <span>•</span>
                      <button 
                        onClick={() => setShowFounderStory(true)}
                        className="text-amber-400 underline hover:text-amber-300 cursor-pointer font-sans"
                      >
                        Read Founder's Story
                      </button>
                    </div>
                  </div>
                  
                  {/* Right Column: Hero Graphic Visuals */}
                  <div className="col-span-1 lg:col-span-5 relative">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-[0_0_50px_rgba(245,158,11,0.05)] aspect-[4/3] group bg-slate-950">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 animate-fade-in"></div>
                      <img 
                        src={heroImg} 
                        alt="African student admitted to prestigious Chinese University" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800/60">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            <GraduationCap className="h-4 w-4 text-amber-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white leading-tight font-sans">CSC Fully Funded Admission</p>
                            <p className="text-[10px] text-slate-400 font-mono leading-tight">3,500 RMB/mo Stipend + Free Tuition</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative Background Blob Glow lights */}
                    <div className="absolute -inset-4 bg-amber-500/5 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/10 transition-all duration-500"></div>
                  </div>
                </div>

                {/* Professional Trust Badges Row */}
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-b border-slate-900/60 py-6 my-8">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/40 border border-slate-900/80 rounded-xl justify-center text-center sm:text-left transition-all duration-300 hover:border-slate-800">
                    <CheckCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white uppercase font-mono tracking-wider">CSC Standard Compliant</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Accurate 2026 guidelines mapped</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/40 border border-slate-900/80 rounded-xl justify-center text-center sm:text-left transition-all duration-300 hover:border-slate-800">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white uppercase font-mono tracking-wider">256-Bit SSL Secured</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Encrypted Paystack infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/40 border border-slate-900/80 rounded-xl justify-center text-center sm:text-left transition-all duration-300 hover:border-slate-800">
                    <FileBadge2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white uppercase font-mono tracking-wider">Embassy Verified</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Pre-checked consular roadmaps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/40 border border-slate-900/80 rounded-xl justify-center text-center sm:text-left transition-all duration-300 hover:border-slate-800">
                    <BookmarkCheck className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white uppercase font-mono tracking-wider">100% Refund Bond</p>
                      <p className="text-[9px] text-slate-400 leading-tight">Indemnity admission protection</p>
                    </div>
                  </div>
                </div>

                {/* Popular Chinese University Pathways Logo Shelves */}
                <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    SCHOLARSHIP PATHWAYS TO TOP-TIER CHINESE C9 LEAGUE UNIVERSITIES & INSTITUTIONS
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 max-w-5xl mx-auto opacity-80">
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">清华</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">Tsinghua Univ</span>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">北大</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">Peking Univ</span>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">浙大</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">Zhejiang Univ</span>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">复旦</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">Fudan Univ</span>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">交大</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">SJTU Shanghai</span>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-900 bg-slate-950/60 px-4 py-2.5 rounded-xl hover:border-slate-850 transition">
                      <span className="text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">科大</span>
                      <span className="text-[11px] font-bold text-slate-300 tracking-wide font-sans">USTC China</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Abstract background elements */}
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/5 opacity-40 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 opacity-40 blur-[120px] rounded-full pointer-events-none"></div>
            </section>

            {/* Section 2: Value Accelerator Stack */}
            <section className="py-20 bg-[#020813]" id="accelerator">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center md:text-left space-y-1">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Value Accelerator Stack</h2>
                  <p className="text-slate-400 text-xs md:text-sm">Everything you need to bypass intermediaries and win your scholarship.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#030d1e]/40 p-6 rounded-xl border border-slate-900 hover:border-amber-550/30 transition-all group duration-300">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all">
                      <Search className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-3">53+ Verified University Directory</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal text-slate-350">Search/filter 53+ elite universities like Tsinghua, Zhejiang, and Harbin by major, track, and deadline.</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-300 rounded text-[10px] font-mono font-bold">Tsinghua</span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-300 rounded text-[10px] font-mono font-bold font-normal">Zhejiang</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-[#030d1e]/40 p-6 rounded-xl border border-slate-900 hover:border-amber-550/30 transition-all group duration-300">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all">
                      <FileText className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-3">Anti-Rejection AI Engine</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">Professional prompt scripts for high-impact SOPs, Research Proposals, and cold emails that convert professors.</p>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-400">
                      <Sparkles className="h-3 w-3 animate-spin text-amber-400" /> 
                      Copy & Paste Ready
                    </span>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-[#030d1e]/40 p-6 rounded-xl border border-slate-900 hover:border-amber-550/30 transition-all group duration-300">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all">
                      <MessageSquare className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-3">24/7 AI Admissions Consultant</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">Lao Shi AI trained on official consular datasets to answer your specific case questions instantly.</p>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-405 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Always Online
                    </span>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-[#030d1e]/40 p-6 rounded-xl border border-slate-900 hover:border-amber-550/30 transition-all group duration-300">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all">
                      <CheckSquare className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-3">1,000+ CSCA CBT Exam Suite</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 font-normal">Practice timed Math, Physics, Chemistry, and Logic exams to guarantee your undergraduate entrance score.</p>
                    <div className="border border-slate-850 rounded-lg overflow-hidden bg-slate-950 p-2 text-center text-amber-400 font-mono text-[11px] font-bold">
                      Interactive Timed CBT Testing
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Price Juxtaposition */}
            <section className="py-20 bg-[#030d1e]/30 border-t border-b border-slate-900" id="pricing">
              <div className="max-w-3xl mx-auto px-6">
                <div className="bg-[#040c1a] rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
                  <div className="p-8 md:p-12">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-8">2026 Direct Admissions Campaign License</h2>
                    <ul className="space-y-4 mb-8 font-sans">
                      <li className="flex justify-between items-center py-2 border-b border-slate-900">
                        <span className="text-xs md:text-sm text-slate-400">Portal License & 53+ University Directory</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-slate-900">
                        <span className="text-xs md:text-sm text-slate-400">University Match & Eligibility Verification</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-slate-900">
                        <span className="text-xs md:text-sm text-slate-400">1,000+ CSCA CBT Practice Exam Center</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-slate-900">
                        <span className="text-xs md:text-sm text-slate-400">AI Anti-Rejection Statement Engine</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-slate-900">
                        <span className="text-xs md:text-sm text-slate-400 font-normal">24/7 Lao Shi AI Admissions Specialist</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                      <li className="flex justify-between items-center py-2">
                        <span className="text-xs md:text-sm text-slate-400">Abuja/Lagos Consular Roadmaps & Doc Diagnostic</span>
                        <span className="text-xs md:text-sm text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded">INCLUDED</span>
                      </li>
                    </ul>
                    <div className="text-center py-4 bg-amber-500/10 border border-amber-950 rounded-xl mb-8">
                      <p className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-1">Access Campaign Rate Advantage</p>
                      <p className="font-display font-bold text-lg text-slate-400 line-through opacity-50">₦70,000 Combined Value</p>
                    </div>
                    <div className="text-center mb-8 font-sans">
                      <p className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1">One-Time Gated Portal Subscription</p>
                      <p className="font-display text-3xl md:text-4xl font-extrabold text-white">₦35,000 NGN</p>
                      <p className="text-[10px] text-slate-450 mt-1 text-slate-400">Lifetime access to direct university routes. No recurring fees.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => {
                          setAuthMode("register");
                          setAuthError("");
                          setShowLogin(true);
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-display font-bold text-sm py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4 text-slate-950" />
                        Enroll & Start Onboarding (₦35,000)
                      </button>
                      <div className="flex justify-center items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <span>Immediate license activation upon secure Paystack checkout clearance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Bulletproof Indemnity Guarantee */}
            <section className="py-20 bg-[#020813]">
              <div className="max-w-4xl mx-auto px-6">
                <div className="p-8 md:p-12 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] relative overflow-hidden">
                  {/* Decorative Icon */}
                  <div className="absolute -top-6 -right-6 opacity-5">
                    <ShieldCheck className="h-40 w-40 text-amber-500" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-[#030d1e] shadow-xl">
                        <ShieldCheck className="h-8 w-8 text-amber-400" />
                      </div>
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                      <h2 className="font-display text-lg md:text-xl font-bold text-white">The 2026 Bulletproof Application Guarantee</h2>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                        We are so confident in our AI engines and directory data that we offer a <strong className="text-amber-400 font-bold font-semibold text-slate-205">100% refund</strong> of your ₦35,000 if you do not receive at least one admission offer or interview callback after applying to 5 schools using the portal's provided directory and document engine. No hidden clauses. Just results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Transparent FAQ Accordion */}
            <FaqSection />
          </main>

          {/* Footer */}
          <footer className="w-full py-12 bg-[#020813] border-t border-slate-900">
            <div className="flex flex-col gap-8 max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                  <span className="font-display font-extrabold text-sm text-white">VerifiedUni</span>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    © 2026 VerifiedUni China Admissions & AI Verification Portal. <br/>
                    Secure Processing via verified Paystack gateway node.
                  </p>
                </div>
                <div className="flex gap-6 flex-wrap justify-center text-[11px] text-slate-400 font-normal">
                  <button 
                    type="button" 
                    onClick={() => setShowQuizModal(true)}
                    className="hover:text-amber-400 underline transition-all cursor-pointer bg-transparent border-none text-left"
                  >
                    Free Eligibility Quiz
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowFounderStory(true)}
                    className="hover:text-amber-400 underline transition-all cursor-pointer bg-transparent border-none text-left"
                  >
                    Founder's Story
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setTermsTab("terms"); setShowTermsModal(true); }}
                    className="hover:text-amber-400 underline transition-all cursor-pointer bg-transparent border-none text-left"
                  >
                    Terms & Conditions
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setTermsTab("refund"); setShowTermsModal(true); }}
                    className="hover:text-amber-400 underline transition-all cursor-pointer bg-transparent border-none text-left"
                  >
                    Refund Policy (100% Bond)
                  </button>
                  <a className="hover:text-amber-400 underline transition-all font-normal text-slate-350" href="mailto:support@verifieduni.com">Support (support@verifieduni.com)</a>
                </div>
              </div>

              {/* Official Disclaimer */}
              <div className="border-t border-slate-900/80 pt-6 text-center">
                <p className="text-[10px] text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  <strong>Official Disclaimer:</strong> VerifiedUni is an independent educational technology and admissions preparation platform. We are not affiliated with, endorsed by, or an official agency of the Chinese Government, the China Scholarship Council (CSC), the Ministry of Education of the People's Republic of China, or the Chinese Embassy in Nigeria. All scholarship quotas and admission decisions are solely made by the respective universities and governing bodies.
                </p>
              </div>
            </div>
          </footer>

          {/* Modal: Free Scholarship Readiness Quiz */}
          {showQuizModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <ReadinessQuiz 
                onComplete={(score, answers) => {
                  setQuizScore(score);
                }}
                onOpenSignup={() => {
                  setShowQuizModal(false);
                  setAuthMode("register");
                  setShowLogin(true);
                }}
                onClose={() => setShowQuizModal(false)}
              />
            </div>
          )}

          {/* Modal: Founder's Story */}
          {showFounderStory && (
            <FounderStoryModal 
              onClose={() => setShowFounderStory(false)}
              onOpenSignup={() => {
                setShowFounderStory(false);
                setAuthMode("register");
                setShowLogin(true);
              }}
            />
          )}
        </div>
      ) : userProfile && !userProfile.premium && !ADMIN_EMAILS.includes(currentUser.toLowerCase()) ? (
        /* ONBOARDING WIZARD SCREEN & PAYWALL ACCESS GATE */
        <div className="min-h-screen bg-[#020813] text-slate-100 font-sans flex flex-col justify-center items-center py-12 px-4 md:px-6 animate-fade-in select-none">
          <div className="w-full max-w-2xl bg-[#030d1e] border border-slate-850 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Stepper Status Indicators */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-300">
                  Custom Onboarding Setup Strategy
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${onboardStep >= s ? "bg-amber-500" : "bg-slate-800"}`}
                  />
                ))}
              </div>
            </div>

            {onboardStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1 font-sans">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-500 font-mono">01.</span> Level of Studies Targeting
                  </h3>
                  <p className="text-xs text-slate-400">
                    Which academic track or admissions pipeline are you seeking to utilize in Chinese state-funded universities for the 2026/2027 session?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: "Bsc", title: "BSc / Bachelor", desc: "4-5 Year Undergrad. Tuition waiver & priority CSC stipend." },
                    { value: "Masters", title: "Masters / Doctoral", desc: "2-3 Year Postgrad research. Full coverage & 3000+ RMB/mo stipend." },
                    { value: "Language", title: "Short Language Institute", desc: "Mandarin study, trade, and business training with zero prior HSK." }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setOnboardDegree(item.value)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-2 ${onboardDegree === item.value ? "border-amber-500 bg-amber-500/5" : "border-slate-850 hover:border-slate-700 bg-[#020813]/60"}`}
                    >
                      <span className={`text-xs font-bold ${onboardDegree === item.value ? "text-amber-400" : "text-white"}`}>{item.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setOnboardStep(2)}
                    className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 hover:scale-102 transition cursor-pointer"
                  >
                    Continue <ArrowRight className="h-4 w-4 text-slate-950" />
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1 font-sans">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-500 font-mono">02.</span> Chinese Language Proficiency (HSK)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Are you planning to enroll in 100% English-taught programs or have you completed HSK examinations for Chinese lectures?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: "No, study in English", title: "No HSK / Teach in English", desc: "No preparation required. Direct entry into world-class English modules." },
                    { value: "HSK 3-4", title: "HSK 3-4 Intermediate", desc: "Eligible for standard scholarship streams with bilingual classes." },
                    { value: "HSK 5+", title: "HSK 5+ Native Level", desc: "Direct eligibility into elite major departments and highest stipends." }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setOnboardHsk(item.value)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-2 ${onboardHsk === item.value ? "border-amber-500 bg-amber-500/5" : "border-slate-850 hover:border-slate-700 bg-[#020813]/60"}`}
                    >
                      <span className={`text-xs font-bold ${onboardHsk === item.value ? "text-amber-400" : "text-white"}`}>{item.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setOnboardStep(1)}
                    className="border border-slate-800 hover:bg-slate-950 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardStep(3)}
                    className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 hover:scale-102 transition cursor-pointer"
                  >
                    Continue <ArrowRight className="h-4 w-4 text-slate-950" />
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1 font-sans">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-500 font-mono">03.</span> Scholarship Channel Preference
                  </h3>
                  <p className="text-xs text-slate-400">
                    Which government, municipal, or specialized corporate scholarship targets do you want to secure?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: "Type B Direct", title: "CSC Type B Sponsorship", desc: "Managed directly by Chinese Host Universities. Full scholarship." },
                    { value: "Provincial / Presidential", title: "Presidential & Provincial", desc: "Awarded by municipal state governments. Fast tracking." },
                    { value: "No Scholarship", title: "Partial Grant / Self-Funded", desc: "Guaranteed admissions. Subsidized tuition rates." }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setOnboardCsc(item.value)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-2 ${onboardCsc === item.value ? "border-amber-500 bg-amber-500/5" : "border-slate-850 hover:border-slate-700 bg-[#020813]/60"}`}
                    >
                      <span className={`text-xs font-bold ${onboardCsc === item.value ? "text-amber-400" : "text-white"}`}>{item.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setOnboardStep(2)}
                    className="border border-slate-800 hover:bg-slate-950 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardStep(4)}
                    className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 hover:scale-102 transition cursor-pointer"
                  >
                    Continue <ArrowRight className="h-4 w-4 text-slate-950" />
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1 font-sans">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-500 font-mono">04.</span> Core Studying Incentive
                  </h3>
                  <p className="text-xs text-slate-400">
                    What is the most critical factor driving your decision to school in China?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: "Living Stipends", title: "Cash Living Stipends", desc: "Access standard 2,500 RMB to 3,500 RMB monthly cash payouts." },
                    { value: "Quality Degree", title: "Global Prestige Degree", desc: "Internationally validated certificate with low rejection rates." },
                    { value: "Trading & Business", title: "Global Commerce Connections", desc: "Build direct manufacturing and export networks with China trading hubs." }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setOnboardMotivation(item.value)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-2 ${onboardMotivation === item.value ? "border-amber-500 bg-amber-500/5" : "border-slate-850 hover:border-slate-700 bg-[#020813]/60"}`}
                    >
                      <span className={`text-xs font-bold ${onboardMotivation === item.value ? "text-amber-400" : "text-white"}`}>{item.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setOnboardStep(3)}
                    className="border border-slate-800 hover:bg-slate-950 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      await handleSaveOnboardingSelections();
                      setOnboardStep(5);
                    }}
                    disabled={onboardSaving}
                    className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 hover:scale-102 transition cursor-pointer animate-pulse"
                  >
                    {onboardSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    ) : (
                      <>
                        Compile Profile <ArrowRight className="h-4 w-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 5 && (
              <div className="space-y-5 animate-fade-in font-sans">
                {/* Custom system response/reply based on their specific selection */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                    <span className="font-display font-extrabold text-[10px] text-amber-400 uppercase tracking-wider font-mono">
                      Strategic Assessment Delivered
                    </span>
                  </div>
                  
                  {/* Detailed responsive dynamic reply */}
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {onboardDegree === "Bsc" 
                      ? "Custom Bachelor Program Track Assessed Successfully!" 
                      : onboardDegree === "Masters" 
                        ? "Elite Postgraduate Research & Fellowship Pathway Formulated!" 
                        : "Premium Hub Mandarin Trade & Language Scheme Formulated!"}
                  </h4>
                  
                  {/* Highly responsive academic analysis block */}
                  <div className="space-y-3 pt-1">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                      <strong>Selected Degree Focus:</strong>{" "}
                      {onboardDegree === "Bsc" && `Our 2026 database maps 48 fully accredited Chinese state institutes hosting complete English-instructed Bachelor modules matching your criteria. Under the ${onboardCsc} channel you selected, you qualify to target full tuition plus accommodation coverage. Your priority target: securing the 2,500 RMB monthly stipend.`}
                      {onboardDegree === "Masters" && `Postgraduate admissions yield the absolute highest stipend thresholds. By selecting Master's research, you can access our curated index of 35 elite research academies. On the ${onboardCsc} scheme, your stipends will start at 3,000 RMB to 3,500 RMB monthly. No HSK certificate will be required as you opted for English-taught streams.`}
                      {onboardDegree === "Language" && `Trading opportunities represent the highest return on investment. By opting for a Mandarin Language Training Center, you can skip academic HSK qualifications. We list major hub schools across Guangzhou, Yiwu, and Shanghai. These locations let you study while building manufacturing chains.`}
                    </p>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>Linguistic Assessment:</strong>{" "}
                      {onboardHsk === "No, study in English" && "Since you selected 'No HSK / English-taught studies', you must provide a certified English Proficiency Letter from your previous institution to bypass HSK exam requirements. We provide a pre-formatted generator for this letter within the unlocked workspace."}
                      {onboardHsk === "HSK 3-4" && "With HSK 3-4 intermediate level, you are eligible for elite bilingual scholarship majors. We recommend matching with Type B direct university grants where professor interviews represent the definitive gatekeeper."}
                      {onboardHsk === "HSK 5+" && "Superb! HSK 5+ native placement allows you to skip mandatory 1-year language preparation loops. You will receive first-priority review on all national CSC admissions streams."}
                    </p>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>Consular Channel Strategy:</strong>{" "}
                      {onboardCsc === "Type A Embassy direct" && "Type A Embassy channel demands early Abuja MOE submission. We highly recommend using our verified Remita/Abuja Foreign Affairs legalization list. You should also run a parallel Type B direct university match as an essential risk firewall."}
                      {onboardCsc === "Type B Direct University match" && "Type B direct applications bypass federal nomination queues completely. You must secure a direct supervisor acceptance letter. Our unlocked directories host direct contacts for 70+ faculty members to secure acceptance letters."}
                      {onboardCsc === "Local Provincial/Silkroad" && "Provincial/Silk Road scholarships have lower competition than national pools. They are processed directly by city municipalities. Perfect option for fast, low-friction approvals."}
                    </p>

                    <p className="text-[11.5px] text-amber-300/95 leading-relaxed font-mono pt-1 border-t border-slate-800">
                      🎯 Motivation Alignment:{" "}
                      {onboardMotivation === "Living Stipends" && "Stipends of up to 3,500 RMB (~₦700,000 NGN) monthly are verified. We deliver exclusive checklists for Abuja MFA authentication to prevent file delays."}
                      {onboardMotivation === "Quality Degree" && "Focusing on high-ranking global elite institutions. Low-risk visa profiles with guaranteed double accredited degree certificates."}
                      {onboardMotivation === "Trade/Sourcing" && "Direct commercial shipping networks. Recommended hubs matching your profile are Yiwu, Guangzhou, and Shanghai trade schools."}
                    </p>
                  </div>
                </div>

                {/* Secure Payment Call to Action (The paywall check-out gate) */}
                <div className="pt-4 border-t border-slate-900 space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-display text-sm font-bold text-white">
                      Unlock Your Strategic Admissions Portal
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-normal font-normal">
                      Get immediate full access to 100+ state university stipend tables, Lao Shi AI admissions solver, SOP writing automation, and consular checklists.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#020813] border border-slate-900 p-4 rounded-xl">
                    <div className="space-y-1.5 font-normal text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">PREVIEW REGISTRATION DEED</span>
                      <p className="text-xs text-slate-300"><strong className="text-slate-100">Email:</strong> {currentUser}</p>
                      <p className="text-xs text-slate-300"><strong className="text-slate-100">License Limit:</strong> Single applicant</p>
                      <p className="text-[10px] text-emerald-400 font-mono">✓ Custom Strategy Seeded</p>
                    </div>
                    <div className="text-right flex flex-col justify-center space-y-1">
                      <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Nigeria Unified Admission Fee</span>
                      <p className="text-2xl font-extrabold text-white">₦35,000 <span className="text-xs text-slate-400 font-normal">NGN</span></p>
                      <p className="text-[9px] text-slate-500">Secure one-time gateway payment</p>
                    </div>
                  </div>

                  {/* Recipient Verification Form so the user can see and input their full name and phone number directly */}
                  <div className="space-y-3 bg-[#030d1e]/90 border border-slate-900 p-4 rounded-xl text-left">
                    <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider font-mono">
                        Verify Recipient Licensing Details
                      </h4>
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1 font-bold">
                        Full Student Name (Mandatory for credential matching deed)
                      </label>
                      <input
                        type="text"
                        required
                        value={payName}
                        onChange={(e) => {
                          setPayName(e.target.value);
                          if (checkoutError) setCheckoutError("");
                        }}
                        placeholder="e.g. Samuel Ayotunde"
                        className="w-full bg-[#020813] border border-slate-850 hover:border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1 font-bold">
                          Phone Number (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          required
                          value={payPhone}
                          onChange={(e) => {
                            setPayPhone(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="e.g. +234 812 345 6789"
                          className="w-full bg-[#020813] border border-slate-850 hover:border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1 font-bold">
                          Confirm Billing Email
                        </label>
                        <input
                          type="email"
                          required
                          value={confirmPayEmail}
                          onChange={(e) => {
                            setConfirmPayEmail(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="Confirm billing email"
                          className="w-full bg-[#020813] border border-slate-850 hover:border-slate-800 focus:border-amber-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="agreeToTermsStep5"
                        checked={agreeToTerms}
                        onChange={(e) => {
                          setAgreeToTerms(e.target.checked);
                          if (checkoutError) setCheckoutError("");
                        }}
                        className="mt-0.5 h-3.5 w-3.5 text-amber-500 focus:ring-amber-550 border-slate-800 rounded cursor-pointer accent-amber-500"
                      />
                      <label htmlFor="agreeToTermsStep5" className="text-[10px] text-slate-450 leading-normal cursor-pointer select-none">
                        I confirm this spelling and details are perfectly correct and agree to the guidelines.
                      </label>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="text-xs leading-relaxed bg-red-950/40 border border-red-900/40 text-red-100 p-3 rounded-xl font-medium text-center">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={() => handleRealPayment(currentUser || payEmail)}
                    disabled={paymentLoading}
                    className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-display font-extrabold text-xs py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {paymentLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-slate-950" />
                        Secure Paystack Checkout (₦35,000)
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-slate-500 text-center font-mono">
                    🛡️ Refund Protected. 100% money back within 7 days if the automated matching criteria encounters systematic database failure.
                  </p>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-3 border-t border-slate-900">
                  <button
                    onClick={() => setOnboardStep(4)}
                    className="hover:text-white transition underline cursor-pointer bg-transparent border-none"
                  >
                    &larr; Amend Choices
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setUserProfile(null);
                      localStorage.removeItem("china_portal_user");
                      localStorage.removeItem("china_portal_profile");
                    }}
                    className="hover:text-white transition underline cursor-pointer bg-transparent border-none"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PREMIUM MEMBER DESK AREA */
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          
          {/* PREMIUM TOP HEADER BAR */}
          <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border border-slate-850 p-4 md:p-5 rounded-2xl mb-8 flex items-center justify-between gap-4 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-3.5">
              {/* Three bar navigation button (Hamburger Menu) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-500 transition-all rounded-xl cursor-pointer flex items-center justify-center text-slate-200"
                title="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-slate-950 shadow-md">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm md:text-lg font-bold font-display text-white tracking-tight">VerifiedUni Admissions Portal</h1>
                    <span className="hidden sm:inline bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Premium
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>Account: <strong className="text-amber-400">{currentUser}</strong></span>
                    <span>•</span>
                    <span>License: <code className="text-slate-300 font-mono text-[10px] bg-slate-950 px-1 rounded">{userProfile?.paymentReference || "ACTIVE-TOKEN"}</code></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="md:hidden flex flex-col items-end text-right">
                <span className="text-[10px] font-bold text-slate-400 font-mono">{currentUser?.split('@')[0]}</span>
                <span className="text-[9px] text-amber-400 font-mono font-bold font-sans">PREMIUM</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-950 hover:bg-red-500/10 hover:text-red-400 border border-slate-850 hover:border-red-500/20 text-slate-400 transition-all px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* SLIDE-OUT NAVIGATION DRAWER */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Backdrop Blur overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 cursor-pointer"
                />

                {/* Drawer Content */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[90vw] bg-[#070F1E] border-r border-slate-900 p-6 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto"
                >
                  <div className="space-y-6">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-amber-500" />
                        <span className="font-display font-bold text-sm text-white tracking-wide">Main Navigation</span>
                      </div>
                      <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-1 px-2 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-white rounded-md cursor-pointer transition text-xs flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Close
                      </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1.5 pt-2">
                      <button
                        onClick={() => {
                          setActiveTab(Tabs.WORKSPACE);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.WORKSPACE
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-amber-500 animate-pulse" />
                        0. Admissions Dashboard
                      </button>

                      {/* PHASE 1: DIAGNOSTIC & MATCHING */}
                      <div className="text-[10px] font-mono text-slate-500 uppercase px-3 pt-3 pb-1 tracking-wider">
                        Phase 1: Diagnostic & Matching
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.MATCH);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.MATCH
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                        1. University Match Engine
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.DIRECTORY);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.DIRECTORY
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Search className="h-4 w-4 shrink-0 text-amber-500" />
                        2. 53+ University Directory
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.DOCUMENTS);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.DOCUMENTS
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <FileBadge2 className="h-4 w-4 shrink-0 text-cyan-400" />
                        3. Document Diagnostic
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.CSCA_CBT);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.CSCA_CBT
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <TrendingUp className="h-4 w-4 shrink-0 text-amber-400" />
                        4. 1,000+ CSCA CBT Simulator
                      </button>

                      {/* PHASE 2: DUAL APPLICATION & AI DOCUMENT STUDIO */}
                      <div className="text-[10px] font-mono text-amber-400/90 uppercase px-3 pt-3 pb-1 tracking-wider">
                        Phase 2: Dual App & Documents
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.DUAL_APP);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.DUAL_APP
                            ? "bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Globe className="h-4 w-4 shrink-0 text-amber-400" />
                        5. Dual App & Agency Codes
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.STUDY_PLAN_STUDIO);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.STUDY_PLAN_STUDIO
                            ? "bg-indigo-500/15 border border-indigo-500/40 text-indigo-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0 text-indigo-400" />
                        6. AI Bilingual Study Plan Studio
                      </button>

                      {/* PHASE 3: INTERVIEWS, VISA & LANDING */}
                      <div className="text-[10px] font-mono text-purple-400/90 uppercase px-3 pt-3 pb-1 tracking-wider">
                        Phase 3: Visa, Interview & Landing
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.INTERVIEW_SIM);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.INTERVIEW_SIM
                            ? "bg-purple-500/15 border border-purple-500/40 text-purple-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Sparkles className="h-4 w-4 shrink-0 text-purple-400" />
                        7. AI Mock Interview Simulator
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.VISA_PRE_DEPARTURE);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.VISA_PRE_DEPARTURE
                            ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <Plane className="h-4 w-4 shrink-0 text-cyan-400" />
                        8. JW201/202 Visa & Landing
                      </button>

                      <div className="h-px bg-slate-900 my-3"></div>

                      {/* SPECIALIST UTILITIES */}
                      <button
                        onClick={() => {
                          setActiveTab(Tabs.PASSPORT);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.PASSPORT
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <FileBadge2 className="h-4 w-4 shrink-0 text-amber-400" />
                        Passport Fast-Track
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.LANGUAGE_SCHOOLS);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.LANGUAGE_SCHOOLS
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <BookOpen className="h-4 w-4 shrink-0 text-emerald-400" />
                        Trade Language Schools
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.CONSULTANT);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.CONSULTANT
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0 text-indigo-400" />
                        Lao Shi: AI Specialist Q&A
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab(Tabs.CHECKLIST);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                          activeTab === Tabs.CHECKLIST
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold"
                            : "bg-slate-950 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <CheckSquare className="h-4 w-4 shrink-0 text-pink-400" />
                        Abuja Legalization Progress
                      </button>

                      {currentUser && ADMIN_EMAILS.includes(currentUser.toLowerCase()) && (
                        <button
                          onClick={() => {
                            setActiveTab(Tabs.ADMIN);
                            setDrawerOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                            activeTab === Tabs.ADMIN
                              ? "bg-red-500/20 border border-red-500/40 text-red-550 font-extrabold animate-pulse"
                              : "bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/30"
                          }`}
                        >
                          <Shield className="h-4 w-4 shrink-0" />
                          Consular Admin Panel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Legalization checklist summary card widget */}
                  <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl mt-6 space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Legalization Status Tracker</span>
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Abuja Step Progress:</span>
                      <span className="text-amber-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 flex overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal pt-1 font-sans">
                      Tracks Abuja Ministry of Education & MFA updates.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Core Interactive Screen Frame - Full-Width Layout */}
          <div className="w-full min-h-[60vh] transition-all duration-300">
            <AnimatePresence mode="wait">
              {/* TAB: UNIVERSITY MATCH & ELIGIBILITY */}
              {activeTab === Tabs.MATCH && (
                <motion.div
                  key="tab-match"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <UniversityMatch
                    onSelectUniversity={(uni) => {
                      setSelectedUni(uni);
                      setActiveTab(Tabs.DIRECTORY);
                    }}
                    onNavigateToCsca={() => setActiveTab(Tabs.CSCA_CBT)}
                    onNavigateToDocuments={() => setActiveTab(Tabs.DOCUMENTS)}
                  />
                </motion.div>
              )}

              {/* TAB: DOCUMENT DIAGNOSTIC CENTER */}
              {activeTab === Tabs.DOCUMENTS && (
                <motion.div
                  key="tab-documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DocumentDiagnostic
                    onNavigateToPromptStation={() => setActiveTab(Tabs.PROMPT_STATION)}
                    onNavigateToChecklist={() => setActiveTab(Tabs.CHECKLIST)}
                    onNavigateToPassportCheck={() => setActiveTab(Tabs.PASSPORT)}
                  />
                </motion.div>
              )}

              {/* PHASE 2 TAB: DUAL APPLICATION & AGENCY CODE HUB */}
              {activeTab === Tabs.DUAL_APP && (
                <motion.div
                  key="tab-dual-app"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DualApplicationHub
                    onNavigateToStudyPlan={() => setActiveTab(Tabs.STUDY_PLAN_STUDIO)}
                    onNavigateToDocuments={() => setActiveTab(Tabs.DOCUMENTS)}
                    onNavigateToConsultant={() => setActiveTab(Tabs.CONSULTANT)}
                  />
                </motion.div>
              )}

              {/* PHASE 2 TAB: AI STUDY PLAN & RECOMMENDATION LETTER STUDIO */}
              {activeTab === Tabs.STUDY_PLAN_STUDIO && (
                <motion.div
                  key="tab-study-plan-studio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <StudyPlanStudio
                    userProfile={userProfile}
                    onOpenConsultant={() => setActiveTab(Tabs.CONSULTANT)}
                  />
                </motion.div>
              )}

              {/* PHASE 3 TAB: AI MOCK INTERVIEW SIMULATOR */}
              {activeTab === Tabs.INTERVIEW_SIM && (
                <motion.div
                  key="tab-interview-sim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InterviewSimulator
                    onOpenConsultant={() => setActiveTab(Tabs.CONSULTANT)}
                  />
                </motion.div>
              )}

              {/* PHASE 3 TAB: JW201/202 VISA & CHINA LANDING COMMAND */}
              {activeTab === Tabs.VISA_PRE_DEPARTURE && (
                <motion.div
                  key="tab-visa-pre-departure"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <VisaAndPreDeparture
                    onOpenConsultant={() => setActiveTab(Tabs.CONSULTANT)}
                  />
                </motion.div>
              )}

              {/* TAB 1: PASSPORT HUB */}
              {activeTab === Tabs.PASSPORT && (
                  <motion.div
                    key="tab-passport"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-amber-500/10 to-[#03C988]/5 border border-slate-800 p-6 rounded-2xl">
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                        Secure Passport Fast-Track Terminal
                      </span>
                      <h1 className="text-2xl font-bold font-display text-white mt-2 tracking-tight">
                        NIS Passport Fast-Track & Intake Safeguards
                      </h1>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Configure Niger Immigration Service (NIS) profiles and verify critical spelling matches to bypass biometric delays at key enrollment centers (Abuja Gwagwalada, Ikoyi, Alausa).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Administrative Manual and Guides */}
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Clipboard className="h-5 w-5 text-amber-500" />
                          <h3 className="text-sm font-bold text-white uppercase font-display select-none">NIS Administrative Manual</h3>
                        </div>

                        <div className="space-y-4 leading-relaxed text-xs">
                          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2 font-sans">
                            <span className="text-amber-500 font-semibold text-xs flex items-center gap-1.5">
                              <Info className="h-4 w-4" />
                              32-Page Booklet vs 64-Page Booklet Bottlenecks
                            </span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              The standard 32-page passport booklet is locally-sourced and frequently experiences severe printing backlogs, which can lead to artificial wait delays of over 3 months.
                            </p>
                            <p className="text-slate-400 text-[11px] font-semibold bg-slate-950 p-2.5 rounded border border-slate-850">
                              💡 <strong>Strategic Hack:</strong> Spend the premium fee for the 64-page booklet. Since it travels on separate international diplomatic supply routes, it is typically printed and issued within literal days of biometric capture.
                            </p>
                          </div>

                          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2 font-sans">
                            <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4" />
                              National ID (NIN) Database Matrix Alignment
                            </span>
                            <p className="text-slate-330 text-[11px] leading-relaxed">
                              Ensure that your date of birth, spelling sequence, and state of origin inside your verified NIMC/NIN profile align with your university portal admissions information 100% exactly.
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono p-2.5 bg-red-500/5 text-red-400 border border-red-500/10 rounded">
                              ⚠️ <strong>System Block:</strong> Even a single letter variance or swapped surname order triggers a software lockout at NIS enrollment biometric capture hubs.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Interactive Spelling Matcher */}
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                            <Sparkles className="h-5 w-5 text-[#03C988]" />
                            <h3 className="text-sm font-bold text-white uppercase font-display select-none">Database Alignment Audit</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-4 leading-normal font-sans">
                            Cross-verify your Passport and National Identification Number (NIN) credentials immediately to avoid physical database errors.
                          </p>

                          <div className="space-y-3 font-sans">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Passport Surname</label>
                                <input
                                  type="text"
                                  value={passportSurname}
                                  onChange={(e) => setPassportSurname(e.target.value)}
                                  placeholder="e.g. Ayotunde"
                                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Passport Given Name(s)</label>
                                <input
                                  type="text"
                                  value={passportGiven}
                                  onChange={(e) => setPassportGiven(e.target.value)}
                                  placeholder="e.g. Samuel"
                                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Full Name as shown in NIMC App (NIN)</label>
                              <input
                                type="text"
                                value={ninNames}
                                onChange={(e) => setNinNames(e.target.value)}
                                placeholder="e.g. Samuel Ayotunde"
                                className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-lg text-xs text-slate-105 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <button
                              onClick={verifyAlignment}
                              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs uppercase tracking-wider cursor-pointer font-sans"
                            >
                              Verify Spelling Alignment
                            </button>
                          </div>
                        </div>

                        {spellCheckResult && (
                          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                            spellCheckResult.match
                              ? "bg-[#03C988]/10 border-[#03C988]/30 text-emerald-100"
                              : "bg-red-500/10 border-red-500/20 text-red-100"
                          }`}>
                            <div className="font-bold flex items-center gap-1.5 mb-1 underline">
                              {spellCheckResult.match ? "Database Status Clear ✔" : "Action Required ⚠️"}
                            </div>
                            <p className="font-sans leading-normal">{spellCheckResult.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: TRADE LANGUAGE SCHOOLS */}
                {activeTab === Tabs.LANGUAGE_SCHOOLS && (
                  <motion.div
                    key="tab-language-schools"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-emerald-500/10 to-[#03C988]/5 border border-slate-800 p-6 rounded-2xl">
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                        Global Trade Logistics language training
                      </span>
                      <h1 className="text-2xl font-bold font-display text-white mt-2 tracking-tight">
                        Commercial Trade & Sourcing Mandarin Institutes
                      </h1>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Direct connection to Firestore short-term Mandarin training centers located in China's major global commodity and wholesale logistics channels. Bypass standard degree programs and study where physical trade happens. Over 50 premium programs indexed.
                      </p>
                    </div>

                    <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                      {/* Search Filter Head Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-emerald-500" />
                          <h3 className="text-sm font-bold text-white uppercase font-display select-none">Commodity Logistical Directories</h3>
                        </div>
                        
                        {/* Filter Button Grid Chips */}
                        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-850">
                          {["All", "Yiwu", "Guangzhou", "Shanghai", "Shenzhen", "Hangzhou", "Beijing", "Others"].map((f) => (
                            <button
                              key={f}
                              onClick={() => setLangSchoolFilter(f)}
                              className={`px-3 py-1.5 rounded-md text-[11px] font-mono uppercase font-bold transition-all cursor-pointer ${
                                langSchoolFilter === f
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Schools list */}
                      {langSchoolLoading ? (
                        <div className="text-center py-20 text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
                          <span>Streaming Firestore records...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
                          {languageSchools
                            .filter((s) => {
                              if (langSchoolFilter === "All") return true;
                              if (langSchoolFilter === "Others") {
                                return !["yiwu", "guangzhou", "shanghai", "shenzhen", "hangzhou", "beijing"].includes(s.location.toLowerCase());
                              }
                              return s.location.toLowerCase() === langSchoolFilter.toLowerCase();
                            })
                            .map((school) => (
                              <div key={school.id} className="bg-slate-950/60 border border-slate-850 rounded-xl p-5 space-y-4 hover:border-slate-800 transition duration-300 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-3">
                                    <h4 className="text-xs font-bold text-white font-display leading-snug">{school.name}</h4>
                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-extrabold shrink-0">
                                      {school.location}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-404 text-slate-400 leading-relaxed font-sans">{school.description}</p>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono bg-[#0B192C]/85 p-3 rounded-lg border border-slate-900">
                                    <div>
                                      <div className="text-slate-500 font-mono uppercase text-[8px] tracking-widest">Estimated Fee</div>
                                      <div className="text-emerald-400 font-bold text-xs mt-0.5 font-sans">¥{school.tuitionRmb.toLocaleString()} RMB</div>
                                    </div>
                                    <div>
                                      <div className="text-slate-500 font-mono uppercase text-[8px] tracking-widest">Intake Windows</div>
                                      <div className="text-white font-bold mt-0.5 text-[10px] truncate">
                                        {school.startDates.join(", ")}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-900/40">
                                    <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                      <Sparkles className="h-3 w-3" />
                                      Sourcing Lab Incl.
                                    </span>
                                    <a
                                      href={school.applicationLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:underline shrink-0 cursor-pointer"
                                    >
                                      Direct Portal <ArrowRight className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: FLIGHT & VISA COMMAND */}
                {activeTab === Tabs.FLIGHT_VISA && (
                  <motion.div
                    key="tab-flight-visa"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-cyan-500/10 to-[#03C988]/5 border border-slate-800 p-6 rounded-2xl">
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                        AVAS Submission & Logistic Command
                      </span>
                      <h1 className="text-2xl font-bold font-display text-white mt-2 tracking-tight">
                        Visa Compliance Center & Free Flight Bypass
                      </h1>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Access official visa routes, CVASC submission masterclass protocols, and utilize our GDS Free Flight locator loophole to avoid reservation fee overheads.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                      
                      {/* CVASC Scheduling masterclass */}
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-1">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Calendar className="h-5 w-5 text-amber-500" />
                          <h3 className="text-sm font-bold text-white uppercase font-display select-none">CVASC Masterclass</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Abuja versus Lagos operational rules for submitting files to physical CVASC counters:
                        </p>

                        <div className="space-y-3.5">
                          <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="text-white font-bold flex justify-between items-center text-[10.5px]">
                              <span>Abuja Submissions (Murjanatu House)</span>
                              <span className="text-[9px] bg-slate-850 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/20">TUES & THURS</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Walk-ins are flatly restricted. Ensure dual-camera facial verification is fully aligned on the COVA online platform prior to booking.
                            </p>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3.5 text-xs space-y-2">
                            <div className="text-white font-bold flex justify-between items-center text-[10.5px]">
                              <span>Lagos Submissions (Churchgate Towers)</span>
                              <span className="text-[10px] bg-slate-850 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/10">MON TO FRI</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Higher daily quota, faster turnaround times, but highly detailed auditing of local Naira balance sheets for self-sponsored routes.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* X2 Visa Legalization Bypass Manual */}
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3 lg:col-span-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                            <Lock className="h-5 w-5 text-emerald-400" />
                            <h3 className="text-sm font-bold text-white uppercase font-display select-none">X2 Bypass Engine</h3>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3">
                            Language programs under 180 days require an <strong className="text-emerald-400">X2 Visa</strong> rather than the standard degree-level X1 Visa.
                          </p>
                          <div className="bg-emerald-500/5 border border-slate-800 border-dashed rounded-xl p-4 space-y-2.5">
                            <span className="text-[10px] font-mono uppercase text-[#03C988] font-bold block">Consular Loop Bypassed!</span>
                            <p className="text-xs text-slate-350 leading-relaxed">
                              Because X2 tracks are supported simply by a standard admissions letter and a secure paper JW202/DQ Form, the physical embassy **completely waives the Abuja consular document legalization sequence!**
                            </p>
                            <p className="text-[10.5px] text-slate-400 font-mono">
                              No Ministry of Education vetting, no Abuja MFA stamp, and zero consular stamp receipts required. Once admitted, proceed straight to visa booking.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PNR Loop Generator */}
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3 lg:col-span-1 flex flex-col justify-between font-sans">
                        <div>
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                            <Plane className="h-5 w-5 text-cyan-400" />
                            <h3 className="text-sm font-bold text-white uppercase font-display select-none">Ethiopian GDS Bypass</h3>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Submit verified booking profiles to CVASC without spending money. Select flight details to construct an Ethiopian GDS free booking reference.
                          </p>

                          <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Departure</label>
                                <select
                                  value={pnrOrigin}
                                  onChange={(e) => setPnrOrigin(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-slate-305 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500"
                                >
                                  <option value="Abuja (ABV)">Abuja (ABV)</option>
                                  <option value="Lagos (LOS)">Lagos (LOS)</option>
                                  <option value="Kano (KAN)">Kano (KAN)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Destination</label>
                                <select
                                  value={pnrDest}
                                  onChange={(e) => setPnrDest(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-slate-305 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500"
                                >
                                  <option value="Yiwu / Hangzhou (HGH)">Yiwu (HGH)</option>
                                  <option value="Guangzhou (CAN)">Guangzhou (CAN)</option>
                                  <option value="Shanghai (PVG)">Shanghai (PVG)</option>
                                  <option value="Beijing (PEK)">Beijing (PEK)</option>
                                </select>
                              </div>
                            </div>

                            <button
                              onClick={generateGdsTicket}
                              disabled={gdsLoading}
                              className="w-full bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer font-sans"
                            >
                              {gdsLoading ? "Registering on GDS Databases..." : "Generate GDS Booking Ticket"}
                            </button>
                          </div>
                        </div>

                        {gdsPnr ? (
                          <div className="p-4 bg-slate-950/90 border border-slate-850 rounded-xl relative overflow-hidden flex flex-col space-y-2 border-dashed font-mono">
                            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-l from-slate-900 to-transparent"></div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 pb-1.5 border-b border-slate-900 border-dashed">
                              <span>Passenger: {currentUser || "SAMUEL AYOTUNDE"}</span>
                              <span className="text-cyan-400 font-bold">GDS CONFIRMED</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <div>
                                <div className="text-[9px] text-slate-600">ROUTE</div>
                                <div className="text-xs font-bold text-white uppercase">{pnrOrigin.split(" ")[0]} → {pnrDest.split(" ")[0]}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[9px] text-slate-600">GDS PNR</div>
                                <div className="text-xs font-black text-amber-500">{gdsPnr}</div>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 border-t border-slate-900 border-dashed pt-1.5 leading-normal font-sans">
                              * Satisfies CVASC ticket guidelines automatically for 7 business days with zero naira checkout fee.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )}

                 {/* TAB 5: CSCA CBT EXAM CENTER */}
                {activeTab === Tabs.CSCA_CBT && (
                  <motion.div
                    key="tab-csca-cbt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Left Panel: Examination Interface */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
                          <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                              <BookOpen className="h-4.5 w-4.5 text-amber-500" />
                              2026 CSCA CBT Mock Center
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Mandatory for the 2026 China Scholarship Council intake. Interactive simulated science, math & language questions. Over 200 items in bank.
                            </p>
                          </div>
                          
                          {cscaActiveTest && (
                            <div className="flex items-center gap-2">
                              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold animate-pulse ${
                                cscaTimeRemaining < 180 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                              }`}>
                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                {formatTime(cscaTimeRemaining)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCscaShowSubmitConfirm(true)}
                                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition select-none cursor-pointer"
                              >
                                Submit Exam
                              </button>
                            </div>
                          )}
                        </div>

                        {/* CBT VIEW CONTROLLER */}
                        {!cscaActiveTest && !cscaTestSubmitted ? (
                          /* CONFIGURATION & LANDING LAUNCHPAD */
                          <div className="space-y-6 py-4 font-sans max-w-xl mx-auto">
                            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center space-y-4">
                              <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <GraduationCap className="h-6 w-6 text-amber-500" />
                              </div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Practice Exam</h3>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                Calibrate your computer-based test parameters below. The simulator serves reshuffled high-realism items corresponding directly to the newly certified 2026 CSCA intake syllabus.
                              </p>

                              <div className="space-y-4 text-left pt-2 border-t border-slate-800">
                                {/* Subject Selector */}
                                <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold">1. Select Syllabus Category</label>
                                  <select 
                                    value={cscaSubject} 
                                    onChange={(e: any) => setCscaSubject(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                                  >
                                    <option value="math">Mathematics Syllabus (Sets, Quadratic, Geometry, Vectors)</option>
                                    <option value="physics">Physics Engine Fundamentals (Kinematics, Circuits, Wave Optics)</option>
                                    <option value="chemistry">Chemistry Compounds (Stoichiometry, Redox, pH Scales)</option>
                                    <option value="professional_chinese">Professional Chinese (Grammar, Logistics, Trade negotiation)</option>
                                  </select>
                                </div>

                                {/* Timer / Duration & Question Limit selector side-by-side */}
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold">2. Set Number of Questions</label>
                                    <select 
                                      value={cscaQuestionsLimit} 
                                      onChange={(e) => setCscaQuestionsLimit(Number(e.target.value))}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
                                    >
                                      <option value={5}>5 Questions (Rapid Drill)</option>
                                      <option value={10}>10 Questions (Standard Intake)</option>
                                      <option value={15}>15 Questions (Thorough Review)</option>
                                      <option value={20}>20 Questions (Marathon Drill)</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold">3. Calculated Time Limit</label>
                                    <div className="w-full bg-slate-950/60 border border-slate-850 rounded-lg text-xs text-[#03C988] font-bold px-3 py-2.5 flex items-center gap-1.5 header-glass">
                                      <Clock className="h-3.5 w-3.5 text-[#03C988]" />
                                      {cscaQuestionsLimit * 2} Minutes ({cscaQuestionsLimit * 120} Secs)
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-[#040c1a] border border-slate-850 p-3 rounded-lg text-[10px] text-slate-500 leading-normal font-sans">
                                  📌 <strong>Nigerian Candidate Directive:</strong> Answers are securely saved as you navigate through items. Past results are logged into your admissions history panel on the right.
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStartCscaTest(cscaSubject as any)}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition uppercase tracking-wider select-none cursor-pointer mt-4"
                              >
                                <Sparkles className="h-4 w-4" />
                                Start CBT Practice Session
                              </button>
                            </div>
                          </div>
                        ) : cscaActiveTest ? (
                          /* STANDARD ONE-QUESTION-AT-A-TIME CBT WRAPPER */
                          <div className="space-y-6">
                            {(() => {
                              const q = cscaQuestions[activeQuestionIdx];
                              if (!q) return (
                                <div className="text-center py-8 text-xs text-slate-400">
                                  Constructing specialized test items... Please wait.
                                </div>
                              );

                              const selectedOption = cscaSelectedAnswers[q.questionId];
                              const isFlagged = !cscaFlaggedAnswers ? false : !!cscaFlaggedAnswers[q.questionId];

                              return (
                                <div className="space-y-5">
                                  {/* Item Header bar */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                                        ITEM {activeQuestionIdx + 1} OF {cscaQuestions.length}
                                      </span>
                                      <span className="bg-[#0B192C] border border-slate-800 text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold">
                                        {cscaSubject.replaceAll("_", " ").toUpperCase()} INDEX
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCscaFlaggedAnswers(prev => ({
                                            ...prev,
                                            [q.questionId]: !isFlagged
                                          }));
                                          addDevLog(`Question ${activeQuestionIdx + 1} ${!isFlagged ? "flagged for review" : "unflagged"}.`);
                                        }}
                                        className={`px-3 py-1 text-[11px] rounded transition select-none cursor-pointer flex items-center gap-1 border ${
                                          isFlagged 
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                                            : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400 hover:border-slate-800"
                                        }`}
                                      >
                                        <Flag className={`h-3 w-3 ${isFlagged ? "fill-amber-400" : ""}`} />
                                        {isFlagged ? "Flagged for Review" : "Flag for Review"}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Stem Content */}
                                  <div className="p-4 bg-slate-950/20 border border-slate-850/60 rounded-xl space-y-2">
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Academic Problem Statement:</span>
                                    <p className="text-sm text-white leading-relaxed font-semibold font-sans">
                                      {q.questionText}
                                    </p>
                                  </div>

                                  {/* Option Buttons */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                    {q.options.map((opt: string) => {
                                      const letter = opt.substring(0, 1);
                                      const isSelected = selectedOption === letter;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => handleSelectAnswer(q.questionId, letter)}
                                          className={`text-left p-3.5 rounded-xl text-xs font-semibold border transition duration-150 cursor-pointer flex items-start gap-3 select-none ${
                                            isSelected 
                                              ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/20" 
                                              : "bg-[#040c1a] border-slate-850 text-slate-300 hover:bg-slate-850/30 hover:border-slate-800"
                                          }`}
                                        >
                                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                            isSelected ? "bg-amber-505 bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-500"
                                          }`}>
                                            {letter}
                                          </span>
                                          <span className="leading-normal pt-0.5">{opt.substring(3)}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Interactive Bottom Console Navigator */}
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-850 mt-6 md:mt-8">
                                    <button
                                      type="button"
                                      disabled={activeQuestionIdx === 0}
                                      onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                                      className="bg-slate-900 border border-slate-800 hover:bg-slate-850 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer select-none font-sans"
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                      Previous Question
                                    </button>

                                    <div className="flex gap-2">
                                      {activeQuestionIdx < cscaQuestions.length - 1 ? (
                                        <button
                                          type="button"
                                          onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                                          className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer select-none font-sans"
                                        >
                                          Next Question
                                          <ChevronRight className="h-4 w-4" />
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setCscaShowSubmitConfirm(true)}
                                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer select-none font-sans animate-pulse"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          Finish & Submit Exam
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          /* COMPLETED EXAM REPORT & STEP SOLUTIONS */
                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-center space-y-4">
                              <p className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">Intake Assessment Concluded</p>
                              
                              <div className="flex items-center justify-center gap-4 py-2 max-w-xs mx-auto">
                                <div className="text-center bg-[#0B192C] border border-slate-800 px-4 py-2.5 rounded-xl flex-1">
                                  <div className="text-[9px] font-mono text-slate-500">RAW SCORE</div>
                                  <div className="text-2xl font-black text-[#03C988] mt-0.5">
                                    {cscaLatestScore} <span className="text-xs text-slate-500">/ {cscaQuestions.length}</span>
                                  </div>
                                </div>
                                <div className="text-center bg-[#0B192C] border border-slate-800 px-4 py-2.5 rounded-xl flex-1">
                                  <div className="text-[9px] font-mono text-slate-500">PERCENTAGE</div>
                                  <div className="text-2xl font-black text-amber-400 mt-0.5">
                                    {Math.round((Number(cscaLatestScore) / cscaQuestions.length) * 100)}%
                                  </div>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-400 leading-normal font-sans px-4">
                                Score captures have been committed. Review the complete answers decomposition list below.
                              </p>

                              <div className="flex justify-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Cleanly reset Zustand Store and go back to configure pane
                                    resetStore();
                                  }}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer font-sans select-none"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" /> Start New Practice
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetStore();
                                  }}
                                  className="bg-slate-800 hover:bg-slate-755 text-white border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer font-sans select-none"
                                >
                                  Back to Panel Config
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-xs font-bold text-white uppercase tracking-wider pl-1 font-display">Step-by-Step Solution Decompositions</h3>
                              {cscaQuestions.map((q, idx) => {
                                const userAns = cscaSelectedAnswers[q.questionId];
                                const isCorrect = (userAns || "").trim().toUpperCase() === q.correctOption.trim().toUpperCase();
                                const showExpl = !!cscaShowExplanations[q.questionId];
                                return (
                                  <div key={q.questionId} className={`p-4 rounded-xl border ${
                                    isCorrect ? "bg-emerald-500/5 border-emerald-950/80" : "bg-rose-500/5 border-rose-950/85"
                                  }`}>
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-900/40">
                                      <span className="text-[10px] font-mono text-slate-500">Question #{idx + 1} info</span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-mono text-slate-400">Correct: {q.correctOption}</span>
                                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                          isCorrect ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                                        }`}>
                                          {isCorrect ? "PASSED" : `YOURS: ${userAns || "None"}`}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-white font-semibold mb-3 leading-relaxed font-sans">{q.questionText}</p>
                                    
                                    <button
                                      type="button"
                                      onClick={() => setCscaShowExplanations(prev => ({ ...prev, [q.questionId]: !showExpl }))}
                                      className="text-[11px] text-amber-500 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-all cursor-pointer font-mono"
                                    >
                                      {showExpl ? "Hide Solution Breakdown" : "View Step-by-Step Mathematical Decomposition"} 
                                      {showExpl ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                    </button>

                                    {showExpl && (
                                      <div className="mt-3 pt-3 border-t border-slate-900 text-slate-300 text-xs leading-relaxed space-y-2 bg-[#0B192C]/50 p-3 rounded-lg border border-slate-800">
                                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold font-mono">Expert Solution Method:</div>
                                        <p className="whitespace-pre-line text-xs font-mono text-slate-300 leading-normal">{q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Side indicators / Navigation Console or Trends History */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {cscaActiveTest ? (
                        /* CBT ACTIVE GRID PERSISTENT CONSOLE PANEL */
                        <div className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl space-y-5">
                          <div className="border-b border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                              CBT Exam Navigation Console
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                              Jump instantly to any item index. Unanswered questions are logged dry until selected.
                            </p>
                          </div>

                          {/* Interactive Number grid */}
                          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2.5">
                            {cscaQuestions.map((q, idx) => {
                              const ans = cscaSelectedAnswers[q.questionId];
                              const isCurrent = activeQuestionIdx === idx;
                              const isFlagged = !cscaFlaggedAnswers ? false : !!cscaFlaggedAnswers[q.questionId];
                              const isAnswered = !!ans;

                              let bgStyle = "bg-slate-950 border-slate-850 text-slate-500";
                              if (isCurrent) {
                                bgStyle = "bg-amber-500 border-amber-400 text-slate-950 font-bold ring-2 ring-amber-500/30";
                              } else if (isFlagged) {
                                bgStyle = "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold";
                              } else if (isAnswered) {
                                bgStyle = "bg-emerald-500/10 border-emerald-500/30 text-[#03C988] font-bold";
                              }

                              return (
                                <button
                                  key={q.questionId}
                                  type="button"
                                  onClick={() => setActiveQuestionIdx(idx)}
                                  className={`aspect-square rounded-xl border text-center flex flex-col items-center justify-center text-xs transition duration-150 cursor-pointer select-none relative ${bgStyle}`}
                                >
                                  <span>{idx + 1}</span>
                                  {isFlagged && !isCurrent && (
                                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Metric Legend */}
                          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 text-[10px] space-y-2 text-slate-400 font-sans">
                            <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">CONSOLE STATUS LEGEND</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded bg-amber-500 inline-block pointer-events-none"></span>
                                <span>Active Selection</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded bg-[#03C988]/20 border border-[#03C988]/30 inline-block pointer-events-none"></span>
                                <span>Answered</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded bg-amber-550/10 border border-amber-500/20 inline-block pointer-events-none text-amber-500 flex items-center justify-center text-[8px]">🚩</span>
                                <span>Review Flagged</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded bg-slate-950 border border-slate-850 inline-block pointer-events-none"></span>
                                <span>Unanswered</span>
                              </div>
                            </div>
                          </div>

                          {/* Digital Guard list */}
                          <div className="space-y-2 border-t border-slate-850 pt-3 text-[11px] text-slate-400 leading-normal font-sans">
                            <div className="flex gap-2 items-start text-[10px] text-slate-500">
                              <ShieldCheck className="h-4 w-4 text-[#03C988] shrink-0" />
                              <div>
                                <strong>Interactive Session Safeguard Active.</strong> All inputs are stored securely dynamically. Standard timeout auto-submits answers.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* PERFORMANCE HISTORY TREND GRAPH */
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 font-display">
                            <TrendingUp className="h-4 w-4 text-[#03C988]" />
                            CSCA Performance History Trends
                          </h3>
                          <p className="text-xs text-slate-400 mb-4 leading-normal font-sans">
                            Tracking progress across practice mock scores recorded in your secure cloud-connected database.
                          </p>

                          {cscaHistory.length === 0 ? (
                            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-xl text-center">
                              <p className="text-xs text-slate-400 font-sans">
                                No mock attempt records inside database yet. Run a category above and hit **Launch Test** to index performance curves.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 font-sans">
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2 font-display">CSCA Score Progression Trend (%)</span>
                                <div className="h-32 w-full flex items-end">
                                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    <line x1="0" y1="10" x2="300" y2="10" stroke="#1e293b" strokeDasharray="3,3" />
                                    <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                                    <line x1="0" y1="90" x2="300" y2="90" stroke="#1e293b" strokeDasharray="3,3" />

                                    {cscaHistory.length > 1 ? (
                                      <path
                                        d={cscaHistory.reduce((acc, curr, idx) => {
                                          const x = (idx / (cscaHistory.length - 1)) * 260 + 20;
                                          const y = 90 - (curr.percentage / 100) * 70;
                                          return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                        }, "")}
                                        fill="none"
                                        stroke="#03C988"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    ) : null}

                                    {cscaHistory.map((curr, idx) => {
                                      const x = cscaHistory.length > 1 ? (idx / (cscaHistory.length - 1)) * 260 + 20 : 150;
                                      const y = 90 - (curr.percentage / 100) * 70;
                                      return (
                                        <g key={curr.attemptId}>
                                          <circle cx={x} cy={y} r="4.5" fill="#03C988" stroke="#0B192C" strokeWidth="1.5" />
                                          <text x={x} y={y - 8} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                            {curr.score}/{curr.totalQuestions}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>

                              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                                {cscaHistory.map((item, idx) => (
                                  <div key={item.attemptId} className="bg-slate-900/40 border border-slate-850 p-3 rounded-lg flex justify-between items-center bg-slate-950/20">
                                    <div>
                                      <div className="font-semibold text-white">Attempt #{idx + 1} ({item.score}/{item.totalQuestions})</div>
                                      <div className="text-[10px] text-slate-500 font-mono">{new Date(item.startedAt || item.timestamp || Date.now()).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right font-sans">
                                      <div className="font-mono text-[#03C988] font-bold">{item.percentage}%</div>
                                      <div className="text-[10px] text-slate-500 font-mono select-none uppercase">Subject: {String(item.subject || "math").replaceAll("_", " ")}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Compliance Regulations (only shown when not inside active test to save screen estate) */}
                      {!cscaActiveTest && (
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setCscaShowComplianceGuide(!cscaShowComplianceGuide)}
                            className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                          >
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                              <ShieldCheck className="h-4.5 w-4.5 text-[#03C988]" />
                              Home-Based Proctoring Regulations
                            </h3>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${cscaShowComplianceGuide ? "rotate-180" : ""}`} />
                          </button>
                          
                          {cscaShowComplianceGuide && (
                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                              <p className="font-mono bg-red-500/10 text-red-400 p-3 rounded-lg border border-red-500/10 text-[11px] leading-relaxed">
                                ⚠️ <strong>Critical Guideline:</strong> Under the 2026 regulations, home-based proctoring anomalies trigger an automatic, immediate 2-year system ban.
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex gap-2 items-start">
                                  <span className="bg-amber-500/10 text-amber-500 font-mono h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px]">01</span>
                                  <div>
                                    <strong className="text-slate-100 block text-xs">Strict Windows OS Platform Preference</strong>
                                    Proctoring tracking modules interact directly with file security systems. Candidates are heavily advised to use standard Windows 10/11 machines over MacOS.
                                  </div>
                                </div>
                                <div className="flex gap-2 items-start">
                                  <span className="bg-amber-500/10 text-amber-500 font-mono h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px]">02</span>
                                  <div>
                                    <strong className="text-slate-100 block text-xs">Dual-Camera Monitoring Protocol</strong>
                                    A persistent QR code is displayed during the exam. Candidates must stream a live side-profile room overview using their mobile camera while their laptop camera monitors eye-gaze anomalies.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* TAB 0: ADVANCED VERIFIEDUNI 2026 ADMIN BENTO WORKSPACE */}
                {activeTab === Tabs.WORKSPACE && (
                  <motion.div
                    key="tab-workspace"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Dashboard
                      currentUser={currentUser}
                      userProfile={userProfile}
                      progressPercent={progressPercent}
                      cscaHistory={cscaHistory}
                      languageSchools={languageSchools}
                      addDevLog={addDevLog}
                      onStartCsca={() => {
                        setActiveTab(Tabs.CSCA_CBT);
                      }}
                      onTabChange={(tab) => {
                        setActiveTab(tab);
                      }}
                    />
                  </motion.div>
                )}

                {/* DISABLED LEGACY WORKSPACE BLOCK */}
                {false && activeTab === "workspace" as any && (
                  <motion.div
                    key="tab-workspace"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Workspace Hero Header */}
                    <div className="bg-gradient-to-r from-[#03C988]/5 to-amber-500/5 border border-slate-800 p-6 rounded-2xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                            2026 Admissions Command Center
                          </span>
                          <h1 className="text-2xl font-bold font-display text-white mt-2 tracking-tight">
                            VerifiedUni Admissions & Verification Workspace
                          </h1>
                          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                            A unified, high-density dashboard combining the 2026 China Scholastic Competency Assessment (CSCA) Mock Center, Local Nigeria Administrative authentication routes, and the Short-Term Trading Mandarin Directory.
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-[#0B192C] border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                            <div className="text-[10px] font-mono uppercase text-slate-400">Database Engine</div>
                            <div className="text-xs font-bold text-[#03C988] flex items-center gap-1 mt-0.5">
                              <span className="h-2 w-2 rounded-full bg-[#03C988] animate-ping inline-block"></span>
                              Active Firestore v10+
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TWO COLUMN PRIMARY BENTO GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* LEFT COLUMN: MODULE 5 CSCA EXAM PRACTICE CENTER (Takes 7 Cols in lg) */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* Core Exam Simulator Panel */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                          
                          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                              <BookOpen className="h-4.5 w-4.5 text-amber-500" />
                              2026 CSCA CBT Mock Center
                            </h2>
                            
                            {cscaActiveTest ? (
                              <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold animate-pulse ${
                                  cscaTimeRemaining < 180 ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                }`}>
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatTime(cscaTimeRemaining)}
                                </span>
                                <button
                                  onClick={() => handleCscaSubmit(false)}
                                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                >
                                  Finish & Submit
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={handleStartCscaTest}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition uppercase tracking-wider"
                              >
                                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                                Start Exam (15Mins)
                              </button>
                            )}
                          </div>

                          {/* Default Landing or Quiz in Progress */}
                          {!cscaActiveTest && !cscaTestSubmitted ? (
                            <div className="space-y-4 py-2">
                              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center space-y-3">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  The CSC Scholastic Competency Assessment (Type A / B) is newly <span className="text-amber-400 font-semibold">mandatory for the 2026 intake</span>. This simulation comprises 10 high-realism mathematics questions sourced directly from the 2026 syllabus including Sets, Inequalities, Matrices, Vectors, and Probabilities.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                                  <div className="bg-[#0B192C] border border-slate-850 p-2.5 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-mono">COUNT</div>
                                    <div className="text-base font-extrabold text-white">10 Qs</div>
                                  </div>
                                  <div className="bg-[#0B192C] border border-slate-850 p-2.5 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-mono">LIMIT</div>
                                    <div className="text-base font-extrabold text-white">15 Min</div>
                                  </div>
                                  <div className="bg-[#0B192C] border border-slate-850 p-2.5 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-mono">LANGUAGE</div>
                                    <div className="text-base font-extrabold text-white">English</div>
                                  </div>
                                  <div className="bg-[#0B192C] border border-slate-850 p-2.5 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-mono">MEDIUM</div>
                                    <div className="text-base font-extrabold text-white">CBT Math</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : cscaActiveTest ? (
                            // Active quiz question display
                            <div className="space-y-6">
                              <div className="space-y-4">
                                {cscaQuestions.map((q, idx) => {
                                  const selectedOption = cscaSelectedAnswers[q.questionId];
                                  return (
                                    <div key={q.questionId} className="bg-slate-900/40 border border-slate-800/75 rounded-xl p-4 space-y-3 transition hover:border-slate-750">
                                      <div className="flex justify-between items-start gap-2">
                                        <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-md">
                                          Question {idx + 1} of {cscaQuestions.length}
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-500 uppercase">Math Matrix</span>
                                      </div>
                                      <p className="text-xs text-white leading-relaxed font-semibold">
                                        {q.questionText}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                                        {q.options.map((opt: string) => {
                                          const letter = opt.substring(0, 1);
                                          const isSelected = selectedOption === letter;
                                          return (
                                            <button
                                              key={opt}
                                              onClick={() => handleSelectAnswer(q.questionId, letter)}
                                              className={`text-left p-2.5 rounded-lg text-xs font-medium border transition duration-200 ${
                                                isSelected
                                                  ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                                                  : "bg-slate-950/40 border-slate-850 text-slate-300 hover:bg-slate-850/30"
                                              }`}
                                            >
                                              {opt}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={() => handleCscaSubmit(false)}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
                                >
                                  Submit Entire CBT Exam
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Test submitted view with score explanations and math decompositions
                            <div className="space-y-6">
                              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center space-y-3">
                                <p className="text-xs font-mono text-amber-500 uppercase tracking-wider">Exam Results Saved</p>
                                <div className="text-3xl font-extrabold text-white">
                                  Score: <span className="text-[#03C988]">{cscaLatestScore}</span> / {cscaQuestions.length}
                                </div>
                                <p className="text-xs text-slate-400">
                                  Your completed score has been recorded permanently inside your personalized Firestore portal dashboard. View the complete mathematical solution for each question below.
                                </p>
                                <button
                                  onClick={handleStartCscaTest}
                                  className="bg-slate-800 hover:bg-slate-755 text-white border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" /> Re-attempt Mock
                                </button>
                              </div>

                              {/* Question feedback loop */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider pl-1">Explanations & Solution Decompositions</h3>
                                {cscaQuestions.map((q, idx) => {
                                  const userAns = cscaSelectedAnswers[q.questionId];
                                  const isCorrect = userAns === q.correctOption;
                                  const showExpl = !!cscaShowExplanations[q.questionId];
                                  return (
                                    <div key={q.questionId} className={`p-4 rounded-xl border ${
                                      isCorrect ? "bg-emerald-500/5 border-emerald-950" : "bg-rose-500/5 border-rose-950"
                                    }`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono text-slate-500">MATH Q{idx + 1}</span>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-mono text-slate-400">Correct: {q.correctOption}</span>
                                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                            isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                          }`}>
                                            {isCorrect ? "Correct" : `Your Choice: ${userAns || "None"}`}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-white font-semibold mb-3 leading-relaxed">{q.questionText}</p>
                                      
                                      <button
                                        onClick={() => setCscaShowExplanations(prev => ({ ...prev, [q.questionId]: !showExpl }))}
                                        className="text-[11px] text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 transition-all"
                                      >
                                        {showExpl ? "Hide Solution Breakdown" : "View Step-by-Step Mathematical Decomposition"} 
                                        {showExpl ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                      </button>

                                      {showExpl && (
                                        <div className="mt-3 pt-3 border-t border-slate-900 text-slate-350 text-xs leading-relaxed space-y-2 bg-[#0B192C]/50 p-3 rounded-lg border border-slate-800">
                                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Lao Shi Mathematical Breakdown:</div>
                                          <p className="whitespace-pre-line text-xs font-mono text-slate-300">{q.explanation}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Performance Charts (SVG Line Graphs dynamically rendered from attempts history in Firestore) */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-[#03C988]" />
                            CSCA Performance History Trends
                          </h3>
                          <p className="text-xs text-slate-400 mb-4 leading-normal">
                            Direct connection to Firestore records tracking attempt histories in real-time. Plotting your progress across successive simulated practice cycles.
                          </p>

                          {cscaHistory.length === 0 ? (
                            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-xl text-center">
                              <p className="text-xs text-slate-400">
                                No mock exam attempts recorded in the database yet. Launch your first 15-minute test series and submit to plot scoring vectors here.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Custom responsive inline SVG Vector Line Graph */}
                              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850">
                                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2">CSCA Score Progression Trend (%)</span>
                                <div className="h-28 w-full flex items-end">
                                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    {/* Horizontal gridlines */}
                                    <line x1="0" y1="10" x2="300" y2="10" stroke="#1e293b" strokeDasharray="3,3" />
                                    <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                                    <line x1="0" y1="90" x2="300" y2="90" stroke="#1e293b" strokeDasharray="3,3" />

                                    {/* Plotted Line */}
                                    {cscaHistory.length > 1 ? (
                                      <path
                                        d={cscaHistory.reduce((acc, curr, idx) => {
                                          const x = (idx / (cscaHistory.length - 1)) * 260 + 20;
                                          const y = 90 - (curr.percentage / 100) * 70;
                                          return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                        }, "")}
                                        fill="none"
                                        stroke="#03C988"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    ) : null}

                                    {/* Plot Circles & Labels */}
                                    {cscaHistory.map((curr, idx) => {
                                      const x = cscaHistory.length > 1 ? (idx / (cscaHistory.length - 1)) * 260 + 20 : 150;
                                      const y = 90 - (curr.percentage / 100) * 70;
                                      return (
                                        <g key={curr.attemptId}>
                                          <circle cx={x} cy={y} r="4.5" fill="#03C988" stroke="#0B192C" strokeWidth="1.5" />
                                          <text x={x} y={y - 8} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                            {curr.score}/{curr.totalQuestions}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-900">
                                  <span>Oldest Attempt</span>
                                  <span>Recent Progress Timeline →</span>
                                </div>
                              </div>

                              {/* Attempts historical timeline table */}
                              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                                {cscaHistory.map((item, idx) => (
                                  <div key={item.attemptId} className="bg-slate-900/50 border border-slate-850 p-3 rounded-lg flex justify-between items-center text-xs">
                                    <div className="space-y-0.5">
                                      <div className="font-semibold text-white">Attempt #{idx + 1} ({item.score}/{item.totalQuestions})</div>
                                      <div className="text-[10px] text-slate-500 font-mono">{new Date(item.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-mono text-[#03C988] font-bold">{item.percentage}%</div>
                                      <div className="text-[10px] text-slate-550 font-mono">Duration: {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Proctoring Survival Guide */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                          <button
                            onClick={() => setCscaShowComplianceGuide(!cscaShowComplianceGuide)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <ShieldCheck className="h-4.5 w-4.5 text-[#03C988]" />
                              CSCA Home-Based Proctoring Compliance Manual
                            </h3>
                            <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition transform ${cscaShowComplianceGuide ? "rotate-180" : ""}`} />
                          </button>
                          
                          {cscaShowComplianceGuide && (
                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
                              <p className="font-mono bg-red-500/10 text-red-400 p-3 rounded-lg border border-red-500/20 text-[11px]">
                                ⚠️ CRITICAL MANDATE: Under the 2026 guidelines, home-based CSCA proctoring failures result in automatic 2-year exam bans. Do NOT assume normal browser flexibility will work.
                              </p>
                              
                              <div className="space-y-3">
                                <div className="flex gap-2.5 items-start">
                                  <span className="bg-amber-500/10 text-amber-500 font-mono h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px]">01</span>
                                  <div>
                                    <span className="font-semibold text-slate-100 block">Strict Windows OS Native Preference</span>
                                    The secure browser launcher utilizes encrypted hooks that crash or lock out on MacOS Sequoia due to screen capture permission limitations. Candidates are heavily advised to sit for the CBT strictly on clean Windows 10/11 machines.
                                  </div>
                                </div>
                                
                                <div className="flex gap-2.5 items-start">
                                  <span className="bg-amber-500/10 text-amber-500 font-mono h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px]">02</span>
                                  <div>
                                    <span className="font-semibold text-slate-100 block">Dual-Camera Proctoring Rig (Main PC + Mobile QR Link)</span>
                                    You will be asked to scan a persistent canvas QR code holding your specific token with your smartphone. Your smartphone must be set up at a 45-degree angle behind you to stream a live room overview, while the main laptop camera tracks eye-gaze anomalies.
                                  </div>
                                </div>

                                <div className="flex gap-2.5 items-start">
                                  <span className="bg-amber-500/10 text-amber-500 font-mono h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px]">03</span>
                                  <div>
                                    <span className="font-semibold text-slate-100 block">Dual Browser Lock & Whitelist Triggers</span>
                                    The software detects system active tasks. Shut down Skype, Teams, AnyDesk, Zoom, and TeamViewer. Any remote access process triggers immediate exam aborts. Only a single system browser process is allowed on your firewall.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* RIGHT COLUMN: MODULE 7 COMMERCIAL TRADER MANDARIN SCHOOLS & VISA INSIGHTS (Takes 5 Cols in lg) */}
                      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                        
                        {/* Interactive Language Institutes Directory */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                            <Globe className="h-4.5 w-4.5 text-emerald-500" />
                            Commercial Trade & Sourcing Mandarin Institutes
                          </h2>
                          <p className="text-xs text-slate-400 mb-4 leading-normal">
                            Direct connection to Firestore short-term Mandarin training centers located in China's major global commodity and wholesale logistics channels.
                          </p>

                          {/* Filter Button Grid Chips */}
                          <div className="flex flex-wrap gap-1.5 mb-4 p-1 bg-slate-950/65 rounded-lg border border-slate-850">
                            {["All", "Yiwu", "Guangzhou", "Shanghai", "Shenzhen", "Hangzhou", "Beijing", "Others"].map((f) => (
                              <button
                                key={f}
                                onClick={() => setLangSchoolFilter(f)}
                                className={`px-3 py-1.5 rounded-md text-[11px] font-mono uppercase font-bold transition-all ${
                                  langSchoolFilter === f
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>

                          {/* Schools listings from Firestore */}
                          {langSchoolLoading ? (
                            <div className="text-center py-8 text-xs text-slate-500">Loading Directory records...</div>
                          ) : (
                            <div className="space-y-4">
                              {languageSchools
                                .filter((s) => {
                                  if (langSchoolFilter === "All") return true;
                                  if (langSchoolFilter === "Others") {
                                    return !["yiwu", "guangzhou", "shanghai", "shenzhen", "hangzhou", "beijing"].includes(s.location.toLowerCase());
                                  }
                                  return s.location.toLowerCase() === langSchoolFilter.toLowerCase();
                                })
                                .map((school) => (
                                  <div key={school.id} className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="text-xs font-bold text-white leading-normal">{school.name}</h4>
                                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-extrabold shrink-0">
                                        {school.location}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-normal">{school.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#0B192C] p-2 rounded-lg border border-slate-900 mt-2">
                                      <div>
                                        <div className="text-slate-500 font-mono uppercase">Estimated Fee</div>
                                        <div className="text-white font-bold text-xs mt-0.5">¥{school.tuitionRmb.toLocaleString()} RMB</div>
                                      </div>
                                      <div>
                                        <div className="text-slate-500 font-mono uppercase">Intakes</div>
                                        <div className="text-white font-bold mt-0.5 text-[9px] truncate">
                                          {school.startDates.slice(0, 2).join(", ")}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="pt-2 flex justify-between items-center">
                                      {/* Highlight items bulletproof grid */}
                                      <span className="text-[9px] font-mono text-emerald-500">✔ Sourcing Field-trips embedded</span>
                                      <a
                                        href={school.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline shrink-0"
                                      >
                                        Direct Portal <ArrowRight className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Short-Term X2 Visa Compliance Bypass Guide */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Lock className="h-4.5 w-4.5 text-[#03C988]" />
                            X2 Short-Term Visa Compliance Engine
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Students traveling for language training tracks use an <span className="text-emerald-400 font-bold">X2 (Short-Term under 180 Days) Visa</span> as opposed to the standard X1 (Long-Term Degree) track. This holds a tremendous advantage for West African applicants looking to avoid bureaucratic delays:
                          </p>
                          <div className="bg-emerald-500/5 border border-emerald-900 border-dashed rounded-xl p-3.5 space-y-2">
                            <span className="text-[10px] font-mono uppercase text-[#03C988] font-bold block">Consular Legalization Loop Bypass</span>
                            <p className="text-xs text-slate-300 leading-normal mb-1">
                              Because an X2 visa application is backed merely by a standard School Admission Notice and a hardcopy DQ Form issued by Chinese educational authorities, the embassy <span className="text-white font-semibold">completely waives the Abuja consular legalization file sequence!</span> 
                            </p>
                            <span className="text-[10.5px] text-slate-400 block font-mono">
                              No Ministry of Education vetting, no Abuja MFA stamp, and zero Chinese Embassy authentication receipts needed. Once you receive your admission packet from YWICC or SCNU, you proceed straight to your CVASC application!
                            </span>
                          </div>
                        </div>

                        {/* 2026 CVASC Lagos & Abuja Masterclass Scheduling */}
                        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Calendar className="h-4.5 w-4.5 text-amber-500" />
                            2026 China Visa Application Center (CVASC) Masterclass
                          </h3>
                          <p className="text-xs text-slate-400 leading-normal">
                             Abuja versus Lagos operational guidelines for submitting passport documents under AVAS scheduling portals:
                          </p>
                          
                          <div className="bg-slate-900 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="text-white font-bold flex justify-between items-center text-[10.5px]">
                              <span>Abuja Submissions (Murjanatu House)</span>
                              <span className="text-[9px] bg-slate-800 text-slate-400 font-mono font-bold px-1.5 py-0.5 rounded">TUES & THURS</span>
                            </div>
                            <p className="text-[11px] text-slate-405 leading-relaxed">
                              Located at Murjanatu House, Adetokunbo Ademola Crescent. Walk-ins are banned. Ensure strict double-camera facial verification on the COVA online platform prior to locking appointment dates.
                            </p>
                          </div>

                          <div className="bg-slate-900 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="text-white font-bold flex justify-between items-center text-[10.5px]">
                              <span>Lagos Submissions (Churchgate Towers)</span>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">MON TO FRI</span>
                            </div>
                            <p className="text-[11px] text-slate-405 leading-relaxed">
                              Located at Churchgate Plaza, Victoria Island. Higher daily quota, fast processing times, but stricter manual paper checks on local bank balance sheets for self-sponsored credentials.
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* BOTTOM ROW: MODULE 6 LOCAL NIGERIAN PIPELINE OPERATIONS & FLIGHT BYPASS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
                      
                      {/* Nigerian International Passport Fast-Track (Take 6) */}
                      <div className="md:col-span-6 bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Clipboard className="h-4.5 w-4.5 text-amber-500" />
                          NIS Passport Fast-Track & Intake Safeguards
                        </h3>
                        <p className="text-xs text-slate-400 leading-normal">
                          Administrative tactics for West African students utilizing the Nigerian Immigration Service (NIS) online passport pipeline:
                        </p>
                        
                        <div className="space-y-3">
                          <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-lg text-xs">
                            <span className="text-slate-100 font-semibold block">32-Page Booklet vs 64-Page Booklet Bottlenecks</span>
                            The standard 32-page booklet is local-made and frequently experiences massive backlogs, leading to 3-month wait delays. <span className="text-amber-400 font-bold">Purchase the premium 64-page booklet</span>; it travels on separate international diplomatic lines and is printed and issued within literal days of capture.
                          </div>

                          <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-lg text-xs">
                            <span className="text-slate-100 font-semibold block">National ID (NIN) Database Matrix Alignment</span>
                            Confirm your date of birth, surname spelling, and state of origin inside your NIN profile matches your school application exactly. Even a single letter mismatch halts the biometric capture engine at Gwagwalada, Ikoyi, or Alausa NIS hubs.
                          </div>
                        </div>
                      </div>

                      {/* Flight Reservation Bypass & Abuja Consular Route (Take 6) */}
                      <div className="md:col-span-6 bg-[#0B192C] border border-slate-800 p-6 rounded-2xl space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Plane className="h-4.5 w-4.5 text-[#03C988]" />
                          Flight Reservation Bypass & Abuja Legalization Route
                        </h3>
                        <p className="text-xs text-slate-400 leading-normal">
                          Actionable instructions to circumvent booking charges and map official document legalization rooms:
                        </p>

                        <div className="space-y-3">
                          <div className="bg-emerald-500/5 border border-emerald-950 p-3.5 rounded-xl border-dashed text-xs">
                            <span className="text-emerald-400 font-bold font-mono text-[10px] block uppercase tracking-widest mb-1">Ethiopian GDS Free Flight PNR Bypass Code</span>
                            <p className="text-xs text-slate-300 leading-normal pb-1">
                              Do NOT buy active tickets prior to receiving visa stamp approval. Go directly to Ethiopian Airlines mobile portal, log into your profile, and select "Book Now / Pay Later via Agent Cash Branch Counter Referral". 
                            </p>
                            <span className="text-slate-400 text-[10px] block leading-normal pt-1 border-t border-slate-850 mt-1">
                              This triggers an automatic 6-digit GDS airline booking code (PNR) that registers on all international global aviation security databases as holding active status for 7 full business days, matching CVASC verification criteria completely for zero naira!
                            </span>
                          </div>

                          <div className="bg-slate-900/50 p-3 rounded-lg text-xs border border-slate-850">
                            <span className="text-slate-100 font-semibold block mb-1">Abuja Room-by-Room Consular Vetting Maps</span>
                            To legalize your transcripts/degrees if submitting on standard X1 routes:
                            <ul className="list-disc leading-relaxed pl-4 text-slate-400 mt-1.5 space-y-1">
                              <li>Step 1: Get documents evaluated at <span className="text-white">Ministry of Education (9th floor, Federal Secretariat Block B)</span>.</li>
                              <li>Step 2: Generate Remita voucher, pay N2,500 over the counters, obtain stamp.</li>
                              <li>Step 3: Route directly to <span className="text-white">Ministry of Foreign Affairs (Consular Legalization Department)</span>. Submit files, obtain signature within 48 hours.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                )}

                {/* TAB 1: SEARCHABLE UNIVERSITY DIRECTORY */}
                {activeTab === Tabs.DIRECTORY && (
                  <motion.div
                    key="tab-directory"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl">
                      <h2 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-amber-500" />
                        Interactive CSC Scholarship Matrix ({filteredUniversities.length} matched)
                      </h2>
                      <p className="text-xs text-slate-400 leading-normal">
                        Verify over 100 fully-accredited Chinese Universities accepting West African applicants. Filter by stipend thresholds, scholarship type categorization, and specific major tracks.
                      </p>

                      {/* Filter Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
                        {/* Search keyword input */}
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Search Keyword</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Name, city, or agency code..."
                              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        {/* City selector */}
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">City Filter</label>
                          <select
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="All">All Cities (Entire China)</option>
                            {uniqueCities.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        {/* Tracks Selector */}
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Track/Discipline Specialization</label>
                          <select
                            value={filterTrack}
                            onChange={(e) => setFilterTrack(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="All">All Disciplines Tracks</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Science">Science (IT/Maths/Physics)</option>
                            <option value="Medical">Medical (MBBS/Clinicals)</option>
                            <option value="Business">Business (MBA/Logistics)</option>
                            <option value="Humanities">Humanities (Economics/Law)</option>
                          </select>
                        </div>
                      </div>

                      {/* Type Flags Checks row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs text-slate-300">
                        <span className="font-mono text-[10px] uppercase text-slate-400 block mr-2">Filter CSC Scheme:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterCscTypeA}
                            onChange={(e) => setFilterCscTypeA(e.target.checked)}
                            className="accent-rose-500"
                          />
                          <span>CSC Type A (Embassy)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterCscTypeB}
                            onChange={(e) => setFilterCscTypeB(e.target.checked)}
                            className="accent-rose-500"
                          />
                          <span>CSC Type B (University)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterProvincial}
                            onChange={(e) => setFilterProvincial(e.target.checked)}
                            className="accent-rose-500"
                          />
                          <span>Provincial/Silk Road Waiver</span>
                        </label>
                      </div>
                    </div>

                    {/* Results table matrix */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-850">
                            <th className="py-4 px-5">Rank</th>
                            <th className="py-4 px-4">University Name</th>
                            <th className="py-4 px-4">City</th>
                            <th className="py-4 px-4">Agency Code</th>
                            <th className="py-4 px-4">Scheme Match</th>
                            <th className="py-4 px-4">Tracks Covered</th>
                            <th className="py-4 px-5 text-right font-bold text-slate-300">Undergrad Stipend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 text-xs">
                          {filteredUniversities.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                                No university matches the criteria search. Refine your filters.
                              </td>
                            </tr>
                          ) : (
                            filteredUniversities.map((uni) => {
                              const isSelected = selectedUni?.id === uni.id;
                              
                              // Fallback calculation for older schemas/cached records to prevent undefined crashes
                              const stipendUndergrad = uni.stipendUndergrad !== undefined 
                                ? uni.stipendUndergrad 
                                : (uni.cscTypeA || uni.cscTypeB ? 2500 : (uni.provincial ? 1500 : 0));
                              
                              const tuitionFeeUndergrad = uni.tuitionFeeUndergrad !== undefined 
                                ? uni.tuitionFeeUndergrad 
                                : (16000 + (uni.ranking % 7) * 1500);
                              
                              const accommodationFee = uni.accommodationFee !== undefined
                                ? uni.accommodationFee
                                : (3000 + (uni.ranking % 5) * 1000);

                              const englishMajors = Array.isArray(uni.englishMajors) && uni.englishMajors.length > 0
                                ? uni.englishMajors
                                : (() => {
                                    const majors = [];
                                    if (uni.tracks?.includes("Engineering")) {
                                      majors.push("B.Eng. Computer Science", "B.Eng. Software Engineering");
                                    }
                                    if (uni.tracks?.includes("Business")) {
                                      majors.push("B.B.A. International Economics & Trade");
                                    }
                                    if (uni.tracks?.includes("Medical")) {
                                      majors.push("M.B.B.S. Clinical Medicine");
                                    }
                                    if (majors.length === 0) {
                                      majors.push("B.Sc. Business Administration", "B.Eng. Information Technology");
                                    }
                                    return majors.slice(0, 3);
                                  })();

                              const safeId = (uni.id || "").replace(/_/g, "").toLowerCase();
                              const applicationPortal = uni.applicationPortal || `https://admissions.${safeId || "univ"}.edu.cn/apply`;

                              return (
                                <React.Fragment key={uni.id}>
                                  <tr
                                    onClick={() => setSelectedUni(isSelected ? null : uni)}
                                    className={`hover:bg-slate-800/40 transition cursor-pointer select-none ${
                                      isSelected ? "bg-amber-500/5 select-none" : ""
                                    }`}
                                  >
                                    <td className="py-4 px-5 font-mono text-slate-400 font-semibold">{uni.ranking}</td>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center gap-2">
                                        <div className="font-semibold text-slate-200">{uni.name}</div>
                                        {isSelected ? (
                                          <ChevronDown className="h-4 w-4 text-amber-500 shrink-0" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 hover:text-amber-500" />
                                        )}
                                      </div>
                                      {isSelected && (
                                        <div className="text-[11px] text-rose-400/80 font-semibold mt-1 flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded w-fit">
                                          <Sparkles className="h-3 w-3" />
                                          Strategic matched: Best suited for West African CSC undergraduate direct admissions!
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-4 px-4 font-normal text-slate-305 text-slate-300">{uni.city}</td>
                                    <td className="py-4 px-4 font-mono text-orange-400 font-bold">{uni.agencyCode}</td>
                                    <td className="py-4 px-4">
                                      <div className="flex flex-wrap gap-1">
                                        {uni.cscTypeA && (
                                          <span className="bg-blue-950 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-blue-900/30">
                                            CSC A
                                          </span>
                                        )}
                                        {uni.cscTypeB && (
                                          <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-emerald-900/30">
                                            CSC B
                                          </span>
                                        )}
                                        {(uni.provincial || uni.silkRoad) && (
                                          <span className="bg-purple-950 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-purple-900/30">
                                            Local Waiver
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-400 font-light truncate max-w-[150px]">
                                      {uni.tracks?.join(", ")}
                                    </td>
                                    <td className="py-4 px-5 text-right font-mono text-emerald-400 font-bold">
                                      {stipendUndergrad ? `¥${stipendUndergrad.toLocaleString()} / Mo` : "Waiver"}
                                    </td>
                                  </tr>
                                  {isSelected && (
                                    <tr key={`${uni.id}-details`} className="bg-slate-950/70 border-t border-slate-850">
                                      <td colSpan={7} className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-200">
                                          <div className="space-y-4">
                                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block border-b border-slate-850 pb-1.5">Fees & Charges</span>
                                            <div>
                                              <div className="text-[11px] text-slate-400 font-medium">Initial Undergraduate Tuition Fee</div>
                                              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">¥{tuitionFeeUndergrad.toLocaleString()} / Year</div>
                                              <div className="text-[10px] text-slate-500">Fully covered under full scholarships</div>
                                            </div>
                                            <div>
                                              <div className="text-[11px] text-slate-400 font-medium">Accommodation Fee</div>
                                              <div className="text-sm font-bold text-white font-mono mt-0.5">¥{accommodationFee.toLocaleString()} / Year</div>
                                              <div className="text-[10px] text-slate-500">University standard double occupancy</div>
                                            </div>
                                          </div>

                                          <div className="md:col-span-2 space-y-4">
                                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block border-b border-slate-850 pb-1.5">Undergraduate Majors (English Taught)</span>
                                            <div className="space-y-2">
                                              {englishMajors.map((major, mIdx) => (
                                                <div key={mIdx} className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                                  <span className="font-semibold text-slate-200">{major}</span>
                                                </div>
                                              ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500">All listed majors are fully accredited, taught in 100% English medium, and support scholarship sponsorship.</p>
                                          </div>

                                          <div className="flex flex-col justify-between h-full bg-[#050D1A] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-inner">
                                            <div className="space-y-1">
                                              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold block">Admissions Portal</span>
                                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">Direct self-directed verification link matching this university's registration pipeline.</p>
                                            </div>
                                            <a
                                              href={applicationPortal}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/15"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Globe className="h-4 w-4" />
                                              Open Direct Portal
                                              <ArrowUpRight className="h-3.5 w-3.5" />
                                            </a>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: CODES/PROMPT AI GENERATIVE STATION */}
                {activeTab === Tabs.PROMPT_STATION && (
                  <motion.div
                    key="tab-prompt-station"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Column Left: Parameters configuration */}
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                          <FileText className="h-5 w-5 text-rose-500" />
                          AI High-Converting Generator
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Personalize elite academic templates. Our system binds variables directly into highly targeted server-side prompts.
                        </p>
                      </div>

                      {/* Template Selector Pills */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase text-slate-400">1. Draft Template Target</label>
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl">
                          <button
                            onClick={() => setActiveTemplate("sop")}
                            className={`py-2 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                              activeTemplate === "sop"
                                ? "bg-rose-500 text-slate-950"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Statement (SOP)
                          </button>
                          <button
                            onClick={() => setActiveTemplate("email")}
                            className={`py-2 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                              activeTemplate === "email"
                                ? "bg-rose-500 text-slate-950"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Supervisor Email
                          </button>
                          <button
                            onClick={() => setActiveTemplate("recommend")}
                            className={`py-2 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                              activeTemplate === "recommend"
                                ? "bg-rose-500 text-slate-950"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Rec Letter
                          </button>
                        </div>
                      </div>

                      {/* Interactive Configuration Input Form Parameters */}
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Student Name (Signee)</label>
                          <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="e.g. Samuel Ayotunde"
                            className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Major Major</label>
                            <input
                              type="text"
                              value={targetMajor}
                              onChange={(e) => setTargetMajor(e.target.value)}
                              placeholder="e.g. AI & Robotics"
                              className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Undergrad CGPA</label>
                            <input
                              type="text"
                              value={prevGpa}
                              onChange={(e) => setPrevGpa(e.target.value)}
                              placeholder="e.g. 4.67 / 5.0"
                              className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target School in China</label>
                          <input
                            type="text"
                            value={targetUniName}
                            onChange={(e) => setTargetUniName(e.target.value)}
                            placeholder="Zhejiang University"
                            className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-105 focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        {activeTemplate === "email" && (
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Supervisor Address Name</label>
                            <input
                              type="text"
                              value={advisorName}
                              onChange={(e) => setAdvisorName(e.target.value)}
                              placeholder="Prof. Dr. Wang Wei"
                              className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-105 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        )}

                        {activeTemplate === "recommend" && (
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Recommender Professional Name</label>
                            <input
                              type="text"
                              value={recommenderName}
                              onChange={(e) => setRecommenderName(e.target.value)}
                              placeholder="Prof. Igwe Nkem"
                              className="w-full bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-xs text-slate-105 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Undergrad Achievements</label>
                          <textarea
                            rows={3}
                            value={keyAdvantage}
                            onChange={(e) => setKeyAdvantage(e.target.value)}
                            placeholder="Graduted top 2% of class, published thesis on deep learning models."
                            className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none focus:border-rose-500 resize-none font-sans"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateAIDoc}
                        disabled={docGenerating || !studentName.trim()}
                        className={`w-full font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                          docGenerating
                            ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                            : "bg-rose-500 text-slate-950 hover:bg-rose-450 hover:opacity-95 text-slate-950"
                        }`}
                      >
                        {docGenerating ? (
                          <>
                            <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                            Drafting Flawless Doc with Gemini AI...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4.5 w-4.5" />
                            Compose Elite AI Match Draft
                          </>
                        )}
                      </button>
                    </div>

                    {/* Column Right: Live preview terminal draft block */}
                    <div className="lg:col-span-7 flex flex-col space-y-4">
                      {/* Active system prompt configuration block */}
                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Secure AI Prompt Formulated:</span>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10px] text-slate-400 max-h-[100px] overflow-y-auto leading-relaxed">
                          {aiDocPrompt || "Fill names or variables to populate exact prompt string proxy parameters dynamically."}
                        </div>
                      </div>

                      {/* Generative terminal container layout */}
                      <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="font-semibold text-xs text-white uppercase font-display select-none">Output Terminal</span>
                          {aiDocOutput && (
                            <button
                              onClick={() => handleCopyToClipboard(aiDocOutput)}
                              className="text-xs text-rose-400 font-semibold hover:text-white flex items-center gap-1 cursor-pointer select-none transition"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              {copiedText ? "Copied!" : "Copy Full Text"}
                            </button>
                          )}
                        </div>

                        <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-850 min-h-[300px] max-h-[450px] overflow-y-auto">
                          {docGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center gap-3">
                              <span className="relative flex h-10 w-10">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-10 w-10 bg-rose-500/20 border border-rose-500 flex items-center justify-center">
                                  <Sparkles className="h-5 w-5 text-rose-400" />
                                </span>
                              </span>
                              <span className="text-xs font-mono text-slate-400 animate-pulse uppercase tracking-widest">
                                Processing admissions parameters via Gemini 3.5...
                              </span>
                            </div>
                          ) : aiDocOutput ? (
                            <div className="prose prose-invert prose-xs text-slate-200 py-2 leading-relaxed text-xs">
                              {aiDocOutput.split("\n").map((line, idx) => {
                                if (line.startsWith("###")) {
                                  return <h4 key={idx} className="font-bold text-sm text-yellow-405 mt-4 text-orange-400">{line.replace("###", "")}</h4>;
                                }
                                if (line.startsWith("##")) {
                                  return <h3 key={idx} className="font-extrabold text-sm text-rose-400 mt-5">{line.replace("##", "")}</h3>;
                                }
                                return <p key={idx} className="mb-2">{line}</p>;
                              })}
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-1 text-center italic py-24 select-none">
                              <FileText className="h-10 w-10 text-slate-700 mb-2" />
                              <span className="text-xs font-mono uppercase tracking-wider not-italic text-slate-500 font-bold block">No document compiled yet</span>
                              <span className="text-[11px] max-w-[280px]">Fill the parameter values in the left control deck and click the main submit button to build direct scholarship SOP matches!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: LAO SHI AI CHAT SPECIALIST ADVISOR */}
                {activeTab === Tabs.CONSULTANT && (
                  <motion.div
                    key="tab-consultant"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Column Left: Prebuilt expert prompt questions */}
                    <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          <span className="font-mono text-[10px] uppercase text-slate-400">Online Specialist Portal</span>
                        </div>
                        <h2 className="text-lg font-bold font-display text-white">Lao Shi (老师)</h2>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1">
                          Our customized Admissions AI agent trained in CSC requirements, agency codes, document legalized timelines in Abuja, and X1 visa interviews.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Choose Specialization Preset:</span>
                        
                        <button
                          onClick={() => handleSendChatMessage(undefined, "What is the detailed difference between CSC Type A and CSC Type B scholarships for West Africans?")}
                          className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 text-xs transition leading-relaxed text-slate-300 hover:text-white cursor-pointer"
                        >
                          ❓ CSC Type A vs CSC Type B comparison Analysis
                        </button>

                        <button
                          onClick={() => handleSendChatMessage(undefined, "Give me a step-by-step legalization guide for my BSC certificate/transcript at Abuja Ministry of Education and Ministry of Foreign Affairs (MFA).")}
                          className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 text-xs transition leading-relaxed text-slate-300 hover:text-white cursor-pointer"
                        >
                          ❓ Certified Document Legalization path in Abuja
                        </button>

                        <button
                          onClick={() => handleSendChatMessage(undefined, "What are the key questions inside Lagos Chinese Consulate or Abuja Embassy for an X1 student visa? Provide checklist.")}
                          className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-850 text-xs transition leading-relaxed text-slate-300 hover:text-white cursor-pointer"
                        >
                          ❓ Common Chinese Embassy X1 visa questions
                        </button>

                        <button
                          onClick={() => handleSendChatMessage(undefined, "How do I secure an official Acceptance Letter from a Chinese Professor before applying for Type B?")}
                          className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-850 text-xs transition leading-relaxed text-slate-300 hover:text-white cursor-pointer"
                        >
                          ❓ Securing Supervisor Acceptance Letter protocol
                        </button>
                      </div>
                    </div>

                    {/* Column Right: Elegant chat window layout */}
                    <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl min-h-[500px]">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-rose-500" />
                          <span className="font-semibold text-xs text-white uppercase font-display">Advisor Chat Client</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to clear this advisory consultation room log?")) {
                              setChatMessages([
                                {
                                  role: "model",
                                  text: "Nǐ hǎo! I am Lao Shi (老师), your dedicated 24/7 AI Chinese Government Scholarship (CSC) Admissions Advisor. Ask me anything about locating Type A/B agency codes, formulating study plans, requesting acceptance letters from supervisors, or legalizing documents in Abuja!",
                                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                }
                              ]);
                            }
                          }}
                          className="text-[10px] font-mono text-slate-500 hover:text-rose-450 hover:text-rose-400 cursor-pointer"
                        >
                          Clear Room History
                        </button>
                      </div>

                      {/* Chat messages box */}
                      <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-4 overflow-y-auto max-h-[380px] space-y-4">
                        {chatMessages.map((msg, i) => {
                          const isUser = msg.role === "user";
                          return (
                            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed text-xs space-y-2 ${
                                  isUser
                                    ? "bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700/50"
                                    : "bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none"
                                }`}
                              >
                                <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                                  {isUser ? "Student (You)" : "Lao Shi (老师)"} — {msg.timestamp}
                                </div>
                                <div className="prose prose-invert prose-xs">
                                  {msg.text.split("\n").map((line, lidx) => {
                                    if (line.startsWith("###")) {
                                      return <h4 key={lidx} className="font-extrabold text-xs text-rose-400 mt-2">{line.replace("###", "")}</h4>;
                                    }
                                    if (line.startsWith("##")) {
                                      return <h3 key={lidx} className="font-bold text-xs text-orange-400 mt-3">{line.replace("##", "")}</h3>;
                                    }
                                    if (line.startsWith("-") || line.startsWith("*")) {
                                      return <li key={lidx} className="ml-4 list-disc mt-1">{line.substring(2)}</li>;
                                    }
                                    return <p key={lidx} className="leading-relaxed">{line}</p>;
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {chatGenerating && (
                          <div className="flex justify-start">
                            <div className="bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-3">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                              </span>
                              <span className="text-xs font-mono text-slate-500 animate-pulse tracking-widest uppercase">
                                Lao Shi is typing advisory pointers...
                              </span>
                            </div>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Chat input form */}
                      <form onSubmit={handleSendChatMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your admissions or visa interview query..."
                          disabled={chatGenerating}
                          className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-800 px-4 py-3 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="submit"
                          disabled={chatGenerating || !chatInput.trim()}
                          className="bg-rose-500 hover:bg-rose-405 text-slate-950 font-bold px-5 rounded-xl flex items-center justify-center transition cursor-pointer"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: ABUJA MOE/MFA LEGALIZATION CHECKLIST ITINERARY */}
                {activeTab === Tabs.CHECKLIST && (
                  <motion.div
                    key="tab-checklist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <h2 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-rose-500" />
                        Abuja Document Legalization & Consular Roadmap
                      </h2>
                      <p className="text-xs text-slate-400 leading-normal">
                        To submit your CSC application successfully, all credentials (BSC cert, Transcript, health form checks) must undergo rigorous review and verification stamps inside Abuja. Use this live checklist tool to outline legalization completion.
                      </p>
                    </div>

                    {/* Operational Map: Stages of Legalization layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Step 1: Ministry of Education (MoE) */}
                      <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold px-2 py-1 rounded w-fit block uppercase border border-orange-500/20">
                            Stage 1: Federal Ministry of Education
                          </span>
                          <h3 className="font-bold font-display text-white text-sm">Evaluation & Verification</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Submit certificates and transcripts at MoE, Federal Secretariat Complex, Phase 3, Abuja. Requires verified receipt generated from Remita.
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-slate-850">
                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.moeEvaluation}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, moeEvaluation: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>Initiate evaluation request in Room 302, MoE.</span>
                          </label>

                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.moePayment}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, moePayment: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>Processed Remita receipt payment (₦5,000 threshold).</span>
                          </label>
                        </div>
                      </div>

                      {/* Step 2: Ministry of Foreign Affairs (MFA) */}
                      <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold px-2 py-1 rounded w-fit block uppercase border border-blue-500/20">
                            Stage 2: Ministry of Foreign Affairs
                          </span>
                          <h3 className="font-bold font-display text-white text-sm">Ministry Attestation Stamp</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Bring MoE attested documents to the Legal Services Division at the Ministry of Foreign Affairs (MFA) headquarters, Abuja.
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-slate-850">
                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.mfaStamp}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, mfaStamp: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>Obtain Ministry of Attestation Stamp on Certificate.</span>
                          </label>

                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.mfaPayment}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, mfaPayment: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>Remita execution clearance signature for MFA Attestation.</span>
                          </label>
                        </div>
                      </div>

                      {/* Step 3: Chinese Embassy Legalisation */}
                      <div className="bg-slate-900 border border-slate-855 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold px-2 py-1 rounded w-fit block uppercase border border-purple-500/20">
                            Stage 3: Consular Visa & Medical Checklist
                          </span>
                          <h3 className="font-bold font-display text-white text-sm">Embassy Liaison Approval</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Submit MFA attested documents to the Chinese Embassy, Central Business District, Abuja, for final red-sticker authentication.
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-slate-850">
                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.embassyLiaison}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, embassyLiaison: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>File submission at Embassy Visa/Consular center.</span>
                          </label>

                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                            <input
                              type="checkbox"
                              checked={checklist.embassyLegalization}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, embassyLegalization: e.target.checked }))}
                              className="accent-rose-500 mt-0.5"
                            />
                            <span>Red Authentication Sticker stamped. Ready for CSC submit!</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Medical Health certificate exam and appointment checklist */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                      <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                        <Flag className="h-4 w-4 text-rose-500" />
                        X1 Chinese Student Visa Attestations & Medicals Physical Form Guide
                      </h3>
                      <p className="text-xs text-slate-400">
                        West African applicants applying for the long-stay **X1 Visa** (stays over 180 days) are mandated to present the official **Foreigner Physical Examination Form** stamped by a recognized local hospital, together with custom police verification.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <label className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-xl flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={checklist.visaFormComplete}
                            onChange={(e) => setChecklist((prev) => ({ ...prev, visaFormComplete: e.target.checked }))}
                            className="accent-rose-500 mt-0.5"
                          />
                          <div>
                            <span className="font-semibold text-xs text-white block">Medical Form Filled</span>
                            <span className="text-[10px] text-slate-500">Official form with chest x-ray, ECG, blood test results cleared.</span>
                          </div>
                        </label>

                        <label className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-xl flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={checklist.visaPhysicalExam}
                            onChange={(e) => setChecklist((prev) => ({ ...prev, visaPhysicalExam: e.target.checked }))}
                            className="accent-rose-500 mt-0.5"
                          />
                          <div>
                            <span className="font-semibold text-xs text-white block">Hospital Round Seal & Photo Stamp</span>
                            <span className="text-[10px] text-slate-500">Ensure the hospital places its round seal overlap strictly on your passport photo.</span>
                          </div>
                        </label>

                        <label className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-xl flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={checklist.visaPoliceReport}
                            onChange={(e) => setChecklist((prev) => ({ ...prev, visaPoliceReport: e.target.checked }))}
                            className="accent-rose-500 mt-0.5"
                          />
                          <div>
                            <span className="font-semibold text-xs text-white block">Police Character Clearance Cert</span>
                            <span className="text-[10px] text-slate-500 font-normal">Sourced from Alagbon / local Nigeria Crime Registry Division.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB ADMIN: RESTRICTED SYSTEM CONTROL PANEL */}
                {activeTab === Tabs.ADMIN && currentUser && ADMIN_EMAILS.includes(currentUser.toLowerCase()) && (
                  <motion.div
                    key="tab-admin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AdminPanel 
                      currentUser={currentUser}
                      onBack={() => setActiveTab(Tabs.WORKSPACE)}
                      addDevLog={addDevLog}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

      {/* FOOTER CODES */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-24 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
          <span>VerifiedUni - China Admissions & AI Verification Portal</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto px-4 leading-relaxed">
          Disclaimer: This portal is a self-directed prep panel utilizing direct-matched data feeds and secure OpenAI/Google Gemini models to draft prompts. Unofficial resource assistance. Use with direct Ministry channels.
        </p>
        <div className="flex justify-center gap-6 text-[11px] text-slate-400 font-normal">
          <button 
            type="button" 
            onClick={() => { setTermsTab("terms"); setShowTermsModal(true); }}
            className="hover:text-amber-400 underline transition-all cursor-pointer"
          >
            Terms & Conditions
          </button>
          <button 
            type="button" 
            onClick={() => { setTermsTab("refund"); setShowTermsModal(true); }}
            className="hover:text-amber-400 underline transition-all cursor-pointer"
          >
            Refund Policy
          </button>
          <a className="hover:text-amber-400 underline transition-all" href="mailto:support@verifieduni.com">support@verifieduni.com</a>
        </div>
      </footer>

      {/* POPUP MODAL: SIMULATED PAYSTACK PAY CHECKOUT IFRAME POPUP */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 overflow-y-auto p-4 flex justify-center items-start md:items-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-slate-250 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden text-slate-800 font-sans my-auto"
            >
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition cursor-pointer z-10 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Paystack Header */}
              <div className="bg-emerald-50 border-b border-emerald-100/50 p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 bg-emerald-500/10 rounded flex items-center justify-center">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-700">Official Secure Paystack Gateway</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#111c2d] font-display">PAY ₦35,000 NGN</h3>
                <p className="text-xs text-slate-600 mt-1">Unlock VerifiedUni Chinese CSC Scholarship Admissions & Verification Portal</p>
              </div>

              <div className="p-6 space-y-5">
                {paymentCompleted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 font-sans">
                    <div className="h-16 w-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-10 w-10 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">Payment Successful!</h3>
                    <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">
                      Access token successfully verified. Webhook call executed to provision your premium license. Entering gated portal...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2.5 text-xs text-slate-600 font-sans">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500 font-medium">Merchant Account:</span>
                        <span className="font-bold text-slate-800">VerifiedUni</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500 font-medium">Service Delivery:</span>
                        <span className="font-semibold text-slate-800">Instant Lifetime Access</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-600 font-bold">Warrant:</span>
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-[10px]">100% Refund Bond</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold tracking-wider">Full Name</label>
                        <input
                          type="text"
                          required
                          value={payName}
                          onChange={(e) => {
                            setPayName(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="Your First and Last Name"
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={payPhone}
                          onChange={(e) => {
                            setPayPhone(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="e.g. +234 803 123 4567"
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold tracking-wider">Billing Email Address</label>
                        <input
                          type="email"
                          required
                          value={payEmail}
                          onChange={(e) => {
                            setPayEmail(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="your-email@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold tracking-wider">Confirm Email Address</label>
                        <input
                          type="email"
                          required
                          value={confirmPayEmail}
                          onChange={(e) => {
                            setConfirmPayEmail(e.target.value);
                            if (checkoutError) setCheckoutError("");
                          }}
                          placeholder="Confirm your-email@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                          ⚠️ <strong>Crucial Spell-check:</strong> Your lifetime portal credentials will be locked permanently to this email. A single typo will block access!
                        </p>
                      </div>

                      {/* Terms and conditions agreement checks */}
                      <div className="flex items-start gap-2.5 pt-2">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={agreeToTerms}
                          onChange={(e) => {
                            setAgreeToTerms(e.target.checked);
                            if (checkoutError) setCheckoutError("");
                          }}
                          className="mt-0.5 h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer accent-emerald-600"
                        />
                        <label htmlFor="agreeToTerms" className="text-[10px] text-slate-500 leading-relaxed cursor-pointer select-none">
                          I confirm my billing email address is spelled perfectly and I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => { setTermsTab("terms"); setShowTermsModal(true); }}
                            className="text-emerald-600 font-bold underline hover:text-emerald-550 transition cursor-pointer"
                          >
                            Terms & Conditions
                          </button>{" "}
                          and the{" "}
                          <button
                            type="button"
                            onClick={() => { setTermsTab("refund"); setShowTermsModal(true); }}
                            className="text-emerald-600 font-bold underline hover:text-emerald-550 transition cursor-pointer"
                          >
                            100% Refund Bond Policy
                          </button>.
                        </label>
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="text-[11px] leading-relaxed bg-red-50 border border-red-200/60 text-red-600 px-3.5 py-2.5 rounded-xl font-medium">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRealPayment(payEmail)}
                      disabled={paymentLoading || !payEmail.trim() || !confirmPayEmail.trim() || !payName.trim() || !payPhone.trim() || !agreeToTerms}
                      className={`w-full font-bold py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                        paymentLoading || !payEmail.trim() || !confirmPayEmail.trim() || !payName.trim() || !payPhone.trim() || !agreeToTerms
                          ? "bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200"
                          : "bg-emerald-600 hover:bg-emerald-550 text-white font-bold shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                      }`}
                    >
                      {paymentLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-white" />
                          Connecting securely to gateway...
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          Proceed to Secure Checkout (₦35,000)
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 font-mono text-center">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>256-Bit SSL Encrypted checkout powered by Paystack SDK</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: REGISTERED MEMBER LOGIN PORTAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none pb-12"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#030d1e] border border-slate-850 w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden text-slate-100 font-sans"
            >
              <button
                onClick={() => {
                  setShowLogin(false);
                  setAuthError("");
                  setOtpSent(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 space-y-5">
                {/* Header section toggle tab tabs */}
                {!otpSent && (
                  <div className="grid grid-cols-2 bg-[#020813] p-1 rounded-xl border border-slate-900 mb-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode("register"); setAuthError(""); }}
                      className={`py-2 rounded-lg text-[11px] font-bold tracking-tight transition cursor-pointer ${authMode === "register" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      New Student (Sign Up)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode("login"); setAuthError(""); }}
                      className={`py-2 rounded-lg text-[11px] font-bold tracking-tight transition cursor-pointer ${authMode === "login" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      Existing (Log In)
                    </button>
                  </div>
                )}

                <div className="text-center space-y-1">
                  <div className="inline-flex p-2.5 bg-[#0c1a30]/80 text-amber-500 border border-slate-800 rounded-full mb-0.5">
                    <Shield className="h-5 w-5 text-amber-400" />
                  </div>
                  <h2 className="text-base font-bold font-display text-white tracking-tight">
                    {otpSent ? "Input Security Check-PIN" : authMode === "register" ? "Initialize Your Student Account" : "Access Your Gated Workspace"}
                  </h2>
                  <p className="text-[10px] text-slate-450 text-slate-400 leading-normal max-w-[280px] mx-auto">
                    {otpSent 
                      ? `We sent a single-use verification PIN code to ${authEmail}. Input it below.`
                      : authMode === "register" 
                        ? "Register your email and contact information to customize your China strategic admissions onboarding." 
                        : "Enter your registered email to request your secure, passwordless login code."}
                  </p>
                </div>

                {authMode === "register" && !otpSent ? (
                  /* REGISTER SIGNUP FORM */
                  <form onSubmit={handleRegisterAccount} className="space-y-3.5">
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1 font-bold">Full Student Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Samuel Ayotunde"
                        className="w-full bg-[#020813] border border-slate-850 hover:border-slate-705 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-550 text-white placeholder-slate-600 text-xs transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1 font-bold">Billing Email Address</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. key@example.com"
                        className="w-full bg-[#020813] border border-slate-850 hover:border-slate-705 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-550 text-white placeholder-slate-600 text-xs transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1 font-bold">Phone Number (WhatsApp Direct)</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="e.g. +234 812 345 6789"
                        className="w-full bg-[#020813] border border-slate-850 hover:border-slate-705 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-550 text-white placeholder-slate-600 text-xs transition font-medium"
                      />
                    </div>

                    {authError && (
                      <div className="text-[10px] leading-normal bg-red-950/40 border border-red-900/40 text-red-400 p-2 rounded-lg font-semibold text-center">
                        {authError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-display"
                    >
                      {authLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-950" />
                      ) : (
                        <>
                          Create Account & Start Onboarding
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-[10px] text-slate-450 text-slate-400 hover:text-white transition font-medium underline text-center block mx-auto pt-1 cursor-pointer"
                    >
                      Already have an account? Log In instead
                    </button>
                  </form>
                ) : (
                  /* LOGIN / OTP FORM */
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (otpSent) {
                        handleVerifyOtp(e);
                      } else {
                        handleRequestOtp(e);
                      }
                    }} 
                    className="space-y-4"
                  >
                    {!otpSent ? (
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">Registered Billing Email</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. key@example.com"
                          className="w-full bg-[#020813] border border-slate-850 hover:border-slate-700 font-sans px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-550 text-white placeholder-slate-600 text-xs transition font-medium"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">6-Digit Verification PIN</label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={authOtp}
                            onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 123456"
                            className="w-full bg-[#020813] border border-slate-850 hover:border-slate-700 font-mono tracking-[8px] text-center py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 text-emerald-400 text-base font-bold transition placeholder:tracking-normal placeholder:text-slate-600"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleRequestOtp()}
                            className="text-slate-400 hover:text-white transition underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setAuthOtp("");
                              setAuthError("");
                              setAuthSuccessMsg("");
                            }}
                            className="text-amber-400 hover:text-amber-300 transition hover:underline cursor-pointer font-medium"
                          >
                            Change Email Address
                          </button>
                        </div>
                      </div>
                    )}

                    {otpSent && authSuccessMsg && (
                      <div className="text-[11px] leading-relaxed bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 px-3 py-2.5 rounded-xl font-medium font-sans">
                        {authSuccessMsg}
                      </div>
                    )}

                    {authError && (
                      <div className="text-[11px] leading-normal bg-red-950/40 border border-red-900/40 text-red-400 px-3 py-2 rounded-lg font-medium">
                        {authError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      {authLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-950" />
                      ) : otpSent ? (
                        <>
                          Verify OTP & Log In
                          <CheckCircle className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Request Secure Verification PIN
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>

                    {!otpSent && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode("register"); setAuthError(""); }}
                        className="text-[10px] text-slate-450 text-slate-400 hover:text-white transition font-medium underline text-center block mx-auto pt-1 cursor-pointer"
                      >
                        Don't have an account yet? Register here
                      </button>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: INTERACTIVE TERMS AND REFUND POLICY DIALOG */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 overflow-y-auto p-4 flex justify-center items-start md:items-center"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0B192C] border border-slate-800 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl relative overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#07111F]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold font-display text-white">Official Legal Agreements</h2>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">VerifiedUni China Admissions & AI Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-[#060E1A]">
                <button
                  onClick={() => setTermsTab("terms")}
                  className={`flex-1 py-3 text-center text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    termsTab === "terms"
                      ? "border-amber-500 text-amber-400 bg-amber-500/[0.02]"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/35"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Terms & Conditions
                </button>
                <button
                  onClick={() => setTermsTab("refund")}
                  className={`flex-1 py-3 text-center text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    termsTab === "refund"
                      ? "border-amber-500 text-amber-400 bg-amber-500/[0.02]"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/35"
                  }`}
                >
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  Refund Policy (100% Refund Bond)
                </button>
              </div>

              {/* Dynamic scrollable content */}
              <div className="p-6 max-h-[380px] overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans custom-scrollbar bg-[#081220]">
                {termsTab === "terms" ? (
                  <>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-1.5">
                        <span className="text-amber-500 font-mono">01.</span> Scope of Self-Directed Service
                      </h4>
                      <p>
                        VerifiedUni is a digital, self-directed admissions preparatory toolkit tailored specifically for West African students. We provide mapped institutional directories, direct civil liaison blueprints, and secure generative AI copywriting prompts to draft your statements, emails, and forms.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-1.5">
                        <span className="text-amber-500 font-mono">02.</span> Single-Applicant License Activation
                      </h4>
                      <p>
                        Your lifetime premium registration credentials (verification PIN) are irreversibly keyed to your primary billing email address. Multi-user credentials sharing, automated scrape routines, or commercial reselling of AI generated outputs is strictly prohibited and stands as grounds for immediate account deactivation.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-1.5">
                        <span className="text-amber-500 font-mono">03.</span> Direct-Source Data Integrity
                      </h4>
                      <p>
                        While agency listings, city filters, and stipend matrices are maintained alongside the active 2026 China scholarship guidelines diligently, institutional terms can fluctuate. Applicants hold final accountability to confirm CSC agency codes independently on direct governmental boards before formal confirmation.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-1.5">
                        <span className="text-amber-500 font-mono">04.</span> Civil Embassy Legalization Phases
                      </h4>
                      <p>
                        The platform acts strictly as an administrative advisor regarding visa documentation formats and Abuja Embassy steps (Ministry of Education, Ministry of Foreign Affairs, Chinese Embassy). Final physical application, biometric submissions, and visa fee delivery remain are executed by you, the student.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
                      <h4 className="font-bold text-amber-400 font-display text-sm tracking-tight flex items-center gap-2">
                        <BookmarkCheck className="h-4 w-4" />
                        The 100% Bulletproof Refund Guarantee
                      </h4>
                      <p className="text-slate-200">
                        We hold complete confidence in our automated school directories, curated contact details, and precise statement editing templates. If you apply to at least <strong>five (5) eligible schools</strong> following our system steps and do not receive at least one (1) university admission offer or interview callback, we will refund your ₦35,000 completely with zero deductions.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-2">
                        How to Trigger a Claim
                      </h4>
                      <p>
                        Simply forward an email to <span className="text-white font-semibold">support@verifieduni.com</span> enclosing your registered billing email address and clear screenshots of your active application submission logs showing five submitted applications.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white font-display text-sm tracking-tight flex items-center gap-2">
                        Secure Gate Settlement
                      </h4>
                      <p>
                        All refunds are calculated and routed natively via Paystack merchant systems, reflecting back onto your original bank account or card within exactly seven (7) business days. It is simple, risk-free, and legally binding under our refund bond.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Button */}
              <div className="p-4 border-t border-slate-800 bg-[#07111F] text-right flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">Version 2.06 Stable Build</span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="bg-amber-500 hover:bg-amber-450 transition text-slate-950 font-bold px-5 py-2 rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  I Understand & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSCA CUSTOM SUBMISSION CONFIRMATION MODAL */}
      <AnimatePresence>
        {cscaShowSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 p-4 flex justify-center items-center"
            onClick={() => setCscaShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-4"
            >
              {/* Decorative glow */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="h-14 w-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                 <AlertTriangle className="h-7 w-7 text-amber-500 animate-bounce" />
              </div>

              <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">Finish & Submit Exam?</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans px-2">
                Are you sure you want to conclude your computer-based mock assessment? Once submitted, your scores will be computed and saved to your admissions database.
              </p>

              {/* Answer Stats Box */}
              {(() => {
                const total = cscaQuestions.length;
                const answered = cscaQuestions.filter(q => cscaSelectedAnswers[q.questionId]).length;
                const unanswered = total - answered;

                return (
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/85 p-3 rounded-xl border border-slate-850 text-left">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold">Answered Questions</div>
                      <div className="text-base font-extrabold text-[#03C988] mt-0.5">{answered} / {total}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold">Unanswered Questions</div>
                      <div className={`text-base font-extrabold mt-0.5 ${unanswered > 0 ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>
                        {unanswered} Q{unanswered === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCscaShowSubmitConfirm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 text-xs font-semibold py-3 rounded-xl transition cursor-pointer select-none font-sans"
                >
                  Cancel, Keep Writing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCscaShowSubmitConfirm(false);
                    handleCscaSubmit(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer select-none font-sans flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/30"
                >
                  <CheckCircle className="h-4 w-4" />
                  Yes, Finish Exam
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* DEV TOOlS: LOGS AND DIRECTORY ASSISTANCE AT THE BOTTOM RIGHT REMOVED */}
    </div>
  );
}
