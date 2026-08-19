import React from "react";
import { X, ShieldCheck, Heart, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";

interface FounderStoryModalProps {
  onClose: () => void;
  onOpenSignup: () => void;
}

export function FounderStoryModal({ onClose, onOpenSignup }: FounderStoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#030d1e] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200 select-none">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono font-bold">
            <Heart className="h-3.5 w-3.5 text-amber-400" />
            Founder's Mission & Story
          </div>
          <h2 className="font-display text-xl md:text-2xl font-black text-white">
            Why We Built VerifiedUni for Nigerian & African Students
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            By Emperor & The VerifiedUni Engineering Team
          </p>
        </div>

        {/* Story Body */}
        <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans border-t border-b border-slate-900 py-4">
          <p>
            In 2023, I watched close friends and brilliant Nigerian graduates pay between <strong className="text-white">₦700,000 and ₦1,200,000</strong> to "study abroad agents" in Lagos and Abuja. Many of these agents did little more than download public PDF forms, fill in basic information with obvious errors, and submit applications that were ultimately rejected by Chinese universities.
          </p>
          <p>
            The truth that agents rarely tell you is that <strong className="text-amber-400">Chinese Government Scholarships (CSC Type A & B) and Provincial Funds do not charge agent submission fees</strong>. The universities evaluate applications purely on academic merit, document compliance, your Statement of Purpose, and your performance on standardized assessments like the CSCA.
          </p>
          <p>
            We built <strong className="text-white">VerifiedUni</strong> to level the playing field:
          </p>
          <ul className="space-y-2 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-850">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>100% Direct University Transparency:</strong> Direct application links, exact agency codes, and real stipend amounts for 53+ verified institutions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>1,000+ Question CSCA Mock Exam Center:</strong> The first specialized prep engine for the new undergraduate entrance exam.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Anti-Rejection AI Document Intelligence:</strong> Prompt templates and diagnostics built on hundreds of successful admission cases.</span>
            </li>
          </ul>
          <p>
            Instead of spending millions on middle-men, our one-time <strong>₦35,000</strong> platform fee funds continuous database updates, server costs, and 24/7 AI computing. Backed by our 100% refund indemnity bond.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenSignup();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-450 text-slate-950 font-display font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="h-4 w-4 text-slate-950" />
            Get Started & Join VerifiedUni (₦35,000)
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs rounded-xl font-mono"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
}
