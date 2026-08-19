import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface FAQItem {
  question: string;
  category: "General" | "Eligibility & WAEC" | "CSCA Exam" | "Payment & Guarantee";
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is VerifiedUni an official Chinese Embassy or Government agency website?",
    category: "General",
    answer: "No. VerifiedUni is an independent educational technology and admissions preparation platform designed specifically for Nigerian and West African students. We provide proprietary directory intelligence, 1,000+ CSCA CBT mock practice suites, AI document formatting tools, and step-by-step consular guidance to help students apply directly to Chinese universities without paying ₦500k–₦1M to third-party travel agents."
  },
  {
    question: "Is admission or scholarship 100% guaranteed?",
    category: "Payment & Guarantee",
    answer: "Final admission and scholarship awards are decided exclusively by the respective Chinese universities, the China Scholarship Council (CSC), and provincial education departments. However, we guarantee that our verified directory, eligibility audits, anti-rejection AI document engines, and CSCA practice test suite will provide you with a bulletproof, compliant application. If you apply to at least 5 universities using our platform and do not receive any admission offer or interview callback, we will issue a full 100% refund of your ₦35,000 fee pursuant to our Refund Policy."
  },
  {
    question: "What is the CSCA and do I need to take it?",
    category: "CSCA Exam",
    answer: "The CSCA (China Scholastic Competency Assessment) is a standardized entrance assessment introduced for international undergraduate applicants seeking admission and scholarships at Chinese universities. It tests core subjects: Mathematics, Physics, Chemistry, and Logic. Postgraduate (Master's & PhD) applicants are generally evaluated on their undergraduate CGPA, research proposal, and supervisor acceptance letters, but our platform provides full CSCA mock exam preparation for all undergraduate tracks."
  },
  {
    question: "Can I apply for Chinese scholarships using WAEC or NECO?",
    category: "Eligibility & WAEC",
    answer: "Yes! High-school leavers with at least 5 credit passes (including Mathematics and English) in WAEC or NECO are eligible for undergraduate admissions and provincial/university scholarships. Candidates with A1 and B2/B3 distinctions in STEM subjects have a strong competitive advantage when applying to C9 and top-tier provincial institutions."
  },
  {
    question: "Do Nigerian students need IELTS or TOEFL to study in English?",
    category: "Eligibility & WAEC",
    answer: "In the vast majority of Chinese universities, Nigerian applicants are exempt from IELTS/TOEFL because Nigeria is recognized as an English-speaking country. An official 'English Proficiency Letter' issued by your secondary school, polytechnic, or university, or an authentication letter from the Federal Ministry of Education in Abuja, is standardly accepted."
  },
  {
    question: "What happens immediately after I pay the ₦35,000 one-time fee?",
    category: "Payment & Guarantee",
    answer: "Your account is instantly upgraded to Lifetime Premium status via automated Paystack checkout confirmation. You gain immediate unrestricted access to the 53+ University Directory, the University Profile Match & Eligibility Engine, the 1,000+ CSCA Mock CBT Exam Center, the Document Diagnostic Center, the AI Statement & Email Generator, and 24/7 access to Lao Shi (AI Admissions Consultant)."
  },
  {
    question: "How does the Abuja document legalization roadmap help me?",
    category: "General",
    answer: "Before your visa can be processed, Chinese consular regulations require educational credentials to be authenticated in Abuja at the Federal Ministry of Education (FME), the Ministry of Foreign Affairs (MFA), and the Chinese Embassy / CVASC center. VerifiedUni provides a detailed room-by-room, fee-by-fee roadmap for Abuja and Lagos so you avoid unnecessary fixer fees and bureaucratic delays."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "General", "Eligibility & WAEC", "CSCA Exam", "Payment & Guarantee"];

  const filteredFaqs = activeCategory === "All"
    ? FAQS
    : FAQS.filter(f => f.category === activeCategory);

  return (
    <section className="py-20 bg-[#020813] border-t border-slate-900" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            Transparent Answers
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about Chinese scholarships, the CSCA exam, document legalization, and our 100% refund guarantee.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#030d1e] border border-slate-850 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-750 shadow-lg"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display text-xs md:text-sm font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-amber-400 border-amber-500/40" : ""
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-900 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
