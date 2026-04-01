export type DashboardResponse = {
  totals: {
    totalCases: number;
    totalClients: number;
    totalExperts: number;
    successfulCases: number;
    unsuccessfulCases: number;
    averageDaysToExpertise: number;
    averageDaysToDecision: number;
  };
  byBenefit: { label: string; total: number }[];
  byDisease: { label: string; total: number }[];
  byExpert: { label: string; total: number }[];
  byChannel: { label: string; total: number }[];
  outcomeByDisease: { label: string; success: number; failure: number }[];
};

export type Client = {
  id: string;
  fullName: string;
  cpf: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  cases?: { id: string; internalCode: string; benefitType: string; currentStatus: string }[];
};

export type Expert = {
  id: string;
  fullName: string;
  specialty?: string;
  city?: string;
  state?: string;
  _count?: { cases: number };
  analytics?: {
    totalCases: number;
    favorableCases: number;
    unfavorableCases: number;
    successRate: number;
    diseases: { name: string; total: number }[];
  };
};

export type CaseItem = {
  id: string;
  internalCode: string;
  caseNumber?: string;
  channelType: string;
  benefitType: string;
  currentStatus: string;
  city?: string;
  client: { fullName: string; gender: string };
  mainDisease?: { name: string };
  mainCid?: { code: string };
  expert?: { fullName: string; specialty?: string };
  result?: { finalOutcome?: string; successFlag?: boolean };
};

export type DocumentItem = {
  id: string;
  originalFileName: string;
  fileName: string;
  origin?: string;
  notes?: string;
  category: { name: string };
  client?: { fullName: string };
  case?: { internalCode: string };
  extractions?: {
    finalConclusion?: string;
    hasIncapacity?: boolean;
  }[];
};

