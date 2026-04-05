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

export type DeadlineItem = {
  id: string;
  title: string;
  dueDate: string;
  responsibleName: string;
  status: "PENDENTE" | "CUMPRIDO" | "NAO_CUMPRIDO";
  notes?: string;
  completedAt?: string | null;
  client: { id: string; fullName: string };
};

export type FinancialControlItem = {
  id: string;
  minimumWageAmount: string | number;
  installmentPercentage: string | number;
  projectedBenefitMonths?: number | null;
  plannedInstallments: number;
  paidInstallments: number;
  installmentValue: string | number;
  arrearsAmount?: string | number | null;
  arrearsPercentage: string | number;
  arrearsFeeValue?: string | number | null;
  arrearsFeePaidAmount?: string | number | null;
  notes?: string | null;
  case: {
    id: string;
    internalCode: string;
    caseNumber?: string | null;
    channelType: string;
    benefitType: string;
    client: { id: string; fullName: string };
  };
};

export type Client = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  addressNumber?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  notes?: string;
  cases?: { id: string; internalCode: string; benefitType: string; currentStatus: string }[];
};

export type AttendanceItem = {
  id: string;
  title: string;
  kind: string;
  attendanceDate: string;
  ownerName?: string;
  contactChannel?: string;
  summary?: string;
  clientReport?: string;
  legalStrategy?: string;
  requestedDocuments?: string;
  nextSteps?: string;
  client: { id: string; fullName: string };
  case?: { id: string; internalCode: string } | null;
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
  client: { id: string; fullName: string; gender: string };
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
