import React, { useState } from "react";
import { 
  FileText, CheckCircle2, AlertTriangle, XCircle, 
  HelpCircle, Sparkles, ExternalLink, ArrowRight, ShieldCheck,
  Upload, Eye, Download, Info
} from "lucide-react";

interface DocumentDiagnosticProps {
  onNavigateToPromptStation: () => void;
  onNavigateToChecklist: () => void;
  onNavigateToPassportCheck: () => void;
}

interface DocItem {
  id: string;
  name: string;
  category: "Identity" | "Academic" | "Medical & Legal" | "Statements";
  status: "passed" | "needs_attention" | "missing" | "not_verified";
  description: string;
  commonMistakes: string[];
  howToFix: string;
  actionType: "ai_generator" | "abuja_checklist" | "passport_checker" | "external";
}

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: "passport",
    name: "International Passport (Data Page)",
    category: "Identity",
    status: "needs_attention",
    description: "Must have at least 12 months remaining validity from your expected date of arrival in China.",
    commonMistakes: [
      "Passport expires within 6 months of visa submission",
      "Spelling variance between Passport surname/given names and NIN database record"
    ],
    howToFix: "Use our NIS/NIN Spell Alignment Checker to ensure zero string mismatch before consular submission.",
    actionType: "passport_checker"
  },
  {
    id: "waec_degree",
    name: "Highest Academic Diploma / WAEC Certificate",
    category: "Academic",
    status: "passed",
    description: "Must be a notarized colored photocopy of your original certificate or formal notification of results.",
    commonMistakes: [
      "Uploading online scratch-card printout instead of official certificate / statement",
      "Missing Federal Ministry of Education (FME) authentication stamp from Federal Secretariat Abuja"
    ],
    howToFix: "Authenticate at Room 2.18, 2nd Floor, Federal Ministry of Education, Federal Secretariat Phase 3, Abuja.",
    actionType: "abuja_checklist"
  },
  {
    id: "transcripts",
    name: "Official Academic Transcripts (All Semesters)",
    category: "Academic",
    status: "passed",
    description: "Detailed semester-by-semester course marks breakdown with clear 4.0 or 5.0 CGPA scale explanation.",
    commonMistakes: [
      "Uploading unofficial student portal screenshot without registrar stamp",
      "Missing grading scale explanation legend on the reverse side"
    ],
    howToFix: "Obtain an official student copy stamped by your University Registrar or Academic Affairs office.",
    actionType: "abuja_checklist"
  },
  {
    id: "study_plan",
    name: "Statement of Purpose / Research Proposal",
    category: "Statements",
    status: "needs_attention",
    description: "Detailed 800+ word academic proposal specifying why China, chosen university, and research intent.",
    commonMistakes: [
      "Generic template downloaded from internet with no university-specific details",
      "Focusing entirely on personal hardship instead of academic & career research value"
    ],
    howToFix: "Generate a custom, anti-rejection Statement of Purpose using our specialized AI Document Engine.",
    actionType: "ai_generator"
  },
  {
    id: "rec_letters",
    name: "Two Academic Recommendation Letters",
    category: "Statements",
    status: "missing",
    description: "Written and signed by Full Professors or Associate Professors with official institutional letterheads.",
    commonMistakes: [
      "Signed by Assistant Lecturers or non-academic industry contacts",
      "Using public free webmail (gmail/yahoo) instead of institutional .edu.ng email domain"
    ],
    howToFix: "Generate formal referee guidance drafts for your professors via our Recommendation Prompt Station.",
    actionType: "ai_generator"
  },
  {
    id: "physical_exam",
    name: "Foreigner Physical Examination Form",
    category: "Medical & Legal",
    status: "not_verified",
    description: "Standard Chinese National Health Commission form with all laboratory tests (HIV, Syphilis, Chest X-Ray).",
    commonMistakes: [
      "Form is older than 6 months at the time of final visa issuance",
      "Doctor failed to stamp the cross-boundary line across the applicant photo"
    ],
    howToFix: "Conduct test at an authorized government teaching hospital; verify doctor cross-stamps your photo.",
    actionType: "abuja_checklist"
  },
  {
    id: "police_report",
    name: "Non-Criminal Record (Police Character Certificate)",
    category: "Medical & Legal",
    status: "missing",
    description: "Issued by the Nigeria Police Force Criminal Investigation Department (FCID Abuja or Alagbon Lagos).",
    commonMistakes: [
      "Certificate older than 6 months at date of application submission",
      "Missing Ministry of Foreign Affairs (MFA) legalization seal"
    ],
    howToFix: "Obtain biometric police report at CID, then legalize at MFA Consular Department, Abuja.",
    actionType: "abuja_checklist"
  }
];

