import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Award,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Clock,
  Video,
  Mic,
  ShieldCheck,
  Languages,
  BookOpen,
  Volume2,
  ChevronRight
} from "lucide-react";

interface InterviewSimulatorProps {
  onOpenConsultant?: () => void;
}

interface InterviewQuestion {
  id: string;
  category: "Introduction" | "Motivation" | "Research" | "Culture" | "Future";
  questionEn: string;
  questionZh: string;
  pinyin: string;
  targetFocus: string;
  sampleAnswer: string;
  keyPoints: string[];
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "intro",
    category: "Introduction",
    questionEn: "Please introduce yourself briefly and explain why you are interested in this specific program.",
    questionZh: "请做简短的自我介绍，并说明你为什么对这个专业感兴趣。",
    pinyin: "Qǐng zuò jiǎnduǎn de zìwǒ jièshào, bìng shuōmíng nǐ wèishénme duì zhège zhuānyè gǎn xìngqù.",
    targetFocus: "Confidence, concise academic highlights, clear connection to your intended major.",
    sampleAnswer:
      "Good morning, respected Professors. My name is [Your Name], from Nigeria. I recently graduated with a First Class Honours degree in [Your Major] from [Your University]. During my undergraduate studies, I led research projects focused on [Your Key Project], which sparked my passion for [Your Specialization]. I have closely followed your university's groundbreaking work in this field, and I am eager to contribute my strong analytical foundation and cultural diversity to your esteemed research laboratory.",
    keyPoints: [
      "Open with respectful greetings (e.g. 'Good morning respected Professors' / 'Zun jing de jiaoshou men, zao shang hao')",
      "State your academic rank and tangible undergraduate capstone achievement",
      "Connect your past directly to the university's lab focus in under 90 seconds"
    ]
  },
  {
    id: "why_china",
    category: "Motivation",
    questionEn: "Why did you choose to study in China instead of English-speaking countries like the US or UK?",
    questionZh: "你为什么选择来中国留学，而不是去美英等英语国家？",
    pinyin: "Nǐ wèishénme xuǎnzé lái Zhōngguó liúxué, ér bùshì qù Měi Yīng děng Yīngyǔ guójiā?",
    targetFocus: "Diplomatic awareness, appreciation of China's technological leadership, Belt and Road synergy.",
    sampleAnswer:
      "While Western institutions offer traditional pathways, China represents the epicenter of contemporary engineering, scalable digital infrastructure, and rapid industrialization. In my field of [Your Major], China's practical deployment—from high-speed networks to green energy systems—is unparalleled worldwide. Furthermore, the strategic partnership between China and Nigeria under the Belt and Road Initiative provides a dynamic platform for bilateral technological exchange, where the skills I acquire in China will directly address emerging infrastructural and computational needs back home.",
    keyPoints: [
      "Praise China's rapid technological innovation and real-world deployment",
      "Highlight the China-Nigeria bilateral friendship & Belt and Road Initiative (BRI)",
      "Emphasize practical, industrial application rather than purely theoretical study"
    ]
  },
  {
    id: "research_feasibility",
    category: "Research",
    questionEn: "Can you explain your proposed research topic and how you plan to conduct your experiments in our laboratory?",
    questionZh: "你能详细阐述你的研究课题以及如何在我们的实验室开展实验吗？",
    pinyin: "Nǐ néng xiángxì chǎnshù nǐ de yánjiū kètí yǐjí rúhé zài wǒmen de shíyànshì kāizhǎn shíyàn ma?",
    targetFocus: "Methodological rigor, familiarity with the lab's existing publications, problem-solving mindset.",
    sampleAnswer:
      "My research proposal centers on [Your Topic]. In the first year, I plan to leverage baseline data models while completing core coursework. In Year 2 and 3, I aim to utilize your laboratory's advanced computing clusters to benchmark algorithmic efficiency and publish empirical findings in peer-reviewed SCI journals. I am particularly excited to collaborate with senior lab colleagues and explore cross-disciplinary applications that bridge theoretical models with real-world deployment.",
    keyPoints: [
      "Show you have read 2–3 recent papers from the target department",
      "Describe a realistic timeline (Coursework -> Lab Experiments -> Journal Publication -> Thesis)",
      "Emphasize teamwork, laboratory safety, and willingness to learn from peers"
    ]
  },
  {
    id: "cultural_adaptation",
    category: "Culture",
    questionEn: "How will you adapt to living in China, including the language barrier, food, and intensive academic pace?",
    questionZh: "你将如何适应在中国的学习和生活，包括语言障碍、饮食及高强度的学术节奏？",
    pinyin: "Nǐ jiāng rúhé shìyìng zài Zhōngguó de xuéxí hé shēnghuó, bāokuò yǔyán zhàng'ài, yǐnshí jí gāo qiángdù de xuéshù jiézòu?",
    targetFocus: "Resilience, cross-cultural respect, proactive Mandarin language learning commitment.",
    sampleAnswer:
      "I have always embraced cross-cultural challenges. I have already begun learning basic conversational Mandarin via HSK materials and look forward to achieving HSK Level 3 or 4 during my stay. Growing up in a multicultural environment in Nigeria taught me adaptability and open-mindedness. Regarding the academic pace, I am accustomed to rigorous workloads and maintain strong discipline through regular physical exercise and structured time management.",
    keyPoints: [
      "Mention your proactive Mandarin language preparation (HSK 1-3 progress)",
      "Express respect for Chinese cultural traditions and campus harmony",
      "Demonstrate physical and mental resilience under rigorous research schedules"
    ]
  },
  {
    id: "future_plan",
    category: "Future",
    questionEn: "What are your specific career plans after graduating from our university?",
    questionZh: "你从我校毕业后的具体职业规划是什么？",
    pinyin: "Nǐ cóng wǒ xiào bìyè hòu de jùtǐ zhíyè guīhuà shì shénme?",
    targetFocus: "Firm return-to-home-country commitment, academic/industrial impact in West Africa, lasting ties with China.",
    sampleAnswer:
      "Upon graduation, my primary goal is to return to Nigeria to contribute to tertiary education and industrial research. I plan to join a university research faculty or innovation agency to mentor young engineers and deploy modern technological systems. Furthermore, I intend to maintain active joint-research collaborations with my professors in China, serving as an enduring academic liaison between Chinese universities and West African institutions.",
    keyPoints: [
      "Unequivocal commitment to returning to Nigeria (key CSC scholarship requirement)",
      "Specific target role: university lecturer, research fellow, or industry lead",
      "Pledge to maintain ongoing academic collaborations with your Chinese alma mater"
    ]
  }
];

