import { create } from "zustand";

export interface CscaQuestion {
  questionId: string;
  subject: string;
  questionText: string;
  options: string[]; // Options array e.g., ["A) ...", "B) ..."] or text options
  correctOption: string; // "A" | "B" | "C" | "D"
  explanation: string;
  difficulty?: string;
  category?: string;
}

export interface CscaResponse {
  questionId: string;
  chosenOption: string;
  isCorrect: boolean;
  subjectTag: string;
  timeSpentSeconds: number;
}

export interface CscaUserAttempt {
  attemptId: string;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  startedAt: string;
  elapsedSeconds: number;
  isInvalidOvertime: boolean;
  subjectBreakdown: {
    mathematics: { score: number; total: number };
    physicsChemistry: { score: number; total: number };
    academicChinese: { score: number; total: number };
  };
  responses: CscaResponse[];
}

interface CscaStore {
  cscaQuestions: CscaQuestion[];
  cscaActiveTest: boolean;
  cscaTimeRemaining: number;
  cscaSelectedAnswers: Record<string, string>;
  cscaTestSubmitted: boolean;
  cscaLatestScore: number | null;
  cscaSubject: string;
  startedAt: number | null; // Timestamp in ms
  timeSpentPerQuestion: Record<string, number>; // tracks seconds per questionId
  currentQuestionId: string | null;
  timerIntervalId: any | null;

