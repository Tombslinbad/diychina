import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  CheckCircle2,
  Download,
  Languages,
  BookOpen,
  Send,
  UserCheck,
  Award,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  RefreshCw
} from "lucide-react";

interface StudyPlanStudioProps {
  userProfile?: any;
  onOpenConsultant?: () => void;
}

export function StudyPlanStudio({ userProfile, onOpenConsultant }: StudyPlanStudioProps) {
  const [activeTab, setActiveTab] = useState<"study_plan" | "recommendation_letters" | "guidelines">("study_plan");

  // Study Plan Generator State
  const [fullName, setFullName] = useState(userProfile?.fullName || "Adebayo Chukwuebuka Daniel");
  const [degree, setDegree] = useState("Master's Degree (M.Sc / M.Eng)");
  const [fieldOfStudy, setFieldOfStudy] = useState("Computer Science & Data Intelligence");
  const [targetUni, setTargetUni] = useState("Zhejiang University");
  const [undergradBackground, setUndergradBackground] = useState(
    "Bachelor of Science in Software Engineering, Covenant University (First Class Honours, CGPA 4.71/5.00)"
  );
  const [researchTopic, setResearchTopic] = useState(
    "Deep Learning Architectures for High-Throughput Agricultural Crop Yield Prediction and Resilient Supply Chain Forecasting in Sub-Saharan Africa"
  );
  const [futureGoals, setFutureGoals] = useState(
    "Spearhead AI-driven agricultural technology hubs across West Africa and foster high-level technical partnerships between Chinese research institutes and Nigerian tertiary institutions."
  );

  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedRec1, setCopiedRec1] = useState(false);
  const [copiedRec2, setCopiedRec2] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Rec letter custom state
  const [recommender1Name, setRecommender1Name] = useState("Prof. Emmanuel O. Balogun");
  const [recommender1Title, setRecommender1Title] = useState("Professor of Computer Systems & Dean of Engineering");
  const [recommender1Inst, setRecommender1Inst] = useState("Covenant University, Ota, Nigeria");

  const [recommender2Name, setRecommender2Name] = useState("Dr. Grace N. Okonkwo");
  const [recommender2Title, setRecommender2Title] = useState("Associate Professor & Head of Department");
  const [recommender2Inst, setRecommender2Inst] = useState("University of Lagos, Akoka, Nigeria");

  // Generated Comprehensive Study Plan (800+ words standard CSC format)
  const generatedStudyPlan = `ACADEMIC STUDY PLAN & RESEARCH PROPOSAL FOR CHINESE GOVERNMENT SCHOLARSHIP (CSC)

Applicant Name: ${fullName}
Target Degree Level: ${degree}
Intended Major & Specialization: ${fieldOfStudy}
Target Institution: ${targetUni}, People's Republic of China
Proposed Research Title: ${researchTopic}

================================================================================
SECTION I: ACADEMIC BACKGROUND & FOUNDATIONAL COMPETENCE
================================================================================
I hold a ${undergradBackground}. Throughout my undergraduate studies, I maintained a steadfast dedication to academic rigor, mathematical modeling, and software engineering. My final year capstone thesis focused on predictive analytical frameworks, which earned the Departmental Distinction Award.

Beyond classroom academics, I actively pursued hands-on research internships and industry projects where I implemented scalable algorithmic pipelines. These experiences sharpened my research curiosity and reinforced my desire to pursue rigorous postgraduate training in China—a world leader in technological innovation, high-speed computing, and industrial-scale infrastructure.

================================================================================
SECTION II: MOTIVATION FOR STUDYING IN CHINA & AT ${targetUni.toUpperCase()}
================================================================================
China's remarkable ascendancy in scientific research, advanced manufacturing, and artificial intelligence represents a global benchmark for engineering excellence. In particular, ${targetUni} stands at the absolute forefront of ${fieldOfStudy}, boasting world-class laboratory facilities, distinguished faculties, and a vibrant multicultural academic environment.

I have meticulously reviewed the research publications produced by ${targetUni}'s key laboratories. The faculty's cutting-edge work on foundational computational models and scalable systems directly aligns with my research aspirations. Studying at ${targetUni} will provide me with the advanced theoretical rigor and experimental tools required to execute high-impact research. Furthermore, China's Belt and Road Initiative and deepening educational ties with Nigeria provide a supportive backdrop for mutually beneficial technological exchange.

================================================================================
SECTION III: FOUR-YEAR DETAILED RESEARCH ROADMAP & METHODOLOGY
================================================================================
My proposed postgraduate research will be executed systematically across four structured phases:

1. Year 1 (Foundations & Coursework):
   - Complete core and elective postgraduate coursework with academic distinction.
   - Master advanced statistical learning, algorithm optimization, and domain-specific methodologies.
   - Attend departmental colloquiums, pass comprehensive doctoral/master's qualifying examinations, and achieve HSK Level 3+ proficiency for smooth cultural integration.

2. Year 2 (Literature Synthesis & Framework Prototyping):
   - Conduct an exhaustive systematic literature review on state-of-the-art architectures.
   - Formulate mathematical formulations and deploy baseline simulation models in the university laboratory.
   - Publish a comprehensive peer-reviewed review paper in a high-impact SCI/EI-indexed international journal.

3. Year 3 (Experimental Validation & Scalability Testing):
   - Execute empirical trials and stress-test algorithmic architectures against large-scale real-world datasets.
   - Collaborate closely with lab colleagues and industry partners under the guidance of my supervisor.
   - Submit two original empirical research manuscripts to leading IEEE/ACM/Elsevier transactions.

4. Year 4 (Thesis Synthesis & Dissertation Defense):
   - Consolidate research findings into a coherent, high-caliber Master's/Ph.D. dissertation.
   - Defend the dissertation before the academic committee and present findings at major international symposiums in China.

================================================================================
SECTION IV: RETURN-TO-HOME-COUNTRY PLAN & LONG-TERM DEVELOPMENT IMPACT
================================================================================
Upon successful completion of my degree at ${targetUni}, I am firmly committed to returning to Nigeria to deploy my acquired knowledge. My long-term objectives include:
1. Academic & Research Leadership: Joining a Nigerian university research faculty to establish computational labs and mentor the next generation of West African scientists.
2. Bilateral Innovation Bridges: Serving as an active academic bridge between Chinese research institutions and Nigerian industries to facilitate technology transfer and collaborative research grants.
3. Societal Impact: ${futureGoals}

I am confident that my strong academic foundation, resilience, and unwavering work ethic will enable me to make meaningful contributions to the academic community at ${targetUni}.

Respectfully submitted,
${fullName}`;

  // Chinese Abstract / Summary (中文研究计划摘要)
  const chineseAbstract = `【研究计划中文摘要】
申请人：${fullName}
申请专业：${fieldOfStudy}
目标院校：${targetUni}
研究方向：${researchTopic}

个人概述与学术背景：
申请人毕业于${undergradBackground}，在校期间成绩优异，具备扎实的数学建模与专业核心技能。

留学动机与目标：
中国在科技创新和高等教育领域处于世界领先地位。${targetUni}拥有卓越的师资力量与世界一流的实验平台。申请人希望在该校攻读${degree}学位，深入开展相关专业领域的学术研究。

研究规划：
第一学年完成核心学位课程并奠定坚实理论基础；第二学年开展系统性文献综述与算法建模；第三学年开展实验验证并发表高水平SCI/EI学术论文；第四学年完成高质量学位论文答辩。

归国计划与长远贡献：
学成毕业后，申请人将返回尼日利亚，将所学前沿知识服务于本国高等教育与科技产业升级，积极推动中非科技文化合作与学术交流。`;

  // Recommendation Letter 1 (Academic Dean / Professor)
  const recommendationLetter1 = `RECOMMENDATION LETTER (ACADEMIC SUPERVISOR)

To: The Admissions Committee & China Scholarship Council (CSC)
Subject: Academic Recommendation for ${fullName}

Dear Respected Members of the Admissions Committee,

It gives me immense pleasure to write this letter of academic recommendation in strongest support of ${fullName} for admission into the ${degree} program in ${fieldOfStudy} at your esteemed university under the Chinese Government Scholarship.

I have known ${fullName} for over four years in my capacity as ${recommender1Title} at ${recommender1Inst}. During this period, ${fullName} took several of my advanced undergraduate courses, consistently ranking among the top 1% of the class. What distinguishes ${fullName} is not merely intellectual brilliance, but exceptional curiosity, rigorous problem-solving ability, and an extraordinary capacity for independent research.

In their final year capstone research project, which I supervised, ${fullName} demonstrated outstanding analytical maturity, working long hours in the laboratory to develop innovative computational frameworks. Their written reports were clear, thorough, and showcased a sophisticated grasp of current international scientific literature.

Beyond academic excellence, ${fullName} exhibits high moral integrity, humility, and leadership qualities. I am confident that ${fullName} will thrive in China's challenging and world-class academic environment, representing Nigeria with distinction.

I therefore recommend ${fullName} with my highest enthusiasm and without any reservation.

Sincerely,

${recommender1Name}
${recommender1Title}
${recommender1Inst}
Email: e.balogun@covenantuniversity.edu.ng
Phone: +234 803 000 0000`;

  // Recommendation Letter 2 (Associate Professor / Head of Department)
  const recommendationLetter2 = `RECOMMENDATION LETTER (HEAD OF DEPARTMENT / PROFESSOR)

To: The Admissions Committee & China Scholarship Council (CSC)
Subject: Letter of Recommendation for ${fullName}

Dear Respected Committee Members,

I am delighted to provide this recommendation for ${fullName}, who is seeking admission and scholarship support to pursue a ${degree} in ${fieldOfStudy} at your prestigious institution.

As ${recommender2Title} at ${recommender2Inst}, I have closely monitored ${fullName}'s academic progression and research undertakings over the past three years. ${fullName} possesses a rare combination of theoretical acumen and practical engineering dexterity. They have consistently demonstrated exemplary dedication, intellectual honesty, and an insatiable appetite for learning.

During departmental seminars, ${fullName} frequently contributed insightful critiques and exhibited the ability to collaborate effectively in diverse multidisciplinary teams. Their communication skills—both written and oral—are exceptional, enabling them to articulate complex scientific concepts with precision and clarity.

Given ${fullName}'s outstanding track record, academic discipline, and clear vision for their postgraduate research, I have no doubt that they will be an exemplary scholar at your university and make significant research contributions.

I give ${fullName} my strongest possible recommendation for your esteemed postgraduate scholarship program.

Warm regards,

${recommender2Name}
${recommender2Title}
${recommender2Inst}
Email: g.okonkwo@unilag.edu.ng
Phone: +234 802 000 0000`;

  const wordCount = generatedStudyPlan.trim().split(/\s+/).length;

  const handleCopyPlan = () => {
    navigator.clipboard.writeText(generatedStudyPlan);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const handleCopyRec1 = () => {
    navigator.clipboard.writeText(recommendationLetter1);
    setCopiedRec1(true);
    setTimeout(() => setCopiedRec1(false), 2500);
  };

  const handleCopyRec2 = () => {
    navigator.clipboard.writeText(recommendationLetter2);
    setCopiedRec2(true);
    setTimeout(() => setCopiedRec2(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-[#03C988]/10 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 2: AI Document & Study Plan Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              Bilingual Study Plan & Recommendation Letter Studio
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Generate CSC-compliant 800–1,500 word Study Plans with structured 4-year research roadmaps, bilingual Chinese abstracts, and official Professor Recommendation letter drafts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenConsultant}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              Ask Lao Shi Review <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("study_plan")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "study_plan"
                ? "bg-indigo-500/15 border-indigo-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">1. AI Bilingual Study Plan</div>
              <div className="text-[10px] text-slate-400">{wordCount} Words • 4 Key Pillars</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("recommendation_letters")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "recommendation_letters"
                ? "bg-amber-500/15 border-amber-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">2. Recommendation Letter Studio</div>
              <div className="text-[10px] text-slate-400">2 Professor Drafts Included</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("guidelines")}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              activeTab === "guidelines"
                ? "bg-emerald-500/15 border-emerald-500/40 text-white shadow-md"
                : "bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">3. CSC Selection Criteria</div>
              <div className="text-[10px] text-slate-400">Anti-Plagiarism & Scoring Rules</div>
            </div>
          </button>
        </div>
      </div>

      {/* TAB 1: STUDY PLAN GENERATOR */}
      {activeTab === "study_plan" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Languages className="h-5 w-5 text-indigo-400" />
                  Customized 4-Pillar Academic Study Plan Generator
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Adjust your profile parameters below. The study plan updates in real-time with rigorous academic framing and an accompanying Chinese abstract.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Word Count</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{wordCount} / 1200</span>
                </div>
                <button
                  onClick={handleCopyPlan}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  {copiedPlan ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Copied Full Plan!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Study Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Input Configuration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Full Applicant Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Bachelor's Degree (B.Sc / B.Eng)">Bachelor's Degree (B.Sc / B.Eng)</option>
                  <option value="Master's Degree (M.Sc / M.Eng)">Master's Degree (M.Sc / M.Eng)</option>
                  <option value="Ph.D. / Doctoral Degree">Ph.D. / Doctoral Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Chinese University</label>
                <input
                  type="text"
                  value={targetUni}
                  onChange={(e) => setTargetUni(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Undergraduate Background & Grade</label>
                <input
                  type="text"
                  value={undergradBackground}
                  onChange={(e) => setUndergradBackground(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Proposed Research Topic / Direction</label>
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Generated Document Displays */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: English Master Study Plan */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-indigo-400" />
                    Official English Study Plan & Research Outline
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    CSC Standard Formatted
                  </span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto pr-3 select-text">
                  {generatedStudyPlan}
                </div>
              </div>

              {/* Right 1 Col: Chinese Abstract & Quick Tips */}
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Languages className="h-4 w-4" /> 中文研究计划摘要
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Dual-Lang Advantage</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Including a Chinese summary demonstrates cross-cultural dedication and immediately catches the reviewer's attention.
                  </p>
                  <div className="p-3.5 bg-[#071328] rounded-xl border border-slate-800 whitespace-pre-wrap font-sans text-[11.5px] text-slate-200 leading-relaxed max-h-[250px] overflow-y-auto">
                    {chineseAbstract}
                  </div>
                </div>

                <div className="bg-[#071328] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" />
                    CSC Reviewer Scoring Secret
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    CSC reviewers award maximum points for:
                    <br />
                    1. <strong>Clear Research Feasibility</strong> (concrete 4-year schedule).
                    <br />
                    2. <strong>Mutual Benefit</strong> (how Nigeria & China both gain from your research).
                    <br />
                    3. <strong>Definite Return Commitment</strong> (explicit post-grad contribution to Nigerian institutions).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECOMMENDATION LETTER STUDIO */}
      {activeTab === "recommendation_letters" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-400" />
                Two Official Professor Recommendation Letter Drafts
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                The CSC application requires <strong>two recommendation letters</strong> from Associate Professors or full Professors. Use these customized templates for your university professors to sign and stamp.
              </p>
            </div>

            {/* Grid of 2 Recommendation Letters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Letter 1: Academic Dean */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <div>
                      <span className="text-xs font-bold text-white block">Recommendation Letter #1</span>
                      <span className="text-[10px] font-mono text-amber-400">Academic Supervisor / Dean</span>
                    </div>
                    <button
                      onClick={handleCopyRec1}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedRec1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedRec1 ? "Copied" : "Copy Draft"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                    <div>
                      <label className="text-slate-500 uppercase">Professor Name</label>
                      <input
                        type="text"
                        value={recommender1Name}
                        onChange={(e) => setRecommender1Name(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 uppercase">Title & Rank</label>
                      <input
                        type="text"
                        value={recommender1Title}
                        onChange={(e) => setRecommender1Title(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs mt-0.5"
                      />
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-[11px] text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto p-3 bg-[#071328] rounded-xl border border-slate-850 select-text">
                    {recommendationLetter1}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/10 font-mono">
                  💡 <strong>Rule:</strong> Must be printed on official university letterhead and signed by the professor with official department rubber stamp.
                </div>
              </div>

              {/* Letter 2: Head of Department */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <div>
                      <span className="text-xs font-bold text-white block">Recommendation Letter #2</span>
                      <span className="text-[10px] font-mono text-indigo-400">Head of Department / Professor</span>
                    </div>
                    <button
                      onClick={handleCopyRec2}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedRec2 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedRec2 ? "Copied" : "Copy Draft"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                    <div>
                      <label className="text-slate-500 uppercase">Professor Name</label>
                      <input
                        type="text"
                        value={recommender2Name}
                        onChange={(e) => setRecommender2Name(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 uppercase">Title & Rank</label>
                      <input
                        type="text"
                        value={recommender2Title}
                        onChange={(e) => setRecommender2Title(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs mt-0.5"
                      />
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-[11px] text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto p-3 bg-[#071328] rounded-xl border border-slate-850 select-text">
                    {recommendationLetter2}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 p-2.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10 font-mono">
                  💡 <strong>Rule:</strong> Letters must include active phone number and institutional email (.edu.ng) of the referee for embassy/university verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GUIDELINES & SELECTION CRITERIA */}
      {activeTab === "guidelines" && (
        <div className="space-y-6">
          <div className="bg-[#050e1f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              China Scholarship Council (CSC) Document Evaluation Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <span className="font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Anti-Plagiarism Scanner
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  CSC uses automated text matching. Never copy templates word-for-word from internet forums. Customize your specific undergraduate project, metrics, and targeted research problem to maintain 0% plagiarism flags.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <span className="font-bold text-amber-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Word Count Sweet Spot
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Undergraduate study plans should be <strong>600–800 words</strong>. Master’s and Ph.D. research proposals must be <strong>1,000–1,500 words</strong> with structured methodology and clear chapter milestones.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <span className="font-bold text-[#03C988] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Language Proficiency
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  For English-taught programs, an official <strong>English Proficiency Letter</strong> from your Nigerian university is accepted by over 90% of Chinese universities (no IELTS/TOEFL required for native English speaking countries).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
