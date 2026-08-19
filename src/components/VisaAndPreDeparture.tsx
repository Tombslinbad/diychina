import React, { useState } from "react";
import {
  Plane,
  FileCheck,
  ShieldCheck,
  Calendar,
  CreditCard,
  Smartphone,
  Globe,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building,
  DollarSign,
  Compass,
  FileText
} from "lucide-react";

interface VisaAndPreDepartureProps {
  onOpenConsultant?: () => void;
}

export function VisaAndPreDeparture({ onOpenConsultant }: VisaAndPreDepartureProps) {
  const [activeTab, setActiveTab] = useState<"visa_jw" | "flight_routes" | "china_landing">("visa_jw");
  const [selectedCenter, setSelectedCenter] = useState<"abuja" | "lagos">("abuja");
  const [scholarshipType, setScholarshipType] = useState<"jw201" | "jw202">("jw201");

  // Interactive Arrival Checklist State
  const [landingChecks, setLandingChecks] = useState<Record<string, boolean>>({
    police_reg_24h: false,
    residence_permit_30d: false,
    alipay_card_setup: false,
    sim_card_activation: false,
    bank_account_icbc: false,
    health_check_entry: false
  });

  const landingProgress = Math.round(
    (Object.values(landingChecks).filter(Boolean).length / Object.keys(landingChecks).length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-[#03C988]/10 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 3: Visa, Flight & China Landing Command
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              JW201/JW202 Visa, Flights & 24h Landing Command
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Master the X1/X2 student visa process at CVASC Abuja/Lagos, compare JW201 vs JW202 documents, book optimal flight corridors, and execute mandatory 24-hour China arrival protocols.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.visaforchina.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              CVASC Online Portal <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("visa_jw")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "visa_jw"
                ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
              <FileCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">1. JW201 / JW202 & Visa Hub</div>
              <div className="text-[10px] text-slate-400">CVASC Abuja & Lagos Protocols</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("flight_routes")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "flight_routes"
                ? "bg-amber-500/15 border-amber-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Plane className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">2. Nigeria-China Flight Routes</div>
              <div className="text-[10px] text-slate-400">2x 23kg Baggage & Transit Guides</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("china_landing")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "china_landing"
                ? "bg-emerald-500/15 border-emerald-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">3. China Landing & Police Reg.</div>
              <div className="text-[10px] text-slate-400">Alipay, SIM & Residence Permit</div>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 1: JW201 vs JW202 & VISA APPLICATION CENTER (CVASC) */}
      {activeTab === "visa_jw" && (
        <div className="space-y-6">
          {/* JW201 vs JW202 Comparator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => setScholarshipType("jw201")}
              className={`p-6 rounded-3xl border transition cursor-pointer relative overflow-hidden shadow-lg ${
                scholarshipType === "jw201"
                  ? "bg-[#071328] border-amber-500/50"
                  : "bg-slate-950/70 border-slate-850"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-2 font-display">
                  <ShieldCheck className="h-4 w-4" />
                  JW201 Form (Chinese Government Scholarship)
                </span>
                <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                  FULL CSC SCHOLARSHIP
                </span>
              </div>
              <div className="space-y-2 mt-3 text-xs text-slate-300 font-sans">
                <p className="leading-relaxed">
                  Issued exclusively by the Ministry of Education of China for fully funded CSC Type A & Type B scholarship recipients.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Document Color:</span>
                    <span className="text-amber-400 font-bold">Yellow Header</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Visa Financial Proof:</span>
                    <span className="text-[#03C988] font-bold">EXEMPT (Stipend Covers All)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Visa Type Issued:</span>
                    <span className="text-white">X1 (Long-term &gt; 180 days)</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setScholarshipType("jw202")}
              className={`p-6 rounded-3xl border transition cursor-pointer relative overflow-hidden shadow-lg ${
                scholarshipType === "jw202"
                  ? "bg-[#071328] border-cyan-500/50"
                  : "bg-slate-950/70 border-slate-850"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-2 font-display">
                  <FileCheck className="h-4 w-4" />
                  JW202 Form (Self-Funded & Provincial Scholarships)
                </span>
                <span className="text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                  PROVINCIAL / SELF-PAID
                </span>
              </div>
              <div className="space-y-2 mt-3 text-xs text-slate-300 font-sans">
                <p className="leading-relaxed">
                  Issued by individual Chinese universities for self-funded students, Mayor/Provincial scholarship recipients, and Silk Road scholars.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Document Color:</span>
                    <span className="text-cyan-400 font-bold">White / Green Header</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Visa Financial Proof:</span>
                    <span className="text-amber-400 font-bold">Bank Statement Required (~$2,500+)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Visa Type Issued:</span>
                    <span className="text-white">X1 or X2 (&lt; 180 days)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CVASC Nigeria Submission Hub */}
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Building className="h-4 w-4 text-cyan-400" />
                  CVASC Submission Center Operations (Nigeria)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your physical application center to view specific biometrics and submission rules.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCenter("abuja")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    selectedCenter === "abuja"
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                  }`}
                >
                  Abuja Centre (Murjanatu House)
                </button>
                <button
                  onClick={() => setSelectedCenter("lagos")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    selectedCenter === "lagos"
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-950 text-slate-400 border border-slate-850 hover:text-white"
                  }`}
                >
                  Lagos Centre (Churchgate Tower)
                </button>
              </div>
            </div>

            {/* Center Details & Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <span className="font-bold text-white block">Center Address & Timings</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedCenter === "abuja"
                    ? "Murjanatu House, 1 Zambezi Crescent, Maitama, Abuja FCT. Mon-Fri 9:00 AM - 3:00 PM."
                    : "Churchgate Tower 2, 8th Floor, Plot PC 30, Afribank Street, Victoria Island, Lagos. Mon-Fri 9:00 AM - 3:00 PM."}
                </p>
                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                  Appointment via visaforchina.cn mandatory before arrival.
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3 md:col-span-2">
                <span className="font-bold text-white block">Mandatory X1 Visa Document Submission Order</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>1. Original Passport & 2 Bio-data Copies</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>2. Original Admission Notice + Copy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>3. Original JW201 or JW202 + Copy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>4. Notarized Transcripts & MFA Stamp</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>5. Physical Exam Form & Lab Reports</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#071328] rounded-lg border border-slate-850">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>6. Police Character Clearance (NPF)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FLIGHT CORRIDORS & BAGGAGE */}
      {activeTab === "flight_routes" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Plane className="h-5 w-5 text-amber-400" />
              Optimal Flight Corridors from Nigeria (Lagos/Abuja) to China
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
              {/* Route 1: Ethiopian */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Ethiopian Airlines</span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                      TOP RECOMMENDED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>Transit Hub:</strong> Addis Ababa (ADD)
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Direct onward connections from Addis Ababa to Beijing (PEK), Shanghai (PVG), Guangzhou (CAN), and Chengdu (TFU).
                  </p>
                </div>
                <div className="bg-[#071328] p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-amber-400 font-bold">Baggage: 2 Pieces × 23kg</div>
                  <div className="text-slate-400 text-[10px]">No transit visa required in Ethiopia for Nigerians.</div>
                </div>
              </div>

              {/* Route 2: Qatar Airways */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Qatar Airways</span>
                    <span className="text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                      PREMIUM SERVICE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>Transit Hub:</strong> Doha (DOH)
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Operates from Lagos (LOS) and Abuja (ABV) into Beijing Daxing (PKX), Shanghai, Guangzhou, and Hangzhou (HGH).
                  </p>
                </div>
                <div className="bg-[#071328] p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-cyan-400 font-bold">Baggage: 2 Pieces × 23kg</div>
                  <div className="text-slate-400 text-[10px]">Student Club discount includes +10kg extra baggage.</div>
                </div>
              </div>

              {/* Route 3: EgyptAir */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">EgyptAir</span>
                    <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                      BUDGET FRIENDLY
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>Transit Hub:</strong> Cairo (CAI)
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Direct flights into Beijing, Guangzhou, and Hangzhou. Often offers lowest base fare for early bookers.
                  </p>
                </div>
                <div className="bg-[#071328] p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-amber-400 font-bold">Baggage: 2 Pieces × 23kg</div>
                  <div className="text-slate-400 text-[10px]">Layover hotel provided for transfers over 8 hours.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CHINA LANDING, 24-HOUR POLICE REGISTRATION & LIVING */}
      {activeTab === "china_landing" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-400" />
                  First 30 Days in China: Essential Survival Checklist
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Check off each protocol upon arrival to avoid immigration fines or visa cancellation.
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-slate-950 rounded-xl border border-slate-850 text-right">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Arrival Readiness</span>
                <span className="text-base font-mono font-bold text-emerald-400">{landingProgress}% Done</span>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {[
                {
                  id: "police_reg_24h",
                  title: "1. Mandatory 24-Hour Police Registration (住宿登记)",
                  desc: "If living on-campus, your university dormitory office handles this automatically. If living off-campus, you must report to the local Police Station (派出所) within 24 hours of landing."
                },
                {
                  id: "residence_permit_30d",
                  title: "2. Convert X1 Visa to Residence Permit (Within 30 Days)",
                  desc: "Your X1 visa is a single-entry document valid for only 30 days. You must visit the local Public Security Bureau (PSB Exit-Entry) with your university teacher to convert it into a multi-entry Foreigner Residence Permit."
                },
                {
                  id: "sim_card_activation",
                  title: "3. China Mobile / Unicom SIM Card Setup",
                  desc: "Go to an official telecommunications branch with your original passport. Recommended plan: 100GB 5G data monthly (~¥50-¥80 RMB/month)."
                },
                {
                  id: "alipay_card_setup",
                  title: "4. Alipay & WeChat Pay International Card Linking",
                  desc: "You can link your Nigerian or international Mastercard/Visa directly to Alipay (TourPass/Bank Card) before your local Chinese bank account is opened."
                },
                {
                  id: "bank_account_icbc",
                  title: "5. Open Bank Account (ICBC / Bank of China)",
                  desc: "Take your Student ID card, Admission Notice, and Residence Permit slip to open a local debit card for monthly CSC scholarship stipend disbursements."
                },
                {
                  id: "health_check_entry",
                  title: "6. Port Health Inspection & Endorsement",
                  desc: "Submit your Nigerian Foreigner Physical Exam form to the Municipal International Travel Healthcare Center (海关国际旅行卫生保健中心) for local verification."
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    setLandingChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                    landingChecks[item.id]
                      ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                      : "bg-slate-950/70 border-slate-850 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!landingChecks[item.id]}
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
          </div>
        </div>
      )}
    </div>
  );
}