  // Actions
  setCscaSubject: (subject: any) => void;
  setCscaQuestions: (questions: CscaQuestion[]) => void;
  startTest: (subject: string, questions: CscaQuestion[], durationSec?: number) => void;
  selectAnswer: (questionId: string, answerLetter: string) => void;
  tickTimer: () => { remaining: number; autoSubmit: boolean };
  submitTest: (email: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  restoreState: () => boolean;
  resetStore: () => void;
  setCurrentQuestion: (questionId: string) => void;
  trackQuestionSeconds: () => void;
  startTimerInterval: (email: string) => void;
  stopTimerInterval: () => void;
}

export const useCscaStore = create<CscaStore>((set, get) => ({
  cscaQuestions: [],
  cscaActiveTest: false,
  cscaTimeRemaining: 1200, // 20 minutes default
  cscaSelectedAnswers: {},
  cscaTestSubmitted: false,
  cscaLatestScore: null,
  cscaSubject: "math",
  startedAt: null,
  timeSpentPerQuestion: {},
  currentQuestionId: null,
  timerIntervalId: null,

  setCscaSubject: (subject) => set({ cscaSubject: subject }),
  setCscaQuestions: (questions) => set({ cscaQuestions: questions }),

  startTest: (subject, questions, durationSec = 1200) => {
    const nowRef = Date.now();
    const targetTime = nowRef + durationSec * 1000;

    // Persist session markers strictly in client storage
    localStorage.setItem("csca_target_time", targetTime.toString());
    localStorage.setItem("csca_started_at", nowRef.toString());
    localStorage.setItem("csca_active_test", "true");
    localStorage.setItem("csca_subject", subject);
    localStorage.setItem("csca_selected_answers", JSON.stringify({}));
    localStorage.setItem("csca_time_spent", JSON.stringify({}));

    // Generate initial flat zero timings for all questions
    const initialTimings: Record<string, number> = {};
    questions.forEach(q => {
      initialTimings[q.questionId] = 0;
    });

    set({
      cscaQuestions: questions,
      cscaActiveTest: true,
      cscaTimeRemaining: durationSec,
      cscaSelectedAnswers: {},
      cscaTestSubmitted: false,
      cscaLatestScore: null,
      cscaSubject: subject,
      startedAt: nowRef,
      timeSpentPerQuestion: initialTimings,
      currentQuestionId: questions[0]?.questionId || null,
    });

    // Backup details to a local fault-tolerant buffer
    const backupState = {
      cscaQuestions: questions,
      cscaSelectedAnswers: {},
      timeSpentPerQuestion: initialTimings,
      startedAt: nowRef,
      cscaSubject: subject
    };
    localStorage.setItem("csca_offline_backup_state", JSON.stringify(backupState));
  },

  selectAnswer: (questionId, answerLetter) => {
    const { cscaSelectedAnswers, cscaTestSubmitted } = get();
    if (cscaTestSubmitted) return;

    const updated = { ...cscaSelectedAnswers, [questionId]: answerLetter };
    localStorage.setItem("csca_selected_answers", JSON.stringify(updated));

    set({ cscaSelectedAnswers: updated });

    // CONTINUOUS FAULT TOLERANCE: Sync entire state cleanly into backup buffer
    const backupState = {
      cscaQuestions: get().cscaQuestions,
      cscaSelectedAnswers: updated,
      timeSpentPerQuestion: get().timeSpentPerQuestion,
      startedAt: get().startedAt,
      cscaSubject: get().cscaSubject
    };
    localStorage.setItem("csca_offline_backup_state", JSON.stringify(backupState));
  },

  tickTimer: () => {
    const targetTime = localStorage.getItem("csca_target_time");
    if (!targetTime) {
      return { remaining: 0, autoSubmit: false };
    }

    const remaining = Math.max(0, Math.round((Number(targetTime) - Date.now()) / 1000));
    set({ cscaTimeRemaining: remaining });

    if (remaining <= 0 && get().cscaActiveTest) {
      return { remaining: 0, autoSubmit: true };
    }

    return { remaining, autoSubmit: false };
  },

  trackQuestionSeconds: () => {
    const { currentQuestionId, timeSpentPerQuestion, cscaActiveTest, cscaTestSubmitted } = get();
    if (!cscaActiveTest || cscaTestSubmitted || !currentQuestionId) return;

    const currentDuration = timeSpentPerQuestion[currentQuestionId] || 0;
    const updatedTimings = {
      ...timeSpentPerQuestion,
      [currentQuestionId]: currentDuration + 1
    };

    localStorage.setItem("csca_time_spent", JSON.stringify(updatedTimings));
    set({ timeSpentPerQuestion: updatedTimings });

    // CONTINUOUS FAULT TOLERANCE: Keep backup timings in sync as well
    const backupState = {
      cscaQuestions: get().cscaQuestions,
      cscaSelectedAnswers: get().cscaSelectedAnswers,
      timeSpentPerQuestion: updatedTimings,
      startedAt: get().startedAt,
      cscaSubject: get().cscaSubject
    };
    localStorage.setItem("csca_offline_backup_state", JSON.stringify(backupState));
  },

  setCurrentQuestion: (questionId) => {
    set({ currentQuestionId: questionId });
  },

  startTimerInterval: (email) => {
    const { timerIntervalId, stopTimerInterval, tickTimer, trackQuestionSeconds } = get();
    if (timerIntervalId) stopTimerInterval();

    const interval = setInterval(() => {
      const { autoSubmit } = tickTimer();
      trackQuestionSeconds();
      if (autoSubmit) {
        get().submitTest(email);
        get().stopTimerInterval();
      }
    }, 1000);

    set({ timerIntervalId: interval });
  },

  stopTimerInterval: () => {
    const { timerIntervalId } = get();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      set({ timerIntervalId: null });
    }
  },

  submitTest: async (email) => {
    const {
      cscaQuestions,
      cscaSelectedAnswers,
      startedAt,
      timeSpentPerQuestion,
      cscaSubject,
      cscaActiveTest
    } = get();

    // Reset test triggers instantly
    localStorage.removeItem("csca_active_test");
    localStorage.removeItem("csca_target_time");
    localStorage.removeItem("csca_started_at");
    localStorage.removeItem("csca_selected_answers");
    localStorage.removeItem("csca_time_spent");
    localStorage.removeItem("csca_subject");

    set({
      cscaActiveTest: false,
      cscaTestSubmitted: true
    });

    // Score and gather metrics
    let scoreCount = 0;
    const responses: CscaResponse[] = cscaQuestions.map((q) => {
      const chosenOption = cscaSelectedAnswers[q.questionId] || "";
      const isCorrect = chosenOption.trim().toUpperCase() === q.correctOption.trim().toUpperCase();
      if (isCorrect) scoreCount++;

      return {
        questionId: q.questionId,
        chosenOption,
        isCorrect,
        subjectTag: q.subject || cscaSubject,
        timeSpentSeconds: timeSpentPerQuestion[q.questionId] || 0
      };
    });

    set({ cscaLatestScore: scoreCount });

    const totalQuestions = cscaQuestions.length;
    const percentage = Math.round((scoreCount / totalQuestions) * 100);

    // Form Subject breakdown maps
    const breakdowns = {
      mathematics: { score: 0, total: 0 },
      physicsChemistry: { score: 0, total: 0 },
      academicChinese: { score: 0, total: 0 }
    };

    cscaQuestions.forEach((q) => {
      const isCorrect = (cscaSelectedAnswers[q.questionId] || "").trim().toUpperCase() === q.correctOption.trim().toUpperCase();
      const rawSub = String(q.subject || cscaSubject).toLowerCase();
      
      let key: "mathematics" | "physicsChemistry" | "academicChinese" = "academicChinese";
      if (rawSub.includes("math")) key = "mathematics";
      else if (rawSub.includes("phys") || rawSub.includes("chem")) key = "physicsChemistry";
      else if (rawSub.includes("chinese") || rawSub.includes("lang")) key = "academicChinese";

      breakdowns[key].total++;
      if (isCorrect) breakdowns[key].score++;
    });

    const realStartedAt = startedAt || Date.now() - 1200000;
    const attemptPayload = {
      email,
      score: scoreCount,
      totalQuestions,
      percentage,
      startedAt: realStartedAt, // passed for server audit timing matching
      subjectBreakdown: breakdowns,
      responses
    };

    if (!email) {
      return { success: true, data: attemptPayload };
    }

    try {
      const res = await fetch("/api/csca/submit-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attemptPayload)
      });
      const resData = await res.json();
      if (resData.status === "success") {
        return { success: true, data: resData.data };
      }
      return { success: false, error: resData.error || "Submission failed" };
    } catch (err: any) {
      console.error("Network drop or server issue recorded during CSCA score persistence:", err);
      // Fallback: Backup standard client-side state is preserved gracefully
      return { success: true, data: attemptPayload, error: "Network drop detected, score cached locally." };
    }
  },

  restoreState: () => {
    const isActive = localStorage.getItem("csca_active_test") === "true";
    const targetTime = localStorage.getItem("csca_target_time");
    const startedAtSaved = localStorage.getItem("csca_started_at");
    
    if (isActive && targetTime) {
      const remaining = Math.max(0, Math.round((Number(targetTime) - Date.now()) / 1000));
      if (remaining > 0) {
        const subject = localStorage.getItem("csca_subject") || "math";
        const savedAnswers = localStorage.getItem("csca_selected_answers");
        const savedTimings = localStorage.getItem("csca_time_spent");

        set({
          cscaActiveTest: true,
          cscaTimeRemaining: remaining,
          cscaSubject: subject,
          startedAt: startedAtSaved ? Number(startedAtSaved) : (Number(targetTime) - 1200000),
          cscaSelectedAnswers: savedAnswers ? JSON.parse(savedAnswers) : {},
          timeSpentPerQuestion: savedTimings ? JSON.parse(savedTimings) : {},
        });
        return true;
      } else {
        localStorage.removeItem("csca_active_test");
        localStorage.removeItem("csca_target_time");
        localStorage.removeItem("csca_started_at");
        localStorage.removeItem("csca_selected_answers");
        localStorage.removeItem("csca_time_spent");
        localStorage.removeItem("csca_subject");
      }
    }
    return false;
  },

  resetStore: () => {
    set({
      cscaQuestions: [],
      cscaActiveTest: false,
      cscaTimeRemaining: 1200,
      cscaSelectedAnswers: {},
      cscaTestSubmitted: false,
      cscaLatestScore: null,
      startedAt: null,
      timeSpentPerQuestion: {},
      currentQuestionId: null
    });
  }
}));
