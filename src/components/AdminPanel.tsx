import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Shield, CheckCircle, AlertTriangle, Trash2, Plus, Edit2, 
  Database, BookOpen, GraduationCap, TrendingUp, BarChart2, X, Search, 
  DollarSign, ArrowLeft, Mail, Download, Send, RefreshCw, Eye, 
  Clock, Award, Globe, ChevronLeft, ChevronRight, Layers, FileText, Check, Copy
} from "lucide-react";
import { University, CSCAQuestion } from "../types";
import { LanguageInstitute } from "../languageInstitutesData";

interface AdminPanelProps {
  onBack: () => void;
  addDevLog: (msg: string) => void;
  currentUser?: string | null;
}

export function AdminPanel({ onBack, addDevLog, currentUser }: AdminPanelProps) {
  const adminEmail = (currentUser || "igwev2956@gmail.com").trim().toLowerCase();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "users" | "transactions" | "csca_analytics" | "broadcast" | "universities" | "questions" | "institutes" | "system"
  >("users");

  // Data Collections State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [cscaAnalytics, setCscaAnalytics] = useState<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    subjectAverages: { math: number; physics: number; chinese: number };
    recentAttempts: any[];
  }>({
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    subjectAverages: { math: 0, physics: 0, chinese: 0 },
    recentAttempts: []
  });
  const [unisList, setUnisList] = useState<University[]>([]);
  const [questionsList, setQuestionsList] = useState<CSCAQuestion[]>([]);
  const [institutesList, setInstitutesList] = useState<LanguageInstitute[]>([]);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "premium" | "unpaid" | "followup_pending">("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modals & Subview Edit States
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showUniModal, setShowUniModal] = useState(false);
  const [editingUni, setEditingUni] = useState<Partial<University> | null>(null);
  const [showQModal, setShowQModal] = useState(false);
  const [editingQ, setEditingQ] = useState<Partial<CSCAQuestion> | null>(null);
  const [showInstModal, setShowInstModal] = useState(false);
  const [editingInst, setEditingInst] = useState<Partial<LanguageInstitute> | null>(null);
  const [showReseedModal, setShowReseedModal] = useState(false);

  // Quick Grant Input
  const [manualGrantEmail, setManualGrantEmail] = useState("");

  // Broadcast Studio State
  const [broadcastForm, setBroadcastForm] = useState({
    audience: "all" as "all" | "premium" | "leads" | "custom",
    customEmail: "",
    subject: "📢 2026 Chinese Government CSC Scholarship Admissions Cohort Update",
    messageBody: `Dear Scholar,\n\nThis is an official administrative announcement from the VerifiedUni Consular Admissions Desk regarding the 2026 China Scholarship Council intake.\n\nKey Actionable Reminders:\n• Ensure all WAEC / Degree credentials have been notarized at the Ministry of Foreign Affairs (MFA) in Abuja.\n• CSCA Computer-Based mock testing is now active for all Science, Engineering & Trade candidates.\n• Complete your verification to unlock direct supervisory pre-admissions letters.\n\nOur advisory team remains on standby to guide your legalizations and visa processing.`,
    actionLabel: "Access Scholarship Portal",
    actionUrl: "https://ais-pre-xrgu47rdpe4dysd7ps7azn-235027986297.europe-west1.run.app",
    previewMode: false
  });

  const getAdminHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-email": adminEmail
  });

  // Load all databases
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    addDevLog(`Admin Panel: Authenticating ${adminEmail} & fetching databases...`);
    try {
      // 1. Fetch Users
      const uRes = await fetch("/api/admin/users", { headers: getAdminHeaders() });
      if (uRes.status === 403) {
        setErrorMsg("Access Denied: You do not have administrator permissions.");
        return;
      }
      const uData = await uRes.json();
      if (uRes.ok && uData.users) {
        setUsersList(uData.users);
      }

      // 2. Fetch Transactions Ledger
      const txRes = await fetch("/api/admin/transactions", { headers: getAdminHeaders() });
      const txData = await txRes.json();
      if (txRes.ok && txData.transactions) {
        setTransactionsList(txData.transactions);
      }

      // 3. Fetch CSCA Analytics
      const cscaRes = await fetch("/api/admin/csca/analytics", { headers: getAdminHeaders() });
      const cscaData = await cscaRes.json();
      if (cscaRes.ok && cscaData.totalAttempts !== undefined) {
        setCscaAnalytics(cscaData);
      }

      // 4. Fetch Universities
      const uniRes = await fetch("/api/universities");
      const uniData = await uniRes.json();
      if (uniRes.ok && uniData.universities) {
        setUnisList(uniData.universities);
      }

      // 5. Fetch CSCA Questions
      const qRes = await fetch("/api/csca/questions");
      const qData = await qRes.json();
      if (qRes.ok && qData.questions) {
        setQuestionsList(qData.questions);
      }

      // 6. Fetch Language Schools
      const instRes = await fetch("/api/language-institutes");
      const instData = await instRes.json();
      if (instRes.ok && instData.institutes) {
        setInstitutesList(instData.institutes);
      }

      addDevLog("Admin Panel: All collections synchronized successfully.");
    } catch (err: any) {
      console.error(err);
      addDevLog(`Admin Panel Error: ${err.message}`);
      setErrorMsg(`Failed loading administrative databases: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute live financial & lead metrics
  const metrics = useMemo(() => {
    const totalReg = usersList.length;
    const totalPremium = usersList.filter(u => u.premium).length;
    const conversionRate = totalReg > 0 ? ((totalPremium / totalReg) * 100).toFixed(1) : "0";
    
    // Calculate total verified revenue
    let totalRevenue = 0;
    transactionsList.forEach(t => {
      if (t.status === "success" && Number(t.amount) > 0) {
        totalRevenue += Number(t.amount);
      }
    });

    // If transactions list is smaller, fallback to calculating paid users
    if (totalRevenue === 0 && totalPremium > 0) {
      totalRevenue = usersList.filter(u => u.premium && !u.paymentReference?.startsWith("ADMIN-GRANTED-WAIVER")).length * 35000;
    }

    const pendingFollowups = usersList.filter(u => !u.premium && u.onboarding && !u.followupSent).length;

    return {
      totalReg,
      totalPremium,
      conversionRate,
      totalRevenue,
      pendingFollowups
    };
  }, [usersList, transactionsList]);

  // Export CSV Helper
  const handleExportCSV = (type: "users" | "transactions" | "csca") => {
    let csvContent = "";
    let filename = `verifieduni_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === "users") {
      const headers = ["ID/Email", "Full Name", "Phone", "Degree Target", "GPA/WAEC", "HSK Level", "CSC Type", "Premium Status", "Payment Ref", "Followup Sent", "Registered At"];
      const rows = usersList.map(u => [
        `"${u.email || u.id || ""}"`,
        `"${(u.fullName || "").replace(/"/g, '""')}"`,
        `"${u.phoneNumber || ""}"`,
        `"${u.onboarding?.degree || "N/A"}"`,
        `"${u.onboarding?.gpa || u.onboarding?.waecGrades || "N/A"}"`,
        `"${u.onboarding?.hskLevel || "None"}"`,
        `"${u.onboarding?.cscType || "N/A"}"`,
        u.premium ? "PREMIUM" : "UNPAID_LEAD",
        `"${u.paymentReference || ""}"`,
        u.followupSent ? "YES" : "NO",
        `"${u.createdAt || ""}"`
      ]);
      csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    } else if (type === "transactions") {
      const headers = ["Reference", "Email", "Full Name", "Phone", "Amount (NGN)", "Channel", "Status", "Paid At", "Verified By"];
      const rows = transactionsList.map(t => [
        `"${t.reference || ""}"`,
        `"${t.email || ""}"`,
        `"${(t.fullName || "").replace(/"/g, '""')}"`,
        `"${t.phoneNumber || ""}"`,
        t.amount || 0,
        `"${t.channel || "card"}"`,
        `"${t.status || "success"}"`,
        `"${t.paidAt || ""}"`,
        `"${t.verifiedBy || "paystack"}"`
      ]);
      csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    } else if (type === "csca") {
      const headers = ["Attempt ID", "Student Email", "Full Name", "Total Score", "Max Questions", "Percentage (%)", "Math Score", "Physics Score", "Chinese Score", "Time Elapsed (s)", "Timestamp"];
      const rows = (cscaAnalytics.recentAttempts || []).map(a => [
        `"${a.attemptId || ""}"`,
        `"${a.email || ""}"`,
        `"${(a.fullName || "").replace(/"/g, '""')}"`,
        a.totalScore || 0,
        a.totalQuestions || 10,
        a.percentage || 0,
        a.subjectBreakdown?.mathematics?.score ?? "N/A",
        a.subjectBreakdown?.physicsChemistry?.score ?? "N/A",
        a.subjectBreakdown?.academicChinese?.score ?? "N/A",
        a.elapsedSeconds || 0,
        `"${a.submittedAt || ""}"`
      ]);
      csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addDevLog(`Admin: Exported ${filename} successfully.`);
  };

  // Toggle User Premium Status
  const handleTogglePremium = async (email: string) => {
    if (!confirm(`Are you sure you want to toggle licensing subscription status for: ${email}?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/toggle-premium", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Access level successfully toggled for ${email}!`);
        addDevLog(`Admin: Subscription toggled for ${email} -> Premium: ${data.premium}`);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Failed toggling subscription.");
      }
    } catch (e: any) {
      setErrorMsg(`Toggle error: ${e.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Instant Grant
  const handleManualGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = manualGrantEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg("Please enter a valid student email.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/toggle-premium", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Premium license successfully GRANTED to ${email}!`);
        addDevLog(`Admin: Manually granted license to ${email}`);
        setManualGrantEmail("");
        await loadData();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Grant failed.");
      }
    } catch (err: any) {
      setErrorMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Student Profile Updates
  const handleSaveStudentProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.email) return;

    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/user/update", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(editingUser)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Candidate profile updated for ${editingUser.email}!`);
        addDevLog(`Admin: Updated profile details for ${editingUser.email}`);
        setEditingUser(null);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Failed updating student profile.");
      }
    } catch (err: any) {
      setErrorMsg(`Update error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (email: string) => {
    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete candidate account: ${email}? This cannot be undone.`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Purged ${email} from authentication directory.`);
        addDevLog(`Admin: Purged student credentials for ${email}`);
        setUsersList(prev => prev.filter(u => (u.email || u.id) !== email));
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Delete failed.");
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Individual Student Strategic Follow-up Email
  const handleSendFollowUp = async (email: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/send-followup", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Dispatched pain-points follow-up email to ${email}!`);
        addDevLog(`Admin: Sent strategic follow-up email to ${email}`);
        setUsersList(prev => prev.map(u => (u.email || u.id) === email ? { ...u, followupSent: true, followupSentAt: data.user.followupSentAt } : u));
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Follow-up email request rejected.");
      }
    } catch (e: any) {
      setErrorMsg(`Follow-up error: ${e.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // One-Click Batch Follow-up Dispatcher
  const handleBatchFollowUp = async () => {
    if (!confirm(`Are you sure you want to dispatch strategic follow-up emails to ALL ${metrics.pendingFollowups} pending lead(s)?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/send-batch-followup", {
        method: "POST",
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(data.message || `Dispatched follow-ups to ${data.countDispatched} applicant(s)!`);
        addDevLog(`Admin: Executed batch follow-up dispatch (${data.countDispatched} sent)`);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(data.error || "Batch follow-up failed.");
      }
    } catch (err: any) {
      setErrorMsg(`Batch error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Dispatch Broadcast Campaign
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.subject.trim() || !broadcastForm.messageBody.trim()) {
      setErrorMsg("Subject and Message Body cannot be empty.");
      return;
    }
    if (broadcastForm.audience === "custom" && !broadcastForm.customEmail.trim()) {
      setErrorMsg("Please provide a custom recipient email.");
      return;
    }

    if (!confirm(`Confirm dispatching announcement to [${broadcastForm.audience.toUpperCase()}] cohort?`)) return;

    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/broadcast-email", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(broadcastForm)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(data.message || "Broadcast successfully sent!");
        addDevLog(`Admin: Dispatched cohort broadcast -> ${data.dispatchedCount} recipients`);
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(data.error || "Broadcast delivery failed.");
      }
    } catch (err: any) {
      setErrorMsg(`Broadcast error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Full Database Re-Seed
  const handleSystemReseed = async () => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/system/reseed", {
        method: "POST",
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(data.message || "Database synchronized successfully!");
        addDevLog("Admin: Full Firestore collections synchronized.");
        setShowReseedModal(false);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 6000);
      } else {
        setErrorMsg(data.error || "Re-seed failed.");
      }
    } catch (err: any) {
      setErrorMsg(`Re-seed error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Save / Delete University
  const handleSaveUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni || !editingUni.id || !editingUni.name) {
      setErrorMsg("University ID and Name are required.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/university/save", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ university: editingUni })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`University '${editingUni.name}' saved!`);
        setShowUniModal(false);
        setEditingUni(null);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Save university failed.");
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUniversity = async (id: string, name: string) => {
    if (!confirm(`Delete university: ${name}?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/university/delete", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setSuccessMsg(`Deleted ${name}`);
        setUnisList(prev => prev.filter(u => u.id !== id));
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Save / Delete Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQ || !editingQ.questionId || !editingQ.questionText) {
      setErrorMsg("Question ID and Text are required.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/question/save", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ question: editingQ })
      });
      if (res.ok) {
        setSuccessMsg(`Question ${editingQ.questionId} saved!`);
        setShowQModal(false);
        setEditingQ(null);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm(`Delete question ${questionId}?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/question/delete", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ questionId })
      });
      if (res.ok) {
        setSuccessMsg(`Deleted question ${questionId}`);
        setQuestionsList(prev => prev.filter(q => q.questionId !== questionId));
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Save / Delete Institute
  const handleSaveInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst || !editingInst.id || !editingInst.name) {
      setErrorMsg("Institute ID and Name are required.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/language-institute/save", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ institute: editingInst })
      });
      if (res.ok) {
        setSuccessMsg(`Language school '${editingInst.name}' saved!`);
        setShowInstModal(false);
        setEditingInst(null);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstitute = async (id: string, name: string) => {
    if (!confirm(`Delete language school: ${name}?`)) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/language-institute/delete", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setSuccessMsg(`Deleted ${name}`);
        setInstitutesList(prev => prev.filter(i => i.id !== id));
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        (u.email || "").toLowerCase().includes(q) ||
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.phoneNumber || "").toLowerCase().includes(q) ||
        (u.paymentReference || "").toLowerCase().includes(q) ||
        (u.onboarding?.degree || "").toLowerCase().includes(q) ||
        (u.onboarding?.fieldOfStudy || "").toLowerCase().includes(q);

      let matchFilter = true;
      if (userStatusFilter === "premium") matchFilter = !!u.premium;
      else if (userStatusFilter === "unpaid") matchFilter = !u.premium;
      else if (userStatusFilter === "followup_pending") matchFilter = !u.premium && !!u.onboarding && !u.followupSent;

      return matchSearch && matchFilter;
    });
  }, [usersList, searchQuery, userStatusFilter]);

  // Paginated Users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalUserPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactionsList.filter(t => {
      const q = searchQuery.toLowerCase();
      return (
        (t.reference || "").toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.fullName || "").toLowerCase().includes(q) ||
        (t.channel || "").toLowerCase().includes(q)
      );
    });
  }, [transactionsList, searchQuery]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questionsList.filter(q => {
      const matchSearch = (q.questionText || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.questionId || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = selectedSubjectFilter === "all" || q.subject === selectedSubjectFilter;
      return matchSearch && matchSubject;
    });
  }, [questionsList, searchQuery, selectedSubjectFilter]);

  // Filtered Universities
  const filteredUniversities = useMemo(() => {
    return unisList.filter(u => {
      const q = searchQuery.toLowerCase();
      const matchSearch = (u.name || "").toLowerCase().includes(q) ||
                          (u.city || "").toLowerCase().includes(q) ||
                          (u.agencyCode || "").toLowerCase().includes(q);
      const matchProvince = selectedProvinceFilter === "all" || (u.city || "").toLowerCase().includes(selectedProvinceFilter.toLowerCase());
      return matchSearch && matchProvince;
    });
  }, [unisList, searchQuery, selectedProvinceFilter]);

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* Top Banner & Control Deck Header */}
      <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="h-3 w-3" /> Consular Root Admin Control
              </span>
              <span className="bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-[10px] px-2.5 py-0.5 rounded-full">
                Caller: {adminEmail}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
              VerifiedUni Operations Command Center
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of Nigerian-Chinese student registrations, Paystack financial reconciliation, 2026 CSCA CBT mock performance, automated educational follow-ups, and cloud database synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleExportCSV(activeAdminTab === "transactions" ? "transactions" : activeAdminTab === "csca_analytics" ? "csca" : "users")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Export filtered records to RFC 4180 CSV"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" /> Export CSV
            </button>

            <button
              onClick={() => setShowReseedModal(true)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Re-seed Firestore databases"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-Sync DB
            </button>

            <button
              onClick={onBack}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Portal
            </button>
          </div>
        </div>

        {/* Global Notifications & Alerts */}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg("")}><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg("")}><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        {/* KPI Financial & Lead Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-5">
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Total Candidates</span>
              <Users className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-extrabold text-white font-mono">{metrics.totalReg}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Registered Student Profiles</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Premium Verified</span>
              <Award className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-[#03C988] font-mono">{metrics.totalPremium}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{metrics.conversionRate}% Conversion Rate</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Total Settled</span>
              <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-mono">₦{metrics.totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Verified Paystack Inflow</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Pending Follow-ups</span>
              <Mail className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-extrabold text-purple-400 font-mono">{metrics.pendingFollowups}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Unpaid Onboarded Leads</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">CSCA Mock Submissions</span>
              <BookOpen className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-extrabold text-rose-400 font-mono">{cscaAnalytics.totalAttempts}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{cscaAnalytics.passRate}% Cohort Pass Rate</div>
          </div>
        </div>
      </div>

      {/* Modern Horizontal Navigation Bar */}
      <div className="bg-[#0B192C] border border-slate-800 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto select-none">
        <button
          onClick={() => { setActiveAdminTab("users"); setCurrentPage(1); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "users" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Students Registry ({usersList.length})
        </button>

        <button
          onClick={() => { setActiveAdminTab("transactions"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "transactions" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Financial Ledger ({transactionsList.length})
        </button>

        <button
          onClick={() => { setActiveAdminTab("csca_analytics"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "csca_analytics" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          CSCA Exam Center ({cscaAnalytics.totalAttempts})
        </button>

        <button
          onClick={() => { setActiveAdminTab("broadcast"); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "broadcast" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          Broadcast Studio
        </button>

        <button
          onClick={() => { setActiveAdminTab("universities"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "universities" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          CSC Universities ({unisList.length})
        </button>

        <button
          onClick={() => { setActiveAdminTab("questions"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "questions" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          CSCA Question Bank ({questionsList.length})
        </button>

        <button
          onClick={() => { setActiveAdminTab("institutes"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "institutes" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Language Schools ({institutesList.length})
        </button>

        <button
          onClick={() => { setActiveAdminTab("system"); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeAdminTab === "system" 
              ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          System Health
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS & ADMISSIONS REGISTRY */}
      {/* ========================================================================= */}
      {activeAdminTab === "users" && (
        <div className="space-y-4">
          {/* Quick Filter & Global Action Bar */}
          <div className="bg-[#0B192C] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students by name, email, phone, target degree, field..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={userStatusFilter}
                onChange={(e: any) => { setUserStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Candidates ({usersList.length})</option>
                <option value="premium">Verified Premium ({usersList.filter(u => u.premium).length})</option>
                <option value="unpaid">Unpaid Leads ({usersList.filter(u => !u.premium).length})</option>
                <option value="followup_pending">Pending Follow-up ({metrics.pendingFollowups})</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {metrics.pendingFollowups > 0 && (
                <button
                  onClick={handleBatchFollowUp}
                  disabled={actionLoading}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  title="Dispatches pain-points strategic follow-up emails to all unpaid candidates who completed questionnaires"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Dispatch Batch Follow-ups ({metrics.pendingFollowups})
                </button>
              )}

              {/* Instant Manual Grant Form */}
              <form onSubmit={handleManualGrantAccess} className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="Grant email..."
                  value={manualGrantEmail}
                  onChange={(e) => setManualGrantEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 w-36 sm:w-44"
                />
                <button
                  type="submit"
                  disabled={actionLoading || !manualGrantEmail.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-40"
                >
                  + Grant
                </button>
              </form>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-[#0B192C] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate Profile</th>
                    <th className="py-3 px-4">Phone / Contact</th>
                    <th className="py-3 px-4">Academic Background</th>
                    <th className="py-3 px-4">Subscription State</th>
                    <th className="py-3 px-4">Email Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                        No student candidate profiles match the current filter parameters.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u, uIdx) => {
                      const isPrem = !!u.premium;
                      const ob = u.onboarding;
                      const uniqueKey = u.email ? `candidate-${u.email}-${uIdx}` : `candidate-${u.id || uIdx}-${uIdx}`;
                      return (
                        <tr key={uniqueKey} className="hover:bg-slate-900/50 transition">
                          {/* Candidate Profile */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{u.fullName || "Applicant"}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              {u.email || u.id}
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                              Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                            </div>
                          </td>

                          {/* Phone / Contact */}
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {u.phoneNumber || <span className="text-slate-600">Not provided</span>}
                          </td>

                          {/* Academic Background */}
                          <td className="py-3.5 px-4">
                            {ob ? (
                              <div className="space-y-0.5">
                                <div className="text-slate-200 font-medium">
                                  {ob.degree === "Bsc" ? "BSc (Undergrad)" : ob.degree === "Masters" ? "Master's Degree" : ob.degree === "PhD" ? "Doctorate (PhD)" : "Mandarin Study"}
                                  {ob.fieldOfStudy ? ` • ${ob.fieldOfStudy}` : ""}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  GPA: <span className="font-mono text-amber-400">{ob.gpa || ob.waecGrades || "N/A"}</span> • HSK: <span className="font-mono text-emerald-400">{ob.hskLevel || "None"}</span>
                                </div>
                                <div className="text-[9px] text-slate-500 font-mono">
                                  Target: {ob.cscType || "General CSC / Provincial"}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Onboarding pending</span>
                            )}
                          </td>

                          {/* Subscription State */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isPrem ? "bg-[#03C988]/10 text-[#03C988] border border-[#03C988]/30" : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}>
                                {isPrem ? "✔ Verified" : "Unpaid Lead"}
                              </span>
                              
                              <button
                                onClick={() => handleTogglePremium(u.email || u.id)}
                                disabled={actionLoading}
                                className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer ml-1"
                                title="Toggle subscription waiver"
                              >
                                {isPrem ? "Revoke" : "Waiver"}
                              </button>
                            </div>
                            {u.paymentReference && (
                              <div className="text-[9px] font-mono text-slate-500 mt-1 truncate max-w-[140px]" title={u.paymentReference}>
                                Ref: {u.paymentReference}
                              </div>
                            )}
                          </td>

                          {/* Email Status */}
                          <td className="py-3.5 px-4">
                            {u.followupSent ? (
                              <div>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                                  Follow-up Sent
                                </span>
                                {u.followupSentAt && (
                                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                                    {new Date(u.followupSentAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ) : ob && !isPrem ? (
                              <button
                                onClick={() => handleSendFollowUp(u.email || u.id)}
                                disabled={actionLoading}
                                className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-[10px] font-semibold px-2 py-1 rounded transition cursor-pointer"
                              >
                                Send Strategic Email
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingUser({ ...u })}
                                className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                                title="Edit Candidate Details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.email || u.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                                title="Purge Candidate from Database"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Showing {filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} students</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1 ml-2 focus:outline-none"
                >
                  <option value={10}>10 / page</option>
                  <option value={15}>15 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-30 rounded border border-slate-800 text-slate-300 transition"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 font-mono text-xs">
                  Page {currentPage} of {totalUserPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalUserPages))}
                  disabled={currentPage >= totalUserPages}
                  className="p-1.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-30 rounded border border-slate-800 text-slate-300 transition"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FINANCIAL & PAYSTACK LEDGER */}
      {/* ========================================================================= */}
      {activeAdminTab === "transactions" && (
        <div className="space-y-4">
          <div className="bg-[#0B192C] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions by reference, student email, customer name, channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => handleExportCSV("transactions")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" /> Export Financial Ledger CSV
            </button>
          </div>

          <div className="bg-[#0B192C] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Reference Key</th>
                    <th className="py-3 px-4">Customer / Scholar</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway Channel</th>
                    <th className="py-3 px-4">Settlement Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-sans italic">
                        No financial transaction ledger records found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t, tIdx) => (
                      <tr key={t.reference ? `tx-${t.reference}-${tIdx}` : `tx-${tIdx}`} className="hover:bg-slate-900/50 transition">
                        <td className="py-3.5 px-4 font-bold text-amber-400">
                          {t.reference}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-semibold text-white">{t.fullName || "Candidate"}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{t.email}</div>
                          {t.phoneNumber && <div className="text-[10px] text-slate-500">{t.phoneNumber}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          ₦{Number(t.amount || 0).toLocaleString()} {t.currency || "NGN"}
                        </td>
                        <td className="py-3.5 px-4 uppercase text-[11px] text-slate-300">
                          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            {t.channel || "paystack"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] uppercase font-bold">
                            ✔ {t.status || "success"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {t.paidAt ? new Date(t.paidAt).toLocaleString() : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CSCA CBT EXAM & COHORT PERFORMANCE ANALYTICS */}
      {/* ========================================================================= */}
      {activeAdminTab === "csca_analytics" && (
        <div className="space-y-6">
          {/* Performance Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl">
              <div className="text-slate-400 text-xs uppercase font-mono mb-1">Total Mock Tests Launched</div>
              <div className="text-3xl font-extrabold text-white font-mono">{cscaAnalytics.totalAttempts}</div>
              <div className="text-[11px] text-slate-500 mt-1">Simulated CSCA candidate tests</div>
            </div>

            <div className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl">
              <div className="text-slate-400 text-xs uppercase font-mono mb-1">Cohort Mean Score</div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">{cscaAnalytics.averageScore}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Across all science & math subjects</div>
            </div>

            <div className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl">
              <div className="text-slate-400 text-xs uppercase font-mono mb-1">Consular Pass Rate (≥70%)</div>
              <div className="text-3xl font-extrabold text-[#03C988] font-mono">{cscaAnalytics.passRate}%</div>
              <div className="text-[11px] text-slate-500 mt-1">High-probability CSC candidates</div>
            </div>

            <div className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl">
              <div className="text-slate-400 text-xs uppercase font-mono mb-1">Subject Proficiency</div>
              <div className="space-y-1.5 mt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mathematics:</span>
                  <span className="font-mono font-bold text-amber-400">{cscaAnalytics.subjectAverages.math}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Physics & Chem:</span>
                  <span className="font-mono font-bold text-blue-400">{cscaAnalytics.subjectAverages.physics}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Academic Chinese:</span>
                  <span className="font-mono font-bold text-rose-400">{cscaAnalytics.subjectAverages.chinese}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Candidate Submissions Log */}
          <div className="bg-[#0B192C] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  Recent Candidate CSCA Mock Examination Logs
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time attempt scores submitted across Nigeria</p>
              </div>
              <button
                onClick={() => handleExportCSV("csca")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1 border border-slate-700 cursor-pointer"
              >
                <Download className="h-3 w-3 text-amber-400" /> Export Attempts CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Attempt ID</th>
                    <th className="py-3 px-4">Candidate Scholar</th>
                    <th className="py-3 px-4">Score Metric</th>
                    <th className="py-3 px-4">Time Duration</th>
                    <th className="py-3 px-4">Subject Breakdown</th>
                    <th className="py-3 px-4">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(cscaAnalytics.recentAttempts || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-sans italic">
                        No CSCA examination attempts recorded in the database yet.
                      </td>
                    </tr>
                  ) : (
                    (cscaAnalytics.recentAttempts || []).map((att, attIdx) => {
                      const isPass = (att.percentage || 0) >= 70;
                      const uniqueKey = att.attemptId ? `csca-att-${att.attemptId}-${attIdx}` : `csca-att-${attIdx}`;
                      return (
                        <tr key={uniqueKey} className="hover:bg-slate-900/50 transition">
                          <td className="py-3.5 px-4 font-bold text-amber-400">{att.attemptId}</td>
                          <td className="py-3.5 px-4 font-sans">
                            <div className="font-semibold text-white">{att.fullName || "Candidate"}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{att.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{att.totalScore} / {att.totalQuestions}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPass ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              }`}>
                                {att.percentage}% ({isPass ? "PASS" : "REVISE"})
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            {att.elapsedSeconds ? `${Math.floor(att.elapsedSeconds / 60)}m ${att.elapsedSeconds % 60}s` : "N/A"}
                            {att.isInvalidOvertime && (
                              <span className="text-[10px] text-rose-400 ml-1.5">(Overtime)</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] font-sans">
                            {att.subjectBreakdown?.mathematics && (
                              <span className="text-slate-300">
                                Math: <span className="font-mono text-amber-400">{att.subjectBreakdown.mathematics.score}/{att.subjectBreakdown.mathematics.total}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {att.submittedAt ? new Date(att.submittedAt).toLocaleString() : "N/A"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BROADCAST ANNOUNCEMENT STUDIO */}
      {/* ========================================================================= */}
      {activeAdminTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Broadcast Editor Form */}
          <div className="lg:col-span-6 bg-[#0B192C] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                📢 Email Dispatch Studio
              </span>
              <h2 className="text-lg font-bold font-display text-white mt-1">
                Cohort Broadcast Announcements
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send professional, branded administrative notices, CSC deadlines, and reminders to your candidate network.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Recipient Segment</label>
                <select
                  value={broadcastForm.audience}
                  onChange={(e: any) => setBroadcastForm(prev => ({ ...prev, audience: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="all">Entire Candidate Database ({usersList.length} total)</option>
                  <option value="premium">Verified Premium Subscribers Only ({usersList.filter(u => u.premium).length})</option>
                  <option value="leads">Unpaid Candidate Leads Only ({usersList.filter(u => !u.premium).length})</option>
                  <option value="custom">Single Custom Candidate Email</option>
                </select>
              </div>

              {broadcastForm.audience === "custom" && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Recipient Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. applicant@gmail.com"
                    value={broadcastForm.customEmail}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, customEmail: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  placeholder="Subject line..."
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Message Body Content</label>
                <textarea
                  rows={8}
                  placeholder="Write announcement body here..."
                  value={broadcastForm.messageBody}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, messageBody: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Action Button Text</label>
                  <input
                    type="text"
                    value={broadcastForm.actionLabel}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, actionLabel: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Portal URL</label>
                  <input
                    type="text"
                    value={broadcastForm.actionUrl}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, actionUrl: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {actionLoading ? "Dispatching Broadcast..." : "Send Cohort Broadcast Announcement"}
              </button>
            </form>
          </div>

          {/* Right Column: Live HTML Preview */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <span>Live Email Visual Preview</span>
              <span className="text-[10px] text-amber-400">Standard Resend Responsive HTML</span>
            </div>

            <div className="bg-[#020813] border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="text-center mb-5">
                <div className="text-lg font-black text-white">VerifiedUni</div>
                <div className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest mt-0.5">
                  Official Academic & Consular Dispatch
                </div>
              </div>

              <div className="bg-[#0b192c] border border-slate-800 p-6 rounded-xl space-y-3">
                <div className="text-center">
                  <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase">
                    📢 Official Cohort Announcement
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white pt-2">
                  Hello Scholar,
                </h3>

                <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  {broadcastForm.messageBody}
                </div>

                <div className="text-center pt-4 pb-2">
                  <a
                    href={broadcastForm.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg uppercase tracking-wider shadow-md"
                  >
                    {broadcastForm.actionLabel}
                  </a>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 mt-4 leading-normal">
                © 2026 VerifiedUni Administrative Desk. All Rights Reserved.<br />
                Chinese Government CSC & Provincial Scholarship Admissions Suite.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CSC UNIVERSITIES CATALOG */}
      {/* ========================================================================= */}
      {activeAdminTab === "universities" && (
        <div className="space-y-4">
          <div className="bg-[#0B192C] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search universities by name, province, city, agency code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingUni({
                  id: "uni-" + Date.now(),
                  name: "",
                  agencyCode: "",
                  city: "",
                  ranking: unisList.length + 1,
                  cscTypeA: true,
                  cscTypeB: true,
                  provincial: true,
                  silkRoad: true,
                  stipendUndergrad: 2500,
                  tuitionFeeUndergrad: 0,
                  accommodationFee: 0,
                  englishMajors: [],
                  applicationPortal: "",
                  cscaRequirements: ""
                });
                setShowUniModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Add CSC University
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUniversities.map((uni) => (
              <div key={uni.id} className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      Agency Code: {uni.agencyCode || "N/A"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Rank #{uni.ranking || "—"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                    {uni.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-sans">
                    📍 {uni.city || "China"}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {uni.cscTypeB && <span className="bg-blue-500/10 text-blue-300 text-[9px] px-2 py-0.5 rounded font-mono">CSC Type B</span>}
                    {uni.silkRoad && <span className="bg-emerald-500/10 text-emerald-300 text-[9px] px-2 py-0.5 rounded font-mono">Silk Road</span>}
                    {uni.provincial && <span className="bg-purple-500/10 text-purple-300 text-[9px] px-2 py-0.5 rounded font-mono">Provincial</span>}
                  </div>

                  {uni.englishMajors && uni.englishMajors.length > 0 && (
                    <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-850">
                      <span className="text-slate-500 font-mono text-[9px] uppercase block">English Programs:</span>
                      <span className="line-clamp-2">{uni.englishMajors.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => { setEditingUni({ ...uni }); setShowUniModal(true); }}
                    className="p-1.5 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2.5 transition"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUniversity(uni.id, uni.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CSCA CBT QUESTION BANK */}
      {/* ========================================================================= */}
      {activeAdminTab === "questions" && (
        <div className="space-y-4">
          <div className="bg-[#0B192C] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search question bank text, explanation formulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Disciplines ({questionsList.length})</option>
                <option value="math">Mathematics ({questionsList.filter(q => q.subject === "math").length})</option>
                <option value="physics">Physics ({questionsList.filter(q => q.subject === "physics").length})</option>
                <option value="chemistry">Chemistry ({questionsList.filter(q => q.subject === "chemistry").length})</option>
                <option value="professional_chinese">Professional Chinese ({questionsList.filter(q => q.subject === "professional_chinese").length})</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingQ({
                  questionId: "CSCA-MOCK-" + (questionsList.length + 1).toString().padStart(4, "0"),
                  subject: selectedSubjectFilter !== "all" ? selectedSubjectFilter : "math",
                  questionText: "",
                  options: ["", "", "", ""],
                  correctOption: "A",
                  explanation: ""
                });
                setShowQModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Add CSCA Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div key={q.questionId} className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {q.subject || "math"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">ID: {q.questionId}</span>
                  </div>

                  <p className="text-xs font-semibold text-white mt-2.5 leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                    {q.options?.map((opt, i) => {
                      const letter = ["A", "B", "C", "D"][i];
                      const isCorrect = q.correctOption === letter;
                      return (
                        <div key={i} className={`p-2 rounded-lg border font-mono ${
                          isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold" : "bg-slate-950 border-slate-850 text-slate-400"
                        }`}>
                          <span className="mr-1 font-bold">{letter})</span> {opt}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-850 text-[10px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold uppercase block mb-0.5">Lao Shi Breakdown:</span>
                      <p className="line-clamp-2">{q.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => { setEditingQ({ ...q }); setShowQModal(true); }}
                    className="p-1.5 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2.5 transition"
                  >
                    <Edit2 className="h-3 w-3" /> Edit Question
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.questionId)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: LANGUAGE INSTITUTES */}
      {/* ========================================================================= */}
      {activeAdminTab === "institutes" && (
        <div className="space-y-4">
          <div className="bg-[#0B192C] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search language schools by name, city, curriculum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingInst({
                  id: "inst-" + Date.now(),
                  name: "",
                  city: "Yiwu / Hangzhou",
                  duration: "4 to 12 Weeks",
                  focus: "Yiwu Wholesale Market & Export Trade",
                  tuitionRmb: 4500,
                  tuitionNgn: 450000,
                  dormIncluded: true,
                  visaSupport: "F / X2 Short-Term Visa",
                  features: ["Market Logistics Training", "Daily Trade Interpreter Sessions"]
                });
                setShowInstModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Add Language Institute
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutesList.filter(i => (i.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((inst) => (
              <div key={inst.id} className="bg-[#0B192C] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition space-y-3">
                <div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    📍 {inst.city}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">{inst.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{inst.focus}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-850 text-xs font-mono">
                    <span className="text-amber-400 font-bold">¥{inst.tuitionRmb?.toLocaleString()} RMB</span> (₦{inst.tuitionNgn?.toLocaleString()} NGN)
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => { setEditingInst({ ...inst }); setShowInstModal(true); }}
                    className="p-1.5 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2.5 transition"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInstitute(inst.id, inst.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 px-2 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: SYSTEM HEALTH & CLOUD FIRESTORE RESEED */}
      {/* ========================================================================= */}
      {activeAdminTab === "system" && (
        <div className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
              Engine Health Check
            </span>
            <h2 className="text-lg font-bold font-display text-white mt-1">
              Cloud Firestore & Verification Security
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current operational status of database collections, cryptographic OTP routing, and payment verification webhooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="text-[10px] font-mono uppercase text-slate-400">Database Connection</div>
              <div className="text-sm font-bold text-[#03C988] flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-[#03C988] animate-ping"></span>
                Active Cloud Firestore v10+
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Isolated Tenant Collection Suffix: Enabled
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="text-[10px] font-mono uppercase text-slate-400">Email Dispatch Engine</div>
              <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" />
                Resend REST API & SMTP Failover
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Sender: VerifiedUni Consular Desk
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="text-[10px] font-mono uppercase text-slate-400">Paystack Gateway Webhooks</div>
              <div className="text-sm font-bold text-blue-400 flex items-center gap-1.5 mt-1">
                <Shield className="h-3.5 w-3.5" />
                HMAC SHA512 Signature Verifier
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Endpoint: /api/webhook/paystack
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">Full System Database Re-Synchronization</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Forces a complete re-seed of the CSC Universities catalog, all 1,000 CSCA examination questions, and Chinese Language trade institutes.
              </p>
            </div>

            <button
              onClick={() => setShowReseedModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer"
            >
              Re-Seed System Collections
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT STUDENT CANDIDATE DETAILS */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Edit Candidate Profile Details</h3>
                <p className="text-[11px] text-slate-400 font-mono">{editingUser.email}</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentProfile} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phoneNumber || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Degree</label>
                  <select
                    value={editingUser.onboarding?.degree || "Bsc"}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      onboarding: { ...(editingUser.onboarding || {}), degree: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bsc">BSc Undergrad</option>
                    <option value="Masters">Master's Degree</option>
                    <option value="PhD">Doctorate (PhD)</option>
                    <option value="Language">Mandarin Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">HSK Proficiency</label>
                  <select
                    value={editingUser.onboarding?.hskLevel || "None"}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      onboarding: { ...(editingUser.onboarding || {}), hskLevel: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="None">None / Beginner</option>
                    <option value="HSK 1-2">HSK 1-2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5+">HSK 5 or HSK 6</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Scholarship Category</label>
                <input
                  type="text"
                  value={editingUser.onboarding?.cscType || ""}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    onboarding: { ...(editingUser.onboarding || {}), cscType: e.target.value }
                  })}
                  placeholder="e.g. Type B High-Level University Program"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!editingUser.premium}
                    onChange={(e) => setEditingUser({ ...editingUser, premium: e.target.checked })}
                    className="accent-amber-500 h-4 w-4"
                  />
                  <span>Premium Verified License Access</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UNIVERSITY CREATE & EDIT */}
      {/* ========================================================================= */}
      {showUniModal && editingUni && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B192C] z-10">
              <h3 className="text-sm font-bold text-white">
                {editingUni.id?.startsWith("uni-") ? "Add New CSC University" : `Edit University: ${editingUni.name}`}
              </h3>
              <button onClick={() => setShowUniModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUniversity} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">University Name (English)</label>
                  <input
                    type="text"
                    value={editingUni.name || ""}
                    onChange={(e) => setEditingUni({ ...editingUni, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">CSC Agency Code</label>
                  <input
                    type="text"
                    value={editingUni.agencyCode || ""}
                    onChange={(e) => setEditingUni({ ...editingUni, agencyCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">City / Province</label>
                  <input
                    type="text"
                    value={editingUni.city || ""}
                    onChange={(e) => setEditingUni({ ...editingUni, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">National Ranking</label>
                  <input
                    type="number"
                    value={editingUni.ranking || 1}
                    onChange={(e) => setEditingUni({ ...editingUni, ranking: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">English-Taught Majors (comma-separated)</label>
                <input
                  type="text"
                  value={editingUni.englishMajors?.join(", ") || ""}
                  onChange={(e) => setEditingUni({
                    ...editingUni,
                    englishMajors: e.target.value.split(",").map(m => m.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. Computer Science, International Trade, Civil Engineering"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingUni.cscTypeB}
                    onChange={(e) => setEditingUni({ ...editingUni, cscTypeB: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>CSC Type B</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingUni.silkRoad}
                    onChange={(e) => setEditingUni({ ...editingUni, silkRoad: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Silk Road</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingUni.provincial}
                    onChange={(e) => setEditingUni({ ...editingUni, provincial: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Provincial</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUniModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Save University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CSCA QUESTION CREATE & EDIT */}
      {/* ========================================================================= */}
      {showQModal && editingQ && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B192C] z-10">
              <h3 className="text-sm font-bold text-white">CSCA Examination Question Editor</h3>
              <button onClick={() => setShowQModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Question ID</label>
                  <input
                    type="text"
                    value={editingQ.questionId || ""}
                    onChange={(e) => setEditingQ({ ...editingQ, questionId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Subject Discipline</label>
                  <select
                    value={editingQ.subject || "math"}
                    onChange={(e) => setEditingQ({ ...editingQ, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="math">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="professional_chinese">Professional Academic Chinese</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Question Stem Text</label>
                <textarea
                  rows={3}
                  value={editingQ.questionText || ""}
                  onChange={(e) => setEditingQ({ ...editingQ, questionText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400">Multiple Choice Options (A - D)</label>
                {["A", "B", "C", "D"].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 w-5">{letter})</span>
                    <input
                      type="text"
                      value={editingQ.options?.[idx] || ""}
                      onChange={(e) => {
                        const newOpts = [...(editingQ.options || ["", "", "", ""])];
                        newOpts[idx] = e.target.value;
                        setEditingQ({ ...editingQ, options: newOpts });
                      }}
                      className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Correct Answer Option</label>
                <select
                  value={editingQ.correctOption || "A"}
                  onChange={(e: any) => setEditingQ({ ...editingQ, correctOption: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Lao Shi Mathematical / Scientific Explanation</label>
                <textarea
                  rows={4}
                  value={editingQ.explanation || ""}
                  onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })}
                  placeholder="Explain step-by-step resolution method..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-[11px] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: LANGUAGE INSTITUTE CREATE & EDIT */}
      {/* ========================================================================= */}
      {showInstModal && editingInst && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Language Training School Editor</h3>
              <button onClick={() => setShowInstModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInstitute} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Institute Name</label>
                <input
                  type="text"
                  value={editingInst.name || ""}
                  onChange={(e) => setEditingInst({ ...editingInst, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={editingInst.city || ""}
                    onChange={(e) => setEditingInst({ ...editingInst, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Course Duration</label>
                  <input
                    type="text"
                    value={editingInst.duration || ""}
                    onChange={(e) => setEditingInst({ ...editingInst, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Tuition (RMB)</label>
                  <input
                    type="number"
                    value={editingInst.tuitionRmb || 0}
                    onChange={(e) => setEditingInst({ ...editingInst, tuitionRmb: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Tuition (NGN)</label>
                  <input
                    type="number"
                    value={editingInst.tuitionNgn || 0}
                    onChange={(e) => setEditingInst({ ...editingInst, tuitionNgn: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Curriculum Focus / Specialty</label>
                <input
                  type="text"
                  value={editingInst.focus || ""}
                  onChange={(e) => setEditingInst({ ...editingInst, focus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInstModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Save School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: SYSTEM DATABASE RE-SEED CONFIRMATION */}
      {/* ========================================================================= */}
      {showReseedModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sync Cloud Firestore Collections</h3>
                <p className="text-xs text-slate-400">Synchronize all catalog databases</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              This action will catalog and synchronize all verified Chinese scholarship universities, over 1,000 CSCA CBT examination questions, and Nigerian-Chinese trade language institutes into your active Firestore instance.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowReseedModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSystemReseed}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                Confirm & Re-Sync DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
