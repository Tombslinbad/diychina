import React, { useState, useMemo } from "react";
import { UNIVERSITIES } from "../universitiesData";
import { University } from "../types";
import {
  Globe,
  Search,
  Building,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  Mail,
  Send,
  HeartPulse,
  Stethoscope,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  Download,
  Award,
  Layers,
  FileCheck
} from "lucide-react";

interface DualApplicationHubProps {
  onNavigateToStudyPlan?: () => void;
  onNavigateToDocuments?: () => void;
  onNavigateToConsultant?: () => void;
}

export function DualApplicationHub({
  onNavigateToStudyPlan,
  onNavigateToDocuments,
  onNavigateToConsultant
}: DualApplicationHubProps) {
  const [activeSection, setActiveSection] = useState<"dual_portal" | "professor_outreach" | "physical_exam">("dual_portal");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Professor Outreach Form State
  const [professorName, setProfessorName] = useState("");
  const [targetUniName, setTargetUniName] = useState("Tsinghua University");
  const [studentField, setStudentField] = useState("Computer Science & Artificial Intelligence");
  const [studentDegree, setStudentDegree] = useState("Master's");
  const [researchInterest, setResearchInterest] = useState("Machine Learning applications in sustainable energy grids and supply chain optimization");
  const [studentUndergradUni, setStudentUndergradUni] = useState("University of Lagos / Covenant University");
  const [studentGpa, setStudentGpa] = useState("4.62 / 5.00 (First Class Honours)");
  const [emailCopied, setEmailCopied] = useState(false);

  // Physical Exam Checklist State
  const [examChecks, setExamChecks] = useState<Record<string, boolean>>({
    hospital_gov: false,
    photo_stamp: false,
    doctor_sig: false,
    blood_hiv: false,
    blood_syphilis: false,
    blood_hepb: false,
    ecg_strip: false,
    chest_xray: false,
    validity_6m: false
  });

  const handleCopyAgency = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.agencyCode.includes(searchQuery) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrack =
        selectedTrack === "All" ||
        uni.tracks.some((t) => t.toLowerCase() === selectedTrack.toLowerCase());
      return matchesSearch && matchesTrack;
    });
  }, [searchQuery, selectedTrack]);

  // Generated Professor Cold Outreach Email
  const generatedEmailSubject = `Prospective ${studentDegree} Student Seeking CSC/University Scholarship Supervision - ${studentField}`;
  const generatedEmailBody = `Dear Professor ${professorName || "[Professor's Surname]"},

I hope this email finds you well.

My name is [Your Full Name], a prospective ${studentDegree} student from Nigeria with a background in ${studentField}. I recently graduated from ${studentUndergradUni} with a CGPA of ${studentGpa}.

I have been closely following your research group at ${targetUniName}, particularly your recent publications regarding ${researchInterest}. Your rigorous methodology and academic contributions have inspired me greatly.

I am preparing my application for the 2026/2027 Chinese Government Scholarship (CSC Type B) and ${targetUniName} Presidential Scholarship. My proposed research aims to investigate "${researchInterest}", addressing both theoretical challenges and real-world deployment. Given your laboratory's leading stature, I would be deeply honored to pursue my research under your distinguished supervision.

Attached to this email, please find:
1. My detailed Academic Curriculum Vitae (highlighting coursework, publications, and technical proficiencies)
2. A 2-page Research Proposal Outline
3. My Official Academic Transcripts & English Proficiency Certificate

Could you kindly advise if you are open to accepting new ${studentDegree} research candidates for the upcoming academic year? If my background aligns with your laboratory's current focus, I would be grateful for the opportunity to request a tentative Pre-Admission Acceptance Letter (or Form) to support my CSC application.

Thank you very much for your valuable time and consideration.

Respectfully yours,

[Your Full Name]
[Your Phone / WhatsApp: +234 ...]
[Your Email Address]
[LinkedIn / Academic Profile Link]`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${generatedEmailSubject}\n\n${generatedEmailBody}`);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const examCompletionPercent = Math.round(
    (Object.values(examChecks).filter(Boolean).length / Object.keys(examChecks).length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-[#03C988]/10 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 2: Dual Application & Professor Outreach
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              Dual Application, Agency Code & Medical Command
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Master the mandatory dual submission process: synchronize your CSC Online Portal application (campuschina.org) with direct university portals, copy official 5-digit Agency Codes, and secure professor pre-acceptance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.campuschina.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              Open CampusChina.org <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSection("dual_portal")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSection === "dual_portal"
                ? "bg-amber-500/15 border-amber-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">1. Dual Portal & Agency Codes</div>
              <div className="text-[10px] text-slate-400">CSC Type A vs Type B Matrix</div>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("professor_outreach")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSection === "professor_outreach"
                ? "bg-indigo-500/15 border-indigo-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">2. Professor Outreach Studio</div>
              <div className="text-[10px] text-slate-400">Pre-Admission Acceptance Letters</div>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("physical_exam")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeSection === "physical_exam"
                ? "bg-emerald-500/15 border-emerald-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">3. Foreigner Physical Exam</div>
              <div className="text-[10px] text-slate-400">Nigerian Hospital Audit & Tests</div>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 1: DUAL PORTAL & AGENCY CODE MATRIX */}
      {activeSection === "dual_portal" && (
        <div className="space-y-6">
          {/* Dual Submission Strategy Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type A: Bilateral Route */}
            <div className="bg-[#071328] border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                    <Building className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">CSC Type A (Bilateral Route)</h3>
                    <p className="text-[10px] font-mono text-slate-400">Dispatch Agency Code: <strong className="text-amber-400">5661</strong></p>
                  </div>
                </div>
                <span className="bg-amber-500/15 text-amber-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  ABUJA EMBASSY / FSB
                </span>
              </div>

              <div className="space-y-3.5 mt-4 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Processed via the <strong>Federal Scholarship Board (FSB)</strong> under Nigeria's Federal Ministry of Education in Abuja and the Chinese Embassy Bilateral Program.
                </p>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-850 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Agency Code on CSC:</span>
                    <span className="text-amber-400 font-bold">5661 (Embassy in Abuja)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Universities:</span>
                    <span className="text-white">Choose 3 Preferences</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>FSB Exam / Interview:</span>
                    <span className="text-[#03C988] font-bold">Physical / CBT in Abuja</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-start gap-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Crucial Rule:</strong> If you obtain a Pre-Admission Letter from a Chinese university professor, upload it to your Type A application to guarantee placement in your first-choice institution.
                  </span>
                </div>
              </div>
            </div>

            {/* Type B: Direct University Route */}
            <div className="bg-[#071328] border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">CSC Type B (University Route)</h3>
                    <p className="text-[10px] font-mono text-slate-400">Direct University Agency Code</p>
                  </div>
                </div>
                <span className="bg-indigo-500/15 text-indigo-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  INDEPENDENT QUOTA
                </span>
              </div>

              <div className="space-y-3.5 mt-4 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Applied directly to your chosen Chinese university. The university's International School reviews and nominates candidate files directly to CSC.
                </p>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-850 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Application Step 1:</span>
                    <span className="text-indigo-400 font-bold">Apply on CampusChina.org</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Application Step 2:</span>
                    <span className="text-indigo-400 font-bold">Apply on University Portal</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Application Fee:</span>
                    <span className="text-white">¥400 - ¥800 RMB (or Waived)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-start gap-2 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dual Submission Rule:</strong> You MUST submit BOTH the CSC Portal application AND the university’s own admissions portal. Submitting to only one results in automatic disqualification.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 53+ University Agency Code Quick-Search Directory */}
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Search className="h-4 w-4 text-amber-500" />
                  53+ Chinese Universities Agency Code Master Database
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click any Agency Code to copy directly into your CampusChina application form.
                </p>
              </div>

              {/* Track Filters */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-850">
                {["All", "Engineering", "Business", "Medical", "Science", "Humanities"].map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      selectedTrack === track
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search university name, agency code (e.g. 10003), or city (e.g. Beijing, Shanghai, Hangzhou)..."
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.id}
                  className="bg-slate-950/80 border border-slate-850 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                          Rank #{uni.ranking} • {uni.city}
                        </span>
                        <h4 className="text-xs font-bold text-white font-display leading-tight mt-0.5">
                          {uni.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono font-bold rounded">
                        Type B
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {uni.tracks.map((t) => (
                        <span key={t} className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">CSC Agency Code</div>
                      <button
                        onClick={() => handleCopyAgency(uni.agencyCode, uni.id)}
                        className="flex items-center gap-1.5 mt-0.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer group-hover:scale-105"
                      >
                        <span>{uni.agencyCode}</span>
                        {copiedId === uni.id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#03C988]" />
                        ) : (
                          <Copy className="h-3 w-3 text-slate-500" />
                        )}
                      </button>
                    </div>

                    <a
                      href={uni.applicationPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-[10.5px] font-medium flex items-center gap-1 transition"
                    >
                      Portal <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROFESSOR OUTREACH & PRE-ADMISSION STUDIO */}
      {activeSection === "professor_outreach" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-400" />
                  Professor Cold-Outreach & Pre-Admission Letter Generator
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Chinese university supervisors hold direct quota allocations for CSC Type B nominations. Use our culturally optimized outreach template engineered to maximize response rates.
                </p>
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md shrink-0"
              >
                {emailCopied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Email Template
                  </>
                )}
              </button>
            </div>

            {/* Input Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Professor Name</label>
                <input
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="e.g. Zhang / Wang / Liu"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Chinese University</label>
                <input
                  type="text"
                  value={targetUniName}
                  onChange={(e) => setTargetUniName(e.target.value)}
                  placeholder="e.g. Tsinghua University"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Degree Target</label>
                <select
                  value={studentDegree}
                  onChange={(e) => setStudentDegree(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree (M.Sc / M.Eng)</option>
                  <option value="Ph.D.">Ph.D. / Doctoral Candidate</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Research Field & Proposed Focus</label>
                <input
                  type="text"
                  value={researchInterest}
                  onChange={(e) => setResearchInterest(e.target.value)}
                  placeholder="e.g. Renewable energy microgrids, AI in healthcare, International trade law..."
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Nigerian Undergrad Institution & CGPA</label>
                <input
                  type="text"
                  value={studentGpa}
                  onChange={(e) => setStudentGpa(e.target.value)}
                  placeholder="e.g. 4.65/5.00 First Class"
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Preview Container */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-850 text-slate-400 text-[11px]">
                <div>
                  <span className="text-slate-500">Subject: </span>
                  <span className="text-indigo-300 font-semibold">{generatedEmailSubject}</span>
                </div>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                  Cultural Protocol: High Respect
                </span>
              </div>
              <div className="whitespace-pre-wrap text-slate-300 font-sans text-xs leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                {generatedEmailBody}
              </div>
            </div>

            {/* Cultural Etiquette Rules for Chinese Professors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Best Time to Send
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Send emails between <strong>8:00 AM - 10:00 AM China Standard Time (UTC+8)</strong> (which corresponds to 1:00 AM - 3:00 AM Nigerian Time WAT).
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1.5">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Attachment Format
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Never attach large .ZIP files or Google Drive links (blocked in China). Always attach <strong>PDF documents under 5MB</strong>.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5" /> Follow-up Etiquette
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  If you receive no reply after <strong>7 business days</strong>, send one polite follow-up. Do not message multiple professors in the exact same lab simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PHYSICAL EXAM & MEDICAL DIAGNOSTIC */}
      {activeSection === "physical_exam" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <HeartPulse className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-white font-display">
                    Official Chinese Foreigner Physical Examination Form Diagnostic
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  The Chinese Embassy and CSC mandate the standardized 2-page Foreigner Physical Examination Form (外国人体格检查表). Over 35% of Nigerian rejections stem from missing round hospital seals or missing lab reports.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 text-right shrink-0">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Medical Readiness</div>
                <div className="text-xl font-bold font-mono text-[#03C988] mt-0.5">
                  {examCompletionPercent}% Verified
                </div>
              </div>
            </div>

            {/* Checklist of Mandatory Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "hospital_gov",
                  title: "Government / Tertiary Hospital Issuance",
                  desc: "Must be issued by an authorized Federal Medical Centre, State University Teaching Hospital (e.g. National Hospital Abuja, LUTH, UCH Ibadan). Private clinic letters are rejected."
                },
                {
                  id: "photo_stamp",
                  title: "Hospital Round Stamp Over Photograph",
                  desc: "Your passport photograph on Page 1 must have the hospital's official round seal stamped PARTIALLY on the photo and partially on the paper."
                },
                {
                  id: "doctor_sig",
                  title: "Physician Signature & Date",
                  desc: "The examining physician must sign, print their full name, and date the form on Page 2 next to the official hospital stamp."
                },
                {
                  id: "blood_hiv",
                  title: "HIV 1/2 Antibody Test Attached",
                  desc: "Official lab printout showing Non-Reactive / Negative status must be attached with the hospital form."
                },
                {
                  id: "blood_syphilis",
                  title: "Syphilis (VDRL / RPR / TPHA) Test Attached",
                  desc: "Mandatory blood screening report confirming negative / non-reactive result."
                },
                {
                  id: "blood_hepb",
                  title: "Hepatitis B Surface Antigen (HBsAg) Report",
                  desc: "Standard blood test verifying negative status for infectious hepatitis."
                },
                {
                  id: "ecg_strip",
                  title: "Electrocardiogram (ECG) Strip / Report",
                  desc: "Must attach the physical printed rhythm strip and doctor's normal sinus rhythm endorsement."
                },
                {
                  id: "chest_xray",
                  title: "Chest X-Ray (CXR) Radiologist Report",
                  desc: "Must verify 'Lungs clear, no active pulmonary tuberculosis lesions' with radiologist stamp."
                },
                {
                  id: "validity_6m",
                  title: "6-Month Expiry Window Alignment",
                  desc: "Results are only valid for 6 months from the date of examination. Do not conduct the test too early before university review."
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    setExamChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                    examChecks[item.id]
                      ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                      : "bg-slate-950/70 border-slate-850 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!examChecks[item.id]}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded accent-emerald-500 shrink-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authorized Hospital Reference Directory (Nigeria) */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Recommended Federal & State Teaching Hospitals in Nigeria
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-sans text-slate-300">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                  <strong className="text-white block font-semibold mb-0.5">Abuja / North Central:</strong>
                  <span>National Hospital Abuja, Garki Hospital, FMC Jabi, UATH Gwagwalada.</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                  <strong className="text-white block font-semibold mb-0.5">Lagos / South West:</strong>
                  <span>LUTH Idi-Araba, LASUTH Ikeja, FMC Ebute-Metta, UCH Ibadan.</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                  <strong className="text-white block font-semibold mb-0.5">South East / South South:</strong>
                  <span>UNTH Enugu, UBTH Benin City, UPTH Port Harcourt, FMC Owerri.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
