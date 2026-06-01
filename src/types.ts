export interface UserProfile {
  uid: string;
  email: string;
  premium: boolean;
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
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export enum Tabs {
  WORKSPACE = "workspace",
  PASSPORT = "passport",
  DIRECTORY = "directory",
  LANGUAGE_SCHOOLS = "language_schools",
  FLIGHT_VISA = "flight_visa",
  CSCA_CBT = "csca_cbt",
  PROMPT_STATION = "prompt_station",
  CONSULTANT = "consultant",
  CHECKLIST = "checklist"
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

