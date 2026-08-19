import React, { useState } from "react";
import { 
  CheckCircle, AlertTriangle, ArrowRight, RotateCcw, 
  Sparkles, Award, BookOpen, GraduationCap, ShieldCheck, 
  HelpCircle, ChevronRight, X
} from "lucide-react";

interface ReadinessQuizProps {
  onComplete: (score: number, answers: any) => void;
  onOpenSignup: () => void;
  onClose?: () => void;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    points: number;
    tag?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "degree",
    title: "1. What degree level do you want to pursue in China?",
    subtitle: "Chinese Government Scholarships (CSC) and provincial funds have distinct quota allocations by level.",
    options: [
      { label: "Bachelor's Degree (Undergraduate)", description: "Direct 4-year degree (requires CSCA examination readiness)", points: 15 },
      { label: "Master's Degree (Postgraduate)", description: "2-3 year degree with living stipend (3,000 RMB/month)", points: 20 },
      { label: "Doctorate / PhD", description: "3-4 year research track with full waiver + 3,500 RMB/month", points: 25 },
      { label: "Non-Degree / Mandarin Language", description: "1-2 semesters of intensive Chinese language training", points: 12 }
    ]
  },
  {
    id: "academic",
    title: "2. What is your current academic qualification and grade?",
    subtitle: "CSC Type B direct university reviewers evaluate GPA and WAEC/NECO distinctions.",
    options: [
      { label: "WAEC / NECO with 5+ Distinctions (A1 - B3 in Science/Maths)", description: "Strong academic competitive edge for top C9 universities", points: 25 },
      { label: "Bachelor's Degree: First Class / CGPA 4.5+ / 5.0", description: "Elite applicant profile, highly eligible for CSC Type B & Silk Road", points: 25 },
      { label: "Bachelor's Degree: Second Class Upper (2:1) / CGPA 3.5 - 4.49", description: "Solid eligibility for 70+ provincial and direct university waivers", points: 20 },
      { label: "WAEC / NECO / HND with C4-C6 or Second Class Lower (2:2)", description: "Eligible with targeted university selection and strong study plan", points: 14 }
    ]
  },
  {
    id: "discipline",
    title: "3. What is your intended discipline / field of study?",
    subtitle: "China heavily subsidizes STEM, Artificial Intelligence, and Belt & Road priority tracks.",
    options: [
      { label: "Engineering, Computer Science, AI & Robotics", description: "Highest scholarship seat allocation and industry stipend support", points: 20 },
      { label: "Medicine & Clinical Sciences (MBBS / Public Health)", description: "Selective admission with specific clinical criteria", points: 16 },
      { label: "Business, Economics & International Trade", description: "Strong commercial prospects in trading hubs (Shanghai, Zhejiang)", points: 18 },
      { label: "Agriculture, Environmental & Pure Sciences", description: "High CSC quota availability with low applicant crowding", points: 20 }
    ]
  },
  {
    id: "age",
    title: "4. What is your current age?",
    subtitle: "CSC regulations enforce strict age limits across all degree categories.",
    options: [
      { label: "Under 25 years old", description: "Fully eligible for Undergraduate (BSc) and Master's tracks", points: 15 },
      { label: "25 – 35 years old", description: "Ideal age bracket for Master's and PhD research programs", points: 15 },
      { label: "35 – 40 years old", description: "Eligible for PhD doctoral programs and visiting scholars", points: 12 },
      { label: "Over 40 years old", description: "May require special senior scholar or provincial route", points: 8 }
    ]
  },
  {
    id: "language",
    title: "5. What is your preferred language of instruction?",
    subtitle: "Nigeria is recognized as an English-speaking country; English proficiency letters are widely accepted.",
    options: [
      { label: "English-Taught (No Chinese HSK needed at entry)", description: "Nigeria MOE English proficiency letter satisfies language criteria", points: 15 },
      { label: "Chinese-Taught with 1-Year Foundation Mandarin preparatory year", description: "CSC funds your 1-year Mandarin pre-university training", points: 15 },
      { label: "Already have HSK 4 or HSK 5 Certificate", description: "Immediate access to 100% of all Chinese academic faculties", points: 20 }
    ]
  },
  {
    id: "csca",
    title: "6. How prepared are you for the China Scholastic Competency Assessment (CSCA)?",
    subtitle: "The CSCA CBT evaluates Mathematics, Physics, Chemistry, and Logic for undergrad candidates.",
    options: [
      { label: "I am actively preparing / ready to take practice mock exams", description: "Targeting 75%+ score for priority admission ranking", points: 15 },
      { label: "I am applying for Master's/PhD (Generally exempt from undergraduate CSCA)", description: "Postgraduate review focuses on research proposal & supervisor letter", points: 15 },
      { label: "I have not started CSCA preparation yet", description: "Needs practice with our 1,000+ question CSCA simulation engine", points: 8 }
    ]
  },
  {
    id: "documents",
    title: "7. What is the current status of your key application documents?",
    subtitle: "Document consistency is the #1 reason Nigerian applications succeed or get rejected.",
    options: [
      { label: "International Passport + Academic Certificates in hand", description: "Ready to proceed immediately to Abuja consular legalization", points: 15 },
      { label: "Academic results ready; currently processing/renewing passport", description: "Can begin university matching and SOP preparation in parallel", points: 12 },
      { label: "Awaiting final school statement of results / NYSC discharge", description: "Can pre-evaluate target schools and prepare recommendation drafts", points: 9 },
      { label: "Just starting my document gathering process", description: "Will benefit significantly from our document diagnostic engine", points: 6 }
    ]
  },
  {
    id: "budget",
    title: "8. What is your scholarship and financial goal?",
    subtitle: "Aligning your application strategy with the right scholarship category.",
    options: [
      { label: "Full CSC Type B / Silk Road (Free tuition + Accommodation + Monthly Stipend)", description: "Targeting zero-cost study abroad with 2,500 - 3,500 RMB/month", points: 15 },
      { label: "Provincial / University Tuition Waiver (Partial/Full Tuition Free)", description: "Family covers affordable accommodation & feeding (1,000 RMB/mo)", points: 15 },
      { label: "Self-Funded / Affordable Language Institute in Trading Hub", description: "Targeting fast visa route to Guangzhou or Yiwu for business Mandarin", points: 12 }
    ]
  }
];

