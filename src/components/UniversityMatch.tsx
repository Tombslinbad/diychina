import React, { useState, useMemo } from "react";
import { 
  University, StudentMatchProfile 
} from "../types";
import { UNIVERSITIES } from "../universitiesData";
import { 
  Search, CheckCircle2, AlertTriangle, XCircle, 
  ExternalLink, Sparkles, Filter, Bookmark, BookmarkCheck, 
  ChevronDown, Building, Award, BookOpen, ShieldCheck, Info
} from "lucide-react";

interface UniversityMatchProps {
  universities?: University[];
  userProfile?: any | null;
  onOpenConsultant?: () => void;
  onSaveUni?: (uniId: string) => void;
  onSelectUniversity?: (uni: University) => void;
  onNavigateToCsca?: () => void;
  onNavigateToDocuments?: () => void;
}

export function UniversityMatch({ 
  universities = UNIVERSITIES, 
  userProfile, 
  onOpenConsultant,
  onSaveUni,
  onSelectUniversity,
  onNavigateToCsca,
  onNavigateToDocuments
}: UniversityMatchProps) {
  // Default match profile based on user's onboarding or standard fallback
  const [profile, setProfile] = useState<StudentMatchProfile>({
    degree: (userProfile?.onboarding?.degree as any) || "Bsc",
    field: userProfile?.onboarding?.fieldOfStudy || "Engineering",
    gpa: userProfile?.onboarding?.gpa || "3.5 - 4.49 (2:1)",
    waecStatus: "5_credits_science",
    age: userProfile?.onboarding?.age || 22,
    cscaStatus: "studying",
    languagePref: "english",
    preferredCity: "All",
    targetScholarship: "any"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<"all" | "high" | "moderate">("all");
  const [savedUnis, setSavedUnis] = useState<Record<string, boolean>>({});
  const [inspectingUni, setInspectingUni] = useState<University | null>(null);

  const toggleSave = (id: string) => {
    setSavedUnis(prev => ({ ...prev, [id]: !prev[id] }));
    if (onSaveUni) onSaveUni(id);
  };

  // Advanced compatibility scoring algorithm
  const rankedUniversities = useMemo(() => {
    if (!universities || universities.length === 0) return [];

    return universities.map((uni) => {
      let score = 70; // baseline
      const reasonsFor: string[] = [];
      const reasonsCaution: string[] = [];
      const reasonsCritical: string[] = [];

      // 1. Discipline Track Match
      const matchesTrack = uni.tracks.some(t => 
        t.toLowerCase().includes(profile.field.toLowerCase()) ||
        profile.field.toLowerCase().includes(t.toLowerCase())
      );
      if (matchesTrack) {
        score += 15;
        reasonsFor.push(`Offers certified faculty in ${profile.field}`);
      } else {
        score -= 10;
        reasonsCaution.push(`Primary strengths are in other tracks (${uni.tracks.join(", ")})`);
      }

      // 2. Degree Level & Scholarship Route
      if (profile.degree === "Bsc") {
        if (uni.cscTypeA || uni.cscTypeB) {
          score += 10;
          reasonsFor.push("Allocates undergraduate CSC Type A & B quotas");
        }
        if (profile.age > 25) {
          score -= 15;
          reasonsCritical.push("Applicant age exceeds standard CSC undergraduate limit (≤25 years)");
        }
        reasonsCaution.push("Undergraduate entry subject to CSCA exam scores");
      } else if (profile.degree === "Masters") {
        if (uni.cscTypeB) {
          score += 12;
          reasonsFor.push("Direct CSC Type B University Postgraduate Route available");
        }
        if (profile.age > 35) {
          score -= 15;
          reasonsCritical.push("Applicant age exceeds standard Master's limit (≤35 years)");
        }
      } else if (profile.degree === "PhD") {
        score += 12;
        reasonsFor.push("Doctoral candidates receive priority 3,500 RMB/month living stipend");
      }

      // 3. GPA & Academic Standing
      if (profile.gpa.includes("First Class") || profile.gpa.includes("4.5")) {
        score += 10;
        reasonsFor.push("GPA qualifies comfortably for top-tier admissions review");
      } else if (profile.gpa.includes("Second Class Lower") && uni.ranking <= 10) {
        score -= 12;
        reasonsCaution.push("Top 10 C9 university; highly competitive GPA review");
      }

      // 4. Provincial / Silk Road Waivers
      if (uni.silkRoad) {
        score += 5;
        reasonsFor.push("Designated Belt & Road priority funding university");
      }
      if (uni.provincial) {
        score += 3;
        reasonsFor.push("Offers provincial government tuition waivers");
      }

      // 5. Preferred City Match
      if (profile.preferredCity !== "All" && uni.city.toLowerCase() === profile.preferredCity.toLowerCase()) {
        score += 8;
        reasonsFor.push(`Located in preferred city: ${uni.city}`);
      }

      // Normalize score between 48% and 97%
      const finalScore = Math.min(97, Math.max(48, score));

      return {
        uni,
        score: finalScore,
        reasonsFor,
        reasonsCaution,
        reasonsCritical,
        status: finalScore >= 85 ? "high" : finalScore >= 70 ? "moderate" : "low"
      };
    }).sort((a, b) => b.score - a.score);
  }, [universities, profile]);

  const filteredMatches = useMemo(() => {
    return rankedUniversities.filter(item => {
      const matchesSearch = item.uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.uni.agencyCode.includes(searchQuery);
      if (!matchesSearch) return false;
      if (selectedFilterCategory === "high" && item.score < 85) return false;
      if (selectedFilterCategory === "moderate" && (item.score < 70 || item.score >= 85)) return false;
      return true;
    });
  }, [rankedUniversities, searchQuery, selectedFilterCategory]);

  return (
    <div className="space-y-8 select-none">
      {/* Header Banner */}
      <div className="bg-[#030d1e] border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Automated Eligibility & Matching Engine
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              University Profile Match & Eligibility
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Our matching engine compares your academic profile, age, qualifications, and intended major directly against admission requirements for 53+ premier Chinese universities.
            </p>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2 min-w-[240px]">
            <span className="text-[10px] uppercase font-mono text-slate-400">Current Evaluation Profile:</span>
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{profile.degree} in {profile.field}</span>
              <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-mono">Age: {profile.age}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              GPA: {profile.gpa}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Parameters Control Accordion */}
      <div className="bg-[#030d1e]/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
            <Filter className="h-4 w-4 text-amber-400" />
            Adjust Your Match Parameters
          </div>
          <span className="text-[11px] text-slate-400">Updates matches in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Degree Level */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 font-bold">Target Degree:</label>
            <select
              value={profile.degree}
              onChange={(e) => setProfile({ ...profile, degree: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="Bsc">Bachelor's Degree (Undergrad)</option>
              <option value="Masters">Master's Degree (Postgrad)</option>
              <option value="PhD">Doctorate / PhD</option>
              <option value="Language">Mandarin Language School</option>
            </select>
          </div>

          {/* Major / Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 font-bold">Intended Discipline:</label>
            <select
              value={profile.field}
              onChange={(e) => setProfile({ ...profile, field: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="Engineering">Engineering (Mech, Civil, Elect)</option>
              <option value="Science">Computer Science & AI / Data</option>
              <option value="Medical">Medicine & Clinical (MBBS)</option>
              <option value="Business">Business & International Trade</option>
              <option value="Humanities">International Relations & Arts</option>
            </select>
          </div>

          {/* GPA Bracket */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 font-bold">Academic Standing / GPA:</label>
            <select
              value={profile.gpa}
              onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            >
              <option value="First Class / 4.5+">First Class / 4.5+ CGPA / 5+ WAEC A1s</option>
              <option value="3.5 - 4.49 (2:1)">Second Class Upper (2:1) / WAEC B2-B3</option>
              <option value="2.5 - 3.49 (2:2)">Second Class Lower (2:2) / WAEC C4-C6</option>
            </select>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 font-bold">Applicant Age:</label>
            <input
              type="number"
              min={16}
              max={50}
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || 20 })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search matching universities or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              selectedFilterCategory === "all" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All Matches ({rankedUniversities.length})
          </button>
          <button
            onClick={() => setSelectedFilterCategory("high")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilterCategory === "high" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Strong (85%+)
          </button>
          <button
            onClick={() => setSelectedFilterCategory("moderate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilterCategory === "moderate" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Target (70-84%)
          </button>
        </div>
      </div>

      {/* Ranked University Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(({ uni, score, reasonsFor, reasonsCaution, reasonsCritical }) => (
          <div
            key={uni.id}
            className="bg-[#030d1e] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-200 shadow-xl relative overflow-hidden group"
          >
            {/* Top Row: Name, Ranking, Compatibility Badge */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Agency: {uni.agencyCode}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Rank #{uni.ranking} in China
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      📍 {uni.city}
                    </span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white group-hover:text-amber-300 transition">
                    {uni.name}
                  </h3>
                </div>

                {/* Compatibility Score Circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-display font-black text-sm shadow-lg ${
                    score >= 85 ? "bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400" :
                    score >= 70 ? "bg-amber-500/10 border-2 border-amber-500 text-amber-400" :
                    "bg-rose-500/10 border-2 border-rose-500 text-rose-400"
                  }`}>
                    <span>{score}%</span>
                    <span className="text-[8px] font-mono uppercase opacity-70">Match</span>
                  </div>
                </div>
              </div>

              {/* Scholarship Badges */}
              <div className="flex flex-wrap gap-1.5">
                {uni.cscTypeB && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-semibold">
                    CSC Type B Direct
                  </span>
                )}
                {uni.cscTypeA && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold">
                    CSC Type A (Embassy)
                  </span>
                )}
                {uni.silkRoad && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                    Silk Road Belt & Road
                  </span>
                )}
                {uni.provincial && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-semibold">
                    Provincial Waiver
                  </span>
                )}
              </div>

              {/* Reasons Why You Match */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Why Your Profile Matches:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  {reasonsFor.slice(0, 2).map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Requirements or Cautions */}
              {reasonsCaution.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    Key Requirements to Verify:
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-slate-400">
                    {reasonsCaution.slice(0, 1).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-900">
              <button
                onClick={() => setInspectingUni(uni)}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Info className="h-3.5 w-3.5" />
                Audit Full Eligibility
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSave(uni.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    savedUnis[uni.id] 
                      ? "bg-amber-500 text-slate-950 border-amber-500" 
                      : "bg-slate-900 text-slate-400 hover:text-white border-slate-800"
                  }`}
                  title="Save to shortlist"
                >
                  {savedUnis[uni.id] ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>

                <a
                  href={uni.applicationPortal}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-850 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5 transition font-mono"
                >
                  <span>Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Eligibility Audit Modal */}
      {inspectingUni && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#030d1e] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Eligibility Assessment Breakdown
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {inspectingUni.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Agency Code: {inspectingUni.agencyCode} • City: {inspectingUni.city}
                </p>
              </div>
              <button
                onClick={() => setInspectingUni(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Checklist Matrix */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">Degree & Age Eligibility</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Your candidate age ({profile.age}) is compliant with standard CSC admission cut-offs.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">Living Stipend Structure</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Successful CSC candidates at {inspectingUni.name} receive full tuition waiver + free campus dorms + <strong>3,000 – 3,500 RMB/month</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">Document Requirements</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Requires 2 Recommendation Letters from Associate Professors and an authenticated Foreigner Physical Examination form with 6-month validity.
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  setInspectingUni(null);
                  onOpenConsultant();
                }}
                className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-450 text-slate-950 font-display font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Sparkles className="h-4 w-4 text-slate-950" />
                Ask Lao Shi AI About This School
              </button>

              <button
                onClick={() => setInspectingUni(null)}
                className="w-full sm:w-auto px-4 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs rounded-xl font-mono"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