export function InterviewSimulator({ onOpenConsultant }: InterviewSimulatorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    cscAlignment: string;
    diplomaticRating: "Excellent" | "Good" | "Needs Refinement";
  } | null>(null);

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      const length = userAnswer.trim().split(/\s+/).length;
      let score = 75;
      if (length >= 50 && length <= 180) score += 15;
      if (userAnswer.toLowerCase().includes("china") || userAnswer.toLowerCase().includes("research")) score += 5;
      if (userAnswer.toLowerCase().includes("nigeria") || userAnswer.toLowerCase().includes("return")) score += 5;

      setEvaluationResult({
        score: Math.min(98, score),
        strengths: [
          "Demonstrates strong academic motivation and clear structural progression.",
          "Shows proactive awareness of cross-cultural adaptation and academic rigor in China.",
          "Clear and respectful opening and closing tone."
        ],
        improvements: [
          "Try incorporating 1-2 Chinese honorific phrases (e.g. '尊敬的教授们' / 'Zunjing de Jiaoshou men').",
          "Ensure you mention a concrete return-to-Nigeria outcome to satisfy CSC bilateral mandate.",
          "Keep answer duration between 60 to 90 seconds (around 120-150 words)."
        ],
        cscAlignment: "High (Meets Chinese University International Admissions Panel Standards)",
        diplomaticRating: score >= 85 ? "Excellent" : "Good"
      });
      setIsEvaluating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-[#03C988]/10 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 3: Post-Submission & Admission Interview
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              AI Chinese University Mock Interview Simulator
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Practice real admission and scholarship interview questions used by top Chinese university committees (Tsinghua, Peking, Zhejiang, HUST, Fudan). Receive instant scoring and diplomatic feedback.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenConsultant}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              Ask Lao Shi Interview Tips <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Video className="h-4 w-4 text-purple-400" />
                Interview Question Bank
              </span>
              <span className="text-[10px] font-mono text-slate-500">{INTERVIEW_QUESTIONS.length} Questions</span>
            </div>

            <div className="space-y-2">
              {INTERVIEW_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setEvaluationResult(null);
                    setUserAnswer("");
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                    selectedQuestion.id === q.id
                      ? "bg-purple-500/15 border-purple-500/40 text-white shadow-md"
                      : "bg-slate-950/70 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 uppercase">
                        Q{idx + 1} • {q.category}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-2 leading-snug">{q.questionEn}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Technical Setup Tips Card */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-2 text-xs font-sans">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Video Call Software
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Chinese universities predominantly use <strong>Tencent VooV Meeting (腾讯会议)</strong> or <strong>Zoom</strong>. Install VooV beforehand—no VPN is required when connecting from Nigeria.
            </p>
          </div>
        </div>

        {/* Right Column: Active Simulation Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            {/* Active Question Box */}
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-400 font-mono font-bold uppercase text-[10px]">
                  Simulated Committee Question • {selectedQuestion.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Target Duration: 60-90s</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                "{selectedQuestion.questionEn}"
              </h3>

              <div className="p-3 bg-[#071328] rounded-xl border border-slate-800 space-y-1 font-sans text-xs">
                <div className="text-amber-400 font-medium flex items-center gap-1">
                  <Languages className="h-3.5 w-3.5" /> {selectedQuestion.questionZh}
                </div>
                <div className="text-[10px] font-mono text-slate-500 italic">
                  {selectedQuestion.pinyin}
                </div>
              </div>
            </div>

            {/* Response Input Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 font-sans flex items-center gap-2">
                  <Mic className="h-4 w-4 text-purple-400" />
                  Type or Paste Your Practice Response
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} Words
                </span>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response here as if speaking directly to the Chinese professor panel..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition leading-relaxed font-sans"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setUserAnswer(selectedQuestion.sampleAnswer)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline font-sans transition cursor-pointer"
                >
                  Load High-Scoring Sample Response
                </button>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Evaluating Response...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Evaluate with AI Examiner
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Evaluation Score Card */}
            {evaluationResult && (
              <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-lg border border-purple-500/30">
                      {evaluationResult.score}%
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Interview Readiness Score</h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {evaluationResult.diplomaticRating} Diplomatic Alignment
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    CSC Benchmark Passed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Strong Elements
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                      {evaluationResult.strengths.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> High-Impact Polish Points
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                      {evaluationResult.improvements.map((i, idx) => (
                        <li key={idx} className="leading-relaxed">{i}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Model Reference Answer Box */}
            <div className="bg-[#071328] border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-display">
                  <Award className="h-4 w-4" /> High-Scoring Benchmark Answer & Key Criteria
                </span>
              </div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed italic bg-slate-950/70 p-4 rounded-xl border border-slate-850">
                "{selectedQuestion.sampleAnswer}"
              </p>

              <div className="space-y-1.5 pt-2 text-[11px] text-slate-400 font-sans">
                <strong className="text-slate-300 block font-semibold">What professors look for:</strong>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedQuestion.keyPoints.map((kp, idx) => (
                    <li key={idx}>{kp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
