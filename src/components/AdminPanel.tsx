import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Shield, CheckCircle, AlertTriangle, Trash2, Plus, Edit2, 
  Database, BookOpen, GraduationCap, TrendingUp, BarChart2, X, Search, DollarSign, ArrowLeft, Mail
} from "lucide-react";
import { University, Tabs, CSCAQuestion } from "../types";
import { LanguageInstitute } from "../languageInstitutesData";

interface AdminPanelProps {
  onBack: () => void;
  addDevLog: (msg: string) => void;
}

export function AdminPanel({ onBack, addDevLog }: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"users" | "universities" | "questions" | "institutes">("users");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [unisList, setUnisList] = useState<University[]>([]);
  const [questionsList, setQuestionsList] = useState<CSCAQuestion[]>([]);
  const [institutesList, setInstitutesList] = useState<LanguageInstitute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit/Create Modal states
  const [showUniModal, setShowUniModal] = useState(false);
  const [editingUni, setEditingUni] = useState<Partial<University> | null>(null);

  const [showQModal, setShowQModal] = useState(false);
  const [editingQ, setEditingQ] = useState<Partial<CSCAQuestion> | null>(null);

  const [showInstModal, setShowInstModal] = useState(false);
  const [editingInst, setEditingInst] = useState<Partial<LanguageInstitute> | null>(null);

  const [manualEmail, setManualEmail] = useState("");

  // Fetch initial collections
  const loadData = async () => {
    setLoading(true);
    addDevLog("Admin Panel: Loading system databases...");
    try {
      // 1. Fetch Users
      const uRes = await fetch("/api/admin/users");
      const uData = await uRes.json();
      if (uRes.ok && uData.users) {
        setUsersList(uData.users);
      }

      // 2. Fetch Universities
      const uniRes = await fetch("/api/universities");
      const uniData = await uniRes.json();
      if (uniRes.ok && uniData.universities) {
        setUnisList(uniData.universities);
      }

      // 3. Fetch CSCA Questions
      const qRes = await fetch("/api/csca/questions");
      const qData = await qRes.json();
      if (qRes.ok && qData.questions) {
        setQuestionsList(qData.questions);
      }

      // 4. Fetch Language Schools
      const instRes = await fetch("/api/language-institutes");
      const instData = await instRes.json();
      if (instRes.ok && instData.institutes) {
        setInstitutesList(instData.institutes);
      }

      addDevLog("Admin Panel: Databases successfully loaded.");
    } catch (err: any) {
      console.error(err);
      addDevLog(`Admin Panel Error: ${err.message}`);
      setErrorMsg("Failed loading administrative logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute analytics
  const metrics = useMemo(() => {
    const totalReg = usersList.length;
    const totalPremium = usersList.filter(u => u.premium).length;
    const conversionRate = totalReg > 0 ? Math.round((totalPremium / totalReg) * 100) : 0;
    const totalRevenue = totalPremium * 35000;

    return {
      totalReg,
      totalPremium,
      conversionRate,
      totalRevenue
    };
  }, [usersList]);

  // Handle User Premium Toggle
  const handleTogglePremium = async (email: string) => {
    if (!confirm(`Are you sure you want to toggle subscription status for: ${email}?`)) return;
    try {
      const res = await fetch("/api/admin/toggle-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Access level toggled for ${email}!`);
        addDevLog(`Admin: Modified licensing contract rules for client ${email}`);
        await loadData();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Execution state rejected.");
      }
    } catch (e: any) {
      setErrorMsg(`Failed committing parameter overrides: ${e.message}`);
    }
  };

  // Handle manual instant grant input form
  const handleManualGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = manualEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg("Please type an email address.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/admin/toggle-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Access level successfully GRANTED to ${email}!`);
        addDevLog(`Admin: Manually granted premium license access to email: ${email}`);
        setManualEmail("");
        await loadData();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Failed to grant access.");
      }
    } catch (error: any) {
      setErrorMsg(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (email: string) => {
    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete user: ${email}? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Purged ${email} from secure credentials database.`);
        addDevLog(`Admin: Pruned ${email} credentials from directory services.`);
        setUsersList(prev => prev.filter(u => (u.email || u.id) !== email));
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(data.error || "Purge request denied.");
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  // Handle Manual Custom Onboarding Pain Points Email Follow-up Trigger
  const handleSendFollowUp = async (email: string) => {
    try {
      const res = await fetch("/api/admin/send-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Dispatched beautiful education-niche followed-up email to ${email}!`);
        addDevLog(`Admin: Dispatched manual paint-point email campaign to client: ${email}`);
        setUsersList(prev => prev.map(u => (u.email || u.id) === email ? { ...u, followupSent: true, followupSentAt: data.user.followupSentAt } : u));
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Manual follow-up request denied.");
      }
    } catch (e: any) {
      setErrorMsg(`Failed committing transaction request: ${e.message}`);
    }
  };

  // Handle Save University
  const handleSaveUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni?.id || !editingUni?.name) {
      setErrorMsg("ID and Name fields are mandatory.");
      return;
    }
    try {
      const res = await fetch("/api/admin/university/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university: editingUni })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Successfully saved ${editingUni.name}!`);
        addDevLog(`Admin: Saved university ID ${editingUni.id}`);
        setShowUniModal(false);
        // Refresh local listing
        setUnisList(prev => {
          const exists = prev.some(u => u.id === editingUni.id);
          if (exists) {
            return prev.map(u => u.id === editingUni.id ? { ...u, ...editingUni } as University : u);
          } else {
            return [...prev, editingUni as University];
          }
        });
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed database transaction.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Handle Delete University
  const handleDeleteUni = async (id: string, name: string) => {
    if (!confirm(`Purge university '${name}'? This deletes it across all user directories immediately.`)) return;
    try {
      const res = await fetch("/api/admin/university/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`University '${name}' permanently pruned.`);
        addDevLog(`Admin: Deleted university record: ${id}`);
        setUnisList(prev => prev.filter(u => u.id !== id));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Handle Save CBT Question
  const handleSaveQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQ?.questionId || !editingQ?.questionText) {
      setErrorMsg("Question ID and text cannot be empty.");
      return;
    }
    // format options
    const formattedQ = {
      ...editingQ,
      options: editingQ.options || ["", "", "", ""]
    };
    try {
      const res = await fetch("/api/admin/question/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: formattedQ })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg("CBT practice question successfully saved!");
        addDevLog(`Admin: Logged mock CSCA items pool update: ${editingQ.questionId}`);
        setShowQModal(false);
        setQuestionsList(prev => {
          const exists = prev.some(q => q.questionId === editingQ.questionId);
          if (exists) {
            return prev.map(q => q.questionId === editingQ.questionId ? { ...q, ...formattedQ } as CSCAQuestion : q);
          } else {
            return [...prev, formattedQ as CSCAQuestion];
          }
        });
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Handle Delete CBT Question
  const handleDeleteQ = async (questionId: string) => {
    if (!confirm(`Purge CBT practice item ID: ${questionId}?`)) return;
    try {
      const res = await fetch("/api/admin/question/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg("Question deleted.");
        addDevLog(`Admin: Purged question ${questionId}`);
        setQuestionsList(prev => prev.filter(q => q.questionId !== questionId));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Handle Save Language Institute
  const handleSaveInst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst?.id || !editingInst?.name) {
      setErrorMsg("ID and Name fields are required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/language-institute/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institute: editingInst })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg(`Saved Mandarin training school: ${editingInst.name}`);
        addDevLog(`Admin: Saved institute record: ${editingInst.id}`);
        setShowInstModal(false);
        setInstitutesList(prev => {
          const exists = prev.some(i => i.id === editingInst.id);
          if (exists) {
            return prev.map(i => i.id === editingInst.id ? { ...i, ...editingInst } as LanguageInstitute : i);
          } else {
            return [...prev, editingInst as LanguageInstitute];
          }
        });
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Handle Delete Language Institute
  const handleDeleteInst = async (id: string, name: string) => {
    if (!confirm(`Purge Language Institute '${name}'?`)) return;
    try {
      const res = await fetch("/api/admin/language-institute/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccessMsg("Mandarin school purged.");
        addDevLog(`Admin: Deleted language institute: ${id}`);
        setInstitutesList(prev => prev.filter(i => i.id !== id));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Filters for search query
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return usersList;
    return usersList.filter(u => 
      (u.fullName || "").toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) ||
      (u.phoneNumber || "").toLowerCase().includes(q) ||
      (u.paymentReference || "").toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

  const filteredUnis = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return unisList;
    return unisList.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.city.toLowerCase().includes(q) ||
      u.agencyCode.toLowerCase().includes(q)
    );
  }, [unisList, searchQuery]);

  const filteredQuestions = useMemo(() => {
    let list = questionsList;
    if (selectedSubjectFilter !== "all") {
      list = list.filter(qi => (qi.subject || "").toLowerCase() === selectedSubjectFilter.toLowerCase());
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter(qi => 
      qi.questionText.toLowerCase().includes(q) || 
      qi.questionId.toLowerCase().includes(q) ||
      (qi.subject || "").toLowerCase().includes(q)
    );
  }, [questionsList, searchQuery, selectedSubjectFilter]);

  const filteredInstitutes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return institutesList;
    return institutesList.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.location.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }, [institutesList, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans select-none">
      
      {/* Top action header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-1 px-3 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" /> Back to Workspace
            </button>
            <span className="text-amber-500 text-xs font-bold font-mono tracking-widest bg-amber-500/10 px-2 py-0.5 rounded uppercase">ROOT CONTROL GATEWAY</span>
          </div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <Shield className="h-7 w-7 text-amber-500" />
            Admissions Admin Control Panel
          </h1>
          <p className="text-xs text-slate-400">Manage Nigeria-to-China software portal configurations, financial billing databases, and curriculum pools.</p>
        </div>
        
        <button 
          onClick={loadData}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Database className="h-4 w-4 text-indigo-400 animate-spin" /> Synchronize DB
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0b192c] border border-slate-850 p-5 rounded-2xl relative overflow-hidden space-y-2">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Total Sales Revenue</span>
            <div className="p-1.5 bg-emerald-500/10 rounded-lg"><DollarSign className="h-4.5 w-4.5 text-[#03C988]" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">₦{(metrics.totalRevenue).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 font-mono">Gross sub sales logged</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b192c] border border-slate-850 p-5 rounded-2xl relative overflow-hidden space-y-2">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Active Subscribers</span>
            <div className="p-1.5 bg-amber-500/10 rounded-lg"><CheckCircle className="h-4.5 w-4.5 text-amber-400" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">{metrics.totalPremium}</div>
            <div className="text-[10px] text-slate-400 font-mono">Paid ₦35,000 sub users</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b192c] border border-slate-850 p-5 rounded-2xl relative overflow-hidden space-y-2">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Total Registered Leads</span>
            <div className="p-1.5 bg-blue-500/10 rounded-lg"><Users className="h-4.5 w-4.5 text-blue-400" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">{metrics.totalReg}</div>
            <div className="text-[10px] text-slate-400 font-mono">Registered accounts overall</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0b192c] border border-slate-850 p-5 rounded-2xl relative overflow-hidden space-y-2">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Billing Conversion</span>
            <div className="p-1.5 bg-indigo-500/10 rounded-lg"><TrendingUp className="h-4.5 w-4.5 text-indigo-400" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#03C988] font-display">{metrics.conversionRate}%</div>
            <div className="text-[10px] text-slate-400 font-mono">Registration to paid premium</div>
          </div>
        </div>
      </div>

      {/* Global Toast Success / Error messages */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-900/40 text-[#03C988] text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-950/40 border border-red-900/40 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab Navigation and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl">
          <button 
            type="button" 
            onClick={() => { setActiveAdminTab("users"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${activeAdminTab === "users" ? "bg-[#0b192c] text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
          >
            Registered Users ({usersList.length})
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveAdminTab("universities"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${activeAdminTab === "universities" ? "bg-[#0b192c] text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
          >
            Universities ({unisList.length})
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveAdminTab("questions"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${activeAdminTab === "questions" ? "bg-[#0b192c] text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
          >
            CBT Questions ({questionsList.length})
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveAdminTab("institutes"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${activeAdminTab === "institutes" ? "bg-[#0b192c] text-white font-bold shadow" : "text-slate-400 hover:text-white"}`}
          >
            Language Schools ({institutesList.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeAdminTab}...`}
            className="w-full bg-slate-900 border border-slate-850 pl-10 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:border-amber-500 text-white transition placeholder-slate-500 font-medium"
          />
        </div>
      </div>

      {/* Main Dynamic Workspace Listing */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Loading Spinner overlay */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <Database className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Syncing administrative records securely with Cloud Firestore...</p>
          </div>
        )}

        {/* Tab 1: Users */}
        {!loading && activeAdminTab === "users" && (
          <div>
            {/* Instant Premium Access Granting Control Panel */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="space-y-1">
                <span className="text-[11px] font-bold font-mono uppercase text-teal-400 block tracking-wide">⚡ Manual License Provisioning Suite</span>
                <span className="text-[10px] text-slate-400 block">Grant instant, complete workspace authorization bypass to any student email address.</span>
              </div>
              <form onSubmit={handleManualGrantAccess} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="Type student's email..."
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-teal-500 w-full md:w-64"
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap"
                >
                  Grant Access
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">No registered students found matching search.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] uppercase font-mono font-bold">
                      <th className="p-4">Applicant Profile</th>
                      <th className="p-4">Contact & Phone</th>
                      <th className="p-4">Paid Subscription</th>
                      <th className="p-4">onboarding Details</th>
                      <th className="p-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {filteredUsers.map((user, idx) => {
                      const isPremium = user.premium === true;
                      const userEmail = user.email || user.id || `user-${idx}`;
                      return (
                        <tr key={`${userEmail}-${idx}`} className="hover:bg-slate-850/20 transition">
                          <td className="p-4 space-y-1">
                            <div className="font-bold text-white text-sm">{user.fullName || "Draft Profile"}</div>
                            <div className="text-xs text-slate-400 font-mono">{userEmail}</div>
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="text-slate-300 font-medium">{user.phoneNumber || "No Phone set"}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Registered: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Pending"}</div>
                          </td>
                          <td className="p-4">
                            {isPremium ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 bg-[#03C988]/15 border border-[#03C988]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#03C988]">
                                  <CheckCircle className="h-3 w-3" /> ₦35,000 Verified
                                </span>
                                <div className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">{user.paymentReference}</div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-500 animate-pulse">
                                <AlertTriangle className="h-3 w-3" /> Unpaid / Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-xs">
                            {user.onboarding ? (
                              <div className="space-y-1.5 max-w-[250px]">
                                <div><span className="text-slate-500 font-mono text-[9px] uppercase">Goal:</span> <span className="font-bold text-amber-400 text-[10px]">{user.onboarding.degree || "N/A"}</span></div>
                                <div><span className="text-slate-500 font-mono text-[9px] uppercase">Lang:</span> <span className="text-slate-300 text-[10px]">{user.onboarding.hsk || "N/A"}</span></div>
                                {user.onboarding.csc && <div><span className="text-slate-500 font-mono text-[9px] uppercase">CSC Type:</span> <span className="text-slate-300 text-[10px]">{user.onboarding.csc}</span></div>}
                                {user.onboarding.motivation && <div><span className="text-slate-500 font-mono text-[9px] uppercase">Pain Point:</span> <span className="text-red-400 text-[10px] font-medium">{user.onboarding.motivation}</span></div>}
                                
                                {/* Automated dispatch status badge */}
                                <div className="pt-1 flex flex-wrap gap-1">
                                  {user.followupSent ? (
                                    <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8.5px] font-mono text-emerald-400 font-bold" title={user.followupSentAt ? `Sent: ${new Date(user.followupSentAt).toLocaleString()}` : ""}>
                                      ✉️ Onboarding Follow-up Sent
                                    </span>
                                  ) : !isPremium ? (
                                    <span className="inline-flex items-center gap-0.5 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[8.5px] font-mono text-blue-400 font-bold">
                                      ⏱️ Auto-Queue Active (Unpaid)
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No onboarding saved</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {user.onboarding && !isPremium && (
                                <button 
                                  onClick={() => handleSendFollowUp(userEmail)}
                                  className="px-2.5 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1"
                                  title="Trigger student pain-point follow-up campaign email"
                                >
                                  <Mail className="h-3 w-3" /> Follow-Up
                                </button>
                              )}
                              <button 
                                onClick={() => handleTogglePremium(userEmail)}
                                className={`px-3 py-1.5 ${isPremium ? "bg-amber-600/10 text-amber-500 border border-amber-500/20 hover:bg-amber-600/20" : "bg-emerald-600/10 text-[#03C988] border border-emerald-500/20 hover:bg-emerald-600/20"} font-bold text-[10px] rounded-lg transition cursor-pointer`}
                              >
                                {isPremium ? "Revoke Access" : "Grant Access"}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(userEmail)}
                                className="p-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                                title="Delete user permanently"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Universities */}
        {!loading && activeAdminTab === "universities" && (
          <div>
            {/* Top creation bar */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center">
              <span className="text-[11px] font-bold font-mono uppercase text-slate-400">Universities Index Manager</span>
              <button 
                onClick={() => {
                  setEditingUni({
                    id: "uni-" + Date.now(),
                    name: "",
                    city: "",
                    ranking: 50,
                    agencyCode: "",
                    cscTypeA: true,
                    cscTypeB: true,
                    provincial: false,
                    silkRoad: false,
                    stipendUndergrad: 2500,
                    tuitionFeeUndergrad: 15000,
                    accommodationFee: 3000,
                    applicationPortal: "https://",
                    tracks: ["Bsc", "Masters", "Language"],
                    englishMajors: ["Software Engineering", "Civil Engineering", "Business Administration"]
                  });
                  setShowUniModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add University
              </button>
            </div>

            <div className="overflow-x-auto">
              {filteredUnis.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">No universities found.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] uppercase font-mono font-bold">
                      <th className="p-4">Rank & University Name</th>
                      <th className="p-4">City Location</th>
                      <th className="p-4">Agency Code</th>
                      <th className="p-4">Stipend & Fees</th>
                      <th className="p-4">Admissions Types</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {filteredUnis.map((uni) => (
                      <tr key={uni.id} className="hover:bg-slate-850/20 transition">
                        <td className="p-4 space-y-1 max-w-[250px]">
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center font-mono">#{uni.ranking || "_"}</span>
                            {uni.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {uni.id}</div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{uni.city}</td>
                        <td className="p-4 font-mono text-xs text-amber-500 font-bold">{uni.agencyCode || "N/A"}</td>
                        <td className="p-4 space-y-1">
                          <div className="text-emerald-400 font-semibold text-[11px] font-mono">💰 Monthly: {uni.stipendUndergrad ? `${uni.stipendUndergrad} RMB` : "N/A"}</div>
                          <div className="text-slate-400 text-[10px]">Tuition: {uni.tuitionFeeUndergrad ? `${uni.tuitionFeeUndergrad} RMB/yr` : "Free"}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {uni.cscTypeA && <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">CSC Type A</span>}
                            {uni.cscTypeB && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">CSC B</span>}
                            {uni.provincial && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Provincial</span>}
                            {uni.silkRoad && <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">Silk Road</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button 
                              onClick={() => {
                                setEditingUni(uni);
                                setShowUniModal(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUni(uni.id, uni.name)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: CBT Questions */}
        {!loading && activeAdminTab === "questions" && (
          <div>
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-400">CSCA Mock CBT Exam Questions Pool</span>
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">📁 All Subjects</option>
                  <option value="math">🧮 Mathematics</option>
                  <option value="physics">⚡ Physics</option>
                  <option value="chemistry">🧪 Chemistry</option>
                  <option value="professional_chinese">🗣️ Professional Chinese</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  setEditingQ({
                    questionId: "Q-" + Date.now(),
                    questionText: "",
                    options: ["", "", "", ""],
                    correctOption: "A",
                    explanation: "",
                    subject: "math",
                    medium: "English"
                  });
                  setShowQModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add CBT Item
              </button>
            </div>

            <div className="overflow-x-auto">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 font-sans">No CBT practice questions cataloged.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] uppercase font-mono font-bold">
                      <th className="p-4">Subject & ID</th>
                      <th className="p-4">Question Text</th>
                      <th className="p-4">Correct Option</th>
                      <th className="p-4">Explanation Blueprint</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {filteredQuestions.map((q) => (
                      <tr key={q.questionId} className="hover:bg-slate-850/20 transition">
                        <td className="p-4 space-y-1">
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">{q.subject || "CSCA General"}</span>
                          <div className="text-[10px] text-slate-500 font-mono">Id: {q.questionId}</div>
                        </td>
                        <td className="p-4 max-w-[280px]">
                          <div className="text-slate-100 font-semibold line-clamp-2">{q.questionText}</div>
                          <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[9px] text-slate-400">
                            <div><span className="font-bold text-slate-500">A:</span> {q.options?.[0]}</div>
                            <div><span className="font-bold text-slate-500">B:</span> {q.options?.[1]}</div>
                            <div><span className="font-bold text-slate-500">C:</span> {q.options?.[2]}</div>
                            <div><span className="font-bold text-slate-500">D:</span> {q.options?.[3]}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[#03C988] font-bold text-sm tracking-wide flex items-center justify-center font-mono">
                            {q.correctOption}
                          </span>
                        </td>
                        <td className="p-4 max-w-[150px]">
                          <p className="text-slate-400 italic line-clamp-2 text-[11px]">{q.explanation || "No explanation provided."}</p>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button 
                              onClick={() => {
                                setEditingQ(q);
                                setShowQModal(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteQ(q.questionId)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Language Schools */}
        {!loading && activeAdminTab === "institutes" && (
          <div>
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center">
              <span className="text-[11px] font-bold font-mono uppercase text-slate-400">Mandarin Academy Directory Manager</span>
              <button 
                onClick={() => {
                  setEditingInst({
                    id: "inst-" + Date.now(),
                    name: "",
                    location: "Guangzhou",
                    tuitionRmb: 6000,
                    startDates: ["September 2026", "March 2027"],
                    applicationLink: "https://",
                    highlights: [],
                    description: ""
                  });
                  setShowInstModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Language School
              </button>
            </div>

            <div className="overflow-x-auto">
              {filteredInstitutes.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 font-sans">No Mandarin language training institutes found.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] uppercase font-mono font-bold">
                      <th className="p-4">Mandarin Training School</th>
                      <th className="p-4">Trading Hub Location</th>
                      <th className="p-4">Tuition Rates</th>
                      <th className="p-4">Intake Dates</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {filteredInstitutes.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-850/20 transition">
                        <td className="p-4 space-y-1 max-w-[250px]">
                          <div className="font-bold text-white text-sm">{inst.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {inst.id}</div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{inst.location}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{inst.tuitionRmb ? `${inst.tuitionRmb} RMB` : "N/A"}</td>
                        <td className="p-4 text-slate-400 font-sans">{inst.startDates?.join(", ") || "N/A"}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button 
                              onClick={() => {
                                setEditingInst(inst);
                                setShowInstModal(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteInst(inst.id, inst.name)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>

      {/* --- ADD/EDIT MODAL: UNIVERSITY --- */}
      {showUniModal && editingUni && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 p-4 flex justify-center items-center overflow-y-auto select-none">
          <form onSubmit={handleSaveUni} className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto font-sans shadow-2xl relative">
            <button type="button" onClick={() => setShowUniModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="h-5 w-5" /></button>
            <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">Configure University Entity</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Unique Record ID</label>
                <input 
                  type="text"
                  required
                  value={editingUni.id || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, id: e.target.value.replace(/\s+/g, "-").toLowerCase() }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. uni-beida"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">QS / Industry Ranking</label>
                <input 
                  type="number"
                  required
                  value={editingUni.ranking || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, ranking: Number(e.target.value) }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">University Official Name</label>
              <input 
                type="text"
                required
                value={editingUni.name || ""}
                onChange={(e) => setEditingUni(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                placeholder="e.g. Tsinghua University"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">City Location</label>
                <input 
                  type="text"
                  required
                  value={editingUni.city || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                  placeholder="e.g. Beijing"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">CSC Agency Code</label>
                <input 
                  type="text"
                  required
                  value={editingUni.agencyCode || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, agencyCode: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                  placeholder="e.g. 10003"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Mly Stipend (RMB)</label>
                <input 
                  type="number"
                  value={editingUni.stipendUndergrad || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, stipendUndergrad: Number(e.target.value) }))}
                  className="w-full bg-[#020813] border border-slate-800 px-2 py-1.5 text-xs text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Tuition (RMB/yr)</label>
                <input 
                  type="number"
                  value={editingUni.tuitionFeeUndergrad || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, tuitionFeeUndergrad: Number(e.target.value) }))}
                  className="w-full bg-[#020813] border border-slate-800 px-2 py-1.5 text-xs text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Accom. (RMB/yr)</label>
                <input 
                  type="number"
                  value={editingUni.accommodationFee || ""}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, accommodationFee: Number(e.target.value) }))}
                  className="w-full bg-[#020813] border border-slate-800 px-2 py-1.5 text-xs text-white rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-850">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input 
                  type="checkbox"
                  checked={editingUni.cscTypeA || false}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, cscTypeA: e.target.checked }))}
                />
                CSC Type A Allowed
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input 
                  type="checkbox"
                  checked={editingUni.cscTypeB || false}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, cscTypeB: e.target.checked }))}
                />
                CSC Type B Allowed
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input 
                  type="checkbox"
                  checked={editingUni.provincial || false}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, provincial: e.target.checked }))}
                />
                Provincial Scholarships
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input 
                  type="checkbox"
                  checked={editingUni.silkRoad || false}
                  onChange={(e) => setEditingUni(prev => ({ ...prev, silkRoad: e.target.checked }))}
                />
                Silk Road Scholarship
              </label>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Official Application Portal</label>
              <input 
                type="text"
                required
                value={editingUni.applicationPortal || "https://"}
                onChange={(e) => setEditingUni(prev => ({ ...prev, applicationPortal: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg font-mono text-indigo-400"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowUniModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs py-3 rounded-xl transition cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer">Save University</button>
            </div>

          </form>
        </div>
      )}

      {/* --- ADD/EDIT MODAL: CBT QUESTION --- */}
      {showQModal && editingQ && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 p-4 flex justify-center items-center overflow-y-auto select-none">
          <form onSubmit={handleSaveQ} className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto font-sans shadow-2xl relative">
            <button type="button" onClick={() => setShowQModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"><X className="h-5 w-5" /></button>
            <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">Configure CSCA practice Exam Question</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">CBT Question unique reference ID</label>
                <input 
                  type="text"
                  required
                  value={editingQ.questionId || ""}
                  onChange={(e) => setEditingQ(prev => ({ ...prev, questionId: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg uppercase"
                  placeholder="e.g. Q-MATH-102"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Subject domain</label>
                <select
                  value={editingQ.subject || "math"}
                  onChange={(e) => setEditingQ(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-slate-300 rounded-lg"
                >
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="professional_chinese">Professional Chinese</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Question Text Prompt</label>
              <textarea 
                rows={3}
                required
                value={editingQ.questionText || ""}
                onChange={(e) => setEditingQ(prev => ({ ...prev, questionText: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg focus:outline-none"
                placeholder="The formal mathematical formula or question text..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Multiple Choice Alternatives</label>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Option A" 
                  value={editingQ.options?.[0] || ""}
                  onChange={(e) => {
                    const opts = [...(editingQ.options || ["", "", "", ""])];
                    opts[0] = e.target.value;
                    setEditingQ(prev => ({ ...prev, options: opts }));
                  }}
                  className="bg-[#020813] border border-slate-800 text-xs text-white px-3 py-2 rounded-lg"
                />
                <input 
                  type="text" 
                  placeholder="Option B" 
                  value={editingQ.options?.[1] || ""}
                  onChange={(e) => {
                    const opts = [...(editingQ.options || ["", "", "", ""])];
                    opts[1] = e.target.value;
                    setEditingQ(prev => ({ ...prev, options: opts }));
                  }}
                  className="bg-[#020813] border border-slate-800 text-xs text-white px-3 py-2 rounded-lg"
                />
                <input 
                  type="text" 
                  placeholder="Option C" 
                  value={editingQ.options?.[2] || ""}
                  onChange={(e) => {
                    const opts = [...(editingQ.options || ["", "", "", ""])];
                    opts[2] = e.target.value;
                    setEditingQ(prev => ({ ...prev, options: opts }));
                  }}
                  className="bg-[#020813] border border-slate-800 text-xs text-white px-3 py-2 rounded-lg"
                />
                <input 
                  type="text" 
                  placeholder="Option D" 
                  value={editingQ.options?.[3] || ""}
                  onChange={(e) => {
                    const opts = [...(editingQ.options || ["", "", "", ""])];
                    opts[3] = e.target.value;
                    setEditingQ(prev => ({ ...prev, options: opts }));
                  }}
                  className="bg-[#020813] border border-slate-800 text-xs text-white px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Correct Option key</label>
                <select
                  value={editingQ.correctOption || "A"}
                  onChange={(e) => setEditingQ(prev => ({ ...prev, correctOption: e.target.value as any }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg font-bold font-mono text-emerald-400"
                >
                  <option value="A">Choice A</option>
                  <option value="B">Choice B</option>
                  <option value="C">Choice C</option>
                  <option value="D">Choice D</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Medium Language</label>
                <input 
                  type="text"
                  value={editingQ.medium || "English"}
                  onChange={(e) => setEditingQ(prev => ({ ...prev, medium: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Step-by-step Explanation Strategy</label>
              <textarea 
                rows={2}
                value={editingQ.explanation || ""}
                onChange={(e) => setEditingQ(prev => ({ ...prev, explanation: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                placeholder="Show students how to solve this math or logic layout easily."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowQModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs py-3 rounded-xl cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold py-3 rounded-xl cursor-pointer">Save CBT Question</button>
            </div>

          </form>
        </div>
      )}

      {/* --- ADD/EDIT MODAL: LANGUAGE INSTITUTE --- */}
      {showInstModal && editingInst && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 p-4 flex justify-center items-center overflow-y-auto select-none">
          <form onSubmit={handleSaveInst} className="bg-[#0B192C] border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto font-sans shadow-2xl relative">
            <button type="button" onClick={() => setShowInstModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"><X className="h-5 w-5" /></button>
            <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">Configure Mandarin Language School</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Unique Record ID</label>
                <input 
                  type="text"
                  required
                  value={editingInst.id || ""}
                  onChange={(e) => setEditingInst(prev => ({ ...prev, id: e.target.value.replace(/\s+/g, "-").toLowerCase() }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                  placeholder="e.g. inst-yw-elite"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Commercial Sourcing Hub</label>
                <select
                  value={editingInst.location || "Guangzhou"}
                  onChange={(e) => setEditingInst(prev => ({ ...prev, location: e.target.value as any }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-slate-300 rounded-lg"
                >
                  <option value="Yiwu">Yiwu (Commodity Center)</option>
                  <option value="Guangzhou">Guangzhou (Trade Center)</option>
                  <option value="Shanghai">Shanghai (Financial Center)</option>
                  <option value="Beijing">Beijing (Intellectual Center)</option>
                  <option value="Shenzhen">Shenzhen (Tech Center)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">School official Name</label>
              <input 
                type="text"
                required
                value={editingInst.name || ""}
                onChange={(e) => setEditingInst(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Tuition Fee (RMB/Semester)</label>
                <input 
                  type="number"
                  required
                  value={editingInst.tuitionRmb || ""}
                  onChange={(e) => setEditingInst(prev => ({ ...prev, tuitionRmb: Number(e.target.value) }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Application Hub Link</label>
                <input 
                  type="text"
                  required
                  value={editingInst.applicationLink || "https://"}
                  onChange={(e) => setEditingInst(prev => ({ ...prev, applicationLink: e.target.value }))}
                  className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-indigo-400 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Detailed Course Description</label>
              <textarea 
                rows={3}
                required
                value={editingInst.description || ""}
                onChange={(e) => setEditingInst(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#020813] border border-slate-800 px-3 py-2 text-xs text-white rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowInstModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs py-3 rounded-xl cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold py-3 rounded-xl cursor-pointer">Save Mandarin School</button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