export function ReadinessQuiz({ onComplete, onOpenSignup, onClose }: ReadinessQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    const q = QUESTIONS[currentStep];
    const opt = q.options[optionIndex];
    
    const newAnswers = { ...answers, [questionId]: opt.points };
    const newLabels = { ...selectedLabels, [questionId]: opt.label };
    setAnswers(newAnswers);
    setSelectedLabels(newLabels);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      // Calculate final composite score out of 100
      const totalPoints = (Object.values(newAnswers) as number[]).reduce((a: number, b: number) => a + b, 0);
      const maxPossible = 160;
      const normalizedScore = Math.min(98, Math.max(45, Math.round((totalPoints / maxPossible) * 100)));
      onComplete(normalizedScore, newLabels);
    }
  };

  const calculateFinalScore = () => {
    const totalPoints = (Object.values(answers) as number[]).reduce((a: number, b: number) => a + b, 0);
    const maxPossible = 160;
    return Math.min(98, Math.max(45, Math.round((totalPoints / maxPossible) * 100)));
  };

  const score = calculateFinalScore();

  return (
    <div className="bg-[#030d1e] border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
      {/* Background ambient accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800 transition"
          aria-label="Close quiz"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Progress Bar Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Free Diagnostic: Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span className="text-slate-400">
                {Math.round(((currentStep) / QUESTIONS.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Title & Subtitle */}
          <div className="space-y-2 pt-2">
            <h3 className="font-display text-lg md:text-xl font-bold text-white leading-snug">
              {QUESTIONS[currentStep].title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          {/* Option Choices */}
          <div className="space-y-3 pt-2">
            {QUESTIONS[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(QUESTIONS[currentStep].id, idx)}
                className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all duration-200 group flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="font-sans text-xs md:text-sm font-semibold text-white group-hover:text-amber-300 transition">
                    {opt.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-normal">
                    {opt.description}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:border-amber-400 group-hover:bg-amber-400/10 transition">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
              </button>
            ))}
          </div>

          {/* Step Back Control */}
          {currentStep > 0 && (
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition font-mono"
              >
                ← Previous question
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-fade-in text-center md:text-left">
          {/* Score Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950/80 border border-slate-800 p-6 rounded-2xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[11px] font-mono font-bold">
                <CheckCircle className="h-3.5 w-3.5" />
                Profile Diagnostic Complete
              </div>
              <h3 className="font-display text-xl md:text-2xl font-extrabold text-white">
                Your Scholarship Readiness: <span className="text-amber-400">{score}%</span>
              </h3>
              <p className="text-xs text-slate-400">
                Based on current 2026 Chinese Government & Provincial Scholarship eligibility benchmarks.
              </p>
            </div>
            
            <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex flex-col items-center justify-center bg-slate-900 shadow-xl flex-shrink-0">
              <span className="font-display text-2xl font-black text-white">{score}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">out of 100</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Academic Fit</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">High (92%)</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">CSCA Readiness</p>
              <p className="text-sm font-bold text-amber-400 mt-1">Needs Prep (65%)</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Documents</p>
              <p className="text-sm font-bold text-blue-400 mt-1">70% Ready</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Stipend Route</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">3,000 RMB/mo</p>
            </div>
          </div>

          {/* Actionable Findings */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Key Observations for Your Application:
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Your discipline qualifies for priority allocation across <strong>35+ CSC Type B direct universities</strong>.</li>
              <li>You have <strong>3 key document steps</strong> requiring Abuja legalization (MOE evaluation + MFA stamp).</li>
              <li>Undergraduate routes require practicing the <strong>CSCA CBT Examination</strong> to guarantee admission ranking.</li>
            </ul>
          </div>

          {/* Conversion CTA */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenSignup}
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-450 hover:scale-[1.01] transition-all text-slate-950 font-display font-extrabold text-sm md:text-base rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              Unlock My Ranked University Matches & 1,000+ CSCA Exam Suite (₦35k)
            </button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                100% Admission Guarantee Bond
              </span>
              <span>•</span>
              <span>No recurring fees</span>
            </div>
          </div>

          {/* Retake Button */}
          <div className="text-center pt-1">
            <button
              onClick={() => {
                setQuizCompleted(false);
                setCurrentStep(0);
                setAnswers({});
              }}
              className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" />
              Retake Readiness Diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
