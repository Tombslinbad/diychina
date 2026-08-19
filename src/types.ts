export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  premium: boolean;
  onboarding?: {
    degree?: string;
    gpa?: string;
    waecGrades?: string;
    fieldOfStudy?: string;
    hskLevel?: string;
    cscType?: string;
    motivation?: string;
    age?: number;
  };
  createdAt: string;
  updatedAt?: string;
  paymentReference?: string;
}

export interface University {
  id: string;
  name: string;
  agencyCode: string;
  cscTypeA: boolean;
  cscTypeB: boolean;
  provincial: boolean;
  silkRoad: boolean;
  tracks: string[];
  stipendUndergrad: number;
  tuitionFeeUndergrad: number;
  accommodationFee: number;
  englishMajors: string[];
  applicationPortal: string;
  city: string;
  ranking: number;
  lastVerified?: string;
  sourceUrl?: string;
  cscaRequirements?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export enum Tabs {
  WORKSPACE = "workspace",
  MATCH = "match",
  DIRECTORY = "directory",
  DOCUMENTS = "documents",
  DUAL_APP = "dual_app",
  STUDY_PLAN_STUDIO = "study_plan_studio",
  CSCA_CBT = "csca_cbt",
  INTERVIEW_SIM = "interview_sim",
  VISA_PRE_DEPARTURE = "visa_pre_departure",
  PROMPT_STATION = "prompt_station",
  CONSULTANT = "consultant",
  CHECKLIST = "checklist",
  PASSPORT = "passport",
  FLIGHT_VISA = "flight_visa",
  LANGUAGE_SCHOOLS = "language_schools",
  ADMIN = "admin"
}

export interface CSCAQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  subject?: string;
  medium?: string;
}

export interface StudentMatchProfile {
  degree: "Bsc" | "Masters" | "PhD" | "Language";
  field: string;
  gpa: string;
  waecStatus: "5_credits_science" | "5_credits_commercial" | "5_credits_arts" | "awaiting_results" | "hnd_bachelor";
  age: number;
  cscaStatus: "not_started" | "studying" | "scored_high" | "exempt";
  languagePref: "english" | "chinese_hsk4" | "beginner";
  preferredCity: string;
  targetScholarship: "csc_type_b" | "csc_type_a" | "provincial" | "silk_road" | "any";
}

