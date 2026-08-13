import React, { useState } from "react";
import {
  Clock,
  CheckSquare,
  FileText,
  BookOpen,
  TrendingUp,
  Plane,
  Globe,
  ShieldCheck,
  Lock,
  ArrowRight,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Award,
  Sparkles,
  Search,
  BadgeAlert,
  Smartphone,
  ChevronDown,
  UserCheck
} from "lucide-react";

interface DashboardProps {
  currentUser: string | null;
  userProfile: any | null;
  progressPercent: number;
  cscaHistory: any[];
  languageSchools: any[];
  addDevLog: (message: string) => void;
  onStartCsca: () => void;
  onTabChange: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  userProfile,
  progressPercent,
  cscaHistory,
  languageSchools,
  addDevLog,
  onStartCsca,
  onTabChange
}) => {
  const [disputeRef, setDisputeRef] = useState("");
  const [disputeEmail, setDisputeEmail] = useState(currentUser || "");
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [disputeStatus, setDisputeStatus] = useState<"idle" | "success" | "error">("idle");
  const [disputeMessage, setDisputeMessage] = useState("");

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeRef.trim() || !disputeEmail.trim()) {
      setDisputeStatus("error");
      setDisputeMessage("Both Transaction Reference and Email address are required.");
      return;
    }

    setDisputeLoading(true);
    setDisputeStatus("idle");
    setDisputeMessage("");
    addDevLog(`Verifying disputed Paystack transaction reference: ${disputeRef}`);

    try {
      const res = await fetch(`/api/verify-payment?reference=${encodeURIComponent(disputeRef.trim())}&email=${encodeURIComponent(disputeEmail.trim())}`);
      const data = await res.json();

      if (data.status === "success") {
        setDisputeStatus("success");
        setDisputeMessage("Payment verified successfully! Your account holds fully licensed premium status.");
        addDevLog(`Dispute Resolution: Reference ${disputeRef} certified manually.`);
        setTimeout(() => {
          // If transaction certified succeeds, simple page reload or profile sync forces updates.
          window.location.reload();
        }, 1500);
      } else {
        setDisputeStatus("error");
        setDisputeMessage(data.error || "Transaction verification failed. Ensure Paystack registered reference is correct.");
        addDevLog(`Dispute Resolution Denied: ${data.error || "Verification issue."}`);
      }
    } catch (err: any) {
      setDisputeStatus("error");
      setDisputeMessage("Network connectivity drops occurred. Ensure Express port is active.");
      addDevLog(`Dispute Verification connection failure: ${err?.message}`);
    } finally {
      setDisputeLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Premium Custom Metric Header */}
      <div className="bg-[#040c1a] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-[#03C988]/[0.05] blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-amber-500/[0.05] blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/15">
              <Sparkles className="h-3 w-3 animate-pulse" /> 
              Intelligent Workspace Active
            </span>
            <h1 className="text-xl md:text-3xl font-extrabold font-display text-white tracking-tight leading-none mt-1">
              VerifiedUni Admissions & Verification Center
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Unlock West Africa's premium diagnostic panel syncing automated CSC Type A/B agency credentials, Abuja legalization timelines, and short-term logistics Mandarin pathways.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-[#070f1d] border border-slate-200/10 dark:border-slate-800 py-2.5 px-4 rounded-2xl flex flex-col min-w-[130px] justify-center shadow-lg">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">System Status</span>
              <span className="text-xs font-bold text-[#03C988] flex items-center gap-1.5 mt-1 font-mono">
                <span className="h-2 w-2 rounded-full bg-[#03C988] animate-ping inline-block"></span>
                ONLINE / CLOUD
              </span>
            </div>
            
            <div className="bg-[#070f1d] border border-slate-200/10 dark:border-slate-800 py-2.5 px-4 rounded-2xl flex flex-col min-w-[130px] justify-center shadow-lg">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Billing ID</span>
              <span className="text-xs font-mono font-bold text-amber-400 truncate max-w-[110px] mt-1">
                {userProfile?.paymentReference || "ACTIVE-SA"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COLUMN PREMIUM BENTO WORKSPACE - RIGID SIZING PREVENTING CLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        
        {/* Column 1: CSCA Mock Exam Panel (Min Sizing Rigidity) */}
        <div className="min-w-[280px] bg-[#070f1d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display select-none">CSCA Mock Center</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">CBT Math Simulator</p>
                </div>
              </div>
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                MANDATORY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-normal font-sans pt-1">
              Test your proficiency in the Scholastic Competency exam (Type A/B vectors) prior to biometric registration. Over 200 syllabi questions indexed.
            </p>

            <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl space-y-2 text-[11px] font-sans">
              <div className="flex justify-between text-slate-400">
                <span>Attempt count:</span>
                <span className="text-white font-bold font-mono">{cscaHistory?.length || 0} cycles</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Latest score recorded:</span>
                <span className="text-[#03C988] font-bold font-mono">
                  {cscaHistory?.length > 0 ? `${cscaHistory[cscaHistory.length - 1].totalScore || 0}/${cscaHistory[cscaHistory.length - 1].totalQuestions || 10}` : "None"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onStartCsca}
              className="w-full bg-amber-500 hover:bg-amber-450 hover:scale-[1.01] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase font-sans tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              Start Practice Session
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Column 2: Abuja Credential Legalization Stepper Timeline (Rigid visual tracker) */}
        <div className="min-w-[280px] bg-[#070f1d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/[0.02] rounded-full blur-xl"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-xl">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Legalization Stepper</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Abuja Federal Organs</p>
                </div>
              </div>
              <span className="bg-pink-500/10 text-pink-500 border border-pink-500/20 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider font-extrabold">
                {progressPercent}% Complete
              </span>
            </div>

            {/* HIGH-FIDELITY STEPPER UI TRACKER WITH CONNECTING BAR LINES */}
            <div className="relative pl-6 space-y-4 pt-2 font-sans text-xs">
              {/* Connecting line bar */}
              <div className="absolute left-2.5 top-3.5 bottom-3.5 w-0.5 bg-slate-800"></div>

              {/* Step 1 */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute -left-6 z-10 font-mono h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressPercent >= 33 ? "bg-pink-500 text-white" : "bg-slate-900 text-slate-505 border border-slate-800"
                }`}>
                  1
                </span>
                <div>
                  <span className="font-semibold text-white block leading-none">Ministry of Education (MoE)</span>
                  <span className="text-[10.5px] text-slate-400 mt-1 block">Federal Secretariat Complex, Block B, Abuja. Evaluation check.</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute -left-6 z-10 font-mono h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressPercent >= 66 ? "bg-pink-500 text-white" : "bg-slate-900 text-slate-505 border border-slate-800"
                }`}>
                  2
                </span>
                <div>
                  <span className="font-semibold text-white block leading-none">Ministry of Foreign Affairs (MFA)</span>
                  <span className="text-[10.5px] text-slate-400 mt-1 block">Consular Legalization division, Abuja Headquarters stamp.</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute -left-6 z-10 font-mono h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressPercent >= 100 ? "bg-pink-500 text-white" : "bg-slate-900 text-slate-505 border border-slate-800"
                }`}>
                  3
                </span>
                <div>
                  <span className="font-semibold text-white block leading-none">Chinese Consular Stamp Receipt</span>
                  <span className="text-[10.5px] text-slate-400 mt-1 block font-sans">Chinese Embassy CBD, Abuja. Final red-sticker validation.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onTabChange("checklist")}
              className="w-full bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold py-2 rounded-xl text-xs transition uppercase tracking-wider font-mono cursor-pointer"
            >
              Refine Step Checklist
            </button>
          </div>
        </div>

        {/* Column 3: Mandarine Commodity Trading Directory */}
        <div className="min-w-[280px] bg-[#070f1d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Trade Language</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Business Mandarin</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                YIWU / GZ
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-normal font-sans pt-1">
              Connect with direct short-term language institutes positioned within China's premier commodity wholesale zones. Over 50 programs indexed.
            </p>

            <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1 text-[11px] font-sans">
              {languageSchools?.slice(0, 2).map((school: any) => (
                <div key={school.id} className="p-2 bg-slate-950/60 border border-slate-900 rounded-lg flex justify-between items-center">
                  <div className="truncate pr-2">
                    <span className="text-white block font-semibold truncate leading-none mb-0.5">{school.name}</span>
                    <span className="text-[10px] text-slate-500">{school.location}</span>
                  </div>
                  <span className="text-amber-500 font-mono font-bold shrink-0">¥{school.tuitionRmb?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onTabChange("language_schools")}
              className="w-full bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer font-sans"
            >
              Browse Full Directory
            </button>
          </div>
        </div>

      </div>

      {/* DISASTER RECOVERY: DETECT & SOLVE PAYSTACK TRANSACTION DROPOUTS */}
      <div className="bg-[#050D1D] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] rounded-full blur-2xl"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded-lg">
                <Smartphone className="h-4 w-4 animate-bounce" />
              </span>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-400">Continuous Fault Tolerance</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">Verify Disputed Transaction (Power Drops & Webhook Fails)</h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              If your bank debited your account but your browser closed unexpectedly before account provisioning, do not panic. Input your 10-character official Paystack transaction reference sequence below to force a secure backend recheck.
            </p>
          </div>

          <form onSubmit={handleManualVerification} className="lg:min-w-[420px] bg-slate-950 p-4 border border-slate-850 rounded-2xl relative space-y-3 font-sans">
            <div>
              <label className="block text-[9px] font-mono font-extrabold text-slate-450 uppercase mb-1">Official Reference Identifier</label>
              <input
                type="text"
                required
                value={disputeRef}
                onChange={(e) => setDisputeRef(e.target.value)}
                placeholder="e.g. VUNI-CSC-39DF92H..."
                className="w-full bg-[#020712] border border-slate-850 hover:border-slate-700 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-white placeholder-slate-655 uppercase font-mono tracking-wider transition"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono font-extrabold text-slate-450 uppercase mb-1">Registered Billing Email</label>
              <input
                type="email"
                required
                value={disputeEmail}
                onChange={(e) => setDisputeEmail(e.target.value)}
                placeholder="e.g. student@example.com"
                className="w-full bg-[#020712] border border-slate-850 hover:border-slate-700 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-white placeholder-slate-655 font-sans transition"
              />
            </div>

            {disputeMessage && (
              <div className={`text-[10.5px] p-2 rounded border leading-relaxed font-sans ${
                disputeStatus === "success"
                  ? "bg-emerald-500/5 border-emerald-900/30 text-emerald-400"
                  : "bg-red-500/5 border-red-900/30 text-red-400"
              }`}>
                {disputeMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={disputeLoading}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition uppercase tracking-wider"
            >
              {disputeLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5" /> Force Database Certification
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