export function DocumentDiagnostic({
  onNavigateToPromptStation,
  onNavigateToChecklist,
  onNavigateToPassportCheck
}: DocumentDiagnosticProps) {
  const [documents, setDocuments] = useState<DocItem[]>(DEFAULT_DOCUMENTS);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const counts = {
    passed: documents.filter(d => d.status === "passed").length,
    needs_attention: documents.filter(d => d.status === "needs_attention").length,
    missing: documents.filter(d => d.status === "missing").length,
    not_verified: documents.filter(d => d.status === "not_verified").length,
  };

  const healthScore = Math.round((counts.passed / documents.length) * 100);

  const handleAction = (type: string) => {
    if (type === "ai_generator") onNavigateToPromptStation();
    else if (type === "abuja_checklist") onNavigateToChecklist();
    else if (type === "passport_checker") onNavigateToPassportCheck();
  };

  const filteredDocs = selectedFilter === "All"
    ? documents
    : documents.filter(d => d.category === selectedFilter);

  const toggleStatus = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== id) return doc;
      const nextStatus: Record<DocItem["status"], DocItem["status"]> = {
        missing: "needs_attention",
        needs_attention: "not_verified",
        not_verified: "passed",
        passed: "missing"
      };
      return { ...doc, status: nextStatus[doc.status] };
    }));
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header Banner */}
      <div className="bg-[#030d1e] border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-mono font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Consular Document Pre-Check Diagnostic
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Application Document Health Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Consular reviewers reject over 40% of applications due to minute formatting discrepancies. Audit each file below to guarantee your documents pass Chinese Embassy & University reviews.
            </p>
          </div>

          {/* Health Score Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-5 min-w-[240px]">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500 flex flex-col items-center justify-center bg-slate-900 shadow-xl flex-shrink-0">
              <span className="font-display text-lg font-black text-white">{healthScore}%</span>
              <span className="text-[7px] font-mono text-slate-400 uppercase">Health</span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-white">Document Status</p>
              <p className="text-emerald-400 text-[11px]">✓ {counts.passed} Validated</p>
              <p className="text-amber-400 text-[11px]">⚠️ {counts.needs_attention + counts.missing} Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {["All", "Identity", "Academic", "Statements", "Medical & Legal"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              selectedFilter === cat
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Cards List */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => {
          const statusBadge = {
            passed: { label: "PASSED", bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", icon: CheckCircle2 },
            needs_attention: { label: "NEEDS ATTENTION", bg: "bg-amber-500/10 border-amber-500/30 text-amber-400", icon: AlertTriangle },
            missing: { label: "MISSING", bg: "bg-rose-500/10 border-rose-500/30 text-rose-400", icon: XCircle },
            not_verified: { label: "NOT VERIFIED", bg: "bg-slate-800 border-slate-700 text-slate-300", icon: Info },
          }[doc.status];

          const IconComponent = statusBadge.icon;

          return (
            <div
              key={doc.id}
              className="bg-[#030d1e] border border-slate-800 rounded-2xl p-6 transition-all duration-200 hover:border-slate-700 space-y-4 shadow-xl"
            >
              {/* Header: Title + Status + Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {doc.category}
                    </span>
                    <button
                      onClick={() => toggleStatus(doc.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold cursor-pointer transition ${statusBadge.bg}`}
                      title="Click to toggle document verification state"
                    >
                      <IconComponent className="h-3 w-3" />
                      {statusBadge.label}
                    </button>
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    {doc.name}
                  </h3>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => handleAction(doc.actionType)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-mono font-bold rounded-xl flex items-center gap-2 cursor-pointer transition w-fit"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  {doc.actionType === "ai_generator" ? "Generate with AI" :
                   doc.actionType === "passport_checker" ? "Run Spell Checker" :
                   "View Abuja Guide"}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {doc.description}
              </p>

              {/* Common Pitfalls & How to Fix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-bold font-mono text-rose-400 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" />
                    Common Consular Rejection Reasons:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {doc.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-bold font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Recommended Fix / Action:
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {doc.howToFix}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
